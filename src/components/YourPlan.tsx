"use client"
import React from 'react';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { RiFileTextFill, RiImageFill, RiVideoFill, RiFileFill } from 'react-icons/ri'; // Import icons as needed
import { getFileType, formatFileSize, getTimeDifference } from '@/helpers/helpers';
import { fetchRecentFilesFromS3 } from '@/helpers/s3helper';


const YourRecentFiles = ({ user }: any) => {
    // Extract data for the pie chart

    // const [recentFiles,setRecentFiles] = React.useState<any>([])
    // const [recentFilesLoading,setRecentFilesLoading] = React.useState(true)
    const router = useRouter()
    // React.useEffect(() => {
    //     const fetchRecentFiles = async () => {
    //       try {
    //         const stats = await fetchRecentFilesFromS3(5);
    //         setRecentFiles(stats);
    //         setRecentFilesLoading(false)
    //       } catch (error) {
    //         console.error('Error fetching recent files', error);
    //       }
    //     };

    //     fetchRecentFiles();
    //   }, []);
    return (
        <div style={{ marginTop: '1rem' }}>
            <Card style={{ padding: '1rem', borderRadius: '14px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ fontWeight: '600' }}>Your plan :</div>
                <div style={{ }}>
                    <div style={{ display: 'flex', gap: '.4rem' }}>
                        <div>Current plan : </div>
                        <div>{user.planData.planName}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '.4rem' }}>
                        <div>Storage Plan : </div>
                        <div>{formatFileSize(user.planData.maxStorage)}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '.4rem' }}>
                        <div>  Cost :</div>
                        <div>{user.planData.inrCost?user.planData.inrCost:"FREE"}</div>
                    </div>



                </div>
                <div>
                    <Button color="success" variant='contained'>Upgrade</Button>
                </div>
            </Card >
        </div >
    );
};

export default YourRecentFiles;
