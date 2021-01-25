/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use strict'

import test from 'ava'
import YAML from 'yaml'
import fs from 'fs'
import path from 'path'
import revalidator from 'revalidator'

import makeDefaultsFile from '../src/index'

import { validateAgainstSchema } from '../src/index'
import { isDefaultProperty } from '../src/index'
import { processProperties } from '../src/index'
import getWriter from '../src/util/getWriter'

// eslint-disable-next-line no-undef
process.chdir('./test')

test('Valid Pandoc defaults file passes JSONSchema validation', (t) => {
  const data: Record<string, unknown> = YAML.parse(fs.readFileSync('./defaults.yaml', 'utf-8'))
  t.notThrows(() => {
    validateAgainstSchema(data), 'Frontmatter validation returned errors.'
  })
})

test('getWriter returns correct value for PDF', (t) => {
  // Simulate a real filename and snip the extension like we would in the main function
  const fileext = path.extname('/test/path/to/file.pdf')
  const writer = getWriter(fileext)
  t.true(writer === 'pdf')
})

test('getWriter returns correct value for HTML', (t) => {
  // Simulate a real filename and snip the extension like we would in the main function
  const fileext = path.extname('/test/path/to/file.html')
  const writer = getWriter(fileext)
  t.true(writer === 'html')
})

test('getWriter returns correct value for DOCX', (t) => {
  // Simulate a real filename and snip the extension like we would in the main function
  const fileext = path.extname('/test/path/to/file.docx')
  const writer = getWriter(fileext)
  t.true(writer === 'docx')
})

test('getWriter returns correct value for PPTX', (t) => {
  // Simulate a real filename and snip the extension like we would in the main function
  const fileext = path.extname('/test/path/to/file.pptx')
  const writer = getWriter(fileext)
  t.true(writer === 'pptx')
})

test('getWriter returns undefined for unknown format', (t) => {
  // Simulate a real filename and snip the extension like we would in the main function
  const fileext = path.extname('/test/path/to/file.potato')
  const writer = getWriter(fileext)
  t.true(writer === undefined)
})

test('isDefaultProperty returns true for default properties', (t) => {
  const property = 'output-file'
  t.true(isDefaultProperty(property))
})

test('isDefaultProperty returns false for custom properties', (t) => {
  const property = 'title'
  t.false(isDefaultProperty(property))
})

test('makeDefaultsFile returns with valid input', (t) => {
  const frontmatter = YAML.parse(fs.readFileSync('./valid-frontmatter.yaml', 'utf-8'))
  const schema: Record<string, unknown> = {
    properties: {
      variables: {
        title: {
          type: 'string',
          enum: ['Example Presentation'],
          required: true,
        },
        'background-image': {
          type: 'boolean',
          enum: [true],
          required: true,
        },
        author: {
          type: 'string',
          enum: ['Matt Jolly'],
          required: true,
        },
        keywords: {
          type: 'array',
          enum: ['example'],
          required: true,
        },
        subject: {
          type: 'string',
          enum: ['example'],
          required: true,
        },
        aspectratio: {
          type: 'number',
          enum: [169],
          required: true,
        },
        'table-row-highlighting': {
          type: 'boolean',
          enum: [true],
          required: true,
        },
      },
      toc: {
        type: 'boolean',
        enum: [true],
        required: true,
      },
      'slide-level': {
        type: 'number',
        enum: [2],
        required: true,
      },
    },
  }
  const validated = revalidator.validate(makeDefaultsFile(frontmatter), schema)

  t.true(validated.errors.length === 0) //TODO: This doesn't fail if required values are missing...
})

test('makeDefaultsFile throws an error with invalid input', (t) => {
  const frontmatter = YAML.parse(fs.readFileSync('./invalid-frontmatter.yaml', 'utf-8'))
  const error = t.throws(() => {
    makeDefaultsFile(frontmatter), t.is(error.message, 'Frontmatter validation returned errors.')
  })
})

test('makeDefaultsFile returns appropriate writer when presented with output-file', (t) => {
  const frontmatter = YAML.parse(fs.readFileSync('./output-file.yaml', 'utf-8'))
  const schema: Record<string, unknown> = {
    properties: {
      'output-file': {
        type: 'string',
        enum: ['test.pdf'],
        required: true,
      },
      writer: {
        type: 'string',
        enum: ['pdf'],
        required: true,
      },
    },
  }
  const validated = revalidator.validate(makeDefaultsFile(frontmatter), schema)
  t.true(validated.errors.length == 0)
})

test('processProperties places default value in root of object', (t) => {
  const property = {
    writer: 'pdf',
  }
  const schema: Record<string, unknown> = {
    properties: {
      writer: {
        type: 'string',
        enum: ['pdf'],
        required: true,
      },
    },
  }

  const validated = revalidator.validate(processProperties(property), schema)
  t.true(validated.errors.length == 0)
})

test('processProperties places special case in object.metadata', (t) => {
  const property = {
    csl: 'this-is-a-csl-string',
  }
  const schema: Record<string, unknown> = {
    properties: {
      metadata: {
        csl: {
          type: 'string',
          enum: ['this-is-a-csl-string'],
          required: true,
        },
      },
    },
  }

  const validated = revalidator.validate(processProperties(property), schema)
  t.true(validated.errors.length == 0)
})

