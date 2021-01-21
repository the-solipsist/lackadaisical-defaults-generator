/* eslint-disable quotes */
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

// pandoc --list-input-formats (pandoc 2.11.0.2)
const readers = [
  'biblatex',
  'bibtex',
  'commonmark',
  'commonmark_x',
  'creole',
  'csljson',
  'csv',
  'docbook',
  'docx',
  'dokuwiki',
  'epub',
  'fb2',
  'gfm',
  'haddock',
  'html',
  'ipynb',
  'jats',
  'jira',
  'json',
  'latex',
  'man',
  'markdown',
  'markdown_github',
  'markdown_mmd',
  'markdown_phpextra',
  'markdown_strict',
  'mediawiki',
  'muse',
  'native',
  'odt',
  'opml',
  'org',
  'rst',
  't2t',
  'textile',
  'tikiwiki',
  'twiki',
  'vimwiki',
]

// pandoc --list-output-formats (pandoc 2.11.0.2)
const writers = [
  'asciidoc',
  'asciidoctor',
  'beamer',
  'commonmark',
  'commonmark_x',
  'context',
  'csljson',
  'docbook',
  'docbook4',
  'docbook5',
  'docx',
  'dokuwiki',
  'dzslides',
  'epub',
  'epub2',
  'epub3',
  'fb2',
  'gfm',
  'haddock',
  'html',
  'html4',
  'html5',
  'icml',
  'ipynb',
  'jats',
  'jats_archiving',
  'jats_articleauthoring',
  'jats_publishing',
  'jira',
  'json',
  'latex',
  'man',
  'markdown',
  'markdown_github',
  'markdown_mmd',
  'markdown_phpextra',
  'markdown_strict',
  'mediawiki',
  'ms',
  'muse',
  'native',
  'odt',
  'opendocument',
  'opml',
  'org',
  'pdf',
  'plain',
  'pptx',
  'revealjs',
  'rst',
  'rtf',
  's5',
  'slideous',
  'slidy',
  'tei',
  'texinfo',
  'textile',
  'xwiki',
  'zimwiki',
]

/*
 * JSONSchema for revalidator
 * Informed by https://github.com/jgm/pandoc/issues/5990 and the pandoc manual.
 * Thanks to:
 * John MacFarlane https://github.com/jgm
 * Carsten Allefeld https://github.com/allefeld
 */
const defaultsSchema: Record<string, unknown> = {
  properties: {
    'input-file': {
      type: 'string',
    },
    'input-files': {
      type: 'array',
    },
    reader: {
      type: 'string',
      enum: readers,
    },
    writer: {
      type: 'string',
      enum: writers,
    },
    'output-file': {
      type: 'string',
    },
    'data-dir': {
      type: 'string',
    },
    'metadata-files': {
      type: 'array',
    },
    'file-scope': {
      type: 'boolean',
    },
    standalone: {
      type: 'boolean',
    },
    template: {
      type: 'string',
    },
    variables: {
      type: ['object', 'boolean'],
    },
    wrap: {
      type: 'string',
      enum: ['auto', 'none', 'preserve'],
    },
    ascii: {
      type: 'boolean',
    },
    toc: {
      type: 'boolean',
    },
    'toc-depth': {
      maximum: 5,
      minimum: 1,
      type: 'number',
    },
    'number-sections': {
      type: 'boolean',
    },
    'number-offset': {
      type: 'array',
    },
    'top-level-division:': {
      type: 'string',
      enum: ['default', 'section', 'chapter', 'part'],
    },
    'extract-media': {
      type: 'string',
    },
    'resource-path': {
      type: 'array',
    },
    'include-in-header': {
      type: 'array',
    },
    'include-after-body': {
      type: 'array',
    },
    'include-before-body': {
      type: 'array',
    },
    'highlight-style': {
      type: 'string',
    },
    'syntax-definitions': {
      type: 'array',
    },
    dpi: {
      type: 'number',
    },
    eol: {
      type: 'string',
      enum: ['lf', 'crlf', 'native'],
    },
    columns: {
      type: 'number',
    },
    'preserve-tabs': {
      type: 'boolean',
    },
    'tab-stop': {
      type: 'number',
    },
    'pdf-engine': {
      enum: ['pdflatex', 'xelatex', 'lualatex', 'tectonic', 'latexmk'],
      type: 'string',
    },
    'pdf-engine-opts': {
      type: 'array',
    },
    'pdf-engine-opt': {
      type: 'string',
    },
    'reference-doc': {
      type: 'string',
    },
    'self-contained': {
      type: 'boolean',
    },
    'request-headers': {
      type: 'array',
    },
    abbreviations: {
      type: 'string',
    },
    'indented-code-classes': {
      type: 'array',
    },
    'default-image-extension': {
      minLength: 3,
      maxLength: 5,
      type: 'string',
    },
    filters: {
      type: 'array',
    },
    'cite-method': {
      type: 'string',
      enum: ['citeproc', 'natbib', 'biblatex'],
    },
    'shift-heading-level-by': {
      type: 'number',
    },
    'track-changes': {
      type: 'string',
      enum: ['accept', 'reject', 'all'],
    },
    'strip-comments': {
      type: 'boolean',
    },
    'reference-links': {
      type: 'boolean',
    },
    'reference-location': {
      type: 'string',
    },
    'atx-headers': {
      type: 'boolean',
    },
    listings: {
      type: 'boolean',
    },
    incremental: {
      type: 'boolean',
    },
    'slide-level': {
      maximum: 5,
      minimum: 1,
      type: 'number',
    },
    'section-divs': {
      type: 'boolean',
    },
    'html-q-tags': {
      type: 'boolean',
    },
    'email-obfuscation': {
      enum: ['none', 'javascript', 'references'],
      type: 'string',
    },
    'identifier-prefix': {
      type: 'string',
    },
    'title-prefix': {
      type: 'string',
    },
    css: {
      format: 'url',
      type: 'array',
    },
    'epub-subdirectory': {
      type: 'string',
    },
    'epub-cover-image': {
      type: 'string',
    },
    'epub-metadata': {
      type: 'string',
    },
    'epub-fonts': {
      type: 'array',
    },
    'epub-chapter-level': {
      maximum: 5,
      minimum: 1,
      type: 'number',
    },
    'inypb-output': {
      enum: ['all', 'none', 'best'],
      type: 'string',
    },
    metadata: {
      type: 'object',
      bibliography: {
        type: ['string', 'array'],
      },
      csl: {
        type: 'string',
      },
      'citation-abbreviations': {
        type: 'string',
      },
    },
    'html-math-method': {
      method: {
        enum: ['mathjax', 'katex', 'gladtex', 'mathml'],
        type: 'string',
      },
      url: {
        type: 'string',
        format: 'url',
      },
    },
    trace: {
      type: 'boolean',
    },
    'dump-args': {
      type: 'boolean',
    },
    'ignore-args': {
      type: 'boolean',
    },
    verbosity: {
      enum: ['INFO', 'WARNING', 'ERROR'],
      type: 'string',
    },
    'fail-if-warnings': {
      type: 'boolean',
    },
    'log-file': {
      type: 'string',
    },
    bibliography: {
      type: ['string', 'array'],
    },
    csl: {
      type: 'string',
    },
    'citation-abbreviations': {
      type: 'string',
    },
  },
}

export default defaultsSchema
