
import * as React from 'react';
import Head from 'next/head';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import NextLink from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';
import {getUserProfile} from '@/actions/mongoActions';
import { getSession } from '@auth0/nextjs-auth0';
import Home from '@/components/Home'
import LandingPage from '@/components/LandingPage'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { getFolderStats } from '@/helpers/s3helper';
import { fetchRecentFilesFromS3 } from '@/helpers/s3helper';



export default async function HomePage() {

  const  session = await getSession()
console.log(session,"24")
if(!session){ 
return  <LandingPage/>
} else {

  // const stats = await getFolderStats()
  
    const [stats,recentFiles] = await Promise.all( [getFolderStats(),fetchRecentFilesFromS3(5)]) 
      // console.log(recentFiles,"recentFiles")

      return <Home user={session.user} folderStats={stats} recentFiles={recentFiles} />
  }

 

 // const { user, error, isLoading } = useUser();

  // async function getUsers() {
  //   const user = JSON.parse(await getUserProfile())
  //   console.log(user,18)
  //   setUsers(user)
  // }
  //   React.useEffect(()=>{
  //     getUsers()
  
  // },[])

//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>{error.message}</div>;
// if(user) return <Home user={user}/>

//       return <LandingPage/>
// }
}

