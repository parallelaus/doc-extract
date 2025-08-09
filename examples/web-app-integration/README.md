# Doc Extract Web Application Example

This example demonstrates how to integrate the `@parallelsoftware/doc-extract` package into a web application using Express.js.

## Features

- File upload interface with drag-and-drop support
- Text extraction from PDF, DOCX, and image files
- Display extracted text with statistics
- Copy to clipboard and download functionality
- Error handling and validation

## Prerequisites

- Node.js 18.0.0 or higher
- npm or pnpm package manager

## Installation

1. Install dependencies:

```bash
npm install
# or
pnpm install
```

## Running the Application

1. Start the server:

```bash
npm start
# or
pnpm start
```

2. For development with auto-restart:

```bash
npm run dev
# or
pnpm dev
```

3. Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

## API Endpoints

- `POST /api/extract` - Extract text from an uploaded document
- `GET /api/supported-types` - Get supported document types and file extensions

## Project Structure

```
web-app-integration/
├── public/                # Static files
│   ├── index.html         # Web interface
│   └── app.js             # Frontend JavaScript
├── server.js              # Express server and API endpoints
├── package.json           # Project configuration
└── README.md              # This file
```

## How It Works

1. The frontend allows users to upload documents through a user-friendly interface
2. The server receives the uploaded file and identifies its MIME type
3. The `DocExtract` class processes the document using the appropriate processor
4. The extracted text is returned to the frontend and displayed to the user

## Customization

- Add more document processors by installing additional `@parallelsoftware/doc-extract-*` packages
- Modify the frontend UI in `public/index.html` and `public/app.js`
- Extend the API in `server.js` to add more functionality

## Security Considerations

This example includes basic file validation, but for production use, consider:

- Adding authentication and authorization
- Implementing rate limiting
- Adding more robust file validation
- Setting up HTTPS
- Configuring proper CORS settings
