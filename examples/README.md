# Doc Extract Examples

This directory contains examples demonstrating how to use the `@parallelsoftware/doc-extract` package for extracting text from various document types.

## Examples Overview

1. **Basic Usage** (`basic-usage.js`): Demonstrates the core functionality of the package, including:
   - Initializing the DocExtract client
   - Registering document processors
   - Extracting text from PDF, DOCX, and image files

2. **Advanced Usage** (`advanced-usage.js`): Shows more advanced features:
   - Error handling
   - Processing documents from URLs
   - Working with multiple document types in batch
   - Creating custom document processors

3. **TypeScript Usage** (`typescript-usage.ts`): Demonstrates using the package with TypeScript:
   - Type-safe document handling
   - Custom processor implementation with TypeScript
   - Error handling with proper typing

4. **Practical Example** (`practical-example.js`): Shows a real-world use case:
   - Processing all documents in a directory
   - Saving extracted text to output files
   - Handling different file types automatically

5. **CLI Tool** (`cli-tool.js`): Command-line interface for document extraction:
   - Extract text from individual files
   - Batch process directories
   - View supported document types
   - Save output to files

6. **Web Application** (`web-app-integration/`): Complete web application example:
   - Express.js backend with file upload API
   - Modern frontend with drag-and-drop interface
   - Real-time text extraction and display
   - Copy to clipboard and download functionality

7. **Usage Guide** (`USAGE_GUIDE.md`): Comprehensive documentation:
   - Architecture overview
   - Installation instructions
   - API documentation
   - Best practices
   - Advanced usage patterns

## Prerequisites

Before running these examples, make sure to:

1. Build the local packages (from the project root):
   ```bash
   pnpm build
   ```

2. Install the example dependencies (from the examples directory):
   ```bash
   npm install
   ```

2. Create a `sample-files` directory with sample documents:
   - `sample.pdf`: A sample PDF file
   - `sample.docx`: A sample DOCX file
   - `sample.png`: A sample image file with text
   - `sample.txt`: A sample text file

## Running the Examples

### JavaScript Examples
```bash
node basic-usage.js
node advanced-usage.js
node practical-example.js
```

### TypeScript Example
```bash
# Compile TypeScript first
tsc typescript-usage.ts
# Then run the compiled JavaScript
node typescript-usage.js
```

### CLI Tool
```bash
# Make the file executable (Unix/Linux/macOS)
chmod +x cli-tool.js

# Extract text from a file
node cli-tool.js extract sample-files/sample.pdf

# Process all files in a directory
node cli-tool.js batch sample-files --output extracted-text

# Show supported document types
node cli-tool.js supported

# Show help
node cli-tool.js help
```

### Web Application
```bash
# Navigate to the web app directory
cd web-app-integration

# Install dependencies
npm install

# Start the server
npm start

# Open http://localhost:3000 in your browser
```

## Notes

- All examples use ES modules syntax (`import`/`export`)
- Make sure your Node.js version is 18.0.0 or higher
- The web application example has its own README with detailed instructions
- See `USAGE_GUIDE.md` for comprehensive documentation on the package
