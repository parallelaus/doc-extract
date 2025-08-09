# DocExtract

Intelligent document extraction package for TypeScript applications with modular plugin architecture.

## Overview

DocExtract is a TypeScript library designed to extract text content from various document formats including PDFs, Word documents, and images. It provides a simple, type-safe API for processing documents from URLs or Buffer contents.

## Features

- 📄 **Multiple Document Types**: Support for PDF, DOC, DOCX files
- 🖼️ **Image Processing**: Extract text from JPEG, PNG, JPG, and WebP images
- 🔧 **Configurable**: Customize allowed file types per instance
- 📝 **TypeScript Support**: Full type safety with comprehensive type definitions
- 🛡️ **Input Validation**: Built-in validation for document types and sources
- 🧪 **Well Tested**: Comprehensive test suite with high coverage
- 🧩 **Modular Plugin Architecture**: Only install dependencies for document types you need
- 📦 **Minimal Core**: Core package has minimal dependencies

## Installation

### Core Package

```bash
npm install @parallelsoftware/doc-extract
```

### Document Type Processors

Install only the processors you need:

```bash
# For PDF support
npm install @parallelsoftware/doc-extract-pdf

# For DOCX support
npm install @parallelsoftware/doc-extract-docx

# For image support
npm install @parallelsoftware/doc-extract-image
```

## Quick Start

```typescript
import { DocExtract } from '@parallelsoftware/doc-extract'
import { PdfProcessor } from '@parallelsoftware/doc-extract-pdf'
import { DocxProcessor } from '@parallelsoftware/doc-extract-docx'

// Create an instance
const docExtract = new DocExtract()

// Register only the processors you need
docExtract.registerProcessor(new PdfProcessor())
docExtract.registerProcessor(new DocxProcessor())

// Extract from a document
const extractedText = await docExtract.extract({
  filename: 'example.pdf',
  type: 'application/pdf',
  url: 'https://example.com/document.pdf'
})

console.log(extractedText)
```

## API Reference

### DocExtract Class

#### Constructor

```typescript
new DocExtract(options?: DocExtractClientOptions)
```

**Options:**

- `allowedImages?: ImageTypes[]` - Array of allowed image MIME types
- `allowedDocuments?: DocumentTypes[]` - Array of allowed document MIME types

#### Methods

##### `extractText(document: Document): Promise<string>`

Extracts text content from the provided document.

**Parameters:**

- `document: Document` - The document to extract text from

**Returns:**

- `Promise<string>` - The extracted text content

**Throws:**

- `Error` - If document has neither URL nor contents
- `Error` - If document type is not allowed

### Types

#### Document

```typescript
type Document = {
  filename: string
  type: DocumentTypes | ImageTypes
  url?: string
  contents?: Buffer
}
```

#### DocumentTypes

```typescript
type DocumentTypes =
  | 'application/pdf'
  | 'application/msword'
  | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  | 'application/vnd.oasis.opendocument.text'
```

#### ImageTypes

```typescript
type ImageTypes = 'image/jpeg' | 'image/png' | 'image/jpg' | 'image/webp'
```

## Usage Examples

### Basic Usage

```typescript
import { DocExtract, Document } from '@parallelsoftware/doc-extract'

const extractor = new DocExtract()

// Extract from PDF
const pdfDoc: Document = {
  filename: 'report.pdf',
  type: 'application/pdf',
  url: 'https://example.com/report.pdf'
}

const text = await extractor.extractText(pdfDoc)
```

### Custom Configuration

```typescript
// Only allow PDFs and JPEG images
const extractor = new DocExtract({
  allowedDocuments: ['application/pdf'],
  allowedImages: ['image/jpeg']
})
```

### Using Buffer Contents

```typescript
import fs from 'fs'

const fileBuffer = fs.readFileSync('./document.pdf')

const document: Document = {
  filename: 'document.pdf',
  type: 'application/pdf',
  contents: fileBuffer
}

const text = await extractor.extractText(document)
```

### Error Handling

```typescript
try {
  const text = await extractor.extractText(document)
  console.log('Extracted:', text)
} catch (error) {
  if (error.message.includes('not allowed')) {
    console.error('File type not supported:', document.type)
  } else if (error.message.includes('url or contents')) {
    console.error('Document source missing')
  } else {
    console.error('Extraction failed:', error.message)
  }
}
```

## Supported File Types

### Documents (Default)

- **PDF**: `application/pdf`
- **Word 97-2003**: `application/msword`
- **Word 2007+**: `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- **OpenDocument Text**: `application/vnd.oasis.opendocument.text`

### Images (Default)

- **JPEG**: `image/jpeg`
- **PNG**: `image/png`
- **JPG**: `image/jpg`
- **WebP**: `image/webp`

## Development

### Prerequisites

- Node.js 16+
- npm or yarn

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd doc-extract

# Install dependencies
npm install

# Build the project
npm run build
```

### Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Linting and Formatting

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass (`npm test`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## License

MIT © Anton R. Menkveld

## Changelog

### 1.0.0

- Initial release
- Support for PDF, DOC, DOCX, and image extraction
- Configurable file type restrictions
- TypeScript support with full type definitions
