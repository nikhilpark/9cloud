"use client"
import React, { useState, useEffect } from 'react';
import { Button, Grid, InputAdornment, Select, TextField, Card } from '@mui/material';
import {
  AiOutlineDownload
} from 'react-icons/ai';
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import Swal from "sweetalert2"
import { fetchFilesFromS3, getSignedUrl, S3File,deleteFile,renameFile } from '@/helpers/s3helper';
import { getFileType, formatFileSize, getTimeDifference } from '@/helpers/helpers';
import { useRouter } from 'next/navigation'

import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';


const FileList = () => {
  const [files, setFiles] = useState<S3File[]>([]);
  const [openElem, setOpenElem] = React.useState<any>(null);

  const [selectedFile, setSelectedFile] = useState<null | S3File>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  const [filterType, setFilterType] = useState('all'); // 'all', 'pdf', 'word', 'excel', 'text', etc.
  const [menuOpen, setMenuOpen] = useState(false);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [runEffect,setRunEffect] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedFiles: Array<S3File> = await fetchFilesFromS3();
        setFiles(fetchedFiles);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    fetchData();
  }, [runEffect]);

  const handleFileClick = (file: S3File) => {
    setSelectedFile(file);
  };
const getFileName = (file:S3File) => {
  const fileName = file ? file.Key.split("/").pop() : ""
  return fileName

}
  const handleDownloadClick = async (key: string) => {
    try {

      // Generate a pre-signed URL for the S3 object
      console.log('download click');
      const signedUrl = await getSignedUrl(key);

      // Open the URL in a new tab to initiate the download
      window.open(signedUrl, '_blank');

    } catch (error) {
      console.error('Error generating pre-signed URL:', error);
    }
  };

  const handleDeleteClick =  async (key: string) => {
    console.log('delete click',key);
    await deleteFile(key);
    console.log('delete done')
    setRunEffect(v=>!v)
    router.refresh()
  }



  const filterFiles = () => {
    return files.filter((file) => {
      if (filterType === 'all') {
        return true;
      } else if (filterType === 'pdf') {
        return file.Key.toLowerCase().endsWith('.pdf');
      } else if (filterType === 'word') {
        return (
          file.Key.toLowerCase().endsWith('.doc') || file.Key.toLowerCase().endsWith('.docx')
        );
      } else if (filterType === 'excel') {
        return (
          file.Key.toLowerCase().endsWith('.xls') || file.Key.toLowerCase().endsWith('.xlsx')
        );
      } else if (filterType === 'text') {
        return file.Key.toLowerCase().endsWith('.txt');
      }
      // Add more conditions for other file types as needed
      return true;
    });
  };

  const sortFiles = (filesToSort) => {
    return filesToSort.sort((a, b) => {
      const nameA = a.Key.toUpperCase();
      const nameB = b.Key.toUpperCase();

      if (sortOrder === 'asc') {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });
  };
  const renderShortenedFileName = (fileName) => {
    if (fileName.length <= 20) {
      return fileName;
    } else {
      const displayedName = fileName.substring(0, 20);
      const remainingChars = fileName.length - 20;
      return (
        <span>
          {displayedName}
          <span style={{ float: 'right', color: 'gray' }}>{` +${remainingChars} chars`}</span>
        </span>
      );
    }
  };
  const getFileTypeIcon = (key: string) => {
    // Map file types to corresponding icons
    const extension = key.split('.').pop()
    const fileType = getFileType(extension)

    const iconMap: Record<string, React.ReactElement> = {
      "text": <img src="/icons/text.svg" alt="text" />,
      "video": <img src="/icons/video_color.svg" alt="video" height="90px" />,
      "document": <img src="/icons/document_color.svg" alt="document" height="90px" />,
      "image": <img src="/icons/image_color.svg" alt="document" height="90px" />,
      "executable": <img src="/icons/executable_color.svg" alt="document" height="90px" />,
      "default": <img src="/icons/document_color.svg" alt="document" height="90px" />
    };

    return iconMap[fileType] || iconMap.default;
  };
  const handleFileAction = (action: string, file: any) => {
    setSelectedFile(file)
    if (action == "rename") {
      // Extract the original filename and extension
      const originalFileName = getFileName(file);
      const originalPath = file.Key.substring(0, file.Key.lastIndexOf('/') + 1);

      const fileExtension = originalFileName.split('.').pop();
    
      // Open a SweetAlert modal for renaming the file
      Swal.fire({
        title: "Rename",
        input: "text",
        inputValue: originalFileName.replace(`.${fileExtension}`, ''), // Pre-fill the input field without the extension
        showCancelButton: true,
        confirmButtonText: "Rename",
        inputValidator: (value) => {
          // Validate the input value
          if (!value) {
            return "You need to write something!"; // Return an error message if the input is empty
          }
        }
      }).then(async(result) => {
        // Handle the result of the modal
        if (result.isConfirmed) {
          const newFileName = `${result.value.trim()}.${fileExtension}`; // Append the original extension
          const newKey = `${originalPath}${newFileName}`; // Combine the original path and the new filename to form the updated key
          await renameFile(file.Key,newKey)
          setRunEffect(v=>!v)
          router.refresh()
        }
      });
    }else if (action == "delete") {
      Swal.fire({
        title: "Confirm!",
        inputLabel: "Are you sure you want to delete this file?",
        showCancelButton: true,
        icon: 'warning'
      }).then(async (response) => {
        if (response.isConfirmed) {
          await handleDeleteClick(file?.Key)
        }
      })

    } else if (action == "info") {
      setInfoDialogOpen(true)

    } else {
      console.log("Invalid action: " + action)
    }
  }

  const InfoDialog = (props: any) => {
    const { selectedFile, onClose } = props;

    const fileName = selectedFile ? selectedFile.Key.split("/").pop() : ""
    console.log(fileName, "filename");
    return (<Dialog
      open={infoDialogOpen}
      onClose={() => {
        setInfoDialogOpen(false)
        setAnchorEl(null)
        setSelectedFile(null)
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '.6rem .4rem' }} ><CloseIcon style={{ cursor: 'pointer' }} onClick={() => {
        setInfoDialogOpen(false)
        setSelectedFile(null)
      }} /></div>
      <Divider />
      {selectedFile && <>
        <div style={{ width: '300px', height: '400px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '.4rem', marginTop: '1rem' }}>
          <div>
            <b>File Name : </b>{fileName}
          </div>
          <Divider />
          <div>
            <b>File Size :</b>  {formatFileSize(selectedFile.Size)}
          </div>
          <Divider />
          <div>
            <b>Last Modified :</b>  {new Date(selectedFile.LastModified).toISOString()}
          </div>
        </div>
      </>}


    </Dialog>)
  }

  return (
    <div>


      <Card style={{ padding: '1rem', borderRadius: '14px', margin: '1rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ fontWeight: '600' }}>Files:</div>




        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {sortFiles(filterFiles()).map((file: any, index: number) => {

            const fileName: string = file.Key.split('/').pop()


            return <Card style={{ background: 'rgba(255, 255, 255, 0.2)', height: '20vh', width: '18vh', display: 'flex', flexDirection: 'column' }} key={index}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '18vh' }}>
                {getFileTypeIcon(file.Key)}
              </div>
              <div >
                <p style={{
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  width: '100%', // Set a width to ensure animation works

                }}>
                  {fileName.slice(0, 20)} {fileName.length > 20 ? "...." : ""}
                </p>

              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0 .4rem', alignItems: 'center' }} >
                <div className='clickable'>
                  <div onClick={(event: any) => {
                    setOpenElem(index);

                    setAnchorEl(event.currentTarget)
                  }}>
                    <HiOutlineDotsHorizontal size="24" />

                  </div>
                  <Menu
                    id="basic-menu"

                    anchorEl={anchorEl}
                    open={openElem === index}
                    onClose={() => { setAnchorEl(null)
                    setOpenElem(null);
                    }}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}

                    MenuListProps={{
                      'aria-labelledby': 'basic-button',
                    }}
                  >
                    <MenuList>
                      <MenuItem onClick={() => {
                        handleFileAction("rename", file)
                        setAnchorEl(null)
                        setOpenElem(null)

                      }}>
                        <ListItemIcon>
                          <DriveFileRenameOutlineIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Rename</ListItemText>
                      </MenuItem>
                      <MenuItem onClick={() => {
                        handleFileAction("delete", file)
                        setAnchorEl(null)
                        setOpenElem(null)


                      }}>
                        <ListItemIcon>
                          <DeleteIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Delete</ListItemText>

                      </MenuItem>
                      <MenuItem onClick={() => {
                        handleFileAction("info", file)
                        setAnchorEl(null)
                        setOpenElem(null)

                      }} >
                        <ListItemIcon>
                          <InfoIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Info</ListItemText>
                      </MenuItem>
                      {/* <Divider /> */}

                    </MenuList>
                  </Menu>
                </div>
                <div className='clickable'>
                  <AiOutlineDownload size="24" onClick={() => handleDownloadClick(file.Key)} />
                </div>

              </div>
            </Card>
          })}
        </div>
        {InfoDialog({ selectedFile, onClose: () => setSelectedFile(null) })}
        {/* <Grid style={{margin:'2vh 0'}} container spacing={2}>
        <Grid item xs={6} sm={4}>
          <TextField
            fullWidth
            label="Search files"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AiOutlineFile />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Select
            fullWidth
            label="Filter by type"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="pdf">PDF</MenuItem>
            <MenuItem value="word">Word</MenuItem>
            <MenuItem value="excel">Excel</MenuItem>
            <MenuItem value="text">Text</MenuItem>
            {/* Add more options for other file types as needed */}
        {/* </Select>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? 'Sort A-Z' : 'Sort Z-A'}
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {sortFiles(filterFiles()).map((file, index) => (
          <Grid item xs={6} sm={4} md={3} key={index} onClick={() => handleFileClick(file)}>
            <div style={{ cursor: 'pointer' }}>
              <div style={{ marginBottom: '8px', textAlign: 'center' }}>
                {renderFileIcon(file.Key)}
              </div>
              <p style={{ textAlign: 'center' }}>{file.Key}</p>
            </div>
          </Grid>
        ))}
      </Grid>

      {selectedFile && (
        <div>
          <p>Selected File: {selectedFile.Key}</p>
          <p>Size: {selectedFile.Size} bytes</p>
          <p>Last Modified: {selectedFile.LastModified.toString()}</p>
          <p>ETag: {selectedFile.ETag}</p>
          <Button onClick={() => handleDownloadClick(selectedFile)}>Download</Button>
        </div>
      )} */}
      </Card>
    </div>
  );
};

export default FileList;
