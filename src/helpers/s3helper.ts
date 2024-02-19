import AWS from 'aws-sdk';
import * as dotenv from 'dotenv';
import { getUserId } from "../actions/mongoActions"

dotenv.config();

AWS.config.update({
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_S3_SECRET_ACCESS_KEY,
  region: process.env.NEXT_PUBLIC_AWS_S3_REGION,
});

const s3 = new AWS.S3();
const folderPrefix = "uploads"
interface UploadFileParams {
  Bucket: string;
  Key: string;
  Body: Buffer;
  ACL: 'private' | 'public-read';
}

const bucketName = String(process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME)
export const uploadFileToS3 = async (file: any) => {
  const params: UploadFileParams = {
    //@ts-ignore
    Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
    Key: `uploads/${file.name}`, // specify the path and file name in the bucket
    Body: file,
    ACL: 'private', // set ACL to public-read if you want the uploaded files to be publicly accessible
  };

  try {
    const result = await s3.upload(params).promise();
    console.log('File uploaded successfully:', result.Location);
    return result.Location; // return the URL of the uploaded file
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

export const fetchFilesFromS3 = async () => {
  try {
    const userId = await getUserId()
    const data: any = await s3.listObjectsV2({ Bucket: String(process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME), Prefix: `uploads/${userId}` }).promise();
    console.log(data)
    const files = data.Contents.map((file: any) => ({
      Key: file.Key,
      Size: file.Size,
      LastModified: file.LastModified,
      ETag: file.ETag,
    })); return files
  } catch (error) {
    console.error('Error fetching files:', error);
  }
}


export const generateSignedUrl = async (fileName: string, expiration = 60) => {
  const userId = await getUserId()
  const key = `${folderPrefix}/${userId}/${fileName}`;

  const params = {
    Bucket: bucketName,
    Key: key,
    Expires: expiration,
    ACL: 'private',
  };

  return new Promise<URL>((resolve, reject) => {
    s3.getSignedUrl('putObject', params, (err, url) => {
      if (err) {
        reject(err);
      } else {
        resolve(new URL(url));
      }
    });
  });
};

export const formatFileSize = (sizeInBytes: number): string => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];

  let size = sizeInBytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
};

export const getFolderStats = async (): Promise<{
  totalSize: string;
  fileCount: number;
  fileTypeCounts: Record<string, number>;
  fileSizeByType: Record<string, string>
}> => {
  try {
    const userId = await getUserId();
    const folderPrefix = `uploads/${userId}`;

    const data: any = await s3.listObjectsV2({
      Bucket: bucketName,
      Prefix: folderPrefix,
    }).promise();

    const files = data.Contents;
    let totalSize = 0;
    let fileCount = 0;
    const fileTypeCounts: Record<string, number> = {};
    const fileSizeByType: Record<string, number> = {};


    files.forEach((file: any) => {
      totalSize += file.Size;
      fileCount++;

      // Extract file extension from the Key
      const fileExtension = file.Key.split('.').pop();

      // Count file types
      if (fileExtension) {
        fileTypeCounts[fileExtension] = (fileTypeCounts[fileExtension] || 0) + 1;
        fileSizeByType[fileExtension] = (fileSizeByType[fileExtension] || 0) + file.Size;

      }
    });
    const formattedSize = formatFileSize(totalSize)
    const formattedSizeByType = Object.fromEntries(
      Object.entries(fileSizeByType).map(([key, value]) => [key, formatFileSize(Number(value))])
    )

    return {
      totalSize: formattedSize,
      fileCount,
      fileTypeCounts,
      fileSizeByType: formattedSizeByType
    };
  } catch (error) {
    console.error('Error getting folder stats:', error);
    throw error;
  }
};

const calculateExpirationTime = () => {
  // Calculate expiration time based on file size, expected upload speed, etc.
  // ...
  let expirationTime = 60
  return expirationTime; // Set dynamically calculated expiration time
};

// Example usage with async/await


export const getSignedUrl = async (key: any) => {
  try {
    const params = {
      Bucket: String(process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME),
      Key: key,
      Expires: 60, // The URL will expire in 60 seconds
    };

    const signedUrl = await s3.getSignedUrlPromise('getObject', params);
    return signedUrl;
  } catch (error) {
    console.error('Error generating pre-signed URL:', error);
    throw error;
  }
};