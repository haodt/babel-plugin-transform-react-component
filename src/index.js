const seen = new WeakSet();

module.exports = function({ types }) {
  let functions = {};
  const isReact = node =>
    node.left.object &&
    node.left.property &&
    ["propTypes", "defaultProps"].includes(node.left.property.name);

  const moveToDeclaration = {
    VariableDeclaration(path) {
      const { node } = path;
      const [declaration] = node.declarations;
      if (declaration && declaration.id.name === this.name) {
        if (types.isCallExpression(declaration.init)) {
          const blocks = declaration.init.callee.body.body;
          blocks.splice(blocks.length - 1, 0, this.move);
          this.path.remove();
          return;
        }

        if (types.isFunctionExpression(declaration.init)) {
          functions[this.name] = path;
          if (!path.moveds) {
            path.moveds = [];
          }

          /**
           * Shift to post event to prevent modification on function
           */
          path.moveds.push(this.move);

          this.path.remove();
          return;
        }
      }
    }
  };

  return {
    pre() {
      functions = {};
    },
    post() {
      Object.values(functions).forEach(path => {
        const { node } = path;
        const [declaration] = node.declarations;
        const pureExpression = types.callExpression(
          types.arrowFunctionExpression(
            [],
            types.blockStatement([
              types.functionDeclaration(
                declaration.init.id,
                declaration.init.params,
                declaration.init.body,
                declaration.init.generator,
                declaration.init.async
              ),
              types.returnStatement(types.cloneNode(declaration.id))
            ])
          ),
          []
        );
        path.moveds.forEach(move => {
          const blocks = pureExpression.callee.body.body;
          blocks.splice(blocks.length - 1, 0, move);
        });

        const classNode = types.variableDeclaration("const", [
          types.variableDeclarator(
            types.cloneNode(declaration.init.id),
            pureExpression
          )
        ]);

        path.replaceWith(classNode);
      });
    },
    visitor: {
      AssignmentExpression(path) {
        const { node } = path;
        if (isReact(node)) {
          path.scope.path.traverse(moveToDeclaration, {
            name: node.left.object.name,
            move: node,
            path: path
          });
          return;
        }
      }
    }
  };
};
