/**
 * Web application example for @parallelsoftware/doc-extract
 * 
 * This example demonstrates how to integrate the document extraction package
 * into a simple Express.js web application with file uploads.
 */

import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

// Import DocExtract and processors
import { DocExtract } from '@parallelsoftware/doc-extract';
import { PdfProcessor } from '@parallelsoftware/doc-extract-pdf';
import { DocxProcessor } from '@parallelsoftware/doc-extract-docx';
import { ImageProcessor } from '@parallelsoftware/doc-extract-image';

// Set up __dirname equivalent for ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Set up multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Initialize DocExtract with all processors
function initDocExtract() {
  const docExtract = new DocExtract();
  docExtract.registerProcessor(new PdfProcessor());
  docExtract.registerProcessor(new DocxProcessor());
  docExtract.registerProcessor(new ImageProcessor());
  return docExtract;
}

// Map file extensions to MIME types
const mimeTypeMap = {
  '.pdf': 'application/pdf',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg'
};

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint for document extraction
app.post('/api/extract', upload.single('document'), async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.file;
    const fileExt = path.extname(file.originalname).toLowerCase();
    const mimeType = mimeTypeMap[fileExt] || file.mimetype;

    // Initialize DocExtract
    const docExtract = initDocExtract();

    // Check if document type is supported
    if (!docExtract.supportsDocumentType(mimeType)) {
      return res.status(400).json({
        error: 'Unsupported document type',
        supportedTypes: docExtract.getSupportedMimeTypes()
      });
    }

    // Create document object
    const document = {
      filename: file.originalname,
      type: mimeType,
      contents: file.buffer
    };

    // Extract text
    console.log(`Processing ${file.originalname} (${mimeType})...`);
    const extractedText = await docExtract.extract(document);

    // Return extracted text
    res.json({
      filename: file.originalname,
      mimeType: mimeType,
      textLength: extractedText.length,
      text: extractedText
    });
  } catch (error) {
    console.error('Extraction error:', error);
    res.status(500).json({
      error: 'Failed to extract text',
      message: error.message
    });
  }
});

// API endpoint to get supported document types
app.get('/api/supported-types', (req, res) => {
  const docExtract = initDocExtract();
  const supportedMimeTypes = docExtract.getSupportedMimeTypes();
  
  // Map MIME types to file extensions
  const supportedExtensions = Object.entries(mimeTypeMap)
    .filter(([_, mimeType]) => supportedMimeTypes.includes(mimeType))
    .map(([ext]) => ext);
  
  res.json({
    mimeTypes: supportedMimeTypes,
    extensions: supportedExtensions
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`API endpoints:`);
  console.log(`- POST /api/extract - Extract text from uploaded document`);
  console.log(`- GET /api/supported-types - Get supported document types`);
});