test('processProperties places custom property in object.variables', (t) => {
  const property = {
    'custom-property': 'this-is-a-custom-property-string',
  }
  const schema: Record<string, unknown> = {
    properties: {
      variables: {
        'custom-property': {
          type: 'string',
          enum: ['this-is-a-custom-property-string'],
          required: true,
        },
      },
    },
  }

  const validated = revalidator.validate(processProperties(property), schema)
  t.true(validated.errors.length == 0)
})

test('Invalid writer fails schema validation', (t) => {
  const data = {
    writer: 'not-a-real-writer',
  }
  const error = t.throws(() => {
    makeDefaultsFile(data), t.is(error.message, 'Frontmatter validation returned errors.')
  })
})

test('Valid writer passes schema validation', (t) => {
  const data = {
    writer: 'html',
  }
  t.notThrows(() => {
    makeDefaultsFile(data), 'Frontmatter validation returned errors.'
  })
})

test('Invalid reader fails schema validation', (t) => {
  const data = {
    reader: 'not-a-real-reader',
  }
  const error = t.throws(() => {
    makeDefaultsFile(data), t.is(error.message, 'Frontmatter validation returned errors.')
  })
})

test('Valid reader passes schema validation', (t) => {
  const data = {
    reader: 'html',
  }
  t.notThrows(() => {
    makeDefaultsFile(data), 'Frontmatter validation returned errors.'
  })
})

test('variables are placed in output object correctly', (t) => {
  const data = {
    variable: {
      'test-variable': 'test variable',
    },
  }
  const schema: Record<string, unknown> = {
    properties: {
      metadata: {
        'test-variable': {
          type: 'string',
          enum: ['test variable'],
          required: true,
        },
      },
    },
  }

  const validated = revalidator.validate(makeDefaultsFile(data), schema)
  t.true(validated.errors.length == 0)
})

test('Explicit metadata is placed in output object correctly', (t) => {
  const data = {
    metadata: {
      'test-metadata': 'test metadata',
    },
  }
  const schema: Record<string, unknown> = {
    properties: {
      metadata: {
        'test-metadata': {
          type: 'string',
          enum: ['test-variable'],
          required: true,
        },
      },
    },
  }

  const validated = revalidator.validate(makeDefaultsFile(data), schema)
  t.true(validated.errors.length == 0)
})

test('Explicit outputFile passed to makeDefaultsFile overrides yaml input', (t) => {
  const output = '../output.pdf'
  const data = {
    'output-file': 'user specified',
  }
  const schema: Record<string, unknown> = {
    properties: {
      'output-file': {
        type: 'string',
        enum: [path.resolve(output)],
        required: true,
      },
    },
  }
  const validated = revalidator.validate(makeDefaultsFile(data, undefined, undefined, path.resolve(output)), schema)
  t.true(validated.errors.length == 0)
})

test('Explicit writer passed to makeDefaultsFile overrides yaml input', (t) => {
  const data = {
    writer: 'pdf',
  }
  const schema: Record<string, unknown> = {
    properties: {
      writer: {
        type: 'string',
        enum: ['html'],
        required: true,
      },
    },
  }
  const validated = revalidator.validate(makeDefaultsFile(data, undefined, undefined, undefined, 'html'), schema)
  t.true(validated.errors.length == 0)
})

test('Custom metadata objects are accepted', (t) => {
  const data = {
    customMetadata: {
      title: 'Custom Metadata Title',
    },
  }
  const outputSchema: Record<string, unknown> = {
    properties: {
      variables: {
        title: {
          type: 'string',
          enum: ['Custom Metadata Title'],
          required: true,
        },
      },
    },
  }
  const validated = revalidator.validate(makeDefaultsFile({}, data), outputSchema)
  t.true(validated.errors.length == 0)
})

test('Custom metadata values are overridden by in-document values', (t) => {
  const data = {
    customMetadata: {
      title: 'Custom Metadata Title',
    },
  }
  const outputSchema: Record<string, unknown> = {
    properties: {
      variables: {
        title: {
          type: 'string',
          enum: ['Standard Title'],
          required: true,
        },
      },
    },
  }
  const validated = revalidator.validate(makeDefaultsFile({ title: 'Standard Title' }, data), outputSchema)
  t.true(validated.errors.length == 0)
})

test('Custom metadata overrides base configuration', (t) => {
  const customMetadata = {
    variables: {
      title: 'Custom Metadata Title',
    },
  }
  const pandocBase = {
    variables: {
      title: 'Default Title',
    },
  }
  const outputSchema: Record<string, unknown> = {
    properties: {
      variables: {
        title: {
          type: 'string',
          enum: ['Custom Metadata Title'],
          required: true,
        },
      },
    },
  }
  const validated = revalidator.validate(makeDefaultsFile({}, customMetadata, pandocBase), outputSchema)
  t.true(validated.errors.length == 0)
})

test('toc is output as a root key', (t) => {
  const outputSchema: Record<string, unknown> = {
    properties: {
      toc: {
        type: 'boolean',
        enum: [true],
        required: true,
      },
    },
  }
  const validated = revalidator.validate(makeDefaultsFile({ toc: true }), outputSchema)
  t.true(validated.errors.length == 0)
})
test('table-of-contents is output as a root key', (t) => {
  const outputSchema: Record<string, unknown> = {
    properties: {
      'table-of-contents': {
        type: 'boolean',
        enum: [true],
        required: true,
      },
    },
  }
  const validated = revalidator.validate(makeDefaultsFile({ 'table-of-contents': true }), outputSchema)
  t.true(validated.errors.length == 0)
})
