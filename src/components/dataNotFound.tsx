import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { BlueCommonButton } from "./button.tsx";
import noData from '../assets/images/noData.svg';
import './searchFound.css'


export default function DataNotFound() {
    const [showSearch, setshowSearch] = useState(false)
    const navigate = useNavigate();

    return (
        <div className='d-flex column searchbg'>
            <img src={noData} className="bgimg" />
            {/* <span className="bold1_26Rem commonBlackcolor mt-20px">{showSearch ? 'Ups!... no results found' : 'Sorry, page not found'}</span>
            <span className="commonGraycolor light0_875Rem mt-10px">{showSearch ? 'Please try another search' : 'Please try again later'}</span> */}
            {/* <div className="mt-30px">
                <BlueCommonButton
                    title="Go back to home page"
                    buttonClick={(e: any) => navigate('./home')}
                />
            </div> */}
        </div>
    );
}