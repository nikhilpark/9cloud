"use client"
import React from 'react';
import Card from '@mui/material/Card';
import Icon from '@mui/material/Icon';
import Link from 'next/link';
import { RiFileTextFill, RiImageFill, RiVideoFill, RiFileFill } from 'react-icons/ri'; // Import icons as needed
import dynamic from 'next/dynamic'; // Import dynamic from 'next/dynamic' to dynamically import ReactApexChart
// import ReactApexChart from 'react-apexcharts';
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

import { getFileType, formatFileSize } from '@/helpers/helpers';

const getFileTypeIcon = (extension: any) => {
    // Map file types to corresponding icons

    const fileType = getFileType(extension)

    const iconMap: Record<string, React.ReactElement> = {
        "text": <Icon ><img src="/icons/text.svg" alt="text" /></Icon>,
        "image": <RiImageFill />,
        "video": <img src="/icons/video_dark.svg" alt="video" height="40px" />,
        "document": <img src="/icons/document_dark.svg" alt="document" height="40px" />,
        "default": <RiFileFill />,
    };

    return iconMap[fileType] || iconMap.default;
};

const YourDriveStatsCard = ({ folderStats, folderStatsLoading }: any) => {
    // Extract data for the pie chart





    const pieChartData = {
        labels: ['Used Storage', 'Remaining Storage'],
        series: [30000000, 1000000000],
    };


    return (
        <div style={{ marginTop: '1rem' }}>
            <Card style={{ padding: '1rem', borderRadius: '14px' }}>
                <div style={{ fontWeight: '600' }}>Drive stats:</div>
                {/* <div>
                    Storage used - 100 / 1GB
                    <Link href="/upload">View files</Link>
                </div> */}
                {!folderStatsLoading ? (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '2rem', alignItems: 'center' }} >
                            {/* Display Pie Chart */}
                        <ReactApexChart
                                options={{
                                    labels: pieChartData.labels,
                                    colors: ['#85C1E9', '#154360'],
                                    legend: {
                                        show: false,
                                        labels: {
                                            colors: ["white", "white"],
                                        },
                                    },
                                    plotOptions: {
                                        pie: {
                                            dataLabels: {
                                                offset: -6
                                            }
                                        }
                                    },
                                    stroke: {
                                        show: false
                                    },
                                    tooltip: {
                                        enabled: false
                                    },

                                    dataLabels: {
                                        style: {
                                            colors: ["black", "white"],
                                        },
                                        dropShadow: {
                                            enabled: false,
                                            top: 2,
                                            left: 0,
                                            blur: 1,
                                            color: 'white',
                                            opacity: .4
                                        },
                                        // formatter(val: number, opts) {
                                        //     const name = opts.w.globals.labels[opts.seriesIndex]
                                        //     const data = opts.w.globals.series[opts.seriesIndex]
                                        //     return [name, formatFileSize(data)]
                                        // }
                                    }

                                }}
                                type="pie" width={"500"}
                                height={"500"}
                                series={pieChartData.series}
                            />


                            <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                                {Object.keys(folderStats.folderDetails).map((key) => {
                                    const val = folderStats.folderDetails[key];

                                    const percentage = (val.sizeInBytes / folderStats.totalSizeInBytes) * 100;
                                    console.log(val.sizeInBytes, percentage, 98)
                                    return (
                                        <div key={key} >
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                {getFileTypeIcon(key)}  <span style={{ fontSize: '1rem', marginLeft: '10px' }}><Link href={`/files?fileType=${key}`} >{getFileType(key).toUpperCase()}S</Link> </span> <span style={{ fontSize: '1rem', marginLeft: '4px' }}>({val.count})</span>
                                            </div>
                                            {/* Display progress bar for each file type */}
                                            <div style={{ display: 'flex', width: '400px' }}>
                                                <div
                                                    style={{
                                                        width: `${percentage}%`,
                                                        height: '14px',
                                                        backgroundColor: '#85C1E9',
                                                        marginTop: '5px',


                                                        borderRadius: '4px'
                                                    }}
                                                ></div>
                                                <div
                                                    style={{
                                                        width: `${100 - percentage}%`,
                                                        height: '14px',
                                                        backgroundColor: '#154360',
                                                        borderRadius: '4px',

                                                        marginTop: '5px',

                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div>
                            {/* Display File Type Details */}

                        </div>
                    </div>
                ) : (
                    <></>
                )}
            </Card>
        </div>
    );
};

export default YourDriveStatsCard;
