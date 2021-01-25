/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/**
 * BEGIN HEADER
 *
 * Contains:    Create Defaults File command
 * CVM-Role:    <none>
 * Maintainer:  Matt Jolly
 * License:     GNU GPL v3
 *
 * Description:   This command creates a valid pandoc defaults file from Markdown YAML frontmatter input.
 *
 * END HEADER
 */

import * as _ from 'lodash'
import path from 'path'
import revalidator from 'revalidator'

import getWriter from './util/getWriter'
import defaultsSchema from './util/pandoc-schema'

/**
 * Interface for a pandoc defaults file.
 * It's basically a record with extra steps.
 * Since all input and output is validated according to the schema, we don't need to be too specific here.
 */
export interface defaultsFile extends Record<string, unknown> {
  'output-file'?: string
  writer?: string
  metadata?: Record<string, unknown>
  variables?: Record<string, unknown>
}
/**
 *  Function to determine if a property is a default 'defaults' property.
 *  If it has an entry in the schema, it's a default property.
 *
 * @param   {string}  property    Property that we want to know about.
 *
 * @returns {boolean} Whether or not this is a default property.
 */
export function isDefaultProperty(property: string): boolean {
  return Object.prototype.hasOwnProperty.call(defaultsSchema.properties, property) ? true : false
}

/**
 * @param   {object}  obj   document properties object
 *
 * @returns {object}        Record<string, unknown>
 */
function recurseDocumentProperties(obj: Record<string, unknown>): defaultsFile {
  const properties: Record<string, unknown> = {
    metadata: {},
    variables: {},
  }
  const metadataValues: Record<'metadata', Record<string, unknown>> = {
    metadata: {},
  }
  const variableValues: Record<'variables', Record<string, unknown>> = {
    variables: {},
  }
  for (const key in obj) {
    const value = obj[key]
    if (key === 'metadata' && typeof value === typeof obj) {
      const metadataKeys = value as Record<string, unknown>
      for (const metadataKey in metadataKeys) {
        const metadataValue = metadataKeys[metadataKey]
        metadataValues.metadata[metadataKey] = metadataValue
      }
    } else if (key === 'variables' && typeof value === typeof obj) {
      const variableKeys = value as Record<string, unknown>
      for (const variableKey in variableKeys) {
        const variableValue = variableKeys[variableKey]
        variableValues.variables[variableKey] = variableValue
      }
    } else if (value && typeof value === typeof obj) {
      recurseDocumentProperties(value as Record<string, unknown>)
    } else {
      properties[key] = value
    }
  }
  const combinedProperties: defaultsFile = Object.assign(properties, metadataValues, variableValues)
  return combinedProperties
}

/**
 * @param {object}  obj Object to be flattened
 * @returns {object}    Object with flattened properties
 */
function flattenProperties(obj: Record<string, unknown>): defaultsFile {
  let flatProperties: defaultsFile = {
    metadata: {},
    variables: {},
  }
  flatProperties = recurseDocumentProperties(obj)
  return flatProperties
}

/**
 * Function that processes a properties object into a pandoc defaults file.
 *
 * @param   {object}  properties    Properties that we want processed.
 *
 * @returns {object}                Processed Properties
 */
export function processProperties(properties: Record<string, unknown>): defaultsFile {
  const processedProperties: defaultsFile = {
    metadata: {},
    variables: {},
  }
  const metadataKeys: Record<'metadata', Record<string, unknown>> = {
    metadata: {},
  }

  const variablesKeys: Record<'variables', Record<string, unknown>> = {
    variables: {},
  }
  const flatProperties: defaultsFile = flattenProperties(properties)
  for (const key in flatProperties) {
    const value: unknown = flatProperties[key]
    // Check if the property appears in the schema. If it's there, it's a default property!
    if (isDefaultProperty(key) && !(key === ('bibliogrpahy' || 'csl' || 'citation-abbreviations'))) {
      processedProperties[key] = value
    } else if (
      key ===
      ('bibliogrpahy' ||
        'csl' ||
        'citation-abbreviations' ||
        'reference-section-title' ||
        'suppress-bibliography' ||
        'citation-style')
    ) {
      // Special Cases: Some of the above may root keys OR metadata values; Setting them in the root sets the metadata key under-the-hood, and it's more explicit when reading output.
      // Others **must** be metadata values (e.g. `citation-style`, `reference-section-title`)
      // See https://groups.google.com/g/pandoc-discuss/c/tqMp0UKPpZQ/m/lay3hDAVBwAJ && https://github.com/Zettlr/Zettlr/issues/1640
      metadataKeys.metadata[key] = value
    } else if (key === ('table-of-contents' || 'toc')) {
      // This must be set as a root key to be consistent across formats.
      processedProperties[key] = value
    } else {
      // Variables values aren't escaped, so we should use them to fill in template variables. Are there any keys that should be escaped?.
      // These can't be validated against the schema, hope the input was validated externally!
      variablesKeys.variables[key] = value
    }
  }
  const defaultsContent: defaultsFile = _.merge(processedProperties, variablesKeys, metadataKeys)
  return defaultsContent
}

