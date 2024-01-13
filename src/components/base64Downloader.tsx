import React, { useState } from "react";
// import Base64Downloader from 'react-base64-downloader';
import { triggerBase64Download } from 'react-base64-downloader';

interface BaseImageDownloader {
    title: string;
    base64: any
}
export const BaseImageDownloader: React.FC<BaseImageDownloader> = ({ title, base64 }) => {

    return (
        <div className="d-flex curser justfyContent-center">
            <div className="a">
                {/* <Base64Downloader base64={base64} downloadName="1x1_red_pixel">
                    {title}
                </Base64Downloader> */}
                <span className="txtstyle " onClick={() => triggerBase64Download(base64, 'image')}>
                    {title}
                </span>
            </div>
        </div>
    );
};