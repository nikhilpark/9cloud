"use client"
// FileList.js

import { useState, useEffect } from 'react';
import { uploadFileToS3,fetchFilesFromS3,getSignedUrl } from '@/helpers/s3helper';

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedFiles = await fetchFilesFromS3();
        setFiles(fetchedFiles);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    fetchData();
  }, []);

  const handleFileClick = (file:any) => {
    setSelectedFile(file);
  };

  const handleDownloadClick = async (file:any) => {
    try {
      // Generate a pre-signed URL for the S3 object
      const signedUrl = await getSignedUrl(file.Key);

      // Open the URL in a new tab to initiate the download
      window.open(signedUrl, '_blank');
    } catch (error) {
      console.error('Error generating pre-signed URL:', error);
    }
  };
  return (
    <div>
      <h2>Files in the S3 Folder:</h2>
      <ul>
        {files.map((file:any, index) => (
          <li key={index}>
            <span onClick={() => handleFileClick(file)} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
              {file.Key}
            </span>
            {selectedFile === file && (
              <div>
                <p>Selected File: {file.Key}</p>
                <p>Size: {file.Size} bytes</p>
                <p>Last Modified: {file.LastModified.toString()}</p>
                <p>ETag: {file.ETag}</p>
                {/* Add more details as needed */}
                <button onClick={() => handleDownloadClick(file)}>Download</button>

              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;
