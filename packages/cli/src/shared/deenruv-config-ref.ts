import fs from "fs-extra";
import path from "node:path";
import {
  Node,
  ObjectLiteralExpression,
  Project,
  SourceFile,
  SyntaxKind,
  VariableDeclaration,
} from "ts-morph";

export class DeenruvConfigRef {
  readonly sourceFile: SourceFile;
  readonly configObject: ObjectLiteralExpression;

  constructor(
    private project: Project,
    options: { checkFileName?: boolean } = {},
  ) {
    const checkFileName = options.checkFileName ?? true;

    const getDeenruvConfigSourceFile = (sourceFiles: SourceFile[]) => {
      return sourceFiles.find((sf) => {
        return (
          (checkFileName
            ? sf.getFilePath().endsWith("deenruv-config.ts")
            : true) &&
          sf
            .getVariableDeclarations()
            .find((v) => this.isDeenruvConfigVariableDeclaration(v))
        );
      });
    };

    const findAndAddDeenruvConfigToProject = () => {
      // If the project does not contain a deenruv-config.ts file, we'll look for a deenruv-config.ts file
      // in the src directory.
      const srcDir = project.getDirectory("src");
      if (srcDir) {
        const srcDirPath = srcDir.getPath();
        const srcFiles = fs.readdirSync(srcDirPath);

        const filePath = srcFiles.find((file) =>
          file.includes("deenruv-config.ts"),
        );
        if (filePath) {
          project.addSourceFileAtPath(path.join(srcDirPath, filePath));
        }
      }
    };

    let deenruvConfigFile = getDeenruvConfigSourceFile(
      project.getSourceFiles(),
    );
    if (!deenruvConfigFile) {
      findAndAddDeenruvConfigToProject();
      deenruvConfigFile = getDeenruvConfigSourceFile(project.getSourceFiles());
    }
    if (!deenruvConfigFile) {
      throw new Error(
        "Could not find the DeenruvConfig declaration in your project.",
      );
    }
    this.sourceFile = deenruvConfigFile;
    this.configObject = deenruvConfigFile
      ?.getVariableDeclarations()
      .find((v) => this.isDeenruvConfigVariableDeclaration(v))
      ?.getChildren()
      .find(Node.isObjectLiteralExpression) as ObjectLiteralExpression;
  }

  getPathRelativeToProjectRoot() {
    return path.relative(
      this.project.getRootDirectories()[0]?.getPath() ?? "",
      this.sourceFile.getFilePath(),
    );
  }

  getConfigObjectVariableName() {
    return this.sourceFile
      ?.getVariableDeclarations()
      .find((v) => this.isDeenruvConfigVariableDeclaration(v))
      ?.getName();
  }

  getPluginsArray() {
    return this.configObject
      .getProperty("plugins")
      ?.getFirstChildByKind(SyntaxKind.ArrayLiteralExpression);
  }

  addToPluginsArray(text: string) {
    this.getPluginsArray()?.addElement(text).formatText();
  }

  private isDeenruvConfigVariableDeclaration(v: VariableDeclaration) {
    return v.getType().getText(v) === "DeenruvConfig";
  }
}
