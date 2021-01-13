#!/usr/bin/env node
/**
 *
 * BEGIN HEADER
 *
 * Contains:        Pandoc defaults file JSON Schema
 * CVM-Role:        <none>
 * Maintainer:      Matt Jolly
 * License:         GNU GPL v3
 *
 * Description:     Contains a schema that a pandoc defaults file (or frontmatter input) can be validated against.
 *
 * END HEADER
 */

// JSONSchema for revalidator
const schema = {
  properties: {
    'input-file': {
      type: 'string'
    },
    'input-files': {
      type: 'array'
    },
    reader: {
      type: 'string'
    },
    writer: {
      type: 'string'
    },
    'output-file': {
      type: 'string'
    },
    'data-dir': {
      type: 'string'
    },
    'metadata-files': {
      type: 'array'
    },
    'file-scope': {
      type: 'boolean'
    },
    standalone: {
      type: 'boolean'
    },
    template: {
      type: 'string'
    },
    variables: {
      type: ['object','boolean']
    },
    wrap: {
      type: 'string',
      enum: ['auto', 'none', 'preserve']
    },
    ascii: {
      type: 'boolean'
    },
    toc: {
      type: 'boolean'
    },
    'toc-depth': {
      maximum: 5,
      minimum: 1,
      type: 'number'
    },
    'number-sections': {
      type: 'boolean'
    },
    'number-offset': {
      type: 'array' // of numbers
    },
    'top-level-division:': {
      type: 'string',
      enum: ['default','section','chapter','part']
    },
    'extract-media': {
      type: 'string'
    },
    'resource-path': {
      type: 'array'
    },
    'include-in-header': {
      type: 'string'
    },
    'include-after-body': {
      type: 'string'
    },
    'include-before-body': {
      type: 'string'
    },
    'highlight-style': {
      type: 'string' // There are enumerated values, but it can also be a path to a json file.
    },
    'syntax-definitions': {
      type: 'array'
    },
    dpi: {
      type: 'number'
    },
    eol: {
      type: 'string',
      enum: ['lf', 'crlf', 'native']
    },
    columns: {
      type: 'number'
    },
    'preserve-tabs': {
      type: 'boolean'
    },
    'tab-stop': {
      type: 'boolean'
    },
    'pdf-engine': {
      enum: ['pdflatex', 'xelatex', 'lualatex', 'tectonic', 'latexmk'],
      type: 'string'
    },
    'pdf-engine-opts': {
      type: 'array'
    },
    'reference-doc': {
      type: 'string'
    },
    'self-contained': {
      type: 'boolean'
    },
    'request-headers': {
      type: 'array'
    },
    abbreviations: {
      type: 'string'
    },
    'indented-code-classes': {
      type: 'array'
    },
    'default-image-extension': {
      minLength: 3,
      maxLength: 5,
      type: 'string'
    },
    filters: {
      type: 'array'
    },
    'cite-method': {
      type: 'string',
      enum: ['citeproc', 'natbib', 'biblatex']
    },
    'shift-heading-level-by': {
      type: 'number'
    },
    'track-changes': {
      type: 'string',
      enum: ['accept', 'reject', 'all']
    },
    'strip-comments': {
      type: 'boolean'
    },
    'reference-links': {
      type: 'boolean'
    },
    'reference-location': {
      type: 'string'
    },
    'atx-headers': {
      type: 'boolean'
    },
    'listings': {
      type: 'boolean'
    },
    'incremental': {
      type: 'boolean'
    },
    'slide-level': {
      maximum: 5,
      minimum: 1,
      type: 'number'
    },
    'section-divs': {
      type: 'boolean'
    },
    'html-q-tags': {
      type: 'boolean'
    },
    'email-obfuscation': {
      enum: ['none', 'javascript', 'references'],
      type: 'string'
    },
    'identifier-prefix': {
      type: 'string'
    },
    'title-prefix': {
      type: 'string'
    },
    'css' : {
      format: 'url',
      type: 'string'
    },
    'epub-subdirectory': {
      type: 'string'
    },
    'epub-cover-image': {
      type: 'string'
    },
    'epub-metadata': {
      type: 'string'
    },
    'epub-fonts': {
      type: 'array'
    },
    'epub-chapter-level': {
      maximum: 5,
      minimum: 1,
      type: 'number'
    },
    'inypb-output': {
      enum: ['all','none','best'],
      type: 'string'
    },
    metadata: {
      type: 'object',
      'bibliography': {
        type: 'string'
      },
      'csl': {
        type: 'string'
      },
      'citation-abbreviations': {
        type: 'string'
      }
    },
    'html-math-method': {
      method: {
        enum: ['mathjax', 'katex', 'gladtex', 'mathml'],
        type: 'string',
      },
      url: {
        type: 'string',
        format: 'url'
      }
    },
    'trace': {
      type: 'boolean'
    },
    'dump-args': {
      type: 'boolean'
    },
    'ignore-args': {
      type: 'boolean'
    },
    'verbosity': {
      enum: ['INFO', 'ERROR'],
      type: 'string'
    },
    'fail-if-warnings': {
      type: 'boolean'
    },
    'log-file': {
      type: 'string'
    }
  }
}

export default schema
