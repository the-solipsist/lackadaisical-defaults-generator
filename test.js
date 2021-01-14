#! /usr/bin/env node

'use strict'

import test from 'ava'
import yaml from 'js-yaml'
import fs from 'fs'
import path from 'path'
import revalidator from 'revalidator'

import makeDefaultsFile from './index.js'

import { validateFrontmatter } from './index.js'
import { isDefaultProperty } from './index.js'
import { processProperties } from './index.js'
import getWriter from './util/getWriter.js'

// eslint-disable-next-line no-undef
process.chdir('./test')

test('Valid Pandoc defaults file passes JSONSchema validation', async t => {
  let fileContents = fs.readFileSync('./defaults.yaml', 'utf-8')
  let data = yaml.safeLoad(fileContents)
  t.notThrows(() => {
    validateFrontmatter(data),
    'Frontmatter validation returned errors.'
  })
})

test('getWriter returns correct value for PDF', async t => {
  // Simulate a real filename and snip the extension like we would in the main function
  let fileext = path.extname('/test/path/to/file.pdf')
  const writer = getWriter(fileext)
  t.true(writer === 'pdf')
})

test('getWriter returns correct value for HTML', async t => {
  // Simulate a real filename and snip the extension like we would in the main function
  let fileext = path.extname('/test/path/to/file.html')
  const writer = getWriter(fileext)
  t.true(writer === 'html')

})

test('getWriter returns correct value for DOCX', async t => {
  // Simulate a real filename and snip the extension like we would in the main function
  let fileext = path.extname('/test/path/to/file.docx')
  const writer = getWriter(fileext)
  t.true(writer === 'docx')

})

test('getWriter returns correct value for PPTX', async t => {
  // Simulate a real filename and snip the extension like we would in the main function
  let fileext = path.extname('/test/path/to/file.pptx')
  const writer = getWriter(fileext)
  t.true(writer === 'pptx')

})

test('getWriter returns null for unknown format', async t => {
  // Simulate a real filename and snip the extension like we would in the main function
  let fileext = path.extname('/test/path/to/file.potato')
  const writer = getWriter(fileext)
  t.true(writer === null)

})

test('isDefaultProperty returns true for default properties', async t => {
  const property = 'output-file'
  t.true(isDefaultProperty(property))
})


test('isDefaultProperty returns false for custom properties',  async t => {
  const property = 'title'
  t.false(isDefaultProperty(property))
})

test('makeDefaultsFile returns with valid input', async t => {
  let fileContents = fs.readFileSync('./valid-frontmatter.yaml', 'utf-8')
  let frontmatter = yaml.safeLoad(fileContents)
  const schema = {
    properties: {
      metadata: {
        title: {
          type: 'string',
          enum: ['Example Presentation'],
          required: true
        },
        'background-image': {
          type: 'boolean',
          enum: [true],
          required: true
        },
        author: {
          type: 'string',
          enum: ['Matt Jolly'],
          required: true
        },
        keywords: {
          type: 'array',
          enum: ['example'],
          required: true
        },
        subject: {
          type: 'string',
          enum: ['example'],
          required: true
        },
        aspectratio: {
          type: 'number',
          enum: [169],
          required: true
        },
        'table-row-highlighting': {
          type: 'boolean',
          enum: [true],
          required: true
        }
      },
      toc: {
        type: 'boolean',
        enum: [true],
        required: true
      },
      'slide-level': {
        type: 'number',
        enum: [2],
        required: true
      }
    }
  }
  const validated = revalidator.validate(makeDefaultsFile(frontmatter), schema)

  t.true(validated.errors.length === 0)
})

test('makeDefaultsFile throws an error with invalid input', t => {
  let fileContents = fs.readFileSync('./invalid-frontmatter.yaml', 'utf-8')
  let frontmatter = yaml.safeLoad(fileContents)
  const error = t.throws(() => {
    makeDefaultsFile(frontmatter),
    t.is(error.message, 'Frontmatter validation returned errors.')
  })
})

test('makeDefaultsFile returns appropriate writer when presented with output-file', t => {
  let fileContents = fs.readFileSync('./output-file.yaml', 'utf-8')
  let frontmatter = yaml.safeLoad(fileContents)
  const schema = {
    properties: {
      'output-file': {
        type: 'string',
        enum: ['test.pdf'],
        required: true
      },
      'writer': {
        type: 'string',
        enum: ['pdf'],
        required: true
      }
    }
  }
  const validated = revalidator.validate(makeDefaultsFile(frontmatter), schema)
  t.true(validated.errors.length == 0)
})

