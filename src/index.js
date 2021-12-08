#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const chalk = require("chalk");
const projectCreation = require("./projectCreation");
const componentCreation = require("./componentCreation");

const operations = { create: "create", c: "c", help: "help", h: "h" };
const operationsList = ["create", "help"];
const types = { app: "app", a: "a", component: "component", c: "c" };
const typesList = ["app", "component"];

let args = {};
if (process.argv[2]) {
  args.operation = process.argv[2];
}
if (process.argv[3]) {
  args.type = process.argv[3];
}
if (process.argv[4]) {
  args.name = process.argv[4];
}

const templates = { component: "component-template", project: "vanilla-template" };

const questions = [
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
const operationArg = process.argv[2] ?? null;

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
    answers = { ...answers, ...args };

    const operation = answers["operation"];
    const type = answers["type"];
    const name = answers["name"] ?? "";
    const template = type === types.c || type === types.component ? templates.component : templates.project;
    const templatePath = path.join(__dirname, "templates", template);

    if ([operations.help, operations.h].includes(operation)) {
      showHelpMessage();
      return false;
    } else if ([operations.create, operations.c].includes(operation)) {
      if ([types.app, types.a].includes(type)) {
        createProject(name, templatePath, currentDirectory);
      }
      if ([types.component, types.c].includes(type)) {
        createComponent(name, templatePath, currentDirectory);
      }
    }
  });
}

function createProject(projectName, templatePath, currentDirectory) {
  const targetPath = path.join(currentDirectory, projectName);

  if (!projectCreation.checkProjectName(projectName)) {
    return;
  }

  if (!projectCreation.createProject(targetPath)) {
    return;
  }

  projectCreation.createDirectoryContents(templatePath, projectName, projectName, currentDirectory);

  if (!projectCreation.postProcess(templatePath, targetPath)) {
    return;
  }

  showProjectCreationCompleteMessage(projectName, targetPath);
}

function createComponent(componentName, templatePath, currentDirectory) {
  if (!componentCreation.checkComponentName(componentName)) {
    return;
  }

  const componentNames = componentCreation.componentNameModeller(componentName);
  const targetPath = path.join(currentDirectory, componentNames.name);
  const folderSuffix = "-component";

  if (!componentCreation.createComponent(targetPath, folderSuffix)) {
    return;
  }

  componentCreation.createComponentContents(templatePath, componentNames, currentDirectory, folderSuffix);

  showComponentCreationCompleteMessage(targetPath, folderSuffix);
}

function showHelpMessage() {
  console.log("");
  console.log("Please use the following syntax: " + chalk.green("unission <operation> <type> <name>"));
  console.log("");
  console.log(chalk.green("---- <operation> ----"));
  console.log(chalk.blueBright(operations.help) + " or " + chalk.blueBright(operations.h));
  console.log(chalk.blueBright(operations.create) + " or " + chalk.blueBright(operations.c));
  console.log("");
  console.log(chalk.green("---- create <type> ----"));
  console.log(chalk.blueBright(types.app) + " or " + chalk.blueBright(types.a));
  console.log(chalk.blueBright(types.component) + " or " + chalk.blueBright(types.c));
  console.log("");
  console.log("For example, to create a new Unisson project called 'todo-list-app'");
  console.log("Type " + chalk.green("unisson") + " and follow the CLI instructions");
  console.log("Or type the following command:");
  console.log(
    chalk.green("unisson") +
      " " +
      chalk.blueBright("create") +
      " " +
      chalk.blueBright("app") +
      " " +
      chalk.blueBright("todo-list-app")
  );
  console.log("Or:");
  console.log(
    chalk.green("unisson") +
      " " +
      chalk.blueBright("c") +
      " " +
      chalk.blueBright("a") +
      " " +
      chalk.blueBright("todo-list-app")
  );
  console.log("");
}

function showProjectCreationCompleteMessage(projectName, projectPath) {
  console.log("");
  console.log(chalk.green("Unisson template created successfully!"));
  console.log(chalk.blueBright("Directory: ") + chalk.green(projectPath));
  console.log(chalk.green(`Access the project directory using cd ${projectName}`));
  console.log(chalk.green("Run: npm start"));
  console.log("");
}

function showComponentCreationCompleteMessage(targetPath, folderSuffix) {
  const componentPath = targetPath + folderSuffix;
  console.log("");
  console.log(chalk.green("Unisson component created successfully!"));
  console.log(chalk.blueBright("Directory: ") + chalk.green(componentPath));
  console.log(chalk.yellow("Don't forget to import your new component in the main.js file"));
  console.log("");
}
