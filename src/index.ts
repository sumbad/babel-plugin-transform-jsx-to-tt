import { declare } from '@babel/helper-plugin-utils';
import { types as t } from '@babel/core';
import { Scope, Node, NodePath } from '@babel/traverse';
import isCompatTag from '@babel/types/lib/validators/react/isCompatTag';
import { getDefined, flatten } from './helpers';
import { voidElements, mappingAttrPresetLit, mappingAttrPresetGlobal } from './constants';
import { Options } from './interfaces';

export default declare((api, options: Options = {}, dirname) => {
  // api.assertVersion(7)

  const tagName = options.tag ?? 'html';
  const tagRootName = tagName.split('.')[0];
  const importDeclaration = generateImportDeclaration(options.import);

  // TODO: prepare attributes mapping only once here

  return {
    name: 'transform-jsx-to-tthtml',

    manipulateOptions(opts, parserOpts) {
      parserOpts.plugins.push('classProperties');
      parserOpts.plugins.push('jsx');
      // parserOpts.plugins.push("asyncGenerators");
      // parserOpts.plugins.push("decorators-legacy");
      // parserOpts.plugins.push("doExpressions");
      // parserOpts.plugins.push("dynamicImport");
      // parserOpts.plugins.push("flow");
      // parserOpts.plugins.push("functionBind");
      // parserOpts.plugins.push("functionSent");
      // parserOpts.plugins.push("objectRestSpread");
      // parserOpts.plugins.push("exportDefaultFrom");
      // parserOpts.plugins.push("exportNamespaceFrom");
    },
    visitor: {
      JSXElement(path: NodePath, state) {
        path.replaceWith(generateTemplateLiteral(jsxElementToTemplateLiteral(path.node, path.scope), state));
      },
      JSXFragment(path: NodePath, state) {
        path.replaceWith(generateTemplateLiteral(jsxElementToTemplateLiteral(path.node, path.scope), state));
      },
      Program: {
        exit(path, state) {
          if (
            getDefined(tagRootName, path.scope) === undefined &&
            state.get('jsxElement') !== undefined &&
            importDeclaration !== undefined
          ) {
            path.unshiftContainer('body', importDeclaration);
          }
        },
      },
    },
  };

  /**
   * Create a new import declaration
   *
   * @param impOptions - options for an import declaration
   */
  function generateImportDeclaration(impOptions: { module: string; export: string }) {
    if (impOptions === undefined) {
      return;
    }
    const tagRoot = t.identifier(tagRootName);
    const { module, export: export_ } =
      typeof impOptions !== 'string'
        ? impOptions
        : {
            module: impOptions,
            export: null,
          };

    let specifier: t.ImportNamespaceSpecifier | t.ImportDefaultSpecifier | t.ImportSpecifier;
    if (export_ === '*') {
      specifier = t.importNamespaceSpecifier(tagRoot);
    } else if (export_ === 'default') {
      specifier = t.importDefaultSpecifier(tagRoot);
    } else {
      specifier = t.importSpecifier(tagRoot, export_ ? t.identifier(export_) : tagRoot);
    }
    return t.importDeclaration([specifier], t.stringLiteral(module));
  }

  /**
   * Produce TemplateLiteral node from an array of string + expressions (AST nodes)
   *
   * @param parts - list of an element parts
   * @param state - AST state
   */
  function generateTemplateLiteral(parts: any[], state): Node | NodePath {
    // we have one mixed array and we need to split nodes by type
    const quasiList = [];
    const exprs = [];

    let i = 0;
    // do one iteration more to make sure we produce an empty string quasi at the end
    while (i < parts.length + 1) {
      let quasi = '';
      // join adjacent strings into one
      while (typeof parts[i] === 'string') {
        // we need to escape backticks and backslashes manually
        quasi += (parts[i] as string).replace(/[\\`]/g, (s) => `\\${s}`);
        i += 1;
      }
      quasiList.push(t.templateElement({ raw: quasi, cooked: quasi }, true));

      // add a single expr node
      if (parts[i] != null) {
        exprs.push(parts[i]);
      }

      i += 1; // repeat
    }

    state.set('jsxElement', true);
    return t.taggedTemplateExpression(t.identifier(tagName), t.templateLiteral(quasiList, exprs));
  }

  /**
   * Transform JSXElement to an array of template strings and parts
   *
   * @param elem - JSXElement
   * @param scope - node scope
   */
  function jsxElementToTemplateLiteral(elem: t.Node, scope: Scope) {
    const renderChildScope: () => [] = jsxChildToTemplateLiteral.bind(null, scope);
    if (elem.type == 'JSXFragment') {
      const children = elem.children.map(renderChildScope);
      return [...flatten(children)];
    }
    if (elem.type == 'JSXElement') {
      const { tag, isVoid } = prepareElementTag(elem.openingElement.name, scope);
      const attrs = elem.openingElement.attributes.map(transformJSXAttribute);
      const children = elem.children.map(renderChildScope);
      return ['<', tag, ...flatten(attrs), '>', ...(isVoid ? [] : flatten(children)), ...(isVoid ? [] : ['</', tag, '>'])];
    }
    throw new Error(`Unknown element type: ${elem.type}`);
  }

  /**
   * Take JSX child node and return array of template strings and parts
   *
   * @param scope - node scope
   * @param child - jsx child element
   */
  function jsxChildToTemplateLiteral(
    scope: Scope,
    child: t.JSXElement | t.JSXFragment | t.JSXExpressionContainer | t.JSXSpreadChild | t.JSXText
  ) {
    if (t.isJSXText(child)) {
      return [child.value]; // text becomes part of template // child.extra.raw
    }

    if (child.type == 'JSXExpressionContainer') {
      if (child.expression.type == 'JSXEmptyExpression') return [];
      else return [child.expression]; // expression renders as part
    }

    if (child.type == 'JSXElement' || child.type == 'JSXFragment') return jsxElementToTemplateLiteral(child, scope); // recurs on element

    throw new Error(`Unknown child type: ${child.type}`);
  }

  /**
   * Take JSXElement name (Identifier or MemberExpression) and return JS counterpart
   *
   * @param jsxElement - JSXElement
   * @param scope - node scope
   * @param isRoot - flag if the element is root
   */
  function prepareElementTag(
    jsxElement: t.JSXIdentifier | t.JSXMemberExpression | t.JSXNamespacedName,
    scope: Scope,
    isRoot = true
  ): { tag: string | t.Identifier; isVoid?: boolean } {
    if (t.isJSXIdentifier(jsxElement)) {
      return tagFromJSXIdentifier(jsxElement, scope, isRoot);
    } else {
      // TODO: tag names can also be member expressions (`Foo.Bar`)
      // if (name.type == 'JSXMemberExpression') {
      //   const expr = name; // transform recursively
      //   const { tag: object } = renderTag(expr.object, scope, false);
      //   const property = t.identifier(expr.property.name);
      //   const tag = root // stick `.is` to the root member expr
      //     ? t.memberExpression(t.memberExpression(object, property), t.identifier('is'))
      //     : t.memberExpression(object, property);
      //   return { tag }; // return as member expr
      // }
      throw new Error(`Unknown element tag type: ${jsxElement.type}`);
    }
  }

  /**
   * Process jsxIdentifier and return element tag
   *
   * @param jsxIdentifier - JSXIdentifier
   * @param scope - node scope
   * @param isRoot - flag if the element is root
   */
  function tagFromJSXIdentifier(jsxIdentifier: t.JSXIdentifier, scope: Scope, isRoot: boolean) {
    let tag = jsxIdentifier.name;

    // it's a single lowercase identifier (e.g. `foo`)
    if (isRoot && isCompatTag(tag)) {
      const isVoid = voidElements.includes(tag.toLowerCase());
      // return it as part of the template (`<foo>`)
      return { tag, isVoid };
    }
    // it's a single uppercase identifier (e.g. `Foo`)
    else if (isRoot) {
      // const object = t.identifier(tag);
      // const property = t.identifier('is');
      // imitate React and try to use the class (`<${Foo.is}>`)
      // return { tag: t.memberExpression(object, property) };

      const defBind = getDefined(jsxIdentifier.name, scope);
      if (defBind === undefined) {
        throw new Error(`Cannot find ${jsxIdentifier.name}`);
      }

      scope.traverse(defBind.path.node, {
        CallExpression(path) {
          const node = path.node;
          
          if (t.isCallExpression(node)) {
            const defineFuncName = options?.define;
            const callee = node.callee;
            const isDefineMemberExpression =
              t.isMemberExpression(callee) && // and the function name equal...
              (defineFuncName === undefined || callee.property.name === defineFuncName);
            const isDefineIdentifier =
              t.isIdentifier(callee) && // and the function name equal...
              (defineFuncName === undefined || callee.name === defineFuncName);

            if ((isDefineMemberExpression || isDefineIdentifier) && t.isStringLiteral(node.arguments[0])) {
              tag = node.arguments[0].value;
            }
          }
        },
      });

      return { tag };
    }
    // it's not the only identifier, it's a part of a member expression
    // return it as identifier
    else return { tag: t.identifier(tag) };
  }

  /**
   * Take JSXAttribute and return array of template strings and parts
   *
   * @param attr - JSXAttribute
   *
   * TODO: t.JSXSpreadAttribute
   */
  function transformJSXAttribute(attr: t.JSXAttribute) {
    if (!t.isJSXIdentifier(attr.name)) {
      return [''];
    }

    const attrName = attr.name.name;

    // if a value a simple string just return as the tag's attribute
    if (t.isStringLiteral(attr.value)) {
      return [` ${attrName}="${attr.value.value}"`];
    }

    const mappedAttrName = mappingAttrName(options?.attributes, attrName) ?? attrName;

    if (t.isJSXExpressionContainer(attr.value)) {
      return [` ${mappedAttrName}=`, attr.value.expression];
    }

    throw new Error(`Couldn't transform attribute ${JSON.stringify(attrName)}`);
  }

  /**
   * Change an attribute name by a map
   *
   * @param attrMap - the map with rules
   * @param attrName - the attribute name
   */
  function mappingAttrName(attrMap: Options['attributes'] = [], attrName: string) {
    for (const mapObj of attrMap) {
      let result: string;
      if ('preset' in mapObj) {
        switch (mapObj.preset) {
          case 'lit-html':
            result = mappingAttrName(mappingAttrPresetLit, attrName);
            break;
          case 'global':
            result = mappingAttrName(mappingAttrPresetGlobal, attrName);
            break;
        }
        if (result !== undefined) {
          return result;
        }
      } else if ('attributes' in mapObj && mapObj.attributes.some((r) => attrName.match(new RegExp(`^${r}$$`)) !== null)) {
        // add or replace an attribute prefix
        return attrName.replace(new RegExp(`^${mapObj.replace || ''}`), mapObj.prefix);
      }
    }
  }
});
