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
import { expenseUrl } from "../../service/url.js";
import axios from "axios";
import { useDispatch, useSelector } from 'react-redux';
import { selectData } from '../../Redux/features/login/loginSlicer.js'
import { toastContainer, notifySuccess, notifyWarning, notifyError } from '../../components/toast.js';
import DataNotFound from "../../components/dataNotFound.tsx";
const draftExpenseDetails = `Here are your submitted expense details. You can check the process by clicking on the "View Details" button.`

export const ApprovalScreen = () => {
    const [approveData, setApproveData] = useState<any>([])
    const [loading, setLoading] = useState(true)
    const loginStatus = useSelector(selectData);
    const user_id = loginStatus.items[0]?.empcode
    const getApproveList = async () => {
        const url = expenseUrl.initialUrl + expenseUrl.expenseApproveList
        try {
            setLoading(true)
            const response = await axios.get(url, {
                // params: {
                //     user_id: '123'
                // }
                params: { user_id: user_id }
            });
            const resultData = response?.data?.result
            console.log('approveapiresult:::', resultData)
            setApproveData(resultData)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.error('Error', error);
            notifyError("Something went wrong!!")
        }
    }
    const navigate = useNavigate();

    const navigateToDetails = (expenseID) => {
        navigate('/expenseDetails', { state: { data: expenseID} })
    }
    useEffect(() => {
        getApproveList()
    }, [])
    return (
        <div>
            {loading ?
                <LoadingSpinner loading={loading} />
                :

                <div className='mt-20px'>
                    {
                        approveData.length !== 0 &&
                        <div className='d-flex m-10px textAlign-Start row mt-30px m-10px mb-1_5rem'>
                            <span className="bold1Rem commonBlackcolor">Pending Expense Details - &nbsp;</span> <span className="commonGraycolor light1Rem">{draftExpenseDetails}</span>
                        </div>
                    }
                    {(approveData.length === 0 || approveData.length == null) && !loading ?
                        <DataNotFound />
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
                                            <TableCell align="center"><div className="bold0_875Rem commonBlackcolor">Approved Amount</div></TableCell>
                                            <TableCell align="center"><div className="bold0_875Rem commonBlackcolor">Action</div></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {approveData.map((item, id) => (
                                            <TableRow
                                                key={item?.id}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell align="left">
                                                    <div className="d-flex row alignItem-center approvalCard justfyContent-center ">
                                                        <div className="dotGreen"></div>
                                                        <div className="light0_875Rem commonGraycolor p-5px">{item?.status.charAt(0).toUpperCase() + item?.status.slice(1)}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell component="th" scope="row" align="center" >
                                                    <div className="regular-13px commonGraycolor">{item?.start_date}/{item?.end_date}</div>
                                                </TableCell>
                                                <TableCell align="center" ><div className="regular-13px commonGraycolor">{item?.expense_type ? item?.expense_type : "--"}</div></TableCell>
                                                <TableCell align="center"><div className="regular-13px commonGraycolor">{item?.description ? item?.description : "--"}</div></TableCell>
                                                <TableCell align="center"><div className="regular-13px commonGraycolor">{item?.approved_amount ? item?.approved_amount : "--"}</div></TableCell>
                                                <TableCell align="center">
                                                    <div className="d-flex row justfyContent-center alignItem-center">
                                                        <span className="commonGraycolor bold0_875Rem txtstyle curser"
                                                            onClick={() => navigateToDetails(item?.id)}
                                                        >View Details</span>
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
                        approveData.length !== 0 &&
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
            {toastContainer()}
        </div>
    )
}