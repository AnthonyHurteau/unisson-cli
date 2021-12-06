#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const chalk = require("chalk");
const template = require("./template");
const shelljs = require("shelljs");

const operations = { create: "create", c: "c", help: "help", h: "h" };
const operationsList = ["create", "help"];
const types = { app: "app", a: "a", component: "component", c: "c" };
const typesList = ["app", "component"];
const args = { operation: process.argv[2], type: process.argv[3], name: process.argv[4] };

const templates = fs.readdirSync(path.join(__dirname, "templates"));

const questions = [
  // Can use this when we will have TS template
  // {
  //   name: "template",
  //   type: "list",
  //   message: "Which Unisson template do you wish to generate?",
  //   choices: templates,
  // },
  {
    name: "operation",
    type: "list",
    message: "Which operation do you wish to perform?",
    when: () => !args.operation,
    choices: operationsList,
  },
  {
    name: "type",
    type: "list",
    message: "Which type of element do you wish to create?",
    when: (answers) =>
      !args.type &&
      (answers.operation === "create" || args.operation === operations.create || args.operation === operations.c),
    choices: typesList,
  },
  {
    name: "name",
    type: "input",
    message: "Project Name:",
    when: (answers) =>
      !args.name &&
      (answers.operation === "create" || args.operation === operations.create || args.operation === operations.c),
    validate: (input) => {
      if (/^([A-Za-z\-\_\d])+$/.test(input)) {
        return true;
      } else {
        return "Project name may only include letters, numbers, underscores and dashes.";
      }
    },
  },
];

const currentDirectory = process.cwd();
const operationArg = process.argv[2] ? process.argv[2] : null;

if ([operations.create, operations.c, null].includes(operationArg)) {
  program();
} else if ([operations.help, operations.h].includes(operationArg)) {
  showHelpMessage();
} else {
  console.log("");
  console.log(chalk.red(`Argument <operation> ${operationArg} is not valid.`));
  showHelpMessage();
}

function program() {
  inquirer.prompt(questions).then((answers) => {
    // Can use this when we will have TS template
    // const projectTemplate = answers["template"];
    const projectTemplate = templates[0];
    const operation = answers["operation"];
    const projectName = answers["name"] ?? "";
    const templatePath = path.join(__dirname, "templates", projectTemplate);

    const targetPath = path.join(currentDirectory, projectName);

    if (operation === operations.help || operations.h) {
      showHelpMessage();
      return false;
    }

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

    showCompleteMessage(projectName);
  });
}

function showHelpMessage() {
  console.log("");
  console.log("Please use the following syntax: " + chalk.green("unission <operation> <type> <name>"));
  console.log("");
  console.log(chalk.green("---- $operation ----"));
  console.log(chalk.blueBright(operations.help) + " or " + chalk.blueBright(operations.h));
  console.log(chalk.blueBright(operations.create) + " or " + chalk.blueBright(operations.c));
  console.log("");
  console.log(chalk.green("---- create $type ----"));
  console.log(chalk.blueBright(types.app) + " or " + chalk.blueBright(types.a));
  console.log(chalk.blueBright(types.component) + " or " + chalk.blueBright(types.c));
}

function showCompleteMessage(projectName) {
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
