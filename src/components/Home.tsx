import React from 'react';
import Head from 'next/head';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import Link from "next/link";
import YourDriveStatsCard from './YourDriverStats';
import YourRecentFiles from './YourRecentFiles';
import { getFolderStats } from '@/helpers/s3helper';


const Home = ({ user,folderStats,recentFiles }:any) => {

  console.log("HOMEEEE",user,)

  // const [folderStats, setFolderStats] = React.useState<any>();
  // const [folderStatsLoading,setFolderStatsLoading] = React.useState(true);

// React.useEffect(() => {
//   const fetchFolderStats = async () => {
//     try {
//       const stats = await getFolderStats();
//       setFolderStats(stats);
//       setFolderStatsLoading(false)
//     } catch (error) {
//       console.error('Error fetching folder stats:', error);
//     }
//   };

//   fetchFolderStats();
// }, []);

  return (
    <Container>
      <Head>
        <title>Your App - Home</title>
        <meta name="description" content="Overview of user details and files" />
        <link rel="icon" href="/favicon.ico" />
      </Head>



      <main>
        <Typography variant="h3" component="div" sx={{ mt: 4 }}>
          Welcome, {user.name}!
        </Typography>



        <div style={{marginTop:'1rem'}}>
        <YourDriveStatsCard folderStats={folderStats} folderStatsLoading={false}/>
        </div>
        <div style={{marginTop:'1rem'}}>
        <YourRecentFiles recentFiles = {recentFiles}  />
        </div>

        {/* {files.map((file) => (
          <Typography key={file.name} variant="body2" sx={{ mt: 1 }}>
            {file.name} - {file.size}
          </Typography>
        ))} */}
      </main>


    </Container>
  )
}


export default Home