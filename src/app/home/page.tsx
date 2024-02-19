"use client"
import React,{useEffect,useState} from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import NextLink from 'next/link';
import axios from 'axios'
import {RegisterLink, LoginLink,LogoutLink} from "@kinde-oss/kinde-auth-nextjs/components";


export default   function Home() {




    useEffect( ()=>{

            axios.post("/api/auth/updateUser",{})

        


       

    },[])

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          Material UI - Next.js App Router example in TypeScript
        </Typography>
        <Link href="/about" color="secondary" component={NextLink}>
          Go to the about page
        </Link>
        
      </Box>

<LogoutLink>Log out</LogoutLink>

    </Container>
  );
}