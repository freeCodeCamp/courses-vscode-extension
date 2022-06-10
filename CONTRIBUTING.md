# freeCodeCamp Courses Extension

freeCodeCamp contributor's guide: https://contribute.freecodecamp.org/

To contribute a new course, see the [external-project](https://github.com/freeCodeCamp/external-project) repository.

To contribute to this extension, see below.

### Developing Locally

Fork the repository, then clone it to your local machine:

```bash
git clone https://github.com/freeCodeCamp/courses-vscode-extension.git
```

Change into the directory, and install the dependencies:

```bash
cd courses-vscode-extension
npm install
```

Run the development script:

```bash
npm run watch
```

`F5` should open a new VSCode window with the extension running.

### Submitting a Pull Request

#### Naming Convention

**VSIX Commit Message**: `patch(1.0.1): update courses url`

**Pull Request Title**: `fix(patch): update courses url`

Include the _vsix_ file, and specify if change is patch (`0.0.x`), minor (`0.x.0`), or major (`x.0.0`).

#### Building the VSIX

Run the following command with the argument being either `patch`, `minor`, or `major`:

```bash
npm run pack <semver_change>
```
