const fs = require("fs");
import * as ts from "typescript";

import { neededTypescript } from "@unneeded/needed-typescript";

export type importT = {
  name: string;
  default: boolean;
};

export type packageImportT = {
  source: string;
  imports: importT[];
};

const walkFileNode = (fileContents: any) => {
  let imports: packageImportT[] = [];

  const parseImport = (tsNode: ts.Node) => {
    const dependencies: importT[] = [];

    switch (tsNode.kind) {
      case ts.SyntaxKind.ImportDeclaration: {
        const importDeclaration = tsNode as ts.ImportDeclaration;

        /* import x from "package-x" -> "package-x" */
        const source = (importDeclaration.moduleSpecifier as ts.StringLiteral).text.toLowerCase();
        if (source === undefined) {
          break;
        }
        /* import React from "react" -> "React" */
        const name = importDeclaration.importClause?.name?.escapedText;
        name && dependencies.push({ name: name as string, default: true });

        const namedBindings = importDeclaration.importClause?.namedBindings;

        /* import * as React from "react" */
        if (
          namedBindings &&
          namedBindings.kind === ts.SyntaxKind.NamespaceImport
        ) {
          dependencies.push({ name: "*", default: true });
        } else if (
          namedBindings &&
          namedBindings.kind === ts.SyntaxKind.NamedImports
        ) {
          /* import { useContext, useRef } from "react" -> useContext, useRef */
          namedBindings.elements.forEach((element: ts.ImportSpecifier) => {
            dependencies.push({
              name: element.propertyName
                ? (element.propertyName.escapedText as string)
                : (element.name.escapedText as string),
              default: false,
            });
          });
        }
        const i = imports.findIndex((x) => x.source === source);
        if (i !== -1) {
          if (dependencies.length > 0) {
            imports[i].imports = [...imports[i].imports, ...dependencies];
          }
        } else {
          imports.push({ source, imports: dependencies });
        }
        break;
      }
      default:
        break;
    }
  };

  const sourceFile = ts.createSourceFile(
    "typescript.tsx",
    fileContents,
    ts.ScriptTarget.ESNext,
    true,
    ts.ScriptKind.TSX
  );

  ts.forEachChild(sourceFile, parseImport);
  return imports;
};

export const getImportsFromFile = async (filepath: string) =>
  new Promise((resolve, reject) => {
    const content = fs.readFileSync(filepath, "utf-8");
    const imports = walkFileNode(content);
    /* Find imports  walkFileNode() missed*/
    neededTypescript(content)
      .filter((imp) => !imports.find((i) => i.source === imp))
      .forEach((imp) =>
        imports.push({ source: imp.toLowerCase(), imports: [] })
      );
    resolve(imports);
  });
