import { DocExtract, DocExtractClientOptions, Document } from '../src/index'

describe('Class: DocExtract', () => {
  let docExtract: DocExtract

  beforeEach(() => {
    docExtract = new DocExtract()
  })

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

  describe('extractText', () => {
    describe('Validation - Document source', () => {
      it('should throw error when document has neither url nor contents', async () => {
        const document: Document = {
          filename: 'test.pdf',
          type: 'application/pdf'
        }

        await expect(docExtract.extractText(document)).rejects.toThrow('Document must have a url or contents')
      })

      it('should not throw error when document has url', async () => {
        const document: Document = {
          filename: 'test.pdf',
          type: 'application/pdf',
          url: 'https://example.com/test.pdf'
        }

        await expect(docExtract.extractText(document)).resolves.toBe('Document extracted')
      })

      it('should not throw error when document has contents', async () => {
        const document: Document = {
          filename: 'test.pdf',
          type: 'application/pdf',
          contents: Buffer.from('test content')
        }

        await expect(docExtract.extractText(document)).resolves.toBe('Document extracted')
      })

      it('should not throw error when document has both url and contents', async () => {
        const document: Document = {
          filename: 'test.pdf',
          type: 'application/pdf',
          url: 'https://example.com/test.pdf',
          contents: Buffer.from('test content')
        }

        await expect(docExtract.extractText(document)).resolves.toBe('Document extracted')
      })
    })

    describe('Validation - Document types', () => {
      describe('Default allowed document types', () => {
        it('should accept PDF documents', async () => {
          const document: Document = {
            filename: 'test.pdf',
            type: 'application/pdf',
            url: 'https://example.com/test.pdf'
          }

          await expect(docExtract.extractText(document)).resolves.toBe('Document extracted')
        })

        it('should accept Word documents (.doc)', async () => {
          const document: Document = {
            filename: 'test.doc',
            type: 'application/msword',
            url: 'https://example.com/test.doc'
          }

          await expect(docExtract.extractText(document)).resolves.toBe('Document extracted')
        })

        it('should accept Word documents (.docx)', async () => {
          const document: Document = {
            filename: 'test.docx',
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            url: 'https://example.com/test.docx'
          }

          await expect(docExtract.extractText(document)).resolves.toBe('Document extracted')
        })

        it('should accept OpenDocument Text (.odt)', async () => {
          const document: Document = {
            filename: 'test.odt',
            type: 'application/vnd.oasis.opendocument.text',
            url: 'https://example.com/test.odt'
          }

          await expect(docExtract.extractText(document)).resolves.toBe('Document extracted')
        })
      })

      describe('Default allowed image types', () => {
        it('should accept JPEG images', async () => {
          const document: Document = {
            filename: 'test.jpeg',
            type: 'image/jpeg',
            url: 'https://example.com/test.jpeg'
          }

          await expect(docExtract.extractText(document)).resolves.toBe('Document extracted')
        })

        it('should accept PNG images', async () => {
          const document: Document = {
            filename: 'test.png',
            type: 'image/png',
            url: 'https://example.com/test.png'
          }

          await expect(docExtract.extractText(document)).resolves.toBe('Document extracted')
        })

        it('should accept JPG images', async () => {
          const document: Document = {
            filename: 'test.jpg',
            type: 'image/jpg',
            url: 'https://example.com/test.jpg'
          }

          await expect(docExtract.extractText(document)).resolves.toBe('Document extracted')
        })

        it('should accept WebP images', async () => {
          const document: Document = {
            filename: 'test.webp',
            type: 'image/webp',
            url: 'https://example.com/test.webp'
          }

          await expect(docExtract.extractText(document)).resolves.toBe('Document extracted')
        })
      })

      describe('Disallowed types', () => {
        it('should reject unsupported document types', async () => {
          const document: Document = {
            filename: 'test.txt',
            type: 'text/plain' as any, // Type assertion to bypass TS checking for test
            url: 'https://example.com/test.txt'
          }

          await expect(docExtract.extractText(document)).rejects.toThrow(/File type 'text\/plain' is not allowed/)
        })

        it('should reject unsupported image types', async () => {
          const document: Document = {
            filename: 'test.gif',
            type: 'image/gif' as any, // Type assertion to bypass TS checking for test
            url: 'https://example.com/test.gif'
          }

          await expect(docExtract.extractText(document)).rejects.toThrow(/File type 'image\/gif' is not allowed/)
        })

        it('should include allowed types in error message', async () => {
          const document: Document = {
            filename: 'test.txt',
            type: 'text/plain' as any,
            url: 'https://example.com/test.txt'
          }

          await expect(docExtract.extractText(document)).rejects.toThrow(
            /Allowed types:.*application\/pdf.*image\/jpeg/
          )
        })
      })
    })

    describe('Custom configuration', () => {
      it('should respect custom allowed images', async () => {
        const customExtract = new DocExtract({
          allowedImages: ['image/jpeg'] // Only JPEG allowed
        })

        const jpegDoc: Document = {
          filename: 'test.jpeg',
          type: 'image/jpeg',
          url: 'https://example.com/test.jpeg'
        }

        const pngDoc: Document = {
          filename: 'test.png',
          type: 'image/png',
          url: 'https://example.com/test.png'
        }

        await expect(customExtract.extractText(jpegDoc)).resolves.toBe('Document extracted')

        await expect(customExtract.extractText(pngDoc)).rejects.toThrow(/File type 'image\/png' is not allowed/)
      })

      it('should respect custom allowed documents', async () => {
        const customExtract = new DocExtract({
          allowedDocuments: ['application/pdf'] // Only PDF allowed
        })

        const pdfDoc: Document = {
          filename: 'test.pdf',
          type: 'application/pdf',
          url: 'https://example.com/test.pdf'
        }

        const wordDoc: Document = {
          filename: 'test.doc',
          type: 'application/msword',
          url: 'https://example.com/test.doc'
        }

        await expect(customExtract.extractText(pdfDoc)).resolves.toBe('Document extracted')

        await expect(customExtract.extractText(wordDoc)).rejects.toThrow(
          /File type 'application\/msword' is not allowed/
        )
      })

      it('should work with both custom images and documents', async () => {
        const customExtract = new DocExtract({
          allowedImages: ['image/jpeg'],
          allowedDocuments: ['application/pdf']
        })

        const allowedDocs = [
          {
            filename: 'test.jpeg',
            type: 'image/jpeg' as const,
            url: 'https://example.com/test.jpeg'
          },
          {
            filename: 'test.pdf',
            type: 'application/pdf' as const,
            url: 'https://example.com/test.pdf'
          }
        ]

        const disallowedDocs = [
          {
            filename: 'test.png',
            type: 'image/png' as const,
            url: 'https://example.com/test.png'
          },
          {
            filename: 'test.doc',
            type: 'application/msword' as const,
            url: 'https://example.com/test.doc'
          }
        ]

        // Test allowed documents
        for (const doc of allowedDocs) {
          await expect(customExtract.extractText(doc)).resolves.toBe('Document extracted')
        }

        // Test disallowed documents
        for (const doc of disallowedDocs) {
          await expect(customExtract.extractText(doc)).rejects.toThrow(/is not allowed/)
        }
      })
    })

    describe('Return value', () => {
      it('should return "Document extracted" for valid documents', async () => {
        const document: Document = {
          filename: 'test.pdf',
          type: 'application/pdf',
          url: 'https://example.com/test.pdf'
        }

        const result = await docExtract.extractText(document)
        expect(result).toBe('Document extracted')
      })
    })
  })
})
