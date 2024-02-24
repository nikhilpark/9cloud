
"use server"
import Upload from "@/components/Upload"
import FileList from "@/components/FileList"
import { useUser } from '@auth0/nextjs-auth0/client';
import Container from '@mui/material/Container'
import Head from 'next/head'
export default async function Page() {
   

    return (
        <Container>
        <Head>
          <title>Your App - Home</title>
          <meta name="description" content="Overview of user details and files" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main>
        {/* <Upload /> */}
            <FileList/>
        </main>
          
        </Container>
    )
}