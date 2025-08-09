# DocExtract Usage Guide

This guide explains how to use the modular DocExtract architecture to extract text from various document types while minimizing dependencies.

## Installation

### Core Package

The core package provides the main `DocExtract` class and interfaces. It has minimal dependencies (only `zod` and `tslib`).

```bash
npm install @parallelsoftware/doc-extract
# or
yarn add @parallelsoftware/doc-extract
# or
pnpm add @parallelsoftware/doc-extract
```

### Document Type Processors

Install only the processors you need:

```bash
# For PDF support
npm install @parallelsoftware/doc-extract-pdf

# For DOCX support
npm install @parallelsoftware/doc-extract-docx

# For image support (OCR)
npm install @parallelsoftware/doc-extract-image
```

## Basic Usage

```typescript
import { DocExtract } from '@parallelsoftware/doc-extract'
import { PdfProcessor } from '@parallelsoftware/doc-extract-pdf'
import { DocxProcessor } from '@parallelsoftware/doc-extract-docx'

// Create an instance
const docExtract = new DocExtract()

// Register only the processors you need
docExtract.registerProcessor(new PdfProcessor())
docExtract.registerProcessor(new DocxProcessor())

// Check which document types are supported
console.log(docExtract.getSupportedMimeTypes())
// Output: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']

// Extract text from a document
async function extractText() {
  const text = await docExtract.extract({
    filename: 'example.pdf',
    type: 'application/pdf',
    contents: pdfBuffer // Buffer containing the PDF data
  })
  
  console.log(text)
}
```

## Advanced Usage

### Processing Documents from URLs

```typescript
import { DocExtract } from '@parallelsoftware/doc-extract'
import { PdfProcessor } from '@parallelsoftware/doc-extract-pdf'

const docExtract = new DocExtract()
docExtract.registerProcessor(new PdfProcessor())

async function extractFromUrl() {
  // The URL will be fetched and processed automatically
  const text = await docExtract.extract({
    type: 'application/pdf',
    url: 'https://example.com/document.pdf'
  })
  
  console.log(text)
}
```

### Dynamic Imports

For even more flexibility, you can use dynamic imports to load processors only when needed:

```typescript
import { DocExtract } from '@parallelsoftware/doc-extract'

async function processDocument(document) {
  const docExtract = new DocExtract()
  
  // Dynamically import the appropriate processor based on document type
  if (document.type === 'application/pdf') {
    const { PdfProcessor } = await import('@parallelsoftware/doc-extract-pdf')
    docExtract.registerProcessor(new PdfProcessor())
  } else if (document.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const { DocxProcessor } = await import('@parallelsoftware/doc-extract-docx')
    docExtract.registerProcessor(new DocxProcessor())
  } else if (document.type.startsWith('image/')) {
    const { ImageProcessor } = await import('@parallelsoftware/doc-extract-image')
    docExtract.registerProcessor(new ImageProcessor())
  } else {
    throw new Error(`Unsupported document type: ${document.type}`)
  }
  
  return docExtract.extract(document)
}
```

### Multiple Document Types

The `ImageProcessor` supports multiple image formats:

```typescript
import { DocExtract } from '@parallelsoftware/doc-extract'
import { ImageProcessor } from '@parallelsoftware/doc-extract-image'

const docExtract = new DocExtract()
const imageProcessor = new ImageProcessor()

// The ImageProcessor handles multiple image formats
// but only the primary type is returned by supportedMimeType
console.log(imageProcessor.supportedMimeType) // 'image/jpeg'

// To check if a specific image type is supported
console.log(imageProcessor.supportedMimeTypes.includes('image/png')) // true

docExtract.registerProcessor(imageProcessor)

// Now you can process JPEG, PNG, JPG, and WebP images
```

## Creating Custom Processors

You can create custom processors for additional document types by implementing the `DocumentProcessor` interface. The project uses Zod schemas as the single source of truth for types, with TypeScript types generated using `z.infer<typeof schemaName>`.

### Within the Monorepo

When creating a processor within the monorepo, import types directly from the core package:

```typescript
// Import types directly from the core package using relative paths
import type { Document } from '../../core/src/lib/types.js'
import type { DocumentProcessor } from '../../core/src/lib/DocumentProcessor.js'

export class CustomProcessor implements DocumentProcessor {
  public readonly supportedMimeType = 'application/custom-format'
  
  public async process(doc: Document): Promise<string> {
    // Custom logic to extract text from the document
    return 'Extracted text'
  }
}
```

### As an External Package

When creating a processor as an external package (outside the monorepo), import types from the published package:

```typescript
import type { DocumentProcessor, Document } from '@parallelsoftware/doc-extract'

export class CustomProcessor implements DocumentProcessor {
  public readonly supportedMimeType = 'application/custom-format'
  
  public async process(doc: Document): Promise<string> {
    // Custom logic to extract text from the document
    return 'Extracted text'
  }
}
```

## Error Handling

```typescript
import { DocExtract } from '@parallelsoftware/doc-extract'
import { PdfProcessor } from '@parallelsoftware/doc-extract-pdf'

const docExtract = new DocExtract()
docExtract.registerProcessor(new PdfProcessor())

async function extractWithErrorHandling() {
  try {
    const text = await docExtract.extract({
      type: 'application/pdf',
      contents: pdfBuffer
    })
    return text
  } catch (error) {
    if (error.message.includes('No processor registered')) {
      console.error('No processor available for this document type')
    } else if (error.message.includes('Failed to extract')) {
      console.error('Document processing failed:', error.message)
    } else {
      console.error('Unexpected error:', error)
    }
    return null
  }
}
```

## Development

### Adding a New Processor

1. Create a new package in the `packages` directory
2. Import types directly from the core package:
   ```typescript
   // Import types directly from the core package using relative paths
   import type { Document } from '../../core/src/lib/types.js'
   import type { DocumentProcessor } from '../../core/src/lib/DocumentProcessor.js'
   ```
3. Configure your `tsconfig.json` to support direct type imports:
   ```json
   "compilerOptions": {
     "moduleResolution": "node",
     "paths": {
       "@parallelsoftware/doc-extract": ["../core/dist"],
       "@parallelsoftware/doc-extract/*": ["../core/dist/*"]
     }
   }
   ```
4. Add project references to the core package:
   ```json
   "references": [
     { "path": "../core" }
   ]
   ```
5. Implement the `DocumentProcessor` interface
6. Export your processor in the package's `index.ts` file
7. Update documentation to include the new processor

### Testing

Each package includes its own tests. Run tests for all packages:

```bash
pnpm test
```

Or for a specific package:

```bash
cd packages/pdf
pnpm test
```
