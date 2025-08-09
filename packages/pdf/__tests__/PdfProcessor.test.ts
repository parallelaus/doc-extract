import { PdfProcessor } from '../src/index'
import type { Document } from '../../core/src/lib/types'
import fs from 'fs'
import path from 'path'
import { DocExtract } from '../../core/src/index'

jest.mock('pdf-parse', () => {
  return jest.fn().mockImplementation(() => {
    return Promise.resolve({
      text: 'Mocked PDF content'
    })
  })
})

describe('PdfProcessor', () => {
  let processor: PdfProcessor

  beforeEach(() => {
    processor = new PdfProcessor()
  })

  it('should have the correct supported MIME type', () => {
    expect(processor.supportedMimeType).toBe('application/pdf')
  })

  it('should process PDF content from buffer', async () => {
    const document: Document = {
      type: 'application/pdf',
      contents: Buffer.from('mock pdf content')
    }

    const result = await processor.process(document)
    expect(result).toBe('Mocked PDF content')
  })

  it('should throw an error if document has no contents or URL', async () => {
    const document: Document = {
      type: 'application/pdf'
    }

    await expect(processor.process(document)).rejects.toThrow('Document must have contents or URL')
  })
})

describe('PdfProcessor integration with DocExtract', () => {
  let docExtract: DocExtract

  beforeEach(() => {
    docExtract = new DocExtract()
    docExtract.registerProcessor(new PdfProcessor())
  })

  it('should extract text from PDF document using DocExtract', async () => {
    const document: Document = {
      type: 'application/pdf',
      contents: Buffer.from('mock pdf content')
    }

    const result = await docExtract.extract(document)
    expect(result).toBe('Mocked PDF content')
  })

  it('should respect document type validation', async () => {
    const customExtract = new DocExtract({
      allowedDocuments: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'] // Only DOCX allowed
    })
    customExtract.registerProcessor(new PdfProcessor())

    const document: Document = {
      type: 'application/pdf',
      contents: Buffer.from('mock pdf content')
    }

    await expect(customExtract.extract(document)).rejects.toThrow('Document type not allowed: application/pdf')
  })
})
