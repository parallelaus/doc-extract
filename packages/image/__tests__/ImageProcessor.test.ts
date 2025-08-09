import { ImageProcessor } from '../src/index'
import type { Document } from '../../core/src/lib/types'
import { DocExtract } from '../../core/src/index'

// Mock the sharp library
jest.mock('sharp', () => {
  return jest.fn().mockImplementation(() => {
    return {
      metadata: jest.fn().mockResolvedValue({ width: 100, height: 100 }),
      toBuffer: jest.fn().mockResolvedValue(Buffer.from('processed image')),
      greyscale: jest.fn().mockReturnThis(),
      threshold: jest.fn().mockReturnThis()
    }
  })
})

// Mock the tesseract.js library
jest.mock('tesseract.js', () => {
  return {
    createWorker: jest.fn().mockImplementation(() => {
      return {
        load: jest.fn().mockResolvedValue({}),
        loadLanguage: jest.fn().mockResolvedValue({}),
        initialize: jest.fn().mockResolvedValue({}),
        recognize: jest.fn().mockResolvedValue({
          data: { text: 'Mocked OCR text from image' }
        }),
        terminate: jest.fn().mockResolvedValue({})
      }
    })
  }
})

describe('ImageProcessor', () => {
  let processor: ImageProcessor

  beforeEach(() => {
    processor = new ImageProcessor()
  })

  it('should have the correct supported MIME type', () => {
    expect(processor.supportedMimeType).toBe('image/*')
  })

  it('should process image content from buffer', async () => {
    const document: Document = {
      type: 'image/jpeg',
      contents: Buffer.from('mock image content')
    }

    const result = await processor.process(document)
    expect(result).toBe('Mocked OCR text from image')
  })

  it('should throw an error if document has no contents or URL', async () => {
    const document: Document = {
      type: 'image/jpeg'
    }

    await expect(processor.process(document)).rejects.toThrow('Document must have contents or URL')
  })
})

describe('ImageProcessor integration with DocExtract', () => {
  let docExtract: DocExtract

  beforeEach(() => {
    docExtract = new DocExtract()
    docExtract.registerProcessor(new ImageProcessor())
  })

  it('should extract text from image document using DocExtract', async () => {
    const document: Document = {
      type: 'image/jpeg',
      contents: Buffer.from('mock image content')
    }

    const result = await docExtract.extract(document)
    expect(result).toBe('Mocked OCR text from image')
  })

  it('should respect document type validation', async () => {
    const customExtract = new DocExtract({
      allowedImages: ['image/png'] // Only PNG allowed
    })
    customExtract.registerProcessor(new ImageProcessor())

    const document: Document = {
      type: 'image/jpeg', // Not in allowed list
      contents: Buffer.from('mock image content')
    }

    await expect(customExtract.extract(document)).rejects.toThrow('Document type not allowed: image/jpeg')
  })
})
