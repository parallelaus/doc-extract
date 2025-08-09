/**
 * Utility functions for doc-extract
 */

/**
 * Gets the document type from a URL by making a HEAD request
 * @param url URL to get document type from
 * @returns The document type (MIME type)
 */
export async function getDocumentType(url: string): Promise<string> {
  // eslint-disable-next-line no-undef
  const response = await fetch(url, {
    method: 'HEAD'
  })
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  // Get content type from headers and handle null case
  const rawContentType = response.headers.get('content-type')

  // If content type is null or undefined, throw an error
  if (!rawContentType) {
    throw new Error('Content-Type header not found')
  }

  // Extract the MIME type from the content type
  const parts = rawContentType.split(';')
  // Access first element with a fallback to empty string if undefined
  const mimeType = parts[0] ? parts[0].trim() : ''

  return mimeType
}
