#!/usr/bin/env node
/**
 * @ignore
 * BEGIN HEADER
 *
 * Contains:        Create Defaults File command
 * CVM-Role:        <none>
 * Maintainer:      Matt Jolly
 * License:         GNU GPL v3
 *
 * Description:     This command creates a valid pandoc defaults file from Markdown YAML frontmatter input.
 *
 * END HEADER
 */

import revalidator from 'revalidator'
import path from 'path'

// Based on Text.Pandoc.App.FormatHeuristics
function getWriter(extension) {
    let writer
    switch (extension.toLowerCase()) {
    case ".adoc"     : writer = "asciidoc"; break;
    case ".asciidoc" : writer = "asciidoc"; break;
    case ".context"  : writer = "context"; break;
    case ".ctx"      : writer = "context"; break;
    case ".db"       : writer = "docbook"; break;
    case ".doc"      : writer = "doc"; break;
    case ".docx"     : writer = "docx"; break;
    case ".dokuwiki" : writer = "dokuwiki"; break;
    case ".epub"     : writer = "epub"; break;
    case ".fb2"      : writer = "fb2"; break;
    case ".htm"      : writer = "html"; break;
    case ".html"     : writer = "html"; break;
    case ".icml"     : writer = "icml"; break;
    case ".json"     : writer = "json"; break;
    case ".latex"    : writer = "latex"; break;
    case ".lhs"      : writer = "markdown+lhs"; break;
    case ".ltx"      : writer = "latex"; break;
    case ".markdown" : writer = "markdown"; break;
    case ".md"       : writer = "markdown"; break;
    case ".ms"       : writer = "ms"; break;
    case ".muse"     : writer = "muse"; break;
    case ".native"   : writer = "native"; break;
    case ".odt"      : writer = "odt"; break;
    case ".opml"     : writer = "opml"; break;
    case ".org"      : writer = "org"; break;
    case ".pdf"      : writer = "pdf"; break;
    case ".pptx"     : writer = "pptx"; break;
    case ".roff"     : writer = "ms"; break;
    case ".rst"      : writer = "rst"; break;
    case ".rtf"      : writer = "rtf"; break;
    case ".s5"       : writer = "s5"; break;
    case ".t2t"      : writer = "t2t"; break;
    case ".tei"      : writer = "tei"; break;
    case ".tei.xml"  : writer = "tei"; break;
    case ".tex"      : writer = "latex"; break;
    case ".texi"     : writer = "texinfo"; break;
    case ".texinfo"  : writer = "texinfo"; break;
    case ".text"     : writer = "markdown"; break;
    case ".textile"  : writer = "textile"; break;
    case ".txt"      : writer = "markdown"; break;
    case ".wiki"     : writer = "mediawiki"; break;
    case ".xhtml"    : writer = "html"; break;
    case ".ipynb"    : writer = "ipynb"; break;
    case ".csv"      : writer = "csv"; break;
    case ".bib"      : writer = "biblatex"; break;
    case /\.[1-9]{1,4}/.test(extension)     : writer = "man"; break;
    default: writer = null; break;
    }
    return writer

}

function isDefaultProperty(property) {

}

export default function makeDefaultsFile (frontmatter, outputFile = null, writer = null) {
    // Iterate over object's properties; if in defaults make root object in output yaml.
    // If not in defaults, add to output.variable as output.variable.name
    // Todo: validate input against a schema based on defaults-description.md

    let defaultsFileContents

    for (const property in frontmatter) {

        if (isDefaultProperty(property)) {
            defaultFileContents[property] = frontmatter[property]
        }
        else {
            defaultFileContents.variable[property] = frontmatter[property]
        }

    }

    // Maybe we don't want to let the user set **all** of the variables directly.
    if (outputFile) {
        defaultsFileContents['output-file'] = path.resolve(outputFile).toString // probably a better way to do this
        }

    if (writer) {
        defaultsFileContents['writer'] = writer
    } else if (outputFile) {
        defaultFileContents['writer'] = isNull(getWriter(path.extname(outputFile))) ? '' : getWriter(path.extname(outputFile))
    }

    return defaultsFileContents

}



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
