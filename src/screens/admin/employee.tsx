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
import { Link, useNavigate } from 'react-router-dom';

import { NewServiceCall } from '../../service/config.js';
import { admin, initUrl } from '../../service/url.js'
import { toastContainer, notifySuccess, notifyWarning, notifyError } from '../../components/toast.js';
import LoadingSpinner from "../../components/loader.tsx";
import DataNotFound from '../../components/dataNotFound.tsx';


export const EmployeeAdminScreen: React.FC = () => {
    const [ispopupOpen, setPopup] = useState(false)
    const [isLoading, setLoading] = useState(false)
    const [data, setData] = useState<any>([])
    const [tempData, setTempData] = useState({ type: "", gradeName: '', headerTitle: '', data: '' })
    const [deleteData, setDeleteData] = useState<any>()
    const navigate = useNavigate();

    const goToAdminEmployeeDetails = (data: any) => {
        navigate('/admin/employeeAdminDetails', { state: { data: data } })
    };

    useEffect(() => {
        getadminEmployeeList()
    }, [])

    const getadminEmployeeList = async () => {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: initUrl + admin.employee,
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
                    notifyError("Something went wrong!")
                }
                console.log("getgetadminEmployeeListGrade res>>>", res)
            })
            .catch((err) => {
                setLoading(false)
                notifyError("Something went wrong!")
                setData([])
                console.log("getadminEmployeeList reerrs>>>", err)
            })
    }

    const handlePopUp = (data: any, type: any) => {
        setTempData({ type: type, gradeName: '', headerTitle: 'Delete Employee Data', data: data })
        setPopup(!ispopupOpen)
        setDeleteData(data)
    }

    const deleteadminEmployeeList = async () => {
        let config = {
            method: 'delete',
            maxBodyLength: Infinity,
            url: initUrl + admin.employee + `/${deleteData?.id}`,
            headers: {}
        };
        setLoading(true)
        await NewServiceCall(config)
            .then((res: any) => {
                setLoading(false)
                if (res.status === 200) {
                    notifySuccess(res?.data?.message)
                }
                else {
                    setData([])
                    notifyError("Something went wrong!")
                }
                console.log("deleteadminEmployeeList res>>>", res)
            })
            .catch((err: any) => {
                setLoading(false)
                notifyError("Something went wrong!")
                console.log("deleteadminEmployeeList reerrs>>>", err)
            })

    }


    return (
        <div className='p-20px'>
            <LoadingSpinner loading={isLoading} />
            {
                data.length !== 0 ?
                    <>
                        <div className='mt-20px'>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center"><span className="commonBlackcolor bold0_875Rem">Name</span></TableCell>
                                            <TableCell align="center"><span className="commonBlackcolor bold0_875Rem">Role</span></TableCell>
                                            <TableCell align="center"><span className="commonBlackcolor bold0_875Rem">Grade Name</span></TableCell>
                                            <TableCell align="center"><span className="commonBlackcolor bold0_875Rem">ID</span></TableCell>
                                            <TableCell align="center"><span className="commonBlackcolor bold0_875Rem">Status</span></TableCell>
                                            <TableCell align="center"><span className="commonBlackcolor bold0_875Rem">Action</span></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data.map((row: any, key) => (
                                            <TableRow
                                                key={row.employeeId}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row" align="center">
                                                    <span className="commonGraycolor"> {row.name}</span>
                                                </TableCell>
                                                <TableCell align="center">
                                                    {row?.role?.map((role, id) =>
                                                        <span className="commonGraycolor">
                                                            {role?.name} 
                                                            {/* {row?.role.length === 1 ? "": ","} */}
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell align="center">
                                                    <span className="commonGraycolor">
                                                        {row?.grade?.name}
                                                    </span>
                                                </TableCell>
                                                <TableCell align="center"><span className="commonGraycolor">{row.employe_id}</span></TableCell>
                                                <TableCell align="center"><span className="commonGraycolor">{row.status === '1' ? "Active" : "Deactive"}</span></TableCell>
                                                <TableCell align="center"><span className="commonGraycolor">
                                                    <div className='d-flex justfyContent-center row alignItem-center'>
                                                        <span className='d-flex justfyContent-center row alignItem-center curser' onClick={() => goToAdminEmployeeDetails(row)}>
                                                            <img src={edit} className='m-5px' />
                                                            <span className='m-5px commonGraycolor regular0_875Rem'>Edit</span>
                                                        </span>
                                                        <span className='d-flex justfyContent-center row alignItem-center curser' onClick={() => handlePopUp(row, 'delete')}>
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
                    popUpType={"deleteAdminEmployee"}
                    fileId={1}
                    passTempData={tempData}
                    buttonClick={(e: any) => deleteadminEmployeeList()}
                />
            }
        </div>
    )
}