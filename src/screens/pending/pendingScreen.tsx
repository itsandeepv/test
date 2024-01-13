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
// import './draftScreenStyle.css'

import PaginationItem from '@mui/material/PaginationItem';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { BrowserRouter as Router, Route, Routes, Link, Navigate, useNavigate } from 'react-router-dom';
import LoadingSpinner from "../../components/loader.tsx";
import SearchFound from "../../components/searchFound.tsx";
import axios from "axios";
import { expenseUrl } from "../../service/url.js";
import { useDispatch, useSelector } from 'react-redux';
import { selectData } from '../../Redux/features/login/loginSlicer.js'
import { toastContainer, notifySuccess, notifyWarning, notifyError } from '../../components/toast.js';
const draftExpenseDetails = `Here are your submitted expense details. You can check the process by clicking on the "View Details" button.`


export const PendingScreen = () => {
    const [pendingData, setPendingdata] = useState<any>([])
    const [loading, setLoading] = useState(true)
    const loginStatus = useSelector(selectData);
    const user_id = loginStatus.items[0]?.empcode
    useEffect(() => {
        pendingApi()
    }, [])

    const pendingApi = async () => {
        const url = expenseUrl.initialUrl + expenseUrl.expensePendingList
        try {
            setLoading(true)
            const response = await axios.get(url, {
                // params: {
                //     user_id: '123'
                // }
                params: { user_id: user_id }
            });
            const resultData = response?.data?.result
            console.log('pendingapiresult:::', resultData)
            setPendingdata(resultData)
            setLoading(false)
        } catch (error) {
            console.error('Error', error);
            setLoading(false)
        }
    }

    const navigate = useNavigate();
    const navigateToDetails = (expenseID) => {
        navigate('/expenseDetails', { state: { data: expenseID } })
    }

    return (
        <div>
            {loading ? <div className="mainContainer"><LoadingSpinner loading={loading} /></div> :
                <div className='mt-20px'>
                    {
                        pendingData.length !== 0 &&
                        <div className='d-flex m-10px textAlign-Start row mt-30px m-10px mb-1_5rem'>
                            <span className="bold1Rem commonBlackcolor">Pending Expense Details - &nbsp;</span> <span className="commonGraycolor light1Rem">{draftExpenseDetails}</span>
                        </div>
                    }
                    {pendingData.length == 0 || pendingData.length == null ?
                        <SearchFound />
                        :
                        <div>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
                                        {pendingData.map((item, index) => (
                                            <TableRow
                                                key={item?.id}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell align="left">
                                                    <div className="d-flex row alignItem-center pendingCard justfyContent-center ">
                                                        <div className="dotOrange"></div>
                                                        <div className="light0_875Rem commonGraycolor p-8px">{item?.status.charAt(0).toUpperCase() + item?.status.slice(1)}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell component="th" scope="row" align="center" >
                                                    <div className="regular-13px commonGraycolor">{item?.start_date}/{item?.end_date}</div>
                                                </TableCell>
                                                <TableCell align="center" ><div className="regular-13px commonGraycolor">{item?.expense_type}</div></TableCell>
                                                <TableCell align="center"><div className="regular-13px commonGraycolor">{item?.description}</div></TableCell>
                                                <TableCell align="center"><div className="regular-13px commonGraycolor">{item?.total_amount}</div></TableCell>
                                                <TableCell align="center">
                                                    <div className="d-flex row justfyContent-center alignItem-center">
                                                        <div className="d-flex row justfyContent-center alignItem-center" onClick={() => navigateToDetails(item?.id)}>
                                                            <span className="commonGraycolor bold0_875Rem txtstyle curser">View Details</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    }
                    {
                        pendingData.length !== 0 &&
                        <div className="d-flex row justfyContent-end mt-30px mb-30px">
                            {/* <Stack spacing={5}>
                                <Pagination count={10} variant="outlined" shape="rounded" showFirstButton showLastButton
                                // className={classes.root}
                                // page={page} onChange={handleChange}
                                />
                            </Stack> */}
                        </div>
                    }
                </div>
            }
        </div>
    )
}