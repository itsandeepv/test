import React, { Fragment, useEffect, useState } from 'react'
import { AddButton, BlueCommonButton, CustomAddButton } from '../../components/button.tsx'
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
import plus2 from '../../assets/images/plus2.svg'
import './adminExpenseStyles.css'
import { Link, useNavigate } from 'react-router-dom';
import { expenseUrl, admin, initUrl } from '../../service/url.js';
import LoadingSpinner from '../../components/loader.tsx';
import DataNotFound from '../../components/dataNotFound.tsx';
import { ServiceCall, NewServiceCall } from '../../service/config.js';
import { toastContainer, notifyWarning, notifySuccess, notifyError } from '../../components/toast.js';

export const MasterSubExpense: React.FC = () => {
    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(true)
    const [ispopupOpen, setPopup] = useState(false)
    const [id, setId] = useState<any>(0)
    const [openStatus, setOpenStatus] = useState('')
    const [value, setValue] = useState<any>({ expense_name: '', has_subexpense: '', currentrow: '', message: '' })
    const handleCreateDataPopUp = (id) => {
        setPopup(!ispopupOpen)
        setId(id.id)
        setValue({ expense_name: '', has_subexpense: '', currentrow: id, message: "" })
        setOpenStatus('')
    }
    const [deleteData, setDeleteDate] = useState<any>([])
    const handleDeleteDataPopUp = (type, data, message, innerData) => {
        setPopup(!ispopupOpen)
        setOpenStatus(type)
        setValue({ expense_name: '', has_subexpense: '', currentrow: data, message: message })
        setDeleteDate(innerData)
        innerData?.map((item) => {
            console.log('inner data deleted id ::::::::', item?.id)
            setDeleteDate(item?.id)

        })
    }
    console.log("deleteData>>", deleteData)
    const getMasterSubExpense = async () => {
        setLoading(true)
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: initUrl + admin.getMasterExpenseWithSubexpense,
            headers: {}
        };
        await NewServiceCall(config)
            .then((res) => {
                setLoading(false)
                setData(res?.data?.result)
                console.log("getMasterSubExpense res>>>", res)
            })
            .catch((err) => {
                setLoading(false)
                notifyError("Something went wrong!!")
                console.log("getMasterSubExpense reerrs>>>", err)
            })
    }
    const navigate = useNavigate();

    const goToAdminUpdateSubMasterExpenseDetails = (data: any, currentData: any) => {
        console.log("goToAdminUpdateSubMasterExpenseDetails data>>", data)
        console.log("goToAdminUpdateSubMasterExpenseDetails currentData>>", currentData)
        navigate('/admin/editMasterSubExpense', { state: { data: data, currentData: currentData } })
    };

    useEffect(() => {
        getMasterSubExpense()
    }, [])

    const validateAddSubExpense = async (dataParam: any) => {
        setLoading(true)
        setPopup(false)
        const url = expenseUrl.initialUrl + expenseUrl.addMasterSubExpense
        const formdata = new FormData();
        formdata.append("expense_id", id);
        formdata.append("subexpense_name", dataParam.nameOfSubExpense);
        formdata.append("has_unit_cost", dataParam.unitCost === true ? "yes" : "no");
        formdata.append("has_max_distance", dataParam.maxDistance === true ? "yes" : "no");
        formdata.append("has_invoice", dataParam.invoice === true ? "yes" : "no");
        formdata.append("icon", dataParam.iconSubExpense);
        formdata.append("travel_type", dataParam.travelType);
        formdata.append("has_max_amount", dataParam.maxAmount === true ? "yes" : "no");
        const response = await ServiceCall(url, formdata, false)
            .then((res) => {
                setLoading(false)
                console.log("res>>", res)
                if (res.responseCode === 200) {
                    notifySuccess(res.message)
                    setTimeout(() => { getMasterSubExpense() }, 1000)
                }
                else {
                    notifyError("Something went wrong.")
                }
            })
            .catch((err) => {
                console.log("AddSubExpense err>>", err)
                notifyError("Something went wrong.")
            })
        console.log("response validateAddSubExpense>>", response)
    }
    const deleteSubMasterExpense = async () => {
        console.log("deleteMasterExpense called..")
        setPopup(true)
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: initUrl + admin.deleteSubMasterExpense,
            headers: {},
            params: { subexpense_id: deleteData }
        };
        await NewServiceCall(config)
            .then((res: any) => {
                setLoading(false)
                if (res.status === 200) {
                    notifySuccess(res?.data?.message)
                    getMasterSubExpense()
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
    // console.log("subExpenseData>", subExpenseData)
    // console.log("masterSubExpense>", masterSubExpense)
    // console.log("value>>", value)
    // console.log("deleteData>>",deleteData)
    console.log("data>>", data)
    return (
        <div>
            <LoadingSpinner loading={loading} />
            <div className='mt-20px'>
                {
                    data.length !== 0 ?
                        <>
                            <TableContainer component={Paper}>
                                <Table className=''>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center"><span className="commonBlackcolor bold0_875Rem">Type of Expense</span></TableCell>
                                            <TableCell align="center"><span className="commonBlackcolor bold0_875Rem">Sub-Expense Type</span></TableCell>
                                            <TableCell align="center"><span className="commonBlackcolor bold0_875Rem">Uploaded Icons</span></TableCell>
                                            <TableCell align="center"><span className="commonBlackcolor bold0_875Rem">Action</span></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <tbody>
                                        {data.map((row, id) => (
                                            <Fragment key={id}>
                                                <tr key={id}>
                                                    <td className=''><span className='m-15px'>{row.expense_name}</span></td>
                                                    <td className=''><span className='m-15px'>{row.sub_expenses?.length > 0 ? row?.sub_expenses[0]?.subexpense_name : '-'}</span></td>
                                                    <td className=''>
                                                        <span className='m-15px'>
                                                            {
                                                                row?.sub_expenses[0]?.icon ?
                                                                    <img src={row.sub_expenses?.length > 0 ? expenseUrl.initialUrl + '/' + row?.sub_expenses[0]?.icon : '-'} className="imgBg" />
                                                                    :
                                                                    "-"
                                                            }
                                                        </span>
                                                    </td>
                                                    <td className=''>
                                                        {
                                                            row.sub_expenses.length !== 0 ?
                                                                <span className="commonGraycolor">
                                                                    <div className='d-flex justfyContent-center row alignItem-center'>
                                                                        <span className='d-flex justfyContent-center row alignItem-center curser' onClick={() => goToAdminUpdateSubMasterExpenseDetails(row, row.sub_expenses[0])}>
                                                                            <img src={edit} className='m-5px' />
                                                                            <span className='m-5px commonGraycolor regular0_875Rem'>Edit</span>
                                                                        </span>
                                                                        <span className='d-flex justfyContent-center row alignItem-center curser' onClick={() => handleDeleteDataPopUp("delete", row, "Delete Master Data", row?.sub_expenses)}>

                                                                            <img src={deleteButton} className='m-5px' />
                                                                            <span className='m-5px commonGraycolor regular0_875Rem'>Delete</span>
                                                                        </span>
                                                                    </div>
                                                                </span>
                                                                :
                                                                "--"
                                                        }
                                                    </td>
                                                </tr>
                                                {row?.sub_expenses.slice(1).map((city, index) => (
                                                    <tr
                                                        key={`${row?.city}-${index}`}
                                                    >
                                                        <td />
                                                        <td align="center">{city.subexpense_name}</td>
                                                        <td align="center">
                                                            {
                                                                city?.icon ? <img src={expenseUrl?.initialUrl + '/' + city?.icon} className="imgBg" /> : "-"
                                                            }
                                                        </td>
                                                        <td align="center">
                                                            {
                                                                row.sub_expenses.length !== 0 ?
                                                                    <span className="commonGraycolor">
                                                                        <div className='d-flex justfyContent-center row alignItem-center'>
                                                                            <span className='d-flex justfyContent-center row alignItem-center curser' onClick={() => goToAdminUpdateSubMasterExpenseDetails(row, row.sub_expenses[index + 1])}>
                                                                                <img src={edit} className='m-5px' />
                                                                                <span className='m-5px commonGraycolor regular0_875Rem'>Edit</span>
                                                                            </span>
                                                                            <span className='d-flex justfyContent-center row alignItem-center curser' onClick={() => handleDeleteDataPopUp("delete", row, "Delete Master Data", row?.sub_expenses[index + 1])}>
                                                                                <img src={deleteButton} className='m-5px' />
                                                                                <span className='m-5px commonGraycolor regular0_875Rem'>Delete</span>
                                                                            </span>
                                                                        </div>
                                                                    </span>
                                                                    :
                                                                    "--"
                                                            }
                                                        </td>

                                                    </tr>
                                                ))}
                                                {
                                                    // row.has_subexpense === "yes" ?
                                                    <TableRow>
                                                        <TableCell></TableCell>
                                                        {
                                                            row.has_subexpense === "yes" ?
                                                                <TableCell align="center">
                                                                    <div className='addButton'>
                                                                        <CustomAddButton
                                                                            onclick={() => handleCreateDataPopUp(row)}
                                                                            title={"Add More"}
                                                                            icon={<img src={plus2} className='pl-5px pr-5px' />}
                                                                        />
                                                                    </div>
                                                                </TableCell>
                                                                : ""
                                                        }
                                                        <TableCell align="center">
                                                        </TableCell>
                                                        <TableCell></TableCell>
                                                        <TableCell></TableCell>
                                                        <TableCell></TableCell>
                                                    </TableRow>
                                                    // :
                                                    // ""
                                                }
                                            </Fragment>

                                        ))}
                                    </tbody>
                                </Table>
                            </TableContainer>

                        </>
                        :
                        data.length === 0 && loading === false ?
                            <div>
                                <DataNotFound />
                            </div>
                            :
                            <></>
                }
                {toastContainer()}
            </div>
            {
                ispopupOpen &&
                <CustomAdminPopUp
                    close={() => setPopup(false)}
                    popUpType={"masterSubExpense"}
                    fileId={id}
                    type={openStatus}
                    buttonType={'ADD'}
                    getValue={value}
                    fileImage={(e) => console.log('fileImage:::::', e)}
                    buttonClick={() => {
                        deleteSubMasterExpense()
                    }}
                    // hasSubExpense={(value) => {
                    //     console.log('hassubExpense::', value)
                    //     setHasSubExpense(value === true ? 'yes' : "No")
                    // }}
                    onSubmit={(e: object) => {
                        if (e.iconSubExpense === undefined) {
                            notifyError("Icon is required!")
                        } else {
                            validateAddSubExpense(e)
                        }
                    }
                    }
                // onSubmit={(e: object) => console.log("e>>",e)}
                />
            }
        </div>
    )
}