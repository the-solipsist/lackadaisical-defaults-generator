#!/usr/bin/env node
/**
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

import schema  from './util/pandoc-schema.js'
import getWriter from './util/getWriter.js'

/**
 *  Function to determine if a property is a default 'defaults' property.
 *
 * @param   {string}  property    Property that we want to know about.
 *
 * @returns {boolean} Whether or not this is a default property.
 */
export function isDefaultProperty(property) {
  return Object.prototype.hasOwnProperty.call(schema.properties, property) ? true : false
}

/**
 *  Function to determine if a property is a default 'defaults' property.
 *
 * @param   {object}  properties    Properties that we want processed.
 *
 * @returns {boolean} processedProperties   The property for .
 */
export function processProperties(properties) {
  let processedProperties = {
    metadata: {}
  }

  for (let [key, value] of Object.entries(properties)) {
    // Check if the property appears in the schema. If it's there, it's a default property!
    // Special Cases: If 'bibliogrpahy', 'csl', or 'citation-abbreviations' is found in root,
    // write to schema.metadata.property. That's what settting them in the root does in the end and it's more explicit.
    if (key === 'metadata') {
      for (let [metadataKey, metadataValue] of Object.entries(value)) {
        processedProperties.metadata[metadataKey] = metadataValue
      }
    } else if (key === 'variable') {
      for (let [variableKey, variableValue] of Object.entries(value)) {
        processedProperties.metadata[variableKey] = variableValue
      }
    } else if (isDefaultProperty(key) && (!(key === ('bibliogrpahy' || 'csl' || 'citation-abbreviations')))) {
      processedProperties[key] = value
    } else {
      // Using metadata here because values are escaped by pandoc. Are there properties that shouldn't be escaped?
      // Add special case handling if something arbitrary (i.e. template stuff) *needs* to be a variable.
      processedProperties.metadata[key] = value
      // These can't be validated against the schema, hope the input was validated externally!
    }
  }
  return processedProperties
}

/**
 *  Function to validate frontmatter values against the schema.
 *
 * @param   {object}  frontmatter    Frontmatter that we need to validate.
 *
 */
export function validateFrontmatter(frontmatter) {
  try {
    let validated = revalidator.validate(frontmatter, schema)

    if (validated.errors.length > 0) {
      console.log(validated.errors) // Todo: This would be nicer if we parsed it so that it was human readable.
      throw 'Frontmatter validation returned errors.'
    }
  } catch (e) {
    console.error(e)
  }
}

/**
 *  Function to provide the content for a pandoc defaults file from frontmatter input.
 *
 * @param  {object}  frontmatter  Frontmatter that we want to add to the defaults file.
 * @param  {string}  outputFile   Output file to configure writer
 * @param  {string}  writer       Pandoc writer to use if you don't want the tool to try and work it out automagically.
 *
 * @returns {object} defaultsFileContents   The contents of a defaults file to do what you will with.
 */
export default function makeDefaultsFile (frontmatter, { outputFile = null, writer = null } = {} ) {
  // Iterate over object's properties; if in defaults make root object in output yaml.
  // If not in defaults, add to output.metadata as output.metadata.name
  validateFrontmatter(frontmatter)
  let defaultsFileContents = processProperties(frontmatter)


  // if we explicitly passed outputFile to the function we'll assume that it should take precedence.
  if (outputFile) {
    defaultsFileContents['output-file'] = path.resolve(outputFile)
  }

  if (writer) {
    defaultsFileContents['writer'] = writer
  } else if (Object.prototype.hasOwnProperty.call(defaultsFileContents, 'output-file')) {
    defaultsFileContents['writer'] = (getWriter(path.extname(defaultsFileContents['output-file'])) === null) ? '' : getWriter(path.extname(defaultsFileContents['output-file']))
  }
  // May as well make sure that we're sending back valid JSON.
  try {
    let validated = revalidator.validate(defaultsFileContents, schema)
    if (validated.errors.length > 0) {
      console.error(validated.errors) // Todo: This would be nicer if we parsed it so that it was human readable.
      throw 'Defaults file output validation returned errors.'
    }
  } catch (e) {
    console.error(e)
  }

  return defaultsFileContents

}
