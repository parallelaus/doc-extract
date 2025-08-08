import { DocExtract, DocExtractClientOptions } from '../src/index'

describe('Class: DocExtract', () => {
  describe('Constructor', () => {
    it('should create instance with default options', () => {
      const instance = new DocExtract()
      expect(instance).toBeInstanceOf(DocExtract)
    })

    it('should create instance with custom allowed images', () => {
      const options: DocExtractClientOptions = {
        allowedImages: ['image/jpeg', 'image/png']
      }
      const instance = new DocExtract(options)
      expect(instance).toBeInstanceOf(DocExtract)
    })

    it('should create instance with custom allowed documents', () => {
      const options: DocExtractClientOptions = {
        allowedDocuments: ['application/pdf']
      }
      const instance = new DocExtract(options)
      expect(instance).toBeInstanceOf(DocExtract)
    })

    it('should create instance with both custom options', () => {
      const options: DocExtractClientOptions = {
        allowedImages: ['image/jpeg'],
        allowedDocuments: ['application/pdf']
      }
      const instance = new DocExtract(options)
      expect(instance).toBeInstanceOf(DocExtract)
    })
  })
})
