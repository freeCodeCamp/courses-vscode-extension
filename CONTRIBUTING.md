# freeCodeCamp Courses Extension

freeCodeCamp contributor's guide: https://contribute.freecodecamp.org/

To contribute a new course, see the [external-project](https://github.com/freeCodeCamp/external-project) repository.

To contribute to this extension, see below.

## Developing Locally

Fork the repository, then clone it to your local machine:

```bash
git clone https://github.com/freeCodeCamp/freecodecamp-courses.git
```

Change into the directory, and install the dependencies:

```bash
cd freecodecamp-courses
npm install
```

Run the development script:

```bash
npm run watch
```

`F5` should open a new VSCode window with the extension running.

## Submitting a Pull Request

### Naming Convention

**Pull Request Title**: `<verb>(<version>): <description>`

Example: `fix(patch): update image links in readme`

## Publishing the Extension

```bash
git checkout main
git fetch upstream
git reset --hard upstream/main
git checkout prod
git merge main
git push upstream
```
