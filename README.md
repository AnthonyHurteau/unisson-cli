# unisson-cli

<p align="center" width="100%">
 <img src="https://raw.githubusercontent.com/AnthonyHurteau/unisson-cli/main/assets/unisson192.png">
 <br/>
 <b>Command line interface for the Unisson Framework</b>
</p>
<br/>

## Unisson Framework

<br/>

<p><a href="https://www.npmjs.com/package/unisson" target="_blank" rel="noopener noreferrer">NPM</a></p>
<p><a href="https://github.com/AnthonyHurteau/unisson#readme" target="_blank" rel="noopener noreferrer">Github</a></p>
<br/>

## Install

<br/>

```
$ npm install -g unisson-cli
```

<br/>

## Usage

<br/>

<p>The unisson command line interface allows developpers to quickly create new Unisson projects as well as component classes.</p>
<br/>

### Default Command

<br/>

```
unisson
```

<p>When using the default Unisson command, you will be prompted with questions that will lead you to create a new project or a new component.</p>
<br/>
<p><img src="https://raw.githubusercontent.com/AnthonyHurteau/unisson-cli/main/assets/defaultCommand.png"></p>
<br/>
<p><img src="https://raw.githubusercontent.com/AnthonyHurteau/unisson-cli/main/assets/defaultProjectCreate.png">
<img src="https://raw.githubusercontent.com/AnthonyHurteau/unisson-cli/main/assets/defaultComponentCreate.png"></p>
<br/>

### New Project Creation

<br/>

```
unisson create app <name>
unisson c a <name>
```

<p>Use either of these commands to create a new Unisson project template under the current directory, already set up with ViteJs. Npm install will be automatically ran when the directory is created.</p>
<br/>
<p><img src="https://raw.githubusercontent.com/AnthonyHurteau/unisson-cli/main/assets/projectCreate.png"></p>
<br/>
<p><img src="https://raw.githubusercontent.com/AnthonyHurteau/unisson-cli/main/assets/template.png"></p>
<br/>

### New Component Creation

<br/>

```
unisson create component <name>
unisson c c <name>
```

<p>Use either of these commands to create a new Unisson component template under the current directory. It will be created under its own folder and will include a css module file.</p>
<br/>
<p><img src="https://raw.githubusercontent.com/AnthonyHurteau/unisson-cli/main/assets/componentCreate.png"></p>
<br/>
<p><img src="https://raw.githubusercontent.com/AnthonyHurteau/unisson-cli/main/assets/newComponent.png"></p>
<br/>
