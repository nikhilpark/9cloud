"use client"
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';

const AppB = () => {
  const router = useRouter()
  const { user, error, isLoading } = useUser();
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography onClick={() => { router.push('/') }} variant="h6" component="div" sx={{ flexGrow: 1, cursor: "pointer" }}>
            9Cloud
          </Typography>
          {isLoading?<CircularProgress/>:user ? <div>
            <Button color="inherit" onClick={() => { router.push('/api/auth/logout') }} >Logout</Button>

          </div> : <Button color="inherit" onClick={() => { router.push('/api/auth/login') }} >Login</Button>
          }
        </Toolbar>
      </AppBar>



    </div>
  );
};

export default AppB
