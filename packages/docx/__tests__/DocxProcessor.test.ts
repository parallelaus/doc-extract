import { DocxProcessor } from '../src/index'
import type { Document } from '../../core/src/lib/types'
import { DocExtract } from '../../core/src/index'

// Mock the docx library
jest.mock('docx', () => {
  return {
    Packer: {
      toBuffer: jest.fn().mockImplementation(() => {
        return Promise.resolve(Buffer.from('mocked docx content'))
      })
    }
  }
})

// Mock the text extraction function
jest.mock('../src/lib/extractText', () => {
  return {
    extractText: jest.fn().mockResolvedValue('Mocked DOCX content')
  }
})

describe('DocxProcessor', () => {
  let processor: DocxProcessor

  beforeEach(() => {
    processor = new DocxProcessor()
  })

  it('should have the correct supported MIME type', () => {
    expect(processor.supportedMimeType).toBe('application/vnd.openxmlformats-officedocument.wordprocessingml.document')
  })

  it('should process DOCX content from buffer', async () => {
    const document: Document = {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      contents: Buffer.from('mock docx content')
    }

    const result = await processor.process(document)
    expect(result).toBe('Mocked DOCX content')
  })

  it('should throw an error if document has no contents or URL', async () => {
    const document: Document = {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    }

    await expect(processor.process(document)).rejects.toThrow('Document must have contents or URL')
  })
})

describe('DocxProcessor integration with DocExtract', () => {
  let docExtract: DocExtract

  beforeEach(() => {
    docExtract = new DocExtract()
    docExtract.registerProcessor(new DocxProcessor())
  })

  it('should extract text from DOCX document using DocExtract', async () => {
    const document: Document = {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      contents: Buffer.from('mock docx content')
    }

    const result = await docExtract.extract(document)
    expect(result).toBe('Mocked DOCX content')
  })

  it('should respect document type validation', async () => {
    const customExtract = new DocExtract({
      allowedDocuments: ['application/pdf'] // Only PDF allowed
    })
    customExtract.registerProcessor(new DocxProcessor())

    const document: Document = {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      contents: Buffer.from('mock docx content')
    }

    await expect(customExtract.extract(document)).rejects.toThrow(
      'Document type not allowed: application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    )
  })
})
