import ts = require("typescript");

function isJsxOpeningLike(node: ts.Node): node is ts.JsxOpeningLikeElement {
  return (
    node.kind === ts.SyntaxKind.JsxOpeningElement ||
    node.kind === ts.SyntaxKind.JsxSelfClosingElement
  );
}

function findFirstJsxOpeningLikeElementWithName(
  node: ts.SourceFile,
  tagName: string
) {
  const nodes: any[] = [];

  find(node);
  return nodes;

  function find(
    node: ts.Node | undefined
  ): ts.JsxOpeningLikeElement | undefined {
    if (!node) {
      return undefined;
    }

    // Is this a JsxElement with an identifier name?
    if (
      isJsxOpeningLike(node) &&
      node.tagName.kind === ts.SyntaxKind.Identifier
    ) {
      // Does the tag name match what we're looking for?
      if ((node.tagName as ts.Identifier).text === tagName) {
        nodes.push(node.attributes.properties.map((x) => x.getFullText()));
      }
    }
    return ts.forEachChild(node, find);
  }
}

export function getProps(sourceFile: ts.SourceFile, elements: string[]) {
  const nodes = elements.map((x) =>
    findFirstJsxOpeningLikeElementWithName(sourceFile, x)
  );

  return nodes.map((node, i) => ({
    tag: elements[i],
    props: node.reduce((old, n) => [...old, n], []),
  }));
}
