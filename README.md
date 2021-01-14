# @lackadaisical/defaults-generator

A module for generating pandoc defaults files from Markdown YAML frontmatter.

## Installation and Usage

npm:

`npm install @lackadaisical/defaults-generator`

Yarn:

`yarn add @lackadaisical/defaults-generator`

### makeDefaultsFile

`makeDefaultsFile(frontmatter, { outputFile = null, writer = null } = {} )`

Where:

`frontmatter` is an object.

`outputFile` and `writer` are optional paramaters (strings).

Optional values passed to the function will override `output-file` and `writer` keys in the input object.
