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

export const CityTier: React.FC = () => {
    const [ispopupOpen, setPopup] = useState(false)
    const [isLoading, setLoading] = useState(false)
    const [data, setData] = useState<any>([])
    const [tempData, setTempData] = useState({ type: "", gradeName: '', headerTitle: '', data: '' })
    const [deleteData, setDeleteData] = useState<any>()

    useEffect(() => {
        getCityTier()
    }, [])

    const handleCreateDataPopUp = (type, data, header) => {
        setPopup(!ispopupOpen)
        console.log("handleCreateDataPopUp>>", type, data)
        setTempData({ type: type, gradeName: '', headerTitle: header, data: data })
        setPopup(!ispopupOpen)
        setDeleteData(data)
    }

    const getCityTier = async () => {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: initUrl + admin.cityTire,
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
                    notifyWarning("Something went wrong!!")
                }
                console.log("getCityTier res>>>", res)
            })
            .catch((err) => {
                setLoading(false)
                setData([])
                notifyWarning("Something went wrong!!")
                console.log("getCityTier reerrs>>>", err)
            })
    }

    const createOrUpdateCityTier = async (e: any) => {
        console.log("createOrUpdateCityTier e>>", e)
        let data = {
            name: e?.value,
            status: e?.data?.status,
            updated_by: 1,
            created_by: 1
        }
        let config = {
            method: e.type === "edit" ? 'put' : 'post',
            maxBodyLength: Infinity,
            url: e.type === "edit" ? initUrl + admin?.cityTire + `/${e?.data?.id}` : initUrl + admin?.cityTire,
            headers: {},
            data: data
        };
        console.log("config>>", config)
        setLoading(true)
        await NewServiceCall(config)
            .then((res) => {
                setLoading(false)
                if (res.status === 200) {
                    if (res.data.responseCode == 402) {
                        notifyWarning("Something went wrong")
                    }
                    else {
                        notifySuccess(res?.data?.message)
                        getCityTier()
                    }
                }
                else {
                    notifyWarning("Something went wrong")
                }
                console.log("createOrUpdateCityList res>>>", res)
            })
            .catch((err) => {
                setLoading(false)
                notifyWarning("Something went wrong")
                console.log("createOrUpdateCityList reerrs>>>", err)
            })
    }
    const deleteCityTier = async () => {
        let config = {
            method: 'delete',
            maxBodyLength: Infinity,
            url: initUrl + admin.cityTire + `/${deleteData?.id}`,
            headers: {},
        };
        setLoading(true)
        await NewServiceCall(config)
            .then((res) => {
                setLoading(false)
                if (res.status === 200) {
                    if (res.data.responseCode === 200) {
                        console.log("deleteCityTier res>>", res)
                        notifySuccess(res?.data?.message)
                        getCityTier()
                    }
                    else {
                        notifyError("Something went wrong!!")
                    }
                }
                else {
                    console.log("validateEditAddGrade res>>", res)
                    setLoading(false)
                }
                console.log("validateEditAddGrade res>>>", res)
            })
            .catch((err) => {
                setLoading(false)
                console.log("validateEditAddGrade reerrs>>>", err)
            })
    }

    return (
        <div className='p-20px'>
            <LoadingSpinner loading={isLoading} />
            <div className='justfyContent-end d-flex'>
                <BlueCommonButton
                    title={"Create New City Tier"}
                    subTitle={""}
                    buttonClick={() => handleCreateDataPopUp("new", "", "Add New City Tier")}
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
                                            <TableCell align="center"><span className="commonBlackcolor bold0_875Rem">City Tier</span></TableCell>
                                            <TableCell align="center"><span className="commonBlackcolor bold0_875Rem">Action</span></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data.map((row, index) => (
                                            <TableRow
                                                key={row.id}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row" align="center">
                                                    <span className="commonGraycolor"> {row?.name}</span>
                                                </TableCell>
                                                <TableCell align="center"><span className="commonGraycolor">
                                                    <div className='d-flex justfyContent-center row alignItem-center'>
                                                        <span className='d-flex justfyContent-center row alignItem-center curser' onClick={() => handleCreateDataPopUp("edit", row, "Edit City Tier")}>
                                                            <img src={edit} className='m-5px' />
                                                            <span className='m-5px commonGraycolor regular0_875Rem'>Edit</span>
                                                        </span>
                                                        <span className='d-flex justfyContent-center row alignItem-center curser' onClick={() => handleCreateDataPopUp("delete", row, "Delete City Tier")}>
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
                        </div>
                    </>
                    :
                    isLoading === false ?
                        <DataNotFound />
                        :
                        ""
            }
            {
                ispopupOpen &&
                <CustomAdminPopUp
                    close={() => setPopup(false)}
                    popUpType={"cityTier"}
                    fileId={1}
                    passTempData={tempData}
                    buttonClick={(e: any) => e === "delete" ? deleteCityTier() : createOrUpdateCityTier(e)}
                    getValue={(e) => console.log("")}
                />
            }
            {toastContainer()}
        </div>
    )
}