test('processProperties places default value in root of object', t=> {
  const property = {
    writer : 'pdf'
  }
  const schema = {
    properties: {
      writer: {
        type: 'string',
        enum: ['pdf'],
        required: true
      }
    }
  }

  const validated = revalidator.validate(processProperties(property), schema)
  t.true(validated.errors.length == 0)
})

test('processProperties places special case in object.metadata', t=> {
  const property = {
    'csl' : 'this-is-a-csl-string'
  }
  const schema = {
    properties: {
      metadata: {
        csl: {
          type: 'string',
          enum: ['this-is-a-csl-string'],
          required: true
        }
      }
    }
  }

  const validated = revalidator.validate(processProperties(property), schema)
  t.true(validated.errors.length == 0)
})

test('processProperties places custom property in object.metadata', t=> {
  const property = {
    'custom-property' : 'this-is-a-custom-property-string'
  }
  const schema = {
    properties: {
      metadata: {
        'custom-property': {
          type: 'string',
          enum: ['this-is-a-custom-property-string'],
          required: true
        }
      }
    }
  }

  const validated = revalidator.validate(processProperties(property), schema)
  t.true(validated.errors.length == 0)
})

test('Invalid writer fails schema validation', async t => {
  const data = {
    writer: 'not-a-real-writer'
  }
  const error = t.throws(() => {
    makeDefaultsFile(data),
    t.is(error.message, 'Frontmatter validation returned errors.')
  })
})

test('Valid writer passes schema validation', async t => {
  const data = {
    writer: 'html'
  }
  t.notThrows(() => {
    makeDefaultsFile(data),
    'Frontmatter validation returned errors.'
  })
})

test('Invalid reader fails schema validation', async t => {
  const data = {
    reader: 'not-a-real-reader'
  }
  const error = t.throws(() => {
    makeDefaultsFile(data),
    t.is(error.message, 'Frontmatter validation returned errors.')
  })
})

test('Valid reader passes schema validation', async t => {
  const data = {
    reader: 'html'
  }
  t.notThrows(() => {
    makeDefaultsFile(data),
    'Frontmatter validation returned errors.'
  })
})

test('variables are placed in output object correctly', async t => {
  const data = {
    variable: {
      'test-variable': 'test variable'
    }
  }
  const schema = {
    properties: {
      metadata: {
        'test-variable': {
          type: 'string',
          enum: ['test variable'],
          required: true
        }
      }
    }
  }

  const validated = revalidator.validate(makeDefaultsFile(data), schema)
  t.true(validated.errors.length == 0)
})


test('Explicit metadata is placed in output object correctly', async t => {
  const data = {
    metadata: {
      'test-metadata': 'test metadata'
    }
  }
  const schema = {
    properties: {
      metadata: {
        'test-metadata': {
          type: 'string',
          enum: ['test-variable'],
          required: true
        }
      }
    }
  }

  const validated = revalidator.validate(makeDefaultsFile(data), schema)
  t.true(validated.errors.length == 0)
})

test('Explicit outputFile passed to makeDefaultsFile overrides yaml input', async t => {
  const output = '../output.pdf'
  const data = {
    'output-file': 'user specified'
  }
  const schema = {
    properties: {
      'output-file': {
        type: 'string',
        enum: [path.resolve(output)],
        required: true
      }
    }
  }
  const validated = revalidator.validate(makeDefaultsFile(data, {outputFile: path.resolve(output)}), schema)
  t.true(validated.errors.length == 0)
})

test('Explicit writer passed to makeDefaultsFile overrides yaml input', async t => {
  const data = {
    'writer': 'pdf'
  }
  const schema = {
    properties: {
      'writer': {
        type: 'string',
        enum: ['html'],
        required: true
      }
    }
  }
  const validated = revalidator.validate(makeDefaultsFile(data, {writer: 'html'}), schema)
  t.true(validated.errors.length == 0)
})

test('Custom metadata objects are accepted', async t => {
  const data = {
    customMetadata: {
      title: 'Custom Metadata Title'
    }
  }
  const outputSchema = {
    properties: {
      metadata: {
        'title': {
          type: 'string',
          enum: ['Custom Metadata Title'],
          required: true
        }
      }
    }
  }
  const validated = revalidator.validate(makeDefaultsFile({}, data), outputSchema)
  t.true(validated.errors.length == 0)
})

test('Custom metadata values are overridden by in-document values', async t => {
  const data = {
    customMetadata: {
      title: 'Custom Metadata Title'
    }
  }
  const outputSchema = {
    properties: {
      metadata: {
        'title': {
          type: 'string',
          enum: ['Standard Title'],
          required: true
        }
      }
    }
  }
  const validated = revalidator.validate(makeDefaultsFile({title: 'Standard Title'}, data), outputSchema)
  t.true(validated.errors.length == 0)
})
