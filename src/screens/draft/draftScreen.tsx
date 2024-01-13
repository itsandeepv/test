import React, { useEffect, useState } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import pen from '../../assets/images/pen.svg'
import uploadImg from '../../assets/images/smallUpload.svg'
import './draftScreenStyle.css'

import PaginationItem from '@mui/material/PaginationItem';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { BrowserRouter as Router, Route, Routes, Link, Navigate, useNavigate } from 'react-router-dom';
import { expenseUrl } from "../../service/url";
import axios from "axios";
import LoadingSpinner from "../../components/loader.tsx";
import SearchFound from "../../components/searchFound.tsx";

import { useDispatch, useSelector } from 'react-redux';
import { selectData } from '../../Redux/features/login/loginSlicer.js'

import { NewServiceCall } from '../../service/config.js';
import { admin, initUrl } from '../../service/url.js'
import { toastContainer, notifySuccess, notifyWarning, notifyError } from '../../components/toast.js';
import DataNotFound from "../../components/dataNotFound.tsx";

const draftExpenseDetails = `Here are the details of your draft expenses. You can edit your information by clicking on the "edit" button and submit the expense by clicking the "submit" button.`

export const DraftScreen = () => {
    const [draftData, setDraftData] = useState<any>([])
    const [loading, setLoading] = useState(true)
    const loginStatus = useSelector(selectData);
    const user_id = loginStatus.items[0].empcode
    const getDraftApi = async () => {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: expenseUrl.initialUrl + expenseUrl.expenseDraftList,
            headers: {},
            params: { user_id: user_id }
            // params: { user_id: '123' }
        };
        setLoading(true)
        await NewServiceCall(config)
            .then((res) => {
                setLoading(false)
                if (res.status === 200) {
                    setDraftData(res?.data?.result ? res?.data?.result : [])
                }
                else {
                    setDraftData([])
                    notifyWarning("Something went wrong!!")
                }
                console.log("DraftScreen res>>>", res)
            })
            .catch((err) => {
                setLoading(false)
                setDraftData([])
                notifyWarning("Something went wrong!!")
            })
    }
    useEffect(() => {
        getDraftApi()
    }, [])
    const navigate = useNavigate();
    const navigateToDetails = (expenseID) => {
        navigate('/expenseDetails', { state: { data: expenseID } })
    }

    return (
        <div>
            <LoadingSpinner loading={loading} />
            <div className='mt-20px'>
                {
                    draftData.length !== 0 &&
                    <div className='m-10px textAlign-Start row mt-30px m-10px mb-1_5rem'>
                        <span className="bold1Rem commonBlackcolor">Draft Expense Details - &nbsp;</span><span className="commonGraycolor light1Rem">{draftExpenseDetails}</span>
                    </div>
                }
                {
                    draftData.length !== 0 ?
                        <div>
                            <TableContainer component={Paper}>
                                <Table
                                    sx={{ minWidth: 650 }}
                                    aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center"><div className="bold0_875Rem commonBlackcolor">Status</div></TableCell>
                                            <TableCell align="center"><div className="bold0_875Rem commonBlackcolor">Start Date/End Date</div></TableCell>
                                            <TableCell align="center"><div className="bold0_875Rem commonBlackcolor">Expense Type</div></TableCell>
                                            <TableCell align="center"><div className="bold0_875Rem commonBlackcolor">Expense Description</div></TableCell>
                                            <TableCell align="center"><div className="bold0_875Rem commonBlackcolor">Amount</div></TableCell>
                                            <TableCell align="center"><div className="bold0_875Rem commonBlackcolor">Action</div></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {draftData.map((item) => (
                                            <TableRow
                                                key={item?.id}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell align="left">
                                                    <div className="d-flex row alignItem-center draftCard justfyContent-center ">
                                                        <div className="dotBlue"></div>
                                                        <div className="light0_875Rem commonGraycolor p-8px">{item?.status.charAt(0).toUpperCase() + item?.status.slice(1)}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell component="th" scope="row" align="center" >
                                                    <div className="light0_813Rem commonGraycolor">{item?.start_date}/{item?.end_date}</div>
                                                </TableCell>
                                                <TableCell align="center" ><div className="light0_813Rem commonGraycolor">{item.expense_type}</div></TableCell>
                                                <TableCell align="center"><div className="light0_813Rem commonGraycolor">{item?.description}</div></TableCell>
                                                <TableCell align="center"><div className="light0_813Rem commonGraycolor">{item?.total_amount}</div></TableCell>
                                                <TableCell align="center">
                                                    <div className="d-flex row justfyContent-center alignItem-center curser">
                                                        <div className="d-flex row justfyContent-center alignItem-center" onClick={() => navigateToDetails(item?.id)}>
                                                            {/* <img src={pen} className="actionButton" /> */}
                                                            <span className="commonGraycolor bold0_875Rem txtstyle">View detail</span>
                                                        </div>
                                                        {/* <div className="d-flex row justfyContent-center alignItem-center">
                                                            <img src={uploadImg} className="actionButton" />
                                                            <span className="commonGraycolor bold0_875Rem">Submit</span>
                                                        </div> */}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                        :
                        !loading &&
                        <DataNotFound />
                }
                {
                    draftData.length !== 0 &&
                    <div className="d-flex row justfyContent-end mt-30px mb-30px">
                        {/* <Stack spacing={5}>
                            <Pagination count={10} variant="outlined" shape="rounded" showFirstButton showLastButton
                            // page={page} onChange={handleChange}
                            />
                        </Stack> */}
                    </div>
                }
            </div>
            {toastContainer()}
        </div>
    )
}