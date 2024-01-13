import React, { useEffect, useState } from 'react'
import { BlueCommonButton } from '../../components/button.tsx'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import edit from '../../assets/images/edit.svg'
import deleteButton from '../../assets/images/delete.svg'
import { CustomAdminPopUp } from './customAdminPopUp.tsx';
import { expenseUrl, admin, initUrl } from '../../service/url.js';
import axios from 'axios';
import LoadingSpinner from '../../components/loader.tsx';
import SearchFound from '../../components/searchFound.tsx';
import DataNotFound from '../../components/dataNotFound.tsx';
import { toastContainer, notifySuccess, notifyError } from '../../components/toast.js';
import { NewServiceCall } from '../../service/config.js';

export const MasterExpense: React.FC = () => {
    const [expenseData, setExpenseData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const [ispopupOpen, setPopup] = useState(false)
    const [expenseName, setExpenseName] = useState('')
    const [hasSubExpense, setHasSubExpense] = useState('')
    const [openStatus, setOpenStatus] = useState('')
    const [value, setValue] = useState<any>({ expense_name: '', has_subexpense: '', currentrow: '', message: '' })

    useEffect(() => {
        getMasterExpense()
    }, [])

    const handleCreateDataPopUp = (param1, param2, row) => {
        setPopup(!ispopupOpen)
        setOpenStatus("edit")
        setValue({ expense_name: param1, has_subexpense: param2, currentrow: row, message: '' })
    }
    const handleDeleteDataPopUp = (type, data, message) => {
        setPopup(!ispopupOpen)
        setOpenStatus(type)
        setValue({ expense_name: '', has_subexpense: '', currentrow: data, message: message })
    }

    const getMasterExpense = async () => {
        setLoading(true)
        const url = expenseUrl.initialUrl + expenseUrl.getExpenseMaster
        try {
            const response = await axios.get(url);
            const resultData = response?.data?.result
            console.log('getmasterexpenseapiresult:::', resultData)
            setExpenseData(resultData)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.error('MasterlistError', error);
        }
    }

    const updateMasterExpense = async () => {
        setLoading(true)
        const formdata = new FormData();
        formdata.append("expense_id", value?.currentrow?.id ? value?.currentrow?.id : undefined);
        formdata.append("expense_name", expenseName);
        formdata.append("has_subexpense", hasSubExpense);
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: expenseUrl.initialUrl + expenseUrl.updateExpenseMaster,
            headers: {},
            data: formdata,
        };
        console.log("check updateMasterExpenseexpense_id>>", value?.currentrow?.id ? value?.currentrow?.id : undefined)
        console.log("check updateMasterExpenseexpense_name>>", expenseName)
        console.log("check updateMasterExpensehas_subexpense>>", hasSubExpense)
        await NewServiceCall(config)
            .then((res) => {
                setLoading(false)
                if (res.status === 200) {
                    notifySuccess(res?.data?.message)
                    getMasterExpense()
                }
                else {
                    notifyError("Something went wrong!!")
                }
                console.log("updateMasterExpense res>>>", res)
            })
            .catch((err) => {
                setLoading(false)
                console.log("updateMasterExpense reerrs>>>", err)
            })
    }

    const addMasterExpense = async () => {
        setPopup(true)
        const formdata = new FormData();
        formdata.append("expense_name", expenseName);
        formdata.append("has_subexpense", hasSubExpense);
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: expenseUrl.initialUrl + expenseUrl.addExpenseMaster,
            headers: {},
            data: formdata
        };
        await NewServiceCall(config)
            .then((res: any) => {
                setLoading(false)
                if (res.status === 200) {
                    notifySuccess(res?.data?.message)
                    getMasterExpense()
                }
                else {
                    notifyError("Something went wrong!!")
                }
                console.log("addMasterExpense res>>>", res)
            })
            .catch((err: any) => {
                setLoading(false)
                console.log("addMasterExpense reerrs>>>", err)
            })
    }

    const deleteMasterExpense = async () => {
        console.log("deleteMasterExpense called..")
        setPopup(true)
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: initUrl + admin.deleteMasterExpense,
            headers: {},
            params:{expense_id: value?.currentrow?.id}
        };
        console.log("deleteMasterExpense config>>",config)
        await NewServiceCall(config)
            .then((res: any) => {
                setLoading(false)
                if (res.status === 200) {
                    notifySuccess(res?.data?.message)
                    getMasterExpense()
                }
                else {
                    notifyError("Something went wrong!!")
                }
                console.log("addMasterExpense res>>>", res)
            })
            .catch((err: any) => {
                setLoading(false)
                console.log("addMasterExpense reerrs>>>", err)
            })
    }

    console.log("value>>", value)
    return (
        <div>
            {loading ?
                <LoadingSpinner loading={loading} />
                :
                <div className='p-20px'>
                    <div className='justfyContent-end d-flex'>
                        <BlueCommonButton
                            title={"Create Master Expense"}
                            subTitle={""}
                            buttonClick={() => {
                                setOpenStatus('add')
                                setPopup(true)
                                setValue({ expense_name: '', has_subexpense: 'No', currentrow: '' })
                                console.log('addbutton::::', openStatus)

                            }}
                        />
                    </div>
                    <div className='mt-20px'>
                        {expenseData.length == 0 && !loading ?
                            <DataNotFound />
                            :
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center"><span className="commonBlackcolor bold0_875Rem">Master Expense Name</span></TableCell>
                                            <TableCell align="center"><span className="commonBlackcolor bold0_875Rem">Has Sub-expense type</span></TableCell>
                                            <TableCell align="center"><span className="commonBlackcolor bold0_875Rem">Action</span></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {expenseData.map((item) => (
                                            <TableRow
                                                key={item?.id}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row" align="center">
                                                    <span className="commonGraycolor"> {item?.expense_name}</span>
                                                </TableCell>
                                                <TableCell align="center"><span className="commonGraycolor">{item?.has_subexpense}</span></TableCell>
                                                <TableCell align="center"><span className="commonGraycolor">
                                                    <div className='d-flex justfyContent-center row alignItem-center'>
                                                        <span className='d-flex justfyContent-center row alignItem-center curser' onClick={() => handleCreateDataPopUp(item?.expense_name, item?.has_subexpense, item)}>
                                                            <img src={edit} className='m-5px' />
                                                            <span className='m-5px commonGraycolor regular0_875Rem'>Edit</span>
                                                        </span>
                                                        <span className='d-flex justfyContent-center row alignItem-center curser' onClick={() => handleDeleteDataPopUp("delete", item, "Delete Master Data")}>
                                                            <img src={deleteButton} className='m-5px' />
                                                            <span className='m-5px commonGraycolor regular0_875Rem'>Delete</span>
                                                        </span>
                                                    </div>
                                                </span></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        }
                    </div>
                    {
                        ispopupOpen &&
                        <CustomAdminPopUp
                            close={() => { setPopup(false) }}
                            data={value}
                            popUpType={"masterExpense"}
                            fileId={1}
                            hasSubExpense={(value) => {
                                console.log('hassubExpense::', value)
                                setHasSubExpense(value === true ? 'yes' : 'No')
                            }}
                            buttonType={openStatus}
                            buttonClick={() => {
                                console.log('addddd::', openStatus)
                                openStatus === "add" ?
                                    addMasterExpense()
                                    :
                                    openStatus === "edit" ?
                                        updateMasterExpense()
                                        :
                                        // openStatus === "delete" ?
                                            deleteMasterExpense()
                                            // :
                                            // ''
                            }}
                            getValue={(e) => setExpenseName(e)}
                            type={openStatus}
                        />
                    }
                </div>
            }
            {toastContainer()}
        </div>
    )
}