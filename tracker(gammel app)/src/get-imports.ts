const fs = require("fs");
import * as ts from "typescript";

import { neededTypescript } from "@unneeded/needed-typescript";
import pLimit from "p-limit";
import { getProps } from "./getProps";

export const getImports = async (files: string[]) => {
  console.log("Starting search for imports in files");
  const limiter = pLimit(10);
  const imports: packageImportT[][] = [];
  let counter = 0;
  await Promise.all(
    files.map((file) =>
      limiter(() =>
        getImportsFromFile(file)
          .then((imp: packageImportT[]) => {
            imports.push(imp);
            counter = counter + 1;
            counter % 1000 == 0 &&
              process.stdout.write(`\x1Bc\r Files: ${counter}/${files.length}`);
          })
          .catch((err: Error) => {
            console.log(file);
          })
      )
    )
  );
  console.log("\nFinished search for imports in files");
  return imports;
};

export type importT = {
  name: string;
  default: boolean;
};

export type packageImportT = {
  source: string;
  imports: importT[];
  props: { tag: string; props: string[] }[];
  fileSource?: string;
};

const walkFileNode = (fileContents: any) => {
  let imports: packageImportT[] = [];

  const parseImport = (tsNode: ts.Node) => {
    const dependencies: importT[] = [];

    switch (tsNode.kind) {
      case ts.SyntaxKind.ImportDeclaration: {
        const importDeclaration = tsNode as ts.ImportDeclaration;

        /* import x from "package-x" -> "package-x" */
        const source = (
          importDeclaration.moduleSpecifier as ts.StringLiteral
        ).text.toLowerCase();
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
          imports.push({ source, imports: dependencies, props: [] });
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

  return imports.map((x) => {
    return {
      ...x,
      props: !!["@navikt/ds-react", "@navikt/ds-icons"].find((y) =>
        x.source.startsWith(y)
      )
        ? getProps(
            sourceFile,
            x.imports.map((x) => x.name)
          )
        : [],
    };
  });
};

export const getImportsFromFile = async (
  filepath: string
): Promise<packageImportT[]> =>
  new Promise((resolve, reject) => {
    const content = fs.readFileSync(filepath, "utf-8");
    const imports = walkFileNode(content);

    /* Find imports  walkFileNode() missed*/
    neededTypescript(content)
      .filter((imp) => !imports.find((i) => i.source === imp))
      .forEach((imp) =>
        imports.push({ source: imp.toLowerCase(), imports: [], props: [] })
      );
    const newImp = imports.map((x) => {
      return { ...x, fileSource: filepath };
    });

    resolve(newImp);
  });
