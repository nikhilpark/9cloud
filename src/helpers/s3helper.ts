import AWS from 'aws-sdk';
import * as dotenv from 'dotenv';
import { getUserId,getUserProfile,updateFileAccessTime } from "../actions/mongoActions"
import dbPromise from "@/helpers/connectMongo"

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
  Metadata:Record<string,string>;

}

interface S3File {
  Key: string;
  Size: number;
  LastModified: Date;
  ETag: string;
  LastAccessTime: string; // Update the type according to your actual LastAccessTime type
}
const bucketName = String(process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME)
export const uploadFileToS3 = async (file: any) => {
  const params: UploadFileParams = {
    //@ts-ignore
    Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
    Key: `uploads/${file.name}`, // specify the path and file name in the bucket
    Body: file,
    Metadata: {
      'x-amz-meta-last-access-time': new Date().toISOString(),
    },
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
    const files = await Promise.all(data.Contents.map(async (file:any) => {
      const headObjectData:any = await s3.headObject({ Bucket: String(process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME), Key: file.Key }).promise();
      console.log(headObjectData.Metadata,"metadata",file.Key,headObjectData)
      return {
        Key: file.Key,
        Size: file.Size,
        LastModified: file.LastModified,
        ETag: file.ETag,
        abcd:"wfg",
        LastAccessTime: headObjectData.Metadata['x-amz-meta-last-access-time'], // Access the specific metadata field
      } as S3File
    }));
    
    
    return files 
  } catch (error) {
    console.error('Error fetching files:', error);
  }
}

export const fetchRecentFilesFromS3 = async (count:number) => {
  try {
    // Fetch all files
    
    const allFiles:any = await fetchFilesFromS3();
const userD = await getUserProfile()
const recentFiles = JSON.parse(userD).recentFiles
console.log(recentFiles,"recentFiles")
//@ts-ignore
const filteredFiles = allFiles.filter(file=>recentFiles.some(recentFile=>recentFile.key == file.Key))
    // Sort files based on LastAccessTime in descending order
    const outFiles: S3File[] = filteredFiles.map(file => {
      const recentFile = recentFiles.find(recentFile => recentFile.key === file.Key);
      return {
        ...file,
        LastAccessTime: recentFile ? new Date(recentFile.time) : undefined,
      };
    });


    // const sortedFiles:S3File[] = allFiles.sort((a:S3File, b:S3File) => new Date(b.LastAccessTime).getTime() - new Date(a.LastAccessTime).getTime());

    // Take the first 5 files (most recent)

    return outFiles;
  } catch (error) {
    console.error('Error fetching recent files:', error);
    throw error; // Rethrow the error to handle it in the calling code
  }
};


export const generateSignedUrl = async (fileName: string, expiration = 60) => {
  const userId = await getUserId()
  const key = `${folderPrefix}/${userId}/${fileName}`;

  const params = {
    Bucket: bucketName,
    Key: key,
    Expires: expiration,
    ACL: 'private',
    Metadata: {
      'x-amz-meta-last-access-time': new Date().toISOString(),
    },
  };
await updateFileAccessTime(userId, key)

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
  totalSizeInBytes:number;
  folderDetails:Record<string, { size: string; count: number,sizeInBytes:number }>;
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
    const fileTypeSize: Record<string, { size: string; count: number,sizeInBytes:number }> = {};

    files.forEach((file: any) => {
      totalSize += file.Size;
      fileCount++;

      // Extract file extension from the Key
      const fileExtension = file.Key.split('.').pop();

      // Count file types
      if (fileExtension) {
        fileTypeCounts[fileExtension] = (fileTypeCounts[fileExtension] || 0) + 1;
        fileSizeByType[fileExtension] = (fileSizeByType[fileExtension] || 0) + file.Size;
        fileTypeSize[fileExtension] = {
          size: formatFileSize(fileSizeByType[fileExtension] || 0),
          count: fileTypeCounts[fileExtension] || 0,
          sizeInBytes:fileSizeByType[fileExtension] || 0
        };
      }
    });
    const formattedSize = formatFileSize(totalSize)
    
    const formattedSizeByType = Object.fromEntries(
      Object.entries(fileSizeByType).map(([key, value]) => [key, formatFileSize(Number(value))])
    )

    return {
      totalSize: formattedSize,
      totalSizeInBytes:totalSize,
      fileCount,
      folderDetails:fileTypeSize
    };
  } catch (error) {
    console.error('Error getting folder stats:', error);
    throw error;
  }
};




export const getSignedUrl = async (key: any) => {
  try {

    const params = {
      Bucket: String(process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME),
      Key: key,
      Expires: 60, // The URL will expire in 60 seconds
    };
    const userId = await getUserId()

    const signedUrl = await s3.getSignedUrlPromise('getObject', params);
    await updateFileAccessTime(userId, key)

    return signedUrl;
  } catch (error) {
    console.error('Error generating pre-signed URL:', error);
    throw error;
  }
};