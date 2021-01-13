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

import { schema } from './util/pandoc-schema.js'
import getWriter from './util/getWriter.js'


function isDefaultProperty(property) {
    // Check if the property appears in the schema. If it's there, it's a default property!
    // Special Cases: metadata.bibliography; metadata.csl; metadata.citation-abbreviations
    // If 'bibliogrpahy', 'csl', or 'citation-abbreviations' is found in root, validate against
    // and write to schema.metadata.property.
    let hasProperty
    if (!(property === 'bibliogrpahy' || property === 'csl' || property === 'citation-abbreviations')) {
        hasProperty = Object.prototype.hasOwnProperty.call(schema, property) ? true : false
    } else {
        hasProperty =  Object.prototype.hasOwnProperty.call(schema.metadata, property) ? true : false
    }
    return hasProperty
}

function validateFrontmatter(frontmatter) {
    // Validate incoming frontmatter early
    // If 'bibliogrpahy', 'csl', or 'citation-abbreviations' is found in root, validate against
    // and write to schema.metadata.property.
}

export default function makeDefaultsFile (frontmatter, outputFile = null, writer = null) {
    // Iterate over object's properties; if in defaults make root object in output yaml.
    // If not in defaults, add to output.variable as output.variable.name

    let defaultsFileContents

    for (const property in frontmatter) {

        if (isDefaultProperty(property)) {
            defaultsFileContents[property] = frontmatter[property] // We should validate default props against the schema rather than just blindly writing them.
        } else {
            // Using metadata here because things are escaped.
            // Add special case handling if something arbitrary (i.e. template stuff) *needs* to be a variable.
            defaultsFileContents.metadata[property] = frontmatter[property]
        }

    }

    // Maybe we don't want to let the user set **all** of the variables directly.
    if (outputFile) {
        defaultsFileContents['output-file'] = path.resolve(outputFile).toString // probably a better way to do this
    }

    if (writer) {
        defaultsFileContents['writer'] = writer
    } else if (outputFile) {
        defaultsFileContents['writer'] = isNull(getWriter(path.extname(outputFile))) ? '' : getWriter(path.extname(outputFile))
    }

    // May as well make sure that we're sending back valid JSON for now.
    revalidator.validate(defaultsFileContents, schema);

    return defaultsFileContents

}



