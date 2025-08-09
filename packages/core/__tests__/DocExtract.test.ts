import { DocExtract } from '../src/index.js'

describe('Class: DocExtract', () => {
  describe('Constructor', () => {
    it('should create instance with default options', () => {
      const instance = new DocExtract()
      expect(instance).toBeInstanceOf(DocExtract)
    })
  })

  describe('registerProcessor', () => {
    it('should register a document processor', () => {
      const docExtract = new DocExtract()
      const mockProcessor = {
        supportedMimeType: 'application/test',
        process: jest.fn().mockResolvedValue('Processed content')
      }

      docExtract.registerProcessor(mockProcessor)

      // This is an internal test that verifies the processor was registered
      // @ts-ignore - Accessing private property for testing
      expect(docExtract.processors.get('application/test')).toBe(mockProcessor)
    })
  })
})
