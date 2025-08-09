# @parallelsoftware/doc-extract Usage Guide

This guide provides comprehensive information on how to use the `@parallelsoftware/doc-extract` package for extracting text from various document types.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Installation](#installation)
3. [Basic Usage](#basic-usage)
4. [Document Processors](#document-processors)
5. [Error Handling](#error-handling)
6. [Advanced Usage](#advanced-usage)
7. [TypeScript Support](#typescript-support)
8. [Creating Custom Processors](#creating-custom-processors)
9. [Best Practices](#best-practices)

## Architecture Overview

The `@parallelsoftware/doc-extract` package uses a modular plugin architecture:

- **Core Package**: Provides the main `DocExtract` class and interfaces
- **Processor Packages**: Implement document-specific extraction logic
- **Plugin System**: Register processors for different document types

This architecture allows for:
- Easy extension with new document types
- Minimal dependencies (only install what you need)
- Consistent API across document types

## Installation

Install the core package and any processors you need:

```bash
# Install core package
npm install @parallelsoftware/doc-extract

# Install processors as needed
npm install @parallelsoftware/doc-extract-pdf
npm install @parallelsoftware/doc-extract-docx
npm install @parallelsoftware/doc-extract-image
```

## Basic Usage

Here's a simple example of extracting text from a PDF file:

```javascript
import { DocExtract } from '@parallelsoftware/doc-extract';
import { PdfProcessor } from '@parallelsoftware/doc-extract-pdf';
import fs from 'node:fs/promises';

async function extractTextFromPdf(filePath) {
  // Initialize DocExtract
  const docExtract = new DocExtract();
  
  // Register PDF processor
  docExtract.registerProcessor(new PdfProcessor());
  
  // Read file contents
  const contents = await fs.readFile(filePath);
  
  // Create document object
  const document = {
    filename: 'document.pdf',
    type: 'application/pdf',
    contents
  };
  
  // Extract text
  const text = await docExtract.extract(document);
  return text;
}

// Usage
extractTextFromPdf('path/to/document.pdf')
  .then(text => console.log(text))
  .catch(error => console.error('Error:', error));
```

## Document Processors

The package includes processors for various document types:

| Processor | Package | MIME Type | Description |
|-----------|---------|-----------|-------------|
| PdfProcessor | @parallelsoftware/doc-extract-pdf | application/pdf | Extracts text from PDF files |
| DocxProcessor | @parallelsoftware/doc-extract-docx | application/vnd.openxmlformats-officedocument.wordprocessingml.document | Extracts text from DOCX files |
| ImageProcessor | @parallelsoftware/doc-extract-image | image/png, image/jpeg, etc. | Extracts text from images using OCR |

## Error Handling

The package uses Zod for validation and provides clear error messages:

```javascript
try {
  const text = await docExtract.extract(document);
  console.log('Extracted text:', text);
} catch (error) {
  if (error.message.includes('No processor registered')) {
    console.error('Unsupported document type');
  } else if (error.message.includes('Invalid')) {
    console.error('Invalid document format:', error.message);
  } else {
    console.error('Extraction error:', error.message);
  }
}
```

## Advanced Usage

### Processing Documents from URLs

```javascript
const urlDocument = {
  url: 'https://example.com/document.pdf',
  type: 'application/pdf'
  // Note: contents is not required when url is provided
};

const text = await docExtract.extract(urlDocument);
```

### Batch Processing

```javascript
async function batchProcess(docExtract, documents) {
  const results = [];
  
  for (const doc of documents) {
    try {
      const text = await docExtract.extract(doc);
      results.push({ filename: doc.filename, success: true, text });
    } catch (error) {
      results.push({ filename: doc.filename, success: false, error: error.message });
    }
  }
  
  return results;
}
```

## TypeScript Support

The package includes TypeScript definitions and uses Zod schemas for runtime validation:

```typescript
import { DocExtract, type Document } from '@parallelsoftware/doc-extract';
import { PdfProcessor } from '@parallelsoftware/doc-extract-pdf';

async function processDocument(filePath: string): Promise<string> {
  const docExtract = new DocExtract();
  docExtract.registerProcessor(new PdfProcessor());
  
  const contents = await fs.readFile(filePath);
  
  const document: Document = {
    filename: 'document.pdf',
    type: 'application/pdf',
    contents
  };
  
  return docExtract.extract(document);
}
```

## Creating Custom Processors

You can create custom processors for additional document types:

```typescript
import { DocumentProcessor, Document } from '@parallelsoftware/doc-extract';

class CsvProcessor implements DocumentProcessor {
  public readonly supportedMimeType = 'text/csv';
  
  public async process(document: Document): Promise<string> {
    if (!document.contents) {
      throw new Error('CSV document must have contents');
    }
    
    const csvContent = document.contents.toString('utf-8');
    
    // Process CSV content
    const lines = csvContent.split('\n');
    return lines.map(line => line.replace(/,/g, ' | ')).join('\n');
  }
}

// Usage
docExtract.registerProcessor(new CsvProcessor());
```

## Best Practices

1. **Register Only Needed Processors**: Only register the processors you need to minimize memory usage.

2. **Validate Document Types**: Check if a document type is supported before processing:
   ```javascript
   if (docExtract.supportsDocumentType(mimeType)) {
     // Process document
   }
   ```

3. **Error Handling**: Always implement proper error handling for extraction failures.

4. **Memory Management**: For large documents, consider processing them in chunks or streams.

5. **Cleanup**: Some processors may create temporary files or resources. Ensure proper cleanup.

6. **Testing**: Test with various document formats and sizes to ensure robustness.

7. **Security**: Validate and sanitize input documents, especially when processing user-uploaded files.

---

For more examples, see the `examples/` directory in this repository.
