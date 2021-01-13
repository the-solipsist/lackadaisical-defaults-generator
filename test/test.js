#! /usr/bin/env node

'use strict'

import test from 'ava'
import yaml from 'js-yaml'
import fs from 'fs'
import path from 'path'
import revalidator from 'revalidator'

import makeDefaultsFile from '../index.js'

import { validateFrontmatter } from '../index.js'
import { isDefaultProperty } from '../index.js'
import getWriter from '../util/getWriter.js'

process.chdir('./test')

test('Valid Pandoc defaults file passes JSONSchema validation', async t => {
  let fileContents = fs.readFileSync('./defaults.yaml', 'utf-8')
  let data = yaml.safeLoad(fileContents)
  const validated = validateFrontmatter(data)
  t.false(validated.errors.length > 0)
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
  const property = {
    'output-file': '/path/to/fake/file.pdf'
  }
  t.true(isDefaultProperty(property))
})

test('isDefaultProperty returns false for custom properties',  async t => {
  const property = {
    'title': 'Example Title'
  }
  t.false(isDefaultProperty(property))
})

test('makeDefaultsFile returns with valid input', async t => {
  let fileContents = fs.readFileSync('./valid-frontmatter.yaml', 'utf-8')
  let frontmatter = yaml.safeLoad(fileContents)
  const schema = {
    properties: {
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
  const defaultsFile = makeDefaultsFile(frontmatter)
  const validated = revalidator.validate(defaultsFile, schema)
  t.true(validated.errors.length === 0)
})

test('makeDefaultsFile throws an error with invalid input', t => {
  let fileContents = fs.readFileSync('./output-file.yaml', 'utf-8')
  let frontmatter = yaml.safeLoad(fileContents)
  // Todo: Validate the error in any way, shape, or form.
  // eslint-disable-next-line no-unused-vars
  const error = t.throws(() => {
    makeDefaultsFile(frontmatter)
  })
})

test.todo('makeDefaultsFile returns appropriate writer when presented with output-file', t => {
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
  const defaultsFile = makeDefaultsFile(frontmatter)
  const validated = revalidator.validate(defaultsFile, schema)
  t.true(validated.errors.length === 0)
})