/**
 *  Function to validate frontmatter values against the schema.
 *
 * @param   {object}  properties    Frontmatter that we need to validate.
 *
 */
export function validateAgainstSchema(properties: Record<string, unknown> | defaultsFile): void {
  interface IErrrorProperty {
    property: string
    message: string
  }

  interface IReturnMessage {
    valid: boolean
    errors: IErrrorProperty[]
  }
  let validated: IReturnMessage
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    validated = revalidator.validate(properties, defaultsSchema)

    if (!validated.valid) {
      console.log(validated.errors) // Todo: This would be nicer if we parsed it so that it was human readable.
      throw 'Schema validation returned errors.'
    }
  } catch (e) {
    console.error(e)
  }
}

/**
 * @param {object}  defaults  defaults file object
 * @param {string}  newKey    key that we want to add
 * @param {any}     value     value of the key
 *
 * @returns {object}          a defaults file object with the new key
 */
function setKey(defaults: defaultsFile, newKey: string, value: unknown): defaultsFile {
  let defaultsContent: defaultsFile
  if (typeof value !== undefined) {
    const newObj: Record<string, unknown> = {}
    newObj[newKey] = value
    defaultsContent = Object.assign(defaults, newObj)
  } else {
    defaultsContent = defaults
  }
  return defaultsContent
}

/**
 *
 *  Function to provide the content for a pandoc defaults file from frontmatter input.
 *
 * @param  {object}  frontmatter     Frontmatter that we want to add to the defaults file.
 * @param  {object}  customMetadata  Custom metadata object to process. In-file metadata will be applied over the top of this.
 * @param  {object}  defaultsBase    Base configuration object for customisation.
 * @param  {string}  outputFile      Output file to configure writer
 * @param  {string}  writer          Pandoc writer to use if you don't want the tool to try and work it out automagically.
 *
 * @returns {object}                 A valid pandoc defaults file.
 */
export default function makeDefaultsFile(
  frontmatter: Record<string, unknown>,
  customMetadata?: Record<string, unknown>,
  defaultsBase?: Record<string, unknown>,
  outputFile?: string,
  writer?: string
): defaultsFile {
  // Iterate over object's properties; if in defaults make root object in output yaml.
  // If not in defaults, add to output.metadata as output.metadata.name
  validateAgainstSchema(frontmatter)
  let defaultsFileContents: defaultsFile

  // Precedence: frontmatter overrides customMetadata overrides defaultsBase
  if (customMetadata && defaultsBase) {
    defaultsFileContents = _.merge(
      processProperties(defaultsBase),
      processProperties(customMetadata),
      processProperties(frontmatter)
    )
  } else if (customMetadata) {
    defaultsFileContents = _.merge(processProperties(customMetadata), processProperties(frontmatter))
  } else if (defaultsBase) {
    defaultsFileContents = _.merge(processProperties(defaultsBase), processProperties(frontmatter))
  } else {
    defaultsFileContents = processProperties(frontmatter)
  }

  // if we explicitly passed outputFile to the function we'll assume that it should take precedence.
  if (outputFile) {
    defaultsFileContents['output-file'] = path.resolve(outputFile)
  }

  if (writer) {
    defaultsFileContents.writer = writer
  } else if (defaultsFileContents['output-file']) {
    setKey(defaultsFileContents, 'writer', getWriter(path.extname(defaultsFileContents['output-file'])))
  }
  // May as well make sure that we're sending back a valid defaults file.
  validateAgainstSchema(defaultsFileContents)

  return defaultsFileContents
}
