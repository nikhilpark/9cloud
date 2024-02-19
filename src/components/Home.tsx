
import React from 'react';
import Head from 'next/head';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

const Home = ({user}) => {
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

        <Typography variant="body1" sx={{ mt: 2 }}>
          Subscription Tier: {user.subscription}
        </Typography>

        <Typography variant="h5" component="div" sx={{ mt: 3 }}>
          Overview of Files:
        </Typography>

        {/* {files.map((file) => (
          <Typography key={file.name} variant="body2" sx={{ mt: 1 }}>
            {file.name} - {file.size}
          </Typography>
        ))} */}
      </main>

      <footer>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 5 }}>
          © {new Date().getFullYear()} Your Company Name
        </Typography>
      </footer>
    </Container>
  )}
  export default Home