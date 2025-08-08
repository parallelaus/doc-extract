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

      // it('should not throw error when document has url', async () => {
      //   const document: Document = {
      //     filename: 'test.pdf',
      //     type: 'application/pdf',
      //     url: 'https://example.com/test.pdf'
      //   }

      //   await expect(docExtract.extract(document)).resolves.toBe('Document extracted')
      // })

      // it('should not throw error when document has contents', async () => {
      //   const document: Document = {
      //     filename: 'test.pdf',
      //     type: 'application/pdf',
      //     contents: Buffer.from('test content')
      //   }

      //   await expect(docExtract.extract(document)).resolves.toBe('Document extracted')
      // })

      // it('should not throw error when document has both url and contents', async () => {
      //   const document: Document = {
      //     filename: 'test.pdf',
      //     type: 'application/pdf',
      //     url: 'https://example.com/test.pdf',
      //     contents: Buffer.from('test content')
      //   }

      //   await expect(docExtract.extract(document)).resolves.toBe('Document extracted')
      // })
    })

    describe('Validation - Conditional requirements', () => {
      describe('URL-based documents', () => {
        // it('should accept URL-only document without filename or type', async () => {
        //   const document: Document = {
        //     url: 'https://example.com/test.pdf'
        //   }

        //   await expect(docExtract.extract(document)).resolves.toBe('Document extracted')
        // })

        // it('should accept URL document with only filename', async () => {
        //   const document: Document = {
        //     url: 'https://example.com/test.pdf',
        //     filename: 'test.pdf'
        //   }

        //   await expect(docExtract.extract(document)).resolves.toBe('Document extracted')
        // })

        // it('should accept URL document with only type', async () => {
        //   const document: Document = {
        //     url: 'https://example.com/test.pdf',
        //     type: 'application/pdf'
        //   }

        //   await expect(docExtract.extract(document)).resolves.toBe('Document extracted')
        // })

        it('should reject URL document with invalid type', async () => {
          const document: Document = {
            url: 'https://example.com/test.txt',
            type: 'text/plain' as any
          }

          await expect(docExtract.extract(document)).rejects.toThrow(/File type 'text\/plain' is not allowed/)
        })
      })

      describe('Buffer-based documents', () => {
        it('should reject Buffer document without filename', async () => {
          const document: Document = {
            contents: Buffer.from('test content'),
            type: 'application/pdf'
          }

          await expect(docExtract.extract(document)).rejects.toThrow(
            'Filename is required when providing document contents'
          )
        })

        it('should reject Buffer document without type', async () => {
          const document: Document = {
            contents: Buffer.from('test content'),
            filename: 'test.pdf'
          }

          await expect(docExtract.extract(document)).rejects.toThrow(
            'Type is required when providing document contents'
          )
        })

        it('should reject Buffer document with invalid type', async () => {
          const document: Document = {
            contents: Buffer.from('test content'),
            filename: 'test.txt',
            type: 'text/plain' as any
          }

          await expect(docExtract.extract(document)).rejects.toThrow(/File type 'text\/plain' is not allowed/)
        })

        // it('should accept Buffer document with valid filename and type', async () => {
        //   const document: Document = {
        //     contents: Buffer.from('test content'),
        //     filename: 'test.pdf',
        //     type: 'application/pdf'
        //   }

        //   await expect(docExtract.extract(document)).resolves.toBe('Document extracted')
        // })
      })

      describe('Mixed source documents', () => {
        it('should require filename and type when both URL and Buffer are provided', async () => {
          // Missing filename
          const document1: Document = {
            contents: Buffer.from('test content'),
            url: 'https://example.com/test.pdf',
            type: 'application/pdf'
          }

          await expect(docExtract.extract(document1)).rejects.toThrow(
            'Filename is required when providing document contents'
          )

          // Missing type
          const document2: Document = {
            contents: Buffer.from('test content'),
            url: 'https://example.com/test.pdf',
            filename: 'test.pdf'
          }

          await expect(docExtract.extract(document2)).rejects.toThrow(
            'Type is required when providing document contents'
          )

          // Both provided (valid)
          // const document3: Document = {
          //   contents: Buffer.from('test content'),
          //   url: 'https://example.com/test.pdf',
          //   filename: 'test.pdf',
          //   type: 'application/pdf'
          // }

          // await expect(docExtract.extract(document3)).resolves.toBe('Document extracted')
        })
      })
    })

    describe('Validation - Document types', () => {
      // describe('Default allowed document types', () => {
      //   it('should accept PDF documents', async () => {
      //     const document: Document = {
      //       filename: 'test.pdf',
      //       type: 'application/pdf',
      //       url: 'https://example.com/test.pdf'
      //     }

      //     await expect(docExtract.extract(document)).resolves.toBe('Document extracted')
      //   })

      //   it('should accept Word documents (.doc)', async () => {
      //     const document: Document = {
      //       filename: 'test.doc',
      //       type: 'application/msword',
      //       url: 'https://example.com/test.doc'
      //     }

      //     await expect(docExtract.extract(document)).resolves.toBe('Document extracted')
      //   })

      //   it('should accept Word documents (.docx)', async () => {
      //     const document: Document = {
      //       filename: 'test.docx',
      //       type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      //       url: 'https://example.com/test.docx'
      //     }

      //     await expect(docExtract.extract(document)).resolves.toBe('Document extracted')
      //   })

      //   it('should accept OpenDocument Text (.odt)', async () => {
      //     const document: Document = {
      //       filename: 'test.odt',
      //       type: 'application/vnd.oasis.opendocument.text',
      //       url: 'https://example.com/test.odt'
      //     }

      //     await expect(docExtract.extract(document)).resolves.toBe('Document extracted')
      //   })
      // })

      // describe('Default allowed image types', () => {
      //   it('should accept JPEG images', async () => {
      //     const document: Document = {
      //       filename: 'test.jpeg',
      //       type: 'image/jpeg',
      //       url: 'https://example.com/test.jpeg'
      //     }

      //     await expect(docExtract.extract(document)).resolves.toBe('Document extracted')
      //   })

      //   it('should accept PNG images', async () => {
      //     const document: Document = {
      //       filename: 'test.png',
      //       type: 'image/png',
      //       url: 'https://example.com/test.png'
      //     }

      //     await expect(docExtract.extract(document)).resolves.toBe('Document extracted')
      //   })

      //   it('should accept JPG images', async () => {
      //     const document: Document = {
      //       filename: 'test.jpg',
      //       type: 'image/jpg',
      //       url: 'https://example.com/test.jpg'
      //     }

      //     await expect(docExtract.extract(document)).resolves.toBe('Document extracted')
      //   })

      //   it('should accept WebP images', async () => {
      //     const document: Document = {
      //       filename: 'test.webp',
      //       type: 'image/webp',
      //       url: 'https://example.com/test.webp'
      //     }

      //     await expect(docExtract.extract(document)).resolves.toBe('Document extracted')
      //   })
      // })

      describe('Disallowed types', () => {
        it('should reject unsupported document types', async () => {
          const document: Document = {
            filename: 'test.txt',
            type: 'text/plain' as any, // Type assertion to bypass TS checking for test
            url: 'https://example.com/test.txt'
          }

          await expect(docExtract.extract(document)).rejects.toThrow(/File type 'text\/plain' is not allowed/)
        })

        it('should reject unsupported image types', async () => {
          const document: Document = {
            filename: 'test.gif',
            type: 'image/gif' as any, // Type assertion to bypass TS checking for test
            url: 'https://example.com/test.gif'
          }

          await expect(docExtract.extract(document)).rejects.toThrow(/File type 'image\/gif' is not allowed/)
        })

        it('should include allowed types in error message', async () => {
          const document: Document = {
            filename: 'test.txt',
            type: 'text/plain' as any,
            url: 'https://example.com/test.txt'
          }

          await expect(docExtract.extract(document)).rejects.toThrow(/Allowed types:.*application\/pdf.*image\/jpeg/)
        })
      })
    })

    describe('Custom configuration', () => {
      it('should respect custom allowed images', async () => {
        const customExtract = new DocExtract({
          allowedImages: ['image/jpeg'] // Only JPEG allowed
        })

        // const jpegDoc: Document = {
        //   filename: 'test.jpeg',
        //   type: 'image/jpeg',
        //   url: 'https://example.com/test.jpeg'
        // }

        const pngDoc: Document = {
          filename: 'test.png',
          type: 'image/png',
          url: 'https://example.com/test.png'
        }

        // await expect(customExtract.extract(jpegDoc)).resolves.toBe('Document extracted')

        await expect(customExtract.extract(pngDoc)).rejects.toThrow(/File type 'image\/png' is not allowed/)
      })

      it('should respect custom allowed documents', async () => {
        const customExtract = new DocExtract({
          allowedDocuments: ['application/pdf'] // Only PDF allowed
        })

        // const pdfDoc: Document = {
        //   filename: 'test.pdf',
        //   type: 'application/pdf',
        //   url: 'https://example.com/test.pdf'
        // }

        const wordDoc: Document = {
          filename: 'test.doc',
          type: 'application/msword',
          url: 'https://example.com/test.doc'
        }

        // await expect(customExtract.extract(pdfDoc)).resolves.toBe('Document extracted')

        await expect(customExtract.extract(wordDoc)).rejects.toThrow(/File type 'application\/msword' is not allowed/)
      })

      it('should work with both custom images and documents', async () => {
        const customExtract = new DocExtract({
          allowedImages: ['image/jpeg'],
          allowedDocuments: ['application/pdf']
        })

        // const allowedDocs = [
        //   {
        //     filename: 'test.jpeg',
        //     type: 'image/jpeg' as const,
        //     url: 'https://example.com/test.jpeg'
        //   },
        //   {
        //     filename: 'test.pdf',
        //     type: 'application/pdf' as const,
        //     url: 'https://example.com/test.pdf'
        //   }
        // ]

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
        // for (const doc of allowedDocs) {
        //   await expect(customExtract.extract(doc)).resolves.toBe('Document extracted')
        // }

        // Test disallowed documents
        for (const doc of disallowedDocs) {
          await expect(customExtract.extract(doc)).rejects.toThrow(/is not allowed/)
        }
      })
    })
  })
})
