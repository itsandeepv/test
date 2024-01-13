import React, { useState, useEffect } from 'react'
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
import { NewServiceCall } from '../../service/config.js';
import { admin, initUrl } from '../../service/url.js'
import { toastContainer, notifySuccess, notifyWarning, notifyError } from '../../components/toast.js';
import LoadingSpinner from "../../components/loader.tsx";
import SearchFound from "../../components/searchFound.tsx";
import DataNotFound from '../../components/dataNotFound.tsx';
import { Link, useNavigate } from 'react-router-dom';

export const GradeSCreen: React.FC = () => {
    const [ispopupOpen, setPopup] = useState(false)
    const [isLoading, setLoading] = useState(false)
    const [data, setData] = useState<any>([])
    const navigate = useNavigate();

    const getGrade = async () => {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: initUrl + admin.grade,
            headers: {}
        };
        setLoading(true)
        await NewServiceCall(config)
            .then((res) => {
                setLoading(false)
                if (res.status === 200) {
                    setData(res?.data?.result ? res?.data?.result : [])
                }
                else {
                    setData([])
                }
                console.log("getGrade res>>>", res)
            })
            .catch((err) => {
                setLoading(false)
                setData([])
                console.log("getGrade reerrs>>>", err)
            })
    }

    const validateAddUpdateGrade = async (arg) => {
        let data = {
            name: arg.name,
            status: '1',
            created_by: '1',
            updated_by: '1'
        }
        let config = {
            method: arg.type === "edit" ? 'put':'post',
            maxBodyLength: Infinity,
            url:arg.type === "edit" ? initUrl + admin?.grade + `/${arg?.data?.id}` : initUrl + admin?.grade,
            headers: {},
            data: data
        };
        setLoading(true)
        await NewServiceCall(config)
            .then((res) => {
                setLoading(false)
                if (res.status === 200) {
                    console.log("validateAddGrade res>>", res)
                    notifySuccess(res?.data?.message)
                    getGrade()
                }
                else {
                    notifyWarning(res.message? res?.message :"Something went wrong")
                }
                console.log("validateAddGrade res>>>", res)
            })
            .catch((err) => {
                setLoading(false)
                notifyWarning("Something went wrong")
                console.log("validateAddGrade reerrs>>>", err)
            })
    }

    const deleteGrade = async () => {
        console.log("dadeleteDatataArg>>", deleteData)
        let config = {
            method: 'delete',
            maxBodyLength: Infinity,
            url: initUrl + admin.grade + `/${deleteData?.id}`,
            headers: {},
        };
        setLoading(true)
        await NewServiceCall(config)
            .then((res) => {
                setLoading(false)
                if (res.status === 200) {
                    if (res.data.responseCode === 200) {
                        console.log("deleteGrade res>>", res)
                        notifySuccess(res?.data?.message)
                        getGrade()
                    }
                    else {
                        notifyError("Something went wrong!!")
                    }
                }
                else {
                    console.log("validateEditAddGrade res>>", res)
                }
                console.log("validateEditAddGrade res>>>", res)
            })
            .catch((err) => {
                setLoading(false)
                console.log("validateEditAddGrade reerrs>>>", err)
            })
    }

    useEffect(() => {
        getGrade()
    }, [])
    const [deleteData, setDeleteData] = useState<any>()
    const [tempData, setTempData] = useState({ type: "", gradeName: '', headerTitle: '', data: '' })
    const handleGrade = (arg: any, currentRow: any) => {
        setPopup(!ispopupOpen)
        if (arg === "new") {
            setTempData({ type: arg, gradeName: '', headerTitle: "Add New Grade", data: currentRow })
        }
        else if (arg === "edit") {
            setTempData({ type: arg, gradeName: '', headerTitle: "Edit Grade", data: currentRow })
        }
        else if (arg === "delete") {
            setTempData({ type: arg, gradeName: '', headerTitle: "Delete Grade", data: currentRow })
            setDeleteData(currentRow)
        }
    }
    return (
        <div className='p-20px'>
            <LoadingSpinner loading={isLoading} />
            <div className='justfyContent-end d-flex'>
                <BlueCommonButton
                    title={"Create Grade"}
                    subTitle={""}
                    buttonClick={() => handleGrade("new", "")}
                />
            </div>
            {
                data.length !== 0 ?
                    <>
                        <div className='mt-20px'>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center"><span className="commonBlackcolor bold0_875Rem">Grade Name</span></TableCell>
                                            <TableCell align="center"><span className="commonBlackcolor bold0_875Rem">Action</span></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data?.map((row, index) => (
                                            <TableRow
                                                key={row.id}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row" align="center">
                                                    <span className="commonGraycolor"> {row.name}</span>
                                                </TableCell>
                                                <TableCell align="center"><span className="commonGraycolor">
                                                    <div className='d-flex justfyContent-center row alignItem-center'>
                                                        <span className='d-flex justfyContent-center row alignItem-center curser ' onClick={() => handleGrade("edit", row)}>
                                                            {/* <span className='d-flex justfyContent-center row alignItem-center curser ' onClick={() => navigate('/admin/gradePolicy', { state: { data: "" } })}> */}

                                                            <img src={edit} className='m-5px' />
                                                            <span className='m-5px commonGraycolor regular0_875Rem'>Edit</span>
                                                        </span>
                                                        <span className='d-flex justfyContent-center row alignItem-center curser'
                                                            // onClick={() => deleteGrade(row)}
                                                            onClick={() => handleGrade("delete", row)}
                                                        >
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
                            {toastContainer()}
                        </div>
                    </>
                    :
                    !isLoading &&
                    <DataNotFound />
            }
            {
                ispopupOpen &&
                <CustomAdminPopUp
                    close={() => setPopup(false)}
                    popUpType={"grade"}
                    fileId={1}
                    passTempData={tempData}
                    // onSubmitValue = {(e)=> console.log(e)}
                    buttonClick={(e: any) => e === "delete" ? deleteGrade() : validateAddUpdateGrade(e)}
                    getValue={(e) => console.log("")}
                />
            }
        </div>
    )
}