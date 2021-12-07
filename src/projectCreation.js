const shelljs = require("shelljs");
const template = require("./template");
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");

module.exports = {
  checkProjectName,
  createProject,
  createDirectoryContents,
  postProcess,
};

function checkProjectName(projectName) {
  if (!projectName) {
    console.log(chalk.red("You must chose a project name."));
    return false;
  }
  if (/^([A-Za-z\-\_\d])+$/.test(projectName)) {
    return true;
  } else {
    console.log(chalk.red("Project name may only include letters, numbers, underscores and dashes."));
    return false;
  }
}

function createProject(projectPath) {
  if (fs.existsSync(projectPath)) {
    console.log(chalk.red(`Folder ${projectPath} already exists. Delete it or choose another directory name.`));
    return false;
  }
  fs.mkdirSync(projectPath);

  return true;
}

// list of file/folder that should not be copied
const skipFiles = ["node_modules", ".template.json"];
function createDirectoryContents(templatePath, projectName, projectTitle, currentDirectory) {
  // read all files/folders (1 level) from template folder
  const filesToCreate = fs.readdirSync(templatePath);
  // loop each file/folder
  filesToCreate.forEach((file) => {
    const origFilePath = path.join(templatePath, file);

    // get stats about the current file
    const stats = fs.statSync(origFilePath);

    // skip files that should not be copied
    if (skipFiles.indexOf(file) > -1) return;

    if (stats.isFile()) {
      if (path.extname(file) === ".png") {
        let contents = fs.readFileSync(origFilePath);
        const writePath = path.join(currentDirectory, projectName, file);
        fs.writeFileSync(writePath, contents);
      } else {
        // read file content and transform it using template engine
        let contents = fs.readFileSync(origFilePath, "utf8");

        contents = template.render(contents, { projectTitle });
        // Rename
        if (file === ".npmignore") {
          file = ".gitignore";
        }
        // write file to destination folder
        const writePath = path.join(currentDirectory, projectName, file);
        fs.writeFileSync(writePath, contents, "utf8");
      }
    } else if (stats.isDirectory()) {
      // create folder in destination folder
      fs.mkdirSync(path.join(currentDirectory, projectName, file));
      // copy files/folder inside current folder recursively
      createDirectoryContents(
        path.join(templatePath, file),
        path.join(projectName, file),
        projectTitle,
        currentDirectory
      );
    }
  });
}

function postProcess(templatePath, targetPath) {
  const isNode = fs.existsSync(path.join(templatePath, "package.json"));
  if (isNode) {
    shelljs.cd(targetPath);
    const result = shelljs.exec("npm install");
    if (result.code !== 0) {
      return false;
    }
  }

  return true;
}
