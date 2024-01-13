import React, { useEffect, useState } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { expenseUrl } from "../../service/url";
import { NewServiceCall } from "../../service/config";
import { notifyWarning } from "../../components/toast";
import { useDispatch, useSelector } from 'react-redux';
import { selectData } from '../../Redux/features/login/loginSlicer.js'
import LoadingSpinner from "../../components/loader.tsx";
import DataNotFound from "../../components/dataNotFound.tsx";
import Moment from 'react-moment';
import { BrowserRouter as Router, Route, Routes, Link, Navigate, useNavigate } from 'react-router-dom';

export const HistoryScreen = () => {
    const loginStatus = useSelector(selectData);
    const user_id = loginStatus.items[0].empcode

    const [isLoading, setLoading] = useState(false)
    const [recentData, setRecentData] = useState([])
    const navigate = useNavigate();
    const navigateToDetails = (expenseID) => {
        navigate('/expenseDetails', { state: { data: expenseID } })
    }

    const getRecentSubmitted = async () => {
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: expenseUrl.initialUrl + expenseUrl.recentSubmitted,
            headers: {},
            params: { user_id: user_id }
        };
        setLoading(true)
        await NewServiceCall(config)
            .then((res) => {
                setLoading(false)
                if (res?.status === 200) {
                    setRecentData(res?.data?.result ? res?.data?.result : [])
                }
                else {
                    setRecentData([])
                    notifyWarning("Something went wrong!!")
                }
                console.log("recentSubmitted res>>>", res)
            })
            .catch((err) => {
                setLoading(false)
                setRecentData([])
                notifyWarning("Something went wrong!!")
                console.log("recentSubmitted reerrs>>>", err)
            })
    }
    useEffect(() => {
        getRecentSubmitted()
    }, [])
    return (
        <div className="textAlign-Start d-flex column moduleBorder">
            {isLoading ? <LoadingSpinner loading={isLoading} />
                :
                <>
                    <div className="mt-10px">
                        <span className="bold1Rem commonBlackcolor">Recent Submitted</span>
                    </div>
                    <div className="mt-10px mb-10px">
                        <span className="commonGraycolor light1Rem">Here is your recent submitted expense details</span>
                    </div>
                    {recentData.length === 0 || recentData.length === null ?
                        <DataNotFound /> :
                        <>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><span></span>Status</TableCell>
                                            <TableCell><span></span>Submit Date</TableCell>
                                            <TableCell align="center"><span className="commonBlackcolor">Topic</span></TableCell>
                                            <TableCell align="center"><span className="commonBlackcolor">Expense Type</span></TableCell>
                                            <TableCell align="center"><span className="commonBlackcolor">Amount</span></TableCell>
                                            <TableCell align="center"><span className="commonBlackcolor">Action</span></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {recentData.map((row: any, index) => (
                                            <TableRow
                                                key={row.id}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell align="left">
                                                    <div className="d-flex row alignItem-center draftCard justfyContent-center "
                                                        style={{ backgroundColor: row?.status === 'draft' ? '#DBEEFF' : row?.status === 'pending' ? '#FEF9C3' : row?.status === 'rejected' ? '#FEE2E2' : row.status === 'approved' ? '#DCFCE7' : "" }}

                                                    >
                                                        <div className={row?.status === "draft" ? "dotBlue" : row?.status === "approved" ? "dotGreen" : row?.status === "rejected" ? "dotRed" : row.status === "pending" ? "dotOrange" : "dotBlue"}></div>
                                                        <div className="light0_875Rem commonGraycolor p-8px">{row?.status}</div>
                                                    </div>
                                                </TableCell>                                                <TableCell component="th" scope="row">
                                                    <Moment format='DD MMM YYYY, HH:mm' className="commonGraycolor">{row?.created_at}</Moment>
                                                </TableCell>
                                                <TableCell align="center"><span className="commonGraycolor">{row?.description}</span></TableCell>
                                                <TableCell align="center"><span className="commonGraycolor">{row?.expense_type}</span></TableCell>
                                                <TableCell align="center"><span className="commonGraycolor">{row?.total_amount}</span></TableCell>
                                                <TableCell align="center"><span className="commonGraycolor txtstyle curser"
                                                onClick={() => navigateToDetails(row?.id)}
                                                >{"View details"}</span></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </>
                    }
                </>
            }
        </div>
    )
}