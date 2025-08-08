import { DocumentTypes, documentTypesEnum } from './types.js'

export async function getDocumentType(url: string): Promise<DocumentTypes> {
  // eslint-disable-next-line no-undef
  const response = await fetch(url, {
    method: 'HEAD'
  })
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const docType = documentTypesEnum.parse(response.headers.get('content-type'))
  return docType
}
