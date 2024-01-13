import React, { useEffect, useState } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import './queryScreen.css'
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import send from '../../assets/images/send.svg'
import { expenseUrl } from "../../service/url";
import axios from "axios";
import LoadingSpinner from "../../components/loader.tsx";
import SearchFound from "../../components/searchFound.tsx";
import DataNotFound from "../../components/dataNotFound.tsx";
import { toastContainer, notifyWarning, notifySuccess, notifyError } from '../../components/toast';
import { initUrl, expenseQuery } from '../../service/url.js'
import { ServiceCall, NewServiceCall } from '../../service/config.js';
import Moment from 'react-moment';
import { selectData } from '../../Redux/features/login/loginSlicer.js'
import { useDispatch, useSelector } from 'react-redux';
const draftExpenseDetails = `Here are your submitted expense details. You can check the process by clicking on the "View Details" button.`


export const QueryScreen = () => {
    const [loading, setLoading] = useState(true)
    const [queryView, setOpenQueryView] = useState<any>()
    const [queryData, setQueryData] = useState<any>([])
    const [queryDataDetails, setQueryDataDetails] = useState<any>([])
    const viewQuery = (id: any, data) => {
        console.log("viewQuery called with ", id)
        if (id === queryView) {
            setOpenQueryView(undefined)
        }
        else {
            setOpenQueryView(id)
            getQueryTicketDetails(data.expense_id)
        }
    }
    const loginStatus = useSelector(selectData);

    const getQueryTicketDetails = async (expenseID) => {
        console.log("getQueryTicketDetails called..")
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: initUrl + expenseQuery.getQueryDetails,
            headers: {},
            params: { expense_id: expenseID }
        };
        setLoading(true)
        await NewServiceCall(config)
            .then((res) => {
                setLoading(false)
                if (res.status === 200) {
                    setQueryDataDetails(res?.data?.result ? res?.data?.result : [])
                    // setSearchData(res?.data?.result ? res?.data?.result : [])
                }
                else {
                    setQueryDataDetails([])
                    notifyError("Something went wrong!")
                }
                console.log("getgetadminEmployeeListGrade res>>>", res?.data?.result)
            })
            .catch((err) => {
                setLoading(false)
                notifyError("Something went wrong!")
                setQueryDataDetails([])
                console.log("getadminEmployeeList reerrs>>>", err)
            })
    }
    const getTicketQuery = async () => {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: initUrl + expenseQuery.getQueryList,
            headers: {},
            params: { user_id: loginStatus.items[0].empcode }
        };
        setLoading(true)
        await NewServiceCall(config)
            .then((res) => {
                setLoading(false)
                if (res.status === 200) {
                    setQueryData(res?.data?.result ? res?.data?.result : [])
                    // setSearchData(res?.data?.result ? res?.data?.result : [])
                }
                else {
                    setQueryData([])
                    notifyError("Something went wrong!")
                }
                // console.log("getgetadminEmployeeListGrade res>>>", res)
            })
            .catch((err) => {
                setLoading(false)
                notifyError("Something went wrong!")
                setQueryData([])
                console.log("getadminEmployeeList reerrs>>>", err)
            })
    }

    useEffect(() => {
        getTicketQuery()
    }, [])

    console.log("queryData>>>", queryData)
    const [queryText, setUpdatedQuery] = useState("")
    const onUpdateQuery = (query: any) => {
        setUpdatedQuery(query.target.value)
    }

    const raiseQuery = async (expense_id, query_id) => {
        if (queryText !== "") {
            setLoading(true)
            const url = initUrl + expenseQuery.createQuery
            const formData = new URLSearchParams();
            formData.append('expense_id', expense_id);
            formData.append('query_id', query_id);
            formData.append('sender_id', loginStatus.items[0].empcode);
            formData.append('query_text', queryText);
            await ServiceCall(url, formData, false)
                .then((res) => {
                    console.log("res>>", res)
                    if (res.responseCode === 200) {
                        notifySuccess(res?.message)
                        getQueryTicketDetails(expense_id)
                        setUpdatedQuery('')
                    }
                    else {
                        notifyError(res?.message)
                        setUpdatedQuery('')
                    }
                    setLoading(false)
                })
                .catch((err) => {
                    setLoading(false)
                    setUpdatedQuery('')
                    notifyError("Something went wrong!!")
                    console.log("createQuery err>>", err)
                })
        }
        else {
            notifyError("Write a query")
        }
    }
    console.log("queryView>>", queryView)
    console.log("queryDataDetails>>", queryDataDetails?.tickets)
    return (
        <div>
            <LoadingSpinner loading={loading} />
            <div className='mt-20px'>
                {/* {
                    queryData.length === 0 && loading === false &&
                    <div className='d-flex m-10px textAlign-Start row mt-30px m-10px mb-1_5rem'>
                        <span className="bold1Rem commonBlackcolor">Pending Expense Details - &nbsp;</span><span className="commonGraycolor light1Rem">{draftExpenseDetails}</span>
                    </div>
                } */}
                {queryData.length === 0 && loading === false ?
                    <DataNotFound />
                    :
                    <div>
                        <div>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center"><div className="bold0_875Rem commonBlackcolor">Ticket #</div></TableCell>
                                            <TableCell align="center"><div className="bold0_875Rem commonBlackcolor">Topic</div></TableCell>
                                            <TableCell align="center"><div className="bold0_875Rem commonBlackcolor">No of Queries</div></TableCell>
                                            <TableCell align="center"><div className="bold0_875Rem commonBlackcolor">Request Status</div></TableCell>
                                            <TableCell align="center"><div className="bold0_875Rem commonBlackcolor">Last Updated</div></TableCell>
                                            <TableCell align="center"><div className="bold0_875Rem commonBlackcolor">Action</div></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {queryData.map((item, index) => (
                                            <>
                                                <TableRow
                                                    key={item?.id}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell align="center">
                                                        <div className="regular-13px commonGraycolor">{item?.id}</div>
                                                    </TableCell>
                                                    <TableCell component="th" scope="row" align="center" >
                                                        <div className="regular-13px commonGraycolor">{item?.query}</div>
                                                    </TableCell>
                                                    <TableCell align="center" ><div className="regular-13px commonGraycolor noOfQuery">{item?.expense_id}</div></TableCell>
                                                    <TableCell align="center">
                                                        <div className="regular-13px commonGraycolor">
                                                            <div className={`d-flex row alignItem-center justfyContent-center ${item?.status === "open" ? "approvalCard" : "rejectCard"} `}>
                                                                <div className={item?.status === "open" ? "dotGreen" : "dotRed"}></div>
                                                                <div className="light0_875Rem commonGraycolor p-8px">{item?.status}</div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell align="center"><div className="regular-13px commonGraycolor">{item?.expense?.end_date}</div></TableCell>
                                                    <TableCell align="center">
                                                        <div className="d-flex row justfyContent-center alignItem-center">
                                                            <div className="d-flex row justfyContent-center alignItem-center" onClick={() => viewQuery(index, item)}>
                                                                <span className="commonGraycolor bold0_875Rem txtstyle curser">{queryView === index ? 'Close Query' : 'View Query'}</span>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    {
                                                        queryView === index &&
                                                        <>
                                                            {
                                                                <TableCell align="center" colSpan={6}>
                                                                    {
                                                                        queryDataDetails.length !== 0 ?
                                                                            queryDataDetails?.tickets.map((tick, id) =>
                                                                                <>
                                                                                    <div className="d-flex space-between ">
                                                                                        <div>
                                                                                            <span className="bold0_875Rem darkBlack">Query : {tick?.query},</span>
                                                                                            <span className="bold0_875Rem ml-10px light0_875Rem">Sender : {tick?.sender_id}</span>
                                                                                        </div>
                                                                                        <span className="light0_875Rem"><Moment format='DD MMM, HH:mm'>{item?.updated_at}</Moment></span>
                                                                                    </div>
                                                                                    {
                                                                                        tick?.replies.map((repl, id) =>
                                                                                            <div className="d-flex textAlign-Start query">
                                                                                                <span className="light0_65Rem commonBlackcolor ">{repl?.query}</span>
                                                                                            </div>
                                                                                        )
                                                                                    }

                                                                                </>
                                                                            )
                                                                            :
                                                                            "Data not found"
                                                                    }
                                                                    {
                                                                        queryDataDetails.length !== 0 && item.status === "open" ?
                                                                            queryDataDetails?.tickets.map((tick, id, array) =>
                                                                                id === array.length - 1 ? (
                                                                                    <div className="d-flex p-10px">
                                                                                        <TextField
                                                                                            fullWidth
                                                                                            multiline
                                                                                            autoComplete="off"
                                                                                            variant="outlined"
                                                                                            placeholder="Write your message here"
                                                                                            className="bgwhite"
                                                                                            InputProps={{
                                                                                                endAdornment: (
                                                                                                    <InputAdornment position="start" className="curser" onClick={() => raiseQuery(tick.expense_id, tick.id)}>
                                                                                                        <img src={send} />
                                                                                                    </InputAdornment>
                                                                                                ),
                                                                                            }}
                                                                                            onChange={(e) => onUpdateQuery(e)}
                                                                                            value={queryText}
                                                                                        />
                                                                                    </div>
                                                                                ) : null
                                                                            ) : ""
                                                                    }
                                                                </TableCell>
                                                            }
                                                        </>
                                                    }
                                                </TableRow>
                                            </>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                        <div className="d-flex row justfyContent-end mt-30px mb-30px">
                            {/* <Stack spacing={5}>
                                <Pagination count={10} variant="outlined" shape="rounded" showFirstButton showLastButton
                                // className={classes.root}
                                // page={page} onChange={handleChange}
                                />
                            </Stack> */}
                        </div>
                    </div>
                }
            </div>
            {/* } */}
        </div>
    )
}