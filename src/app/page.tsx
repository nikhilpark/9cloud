"use client"
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
import Home from '@/components/Home'
import LandingPage from '@/components/LandingPage'


export default function HomePage() {
  const { user, error, isLoading } = useUser();
  const [users,setUsers] = React.useState()

  async function getUsers() {
    const user = JSON.parse(await getUserProfile())
    console.log(user,18)
    setUsers(user)
  }
    React.useEffect(()=>{
      getUsers()
  
  },[])

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
if(user) return <Home user={user}/>

      return <LandingPage/>
}