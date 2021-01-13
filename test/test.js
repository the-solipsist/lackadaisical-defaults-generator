'use strict'

import test from 'ava'
import yaml from 'js-yaml'
import fs from 'fs'
import path from 'path'

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
    writer = getWriter(fileext)
    t.fail()

    t.true(writer === 'pdf')
  }
})

test('getWriter returns correct value for HTML', async t => {

    // Simulate a real filename and snip the extension like we would in the main function
    let fileext = path.extname('/test/path/to/file.html')
    writer = getWriter(fileext)
    t.fail()

    t.true(writer === 'html')
  }
})

test('getWriter returns correct value for DOCX', async t => {

    // Simulate a real filename and snip the extension like we would in the main function
    let fileext = path.extname('/test/path/to/file.docx')
    writer = getWriter(fileext)
    t.fail()

    t.true(writer === 'docx')
  }
})

test('getWriter returns correct value for PPTX', async t => {

    // Simulate a real filename and snip the extension like we would in the main function
    let fileext = path.extname('/test/path/to/file.pptx')
    writer = getWriter(fileext)
    t.fail()

    t.true(writer === 'pptx')
  }
})

test('getWriter returns null for unknown format', async t => {

    // Simulate a real filename and snip the extension like we would in the main function
    let fileext = path.extname('/test/path/to/file.potato')
    let writer = getWriter(fileext)
    t.fail()

    t.true(writer === null)
  }
})

test('isDefaultProperty returns true for default properties', async t => {


  }
})

test.todo('isDefaultProperty returns true for default properties') // output === true
test.todo('isDefaultProperty returns false for custom properties') // title === false
