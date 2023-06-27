// Babel 已经帮我们自动引入了 @babel/types 模块（通过 @babel/core) 了
// 在插件骨架中导出的函数参数中有一个 types 属性，它就是 @babel/types 对象，可以直接使用
module.exports = function ({ types: t }) {
    // plugin contents
    return {
      // 要遍历 AST，我们可以返回对象，这个对象的 visitor 属性描述要遍历的节点类型
      visitor: {
        // 遍历 CallExpression 类型的节点，然后对这类节点进行修改
        CallExpression: {
          exit(path) {
            // callee 属性表示函数调用的函数名，arguments 属性表示函数调用的参数
            const funcName = path.node.callee.name;
            if (funcName === 'vec2') {
              const args = path.node.arguments;
              if (args.length === 2) {
                path.node.callee.name = 'vec2.fromValues';
              }
            }
          },
        },
        UnaryExpression: {
          exit(path) {
            const { operator, argument } = path.node;
            if (operator === '-') {
              if (t.isCallExpression(argument) && argument.callee.name === 'vec2') {
                const node = t.callExpression(
                  t.identifier(`${argument.callee.name}.negate`),
                  [
                    t.callExpression(
                      t.identifier(`${argument.callee.name}.create`),
                      [],
                    ),
                    argument.arguments[0]],
                );
                path.replaceWith(node);
              }
            }
          },
        },
        BinaryExpression: {
          // 判断一下 BinaryExpression 类型的节点，如果它的左右两个操作数都是 vec2 函数调用，
          // 那么我们就把它替换成 vec2.add(vec2.create(), a, b)
          exit(path) {
            const { left, right } = path.node;
            // t.isCallExpression 方法可以用来判断一个节点是否是函数调用节点
            if (t.isCallExpression(left) && left.callee.name === 'vec2') {
              if (t.isCallExpression(right) && right.callee.name === 'vec2') {
                const { operator } = path.node;
                if (operator === '+') {
                  // https://babeljs.io/docs/en/babel-types
                  // t.callExpression 方法可以用来创建函数调用节点
                  const node = t.callExpression(
                    // t.identifier 方法可以用来创建标识符节点
                    t.identifier(`${left.callee.name}.add`),
                    [
                      t.callExpression(
                        t.identifier(`${left.callee.name}.create`),
                        [],
                      ),
                      left.arguments[0],
                      right.arguments[0]],
                  );
                  path.replaceWith(node);
                }
              } else if (t.isNumericLiteral(right)) {
                const { operator } = path.node;
                if (operator === '+') {
                  // https://babeljs.io/docs/en/babel-types
                  const node = t.callExpression(
                    t.identifier(`${left.callee.name}.add`),
                    [
                      t.callExpression(
                        t.identifier(`${left.callee.name}.create`),
                        [],
                      ),
                      left.arguments[0],
                      t.callExpression(
                        t.identifier(`${left.callee.name}.fromValues`),
                        [right, t.numericLiteral(0)],
                      )],
                  );
                  path.replaceWith(node);
                }
              } else {
                // console.log(right);
              }
            } else if (t.isCallExpression(left) && left.callee.name === 'vec2.add') {
              if (t.isCallExpression(right) && right.callee.name === 'vec2') {
                const { operator } = path.node;
                if (operator === '+') {
                  // https://babeljs.io/docs/en/babel-types
                  const node = t.callExpression(
                    t.identifier(left.callee.name),
                    [
                      t.callExpression(
                        t.identifier(`${right.callee.name}.create`),
                        [],
                      ),
                      left,
                      right.arguments[0]],
                  );
                  path.replaceWith(node);
                }
              }
            } else if (t.isNumericLiteral(left) && t.isCallExpression(right) && right.callee.name === 'vec2') {
              const { operator } = path.node;
              if (operator === '+') {
                // https://babeljs.io/docs/en/babel-types
                const node = t.callExpression(
                  t.identifier(`${right.callee.name}.add`),
                  [
                    t.callExpression(
                      t.identifier(`${right.callee.name}.create`),
                      [],
                    ),
                    t.callExpression(
                      t.identifier(`${right.callee.name}.fromValues`),
                      [left, t.numericLiteral(0)],
                    ),
                    right.arguments[0],
                  ],
                );
                path.replaceWith(node);
              }
            }
          },
        },
      },
    };
  };