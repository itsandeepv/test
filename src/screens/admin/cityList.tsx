import React, { useEffect, useState } from 'react'
import { BlueCommonButton, CustomAddButton } from '../../components/button.tsx'
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
import { Link } from 'react-router-dom';
import plus2 from '../../assets/images/plus2.svg'


import { NewServiceCall } from '../../service/config.js';
import { admin, initUrl } from '../../service/url.js'
import { toastContainer, notifySuccess, notifyWarning, notifyError } from '../../components/toast.js';
import LoadingSpinner from "../../components/loader.tsx";
import SearchFound from "../../components/searchFound.tsx";
export const CityList: React.FC = () => {
    const [ispopupOpen, setPopup] = useState(false)
    const [isDeletepopupOpen, setDeletePopup] = useState(false)
    const [isLoading, setLoading] = useState(false)
    const [data, setData] = useState<any>([])

    useEffect(() => {
        getCityList()
    }, [])
    const [deleteData, setDeleteData] = useState<any>()
    const [tempData, setTempData] = useState({ type: "", gradeName: '', headerTitle: '', data: '', tierMasterData: [] })

    const getCityList = async () => {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: initUrl + admin.cityList,
            headers: {}
        };
        setLoading(true)
        await NewServiceCall(config)
            .then((res) => {
                setLoading(false)
                if (res.status === 200) {
                    // console.log("getCityList res>>",res)
                    setData(res?.data?.result ? res?.data?.result : [])
                }
                else {
                    setData([])
                }
                console.log("getCityList res>>>", res)
            })
            .catch((err) => {
                setLoading(false)
                setData([])
                console.log("getGrgetCityListade reerrs>>>", err)
            })
    }

    const createOrUpdateCityList = async (e) => {
        let data = {
            city_tier_id: e?.selectedTier ? e?.selectedTier : '',
            name: e?.cityName ? e?.cityName : '',
            status: e?.data?.status,
            updated_by: 1,
            created_by: 1
        }
        let config = {
            method: e?.type === "edit" ? 'put' : 'post',
            maxBodyLength: Infinity,
            url: e?.type === "edit" ? initUrl + admin?.cityList + `/${e?.data?.id}` : initUrl + admin?.cityList,
            headers: {},
            data: data
        };
        console.log("config>>", config)
        console.log("e>>>", e)
        setLoading(true)
        await NewServiceCall(config)
            .then((res) => {
                setLoading(false)
                if (res.status === 200) {
                    notifySuccess(res?.data?.message)
                    getCityList()
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

    const deleteCityList = async () => {
        console.log("deleteCityList call")
        let config = {
            method: 'delete',
            maxBodyLength: Infinity,
            url: initUrl + admin.cityList + `/${deleteData?.id}`,
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
                        getCityList()
                    }
                    else {
                        notifyError("Something went wrong!!")
                    }
                    // setData(res?.data?.result ? res?.data?.result : [])
                }
                else {
                    console.log("validateEditAddGrade res>>", res)
                    // setData([])
                }
                console.log("validateEditAddGrade res>>>", res)
            })
            .catch((err) => {
                setLoading(false)
                console.log("validateEditAddGrade reerrs>>>", err)
            })
    }

    const [tierList, setTierList] = useState<any>([])

    const getCityTier = async (type, data, header) => {
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
                if (res?.status === 200) {
                    setTierList(res?.data?.result ? res?.data?.result : [])
                    setTempData({ type: type, gradeName: '', headerTitle: header, data: data, tierMasterData: res?.data?.result ? res?.data?.result : [] })
                    setPopup(!ispopupOpen)
                    setDeleteData(data)
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
    const handleCreateDataPopUp = (type, data, header) => {
        getCityTier(type, data, header)
    }

    return (
        <div className='p-20px'>
            <LoadingSpinner loading={isLoading} />
            <div className='justfyContent-end d-flex'>
                <BlueCommonButton
                    title={"Create City"}
                    subTitle={""}
                    buttonClick={() => handleCreateDataPopUp("new", 'add', "Add New City Tier")}
                />
            </div>
            {
                data.lenght !== 0 ?
                    <>
                        <div className='mt-20px'>
                            <>
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="center"><span className="commonBlackcolor bold0_875Rem">City Tier</span></TableCell>
                                                <TableCell align="center"><span className="commonBlackcolor bold0_875Rem">City Name</span></TableCell>
                                                <TableCell align="center"><span className="commonBlackcolor bold0_875Rem">Action</span></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                data.sort((a, b) => a.city_tier_id - b.city_tier_id).map((row, id) => (
                                                    <React.Fragment key={id}>
                                                        <TableRow>
                                                            <TableCell align="center">{row.city_tier_name}</TableCell>
                                                            <TableCell align="center">{row.name}</TableCell>
                                                            <TableCell align="center">
                                                                <span className="commonGraycolor">
                                                                    <div className='d-flex justfyContent-center row alignItem-center'>
                                                                        <span className='d-flex justfyContent-center row alignItem-center curser' onClick={() => handleCreateDataPopUp("edit", row, "Edit City")}>
                                                                            <img src={edit} className='m-5px' />
                                                                            <span className='m-5px commonGraycolor regular0_875Rem'>Edit</span>
                                                                        </span>
                                                                        <span className='d-flex justfyContent-center row alignItem-center curser' onClick={() => handleCreateDataPopUp("delete", row, "Delete City List")}>
                                                                            <img src={deleteButton} className='m-5px' />
                                                                            <span className='m-5px commonGraycolor regular0_875Rem'>Delete</span>
                                                                        </span>
                                                                    </div>
                                                                </span>
                                                            </TableCell>
                                                        </TableRow>
                                                    </React.Fragment>
                                                ))
                                            }
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </>
                            {toastContainer()}
                        </div>
                    </>
                    :
                    <SearchFound />
            }
            {
                ispopupOpen &&
                <CustomAdminPopUp
                    close={() => setPopup(false)}
                    popUpType={"cityList"}
                    fileId={1}
                    passTempData={tempData}
                    // onSubmitValue = {(e)=> console.log(e)}
                    buttonClick={(e: any) => e === "delete" ? deleteCityList() : createOrUpdateCityList(e)}
                    // buttonClick={(e: any) => console.log("ddddde>>",e)}
                    getValue={(e: any) => console.log("")}
                />
            }
            {
                isDeletepopupOpen &&
                <CustomAdminPopUp
                    close={() => setPopup(false)}
                    popUpType={"deleteCityList"}
                    fileId={1}
                    passTempData={tempData}
                    getValue={(e) => console.log("")}
                />
            }
        </div>
    )
}