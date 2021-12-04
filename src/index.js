#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const chalk = require("chalk");
const template = require("./template");
const shelljs = require("shelljs");

const templates = fs.readdirSync(path.join(__dirname, "templates"));

const questions = [
  {
    name: "template",
    type: "list",
    message: "Which Unisson template do you wish to generate?",
    choices: templates,
  },
  {
    name: "name",
    type: "input",
    message: "Project Name:",
    validate: (input) => {
      if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
      else return "Project name may only include letters, numbers, underscores and dashes.";
    },
  },
];

const currentDirectory = process.cwd();

console.log(process.argv[2]);

inquirer.prompt(questions).then((answers) => {
  const projectTemplate = answers["template"];
  const projectName = answers["name"];
  const templatePath = path.join(__dirname, "templates", projectTemplate);
  const targetPath = path.join(currentDirectory, projectName);

  // if (!checkProjectName(projectName)) {
  //   return;
  // }

  // if (!createProject(targetPath)) {
  //   return;
  // }

  // createDirectoryContents(templatePath, projectName, projectName);

  // if (!postProcess(templatePath, targetPath)) {
  //   return;
  // }

  showMessage(projectName);
});

function showMessage(projectName) {
  console.log("");
  console.log(chalk.green("Unisson template created successfully!"));
  console.log(chalk.green(`Access the project directory using cd ${projectName}`));
  console.log(chalk.green("Run: npm start"));
}

function checkProjectName(projectName) {
  if (!projectName) {
    console.log(chalk.red("You must chose a project name."));
    return false;
  }
  return true;
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
function createDirectoryContents(templatePath, projectName, projectTitle) {
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
      createDirectoryContents(path.join(templatePath, file), path.join(projectName, file), projectTitle);
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
