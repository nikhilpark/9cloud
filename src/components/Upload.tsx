"use client"
import React, { useState, ChangeEvent, useEffect } from 'react';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import Snackbar from '@mui/material/Snackbar';
import LinearProgress from '@mui/material/LinearProgress';
import { uploadFileToS3, fetchFilesFromS3, generateSignedUrl } from '@/helpers/s3helper';

const MAX_FILE_SIZE_MB = 100;

interface FileUploadButtonProps {
  // You can define any props here if needed
}

const FileUploadButton: React.FC<FileUploadButtonProps> = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);

  useEffect(() => {
    // Open the snackbar when progress starts
    if (uploadProgress > 0 && uploadProgress < 100) {
      setSnackbarOpen(true);
    } else {
      setSnackbarOpen(false);
    }
  }, [uploadProgress]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB <= MAX_FILE_SIZE_MB) {
        setSelectedFile(file || null);
      } else {
        alert(`Please select a file with size less than ${MAX_FILE_SIZE_MB} MB.`);
      }
    }
  };

  const handleUploadClick = async () => {
    // Perform file upload logic here
    if (selectedFile) {
      console.log(selectedFile);
      console.log(`Uploading file: ${selectedFile.name}`);
      await initiateUpload(selectedFile.name, selectedFile);
      console.log(`Uploaded file`);
      // Add your upload logic here, e.g., using FormData and sending to a server
    } else {
      console.log('No file selected');
    }
  };

  const initiateUpload = async (fileName, file) => {
    try {
      const expirationTime = 50;
      const signedUrl = await generateSignedUrl(fileName, expirationTime);

      // Create a FormData object and append the file to it
      const formData = new FormData();
      formData.append('file', file);

      // Create an XMLHttpRequest object
      const xhr = new XMLHttpRequest();

      // Set up the event listeners for progress tracking
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentUploaded = (event.loaded / event.total) * 100;
          setUploadProgress(percentUploaded); // Update the progress state
        }
      });

      xhr.upload.addEventListener('load', () => {
        console.log('Upload completed!');
        setUploadProgress(100); // Set progress to 100% when upload is completed
      });

      // Open the connection and send the file using the signed URL
      xhr.open('PUT', signedUrl, true);
      xhr.send(formData);
    } catch (error) {
      console.error('Error generating signed URL:', error);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div>
      <Input
        type="file"
        id="fileInput"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <label htmlFor="fileInput">
        <Button variant="contained" color="primary" component="span">
          Choose File
        </Button>
      </label>
      {selectedFile && (
        <div>
          <p>Selected File: {selectedFile.name}</p>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUploadClick}
          >
            Upload
          </Button>
          {uploadProgress > 0 && (
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={6000} // Adjust as needed
              onClose={handleCloseSnackbar}
              message={`Upload Progress: ${uploadProgress.toFixed(2)}%`}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default FileUploadButton;
