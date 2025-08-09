import { DocExtract, Document } from '../src/index'

describe('Class: DocExtract', () => {
  let docExtract: DocExtract

  beforeEach(() => {
    docExtract = new DocExtract()
  })

  describe('extract', () => {
    describe('Validation - Document source', () => {
      it('should throw error when document has neither url nor contents', async () => {
        const document: Document = {
          filename: 'test.pdf',
          type: 'application/pdf'
        }

        await expect(docExtract.extract(document)).rejects.toThrow('Document must have a url or contents')
      })
    })

    describe('Validation - Document types', () => {
      it('should throw error when no processor is registered for document type', async () => {
        const document: Document = {
          type: 'application/pdf',
          contents: Buffer.from('test')
        }

        await expect(docExtract.extract(document)).rejects.toThrow(
          'No processor registered for document type: application/pdf'
        )
      })
    })

    describe('Custom configuration', () => {
      it('should respect custom allowed images', async () => {
        const customExtract = new DocExtract({
          allowedImages: ['image/jpeg'] // Only JPEG allowed
        })

        const document: Document = {
          type: 'image/png', // Not in allowed list
          contents: Buffer.from('test')
        }

        await expect(customExtract.extract(document)).rejects.toThrow('Document type not allowed: image/png')
      })

      it('should respect custom allowed documents', async () => {
        const customExtract = new DocExtract({
          allowedDocuments: ['application/pdf'] // Only PDF allowed
        })

        const document: Document = {
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // Not in allowed list
          contents: Buffer.from('test')
        }

        await expect(customExtract.extract(document)).rejects.toThrow(
          'Document type not allowed: application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )
      })
    })
  })
})
