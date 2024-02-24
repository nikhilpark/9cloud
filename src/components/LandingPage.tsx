"use client"
import React from 'react';
import Head from 'next/head';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { useRouter } from 'next/navigation';

const LandingPage = () => {
  const router = useRouter()

  return (
    <Container>
      <Head>
        <title>9Cloud - Securely Store Your Files</title>
        <meta name="description" content="9Cloud - A web app to securely store your files on the cloud" />
        <link rel="icon" href="/favicon.ico" />
      </Head>


      <main>
        <Typography variant="h3" component="div" sx={{ mt: 4 }}>
          Welcome to 9Cloud
        </Typography>

        <Typography variant="body1" sx={{ mt: 2 }}>
          9Cloud is a secure web app designed to help you easily and securely store your files on the cloud.
        </Typography>

        <Typography variant="body1" sx={{ mt: 2 }}>
          Key Features:
        </Typography>

        <ul>
          <li>Securely store and access your files from anywhere.</li>
          <li>Encrypted file storage for enhanced security.</li>
          <li>Easy file management with intuitive user interface.</li>
        </ul>

        <Typography variant="body1" sx={{ mt: 2 }}>
          Get started today and experience the convenience of 9Cloud!
        </Typography>

        <Button onClick={() => { router.push('/api/auth/login') }} variant="contained" color="primary" sx={{ mt: 3 }}>
          Get started!
        </Button>
      </main>

   
    </Container>
  );
};

export default LandingPage;
