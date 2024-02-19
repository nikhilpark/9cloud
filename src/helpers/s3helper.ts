import AWS from 'aws-sdk';
import * as dotenv from 'dotenv';
import {getUserId} from "../actions/mongoActions"
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
export const uploadFileToS3 = async (file:any) => {
  const params: UploadFileParams  = {
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
    const data:any = await s3.listObjectsV2({ Bucket: String(process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME), Prefix: `uploads/${userId}` }).promise();
    console.log(data)
    const files = data.Contents.map((file:any) => ({
      Key: file.Key,
      Size: file.Size,
      LastModified: file.LastModified,
      ETag: file.ETag,
    }));    return files
  } catch (error) {
    console.error('Error fetching files:', error);
  }
}


export const generateSignedUrl = async (fileName:string, expiration = 60) => {
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


const calculateExpirationTime = () => {
  // Calculate expiration time based on file size, expected upload speed, etc.
  // ...
  let expirationTime = 60
  return expirationTime; // Set dynamically calculated expiration time
};

// Example usage with async/await


export const getSignedUrl = async (key:any) => {
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