"use client"
import React from 'react';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { RiFileTextFill, RiImageFill, RiVideoFill, RiFileFill } from 'react-icons/ri'; // Import icons as needed
import { getFileType, formatFileSize,getTimeDifference } from '@/helpers/helpers';
import { fetchRecentFilesFromS3 } from '@/helpers/s3helper';


const YourRecentFiles = () => {
    // Extract data for the pie chart

    const [recentFiles,setRecentFiles] = React.useState<any>([])
    const [recentFilesLoading,setRecentFilesLoading] = React.useState(true)
    const router = useRouter()
    React.useEffect(() => {
        const fetchRecentFiles = async () => {
          try {
            const stats = await fetchRecentFilesFromS3(5);
            setRecentFiles(stats);
            setRecentFilesLoading(false)
          } catch (error) {
            console.error('Error fetching recent files', error);
          }
        };
      
        fetchRecentFiles();
      }, []);
    return (
        <div style={{ marginTop: '1rem' }}>
            <Card style={{ padding: '1rem', borderRadius: '14px',display:'flex',flexDirection:'column',gap:'1rem' }}>
                <div style={{ fontWeight: '600' }}>Recent files:</div>
                <div style={{display:'flex',flexDirection:'row',gap:'1rem',flexWrap:'wrap',marginTop:'1rem'}}>
                {recentFiles.map((file:any,key:number)=>{
                  const fileName = file.Key.split('/').pop()
                  return <Card key={key} style={{padding:'.4rem 1rem',borderRadius:'14px',background:'rgba(255, 255, 255, 0.2)'}}>
                    <div>
                      <Link href={'#'}>{fileName}</Link>
                    </div>
                    <div style={{display:'flex',justifyContent:'space-between',gap:'1rem',alignItems:'center'}}>
                      <div>
                      {formatFileSize(file.Size)}

                      </div>
                      <div style={{fontSize:'.6rem'}}>
                      {getTimeDifference(file.LastAccessTime)}

                      </div>
                    </div>
                    </Card>
                })}
                </div>
                <div style={{display:'flex',justifyContent:'flex-end',gap:'1rem',marginTop:'1rem'}}>
                <div>
                <Button variant="outlined" >Upload a file</Button>
                  </div>
                <div>
                <Button variant="contained" onClick={()=>{router.push('/files')}} > View all files</Button> 
                  </div>
                </div>
            </Card>
        </div>
    );
};

export default YourRecentFiles;
