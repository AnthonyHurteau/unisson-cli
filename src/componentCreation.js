const chalk = require("chalk");
const template = require("./template");
const fs = require("fs");
const path = require("path");

module.exports = {
  checkComponentName,
  createComponent,
  componentNameModeller,
  createComponentContents,
};

function checkComponentName(componentName) {
  if (!componentName) {
    console.log(chalk.red("You must chose a component name."));
    return false;
  } else if (/^[a-zA-Z0-9]+$/.test(componentName)) {
    return true;
  } else {
    console.log(chalk.red("Component name must only contain letters or numbers."));
    return false;
  }
}

function createComponent(targetPath, folderSuffix) {
  const componentPath = targetPath + folderSuffix;

  if (fs.existsSync(componentPath)) {
    console.log(chalk.red(`Folder ${componentPath} already exists. Delete it or choose another directory name.`));
    return false;
  }
  fs.mkdirSync(componentPath);

  return true;
}

function componentNameModeller(componentName) {
  const name = componentName.charAt(0).toLowerCase() + componentName.slice(1);
  const className = componentName.charAt(0).toUpperCase() + componentName.slice(1);

  return { name, className };
}

function createComponentContents(templatePath, componentNames, currentDirectory, folderSuffix) {
  // read all files (1 level) from template folder
  const filesToCreate = fs.readdirSync(templatePath);
  // loop each file
  filesToCreate.forEach((file) => {
    const origFilePath = path.join(templatePath, file);

    // get stats about the current file
    const stats = fs.statSync(origFilePath);

    if (stats.isFile()) {
      // read file content and transform it using template engine
      let contents = fs.readFileSync(origFilePath, "utf8");

      const name = componentNames.name;
      const className = componentNames.className;
      contents = template.render(contents, { name, className });

      // write file to destination folder
      const writePath = path.join(currentDirectory, componentNames.name + folderSuffix, file);
      fs.writeFileSync(writePath, contents, "utf8");

      // renamee component files
      const renamedFile = file.replace("component", componentNames.name);
      const renamedPath = path.join(currentDirectory, componentNames.name + folderSuffix, renamedFile);
      fs.renameSync(writePath, renamedPath);
    }
  });
}
