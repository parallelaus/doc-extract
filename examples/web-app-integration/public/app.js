/**
 * Frontend JavaScript for the Document Text Extractor web application
 * Demonstrates client-side integration with the doc-extract API
 */

// Using strict mode for better error catching
'use strict'

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('fileInput');
  const uploadForm = document.getElementById('uploadForm');
  const fileInfo = document.getElementById('fileInfo');
  const fileName = document.getElementById('fileName');
  const fileSize = document.getElementById('fileSize');
  const extractBtn = document.getElementById('extractBtn');
  const clearBtn = document.getElementById('clearBtn');
  const resultContainer = document.getElementById('resultContainer');
  const extractedText = document.getElementById('extractedText');
  const extractionStats = document.getElementById('extractionStats');
  const statsText = document.getElementById('statsText');
  const copyBtn = document.getElementById('copyBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const errorAlert = document.getElementById('errorAlert');
  const errorMessage = document.getElementById('errorMessage');
  const supportedFormats = document.getElementById('supportedFormats');
  
  // Bootstrap modal
  let loadingModal;
  
  // Current file
  let currentFile = null;
  
  // Initialize
  init();
  
  /**
   * Initialize the application
   */
  async function init() {
    // Initialize Bootstrap modal
    loadingModal = new bootstrap.Modal(document.getElementById('loadingModal'));
    
    // Set up event listeners
    setupEventListeners();
    
    // Load supported formats
    await loadSupportedFormats();
  }
  
  /**
   * Set up event listeners
   */
  function setupEventListeners() {
    // Drop zone click
    dropZone.addEventListener('click', () => {
      fileInput.click();
    });
    
    // File input change
    fileInput.addEventListener('change', handleFileSelect);
    
    // Form submit
    uploadForm.addEventListener('submit', handleFormSubmit);
    
    // Clear button
    clearBtn.addEventListener('click', clearForm);
    
    // Copy button
    copyBtn.addEventListener('click', copyToClipboard);
    
    // Download button
    downloadBtn.addEventListener('click', downloadText);
    
    // Drag and drop events
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('active');
    });
    
    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('active');
    });
    
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('active');
      
      if (e.dataTransfer.files.length) {
        handleFiles(e.dataTransfer.files);
      }
    });
  }
  
  /**
   * Load supported document formats from the API
   */
  async function loadSupportedFormats() {
    try {
      const response = await fetch('/api/supported-types');
      const data = await response.json();
      
      if (data.extensions && data.extensions.length) {
        supportedFormats.textContent = `Supported formats: ${data.extensions.join(', ')}`;
      } else {
        supportedFormats.textContent = 'No supported formats found';
      }
    } catch (error) {
      console.error('Failed to load supported formats:', error);
      supportedFormats.textContent = 'Failed to load supported formats';
    }
  }
  
  /**
   * Handle file selection from input
   */
  function handleFileSelect(e) {
    if (e.target.files.length) {
      handleFiles(e.target.files);
    }
  }
  
  /**
   * Handle files from input or drop
   */
  function handleFiles(files) {
    // Only process the first file
    const file = files[0];
    currentFile = file;
    
    // Update UI
    fileInfo.classList.remove('d-none');
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
    extractBtn.disabled = false;
    
    // Hide previous results and errors
    resultContainer.classList.add('d-none');
    errorAlert.classList.add('d-none');
  }
  
  /**
   * Handle form submission
   */
  async function handleFormSubmit(e) {
    e.preventDefault();
    
    if (!currentFile) {
      showError('No file selected');
      return;
    }
    
    try {
      // Show loading modal
      loadingModal.show();
      
      // Create form data
      const formData = new FormData();
      formData.append('document', currentFile);
      
      // Send request to API
      const response = await fetch('/api/extract', {
        method: 'POST',
        body: formData
      });
      
      // Parse response
      const data = await response.json();
      
      // Hide loading modal
      loadingModal.hide();
      
      if (response.ok) {
        // Show results
        displayResults(data);
      } else {
        // Show error
        showError(data.error || 'Failed to extract text');
      }
    } catch (error) {
      // Hide loading modal
      loadingModal.hide();
      
      // Show error
      showError('An error occurred while processing the document');
      console.error('Error:', error);
    }
  }
  
  /**
   * Display extraction results
   */
  function displayResults(data) {
    // Show result container
    resultContainer.classList.remove('d-none');
    
    // Update stats
    statsText.textContent = `Extracted ${data.textLength.toLocaleString()} characters from ${data.filename}`;
    
    // Update extracted text
    extractedText.textContent = data.text;
    
    // Scroll to results
    resultContainer.scrollIntoView({ behavior: 'smooth' });
  }
  
  /**
   * Show error message
   */
  function showError(message) {
    errorAlert.classList.remove('d-none');
    errorMessage.textContent = message;
    
    // Scroll to error
    errorAlert.scrollIntoView({ behavior: 'smooth' });
  }
  
  /**
   * Clear the form
   */
  function clearForm() {
    // Reset file input
    fileInput.value = '';
    currentFile = null;
    
    // Update UI
    fileInfo.classList.add('d-none');
    extractBtn.disabled = true;
    
    // Hide results and errors
    resultContainer.classList.add('d-none');
    errorAlert.classList.add('d-none');
  }
  
  /**
   * Copy extracted text to clipboard
   */
  function copyToClipboard() {
    const text = extractedText.textContent;
    
    if (!text) return;
    
    navigator.clipboard.writeText(text)
      .then(() => {
        // Show success feedback
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="bi bi-check-lg"></i> Copied!';
        
        // Reset button text after 2 seconds
        setTimeout(() => {
          copyBtn.innerHTML = originalText;
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy text:', err);
      });
  }
  
  /**
   * Download extracted text as a file
   */
  function downloadText() {
    const text = extractedText.textContent;
    
    if (!text) return;
    
    // Create file name based on original file
    const downloadName = currentFile ? 
      `${currentFile.name.split('.')[0]}_extracted.txt` : 
      'extracted_text.txt';
    
    // Create blob and download link
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.href = url;
    a.download = downloadName;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  }
  
  /**
   * Format file size in human-readable format
   */
  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
});
