import { DocExtract, Document } from '../src/index'

describe('Class: DocExtract', () => {
  let docExtract: DocExtract

  beforeEach(() => {
    docExtract = new DocExtract({
      allowedDocuments: ['application/pdf']
    })
  })

  describe('extract', () => {
    describe('Extract: Simple PDF', () => {
      it('should return extracted text for valid documents', async () => {
        const document: Document = {
          // filename: 'simple.pdf',
          // type: 'application/pdf',
          url: `https://www.princexml.com/samples/icelandic/dictionary.pdf`
        }

        const result = await docExtract.extract(document)
        expect(result).toBe('Document extracted')
      })
    })
  })
})
