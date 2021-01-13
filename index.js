#!/usr/bin/env node
/**
 * @ignore
 * BEGIN HEADER
 *
 * Contains:    Create Defaults File command
 * CVM-Role:    <none>
 * Maintainer:    Matt Jolly
 * License:     GNU GPL v3
 *
 * Description:   This command creates a valid pandoc defaults file from Markdown YAML frontmatter input.
 *
 * END HEADER
 */

import revalidator from 'revalidator'
import path from 'path'

import { schema } from './util/pandoc-schema.js'
import getWriter from './util/getWriter.js'

/**
 *  Function to determine if a property is a default 'defaults' property.
 *
 * @param   {object}  property    File extension that we want a writer for.
 *
 * @returns {boolean}   hasProperty   The pandoc writer for this file extension.
 */
function isDefaultProperty(property) {
  // Check if the property appears in the schema. If it's there, it's a default property!
  // Special Cases: If 'bibliogrpahy', 'csl', or 'citation-abbreviations' is found in root,
  // validate against and write to schema.metadata.property.
  let hasProperty
  if (!(property === 'bibliogrpahy' || property === 'csl' || property === 'citation-abbreviations')) {
    hasProperty = Object.prototype.hasOwnProperty.call(schema, property) ? true : false
  } else {
    hasProperty =  Object.prototype.hasOwnProperty.call(schema.metadata, property) ? true : false
  }
  return hasProperty
}

/**
 *  Function to validate frontmatter values against the schema.
 *
 * @param   {object}  frontmatter    File extension that we want a writer for.
 *
 */
function validateFrontmatter(frontmatter) {
  try {
    let validated = revalidator.validate(frontmatter, schema)

    if (validated.errors.length > 0) {
      console.error('Frontmatter failed validation.')
      console.error(validated.errors) // Todo: This would be nicer if we parsed it so that it was human readable.
      throw `Frontmatter validation returned errors ${validated.errors}`
    }
  } catch (e) {
    console.error(e)
  }
}

/**
 *  Function to provide the content for a pandoc defaults file from frontmatter input.
 *
 * @param  {object}  frontmatter  Frontmatter that we want to add to the defaults file.
 * @param  {object}  outputFile   Output file to configure writer
 * @param  {writer}  writer       Pandoc writer to use if you don't want the tool to try and work it out automagically.
 *
 * @returns {object} defaultsFileContents   The contents of a defaults file to do what you will with.
 */
export default function makeDefaultsFile (frontmatter, outputFile = null, writer = null) {
  // Iterate over object's properties; if in defaults make root object in output yaml.
  // If not in defaults, add to output.metadata as output.metadata.name

  validateFrontmatter(frontmatter) // Provide user with feedback so they can amend frontmatter values before we really do anything.

  let defaultsFileContents

  for (const property in frontmatter) {

    if (isDefaultProperty(property)) {
      defaultsFileContents[property] = frontmatter[property] // Properties should already have been validated, so just pass to the object.
    } else {
    // Using metadata here because values are escaped by pandoc.
    // Add special case handling if something arbitrary (i.e. template stuff) *needs* to be a variable.
      defaultsFileContents.metadata[property] = frontmatter[property]
      // These can't be validated against the schema, hope the input was validated externally!
    }

  }

  // if we explicitly passed outputFile to the function we'll assume that it should take precedence.
  if (outputFile) {
    defaultsFileContents['output-file'] = path.resolve(outputFile).toString // probably a better way to do this
  }

  if (writer) {
    defaultsFileContents['writer'] = writer
  } else if (Object.prototype.hasOwnProperty.call(defaultsFileContents, 'output-file')) {
    defaultsFileContents['writer'] = (getWriter(path.extname(defaultsFileContents['output-file'])) === null) ? '' : getWriter(path.extname(defaultsFileContents['output-file']))
  }

  // May as well make sure that we're sending back valid JSON.
  revalidator.validate(defaultsFileContents, schema)

  return defaultsFileContents

}
