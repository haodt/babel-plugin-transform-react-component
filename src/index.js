module.exports = function({ types }) {
  let functions = {};
  let namedfunctions = {};
  let removeds = [];

  const isReact = node =>
    node.left.object &&
    node.left.property &&
    ["propTypes", "defaultProps"].includes(node.left.property.name);

  const moveToDeclaration = {
    // FunctionDeclaration(path) {
    //   /**
    //    * Check if path has been removed by previous lookup from variable vistor
    //    */
    //   if (path.node.id.name === this.name && !functions[this.name] && !this.path.removed) {
    //     namedfunctions[this.name] = path;
    //     if (!path.moveds) {
    //       path.moveds = [];
    //     }

    //     /**
    //      * Shift to post event to prevent modification on function
    //      */
    //     path.moveds.push(this.move);
    //     removeds.push(this.path);
    //     return;
    //   }
    // },
    VariableDeclaration(path) {
      const { node } = path;
      const [declaration] = node.declarations;
      if (declaration && declaration.id.name === this.name) {
        if (types.isCallExpression(declaration.init)) {
          const blocks = path.get('declarations')[0].get('init').get('callee').get('body').get('body');
          blocks.forEach(child => {
            if (types.isReturnStatement(child)) {
              child.insertBefore(this.move)
            }
          })
          removeds.push(this.path);
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
          removeds.push(this.path);
          return;
        }
      }
    }
  };

  return {
    pre() {
      functions = {};
      namedfunctions = {};
      removeds = [];
    },
    post() {
      removeds.forEach(p => !p.removed && p.remove())
      Object.values(namedfunctions).forEach(path => {
        const { node } = path;
        const pureExpression = types.callExpression(
          types.functionExpression(
            null,
            [],
            types.blockStatement([
              types.functionDeclaration(
                node.id,
                node.params,
                node.body,
                node.generator,
                node.async
              ),
              types.returnStatement(types.cloneNode(node.id))
            ])
          ),
          []
        );
        path.moveds.forEach(move => {
          const blocks = pureExpression.callee.body.body;
          blocks.splice(blocks.length - 1, 0, move);
        });

        const classNode = types.variableDeclaration("var", [
          types.variableDeclarator(types.cloneNode(node.id), pureExpression)
        ]);

        path.replaceWith(classNode);
      });

      Object.values(functions).forEach(path => {
        const { node } = path;
        const [declaration] = node.declarations;
        const pureExpression = types.callExpression(
          types.functionExpression(
            null,
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

        const classNode = types.variableDeclaration("var", [
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
