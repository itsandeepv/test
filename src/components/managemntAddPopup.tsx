import React, { useEffect, useState } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import search from '../assets/images/search.svg';
import user from '../assets/images/user.svg'
import cross from '../assets/images/cross.svg';
import { BlueCommonButton } from './button.tsx';
import { admin, initUrl } from '../service/url.js';
import { NewServiceCall } from '../service/config.js';
import LoadingSpinner from './loader.tsx';
import { notifySuccess, toastContainer } from './toast.js';
const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
interface modelProps {
    close: Function;
    locations: any,
    passData: any,
    fieldType: any,
    selectedEmployee: any,
    mngmntId: any,
    hodId: any,
    refresh: any
}

export const ManagementProfilePopup: React.FC<modelProps> = ({ close, selectedEmployee, mngmntId, hodId , refresh}) => {
    const [open, setOpen] = React.useState(true);
    const [searchText, setSearchText] = useState('');
    const [searchData, setSearchData] = useState<any>([]);
    const [selectedItems, setSelectedItems] = useState<any>([]);
    const [hodList, setHodList] = useState([])
    const [isLoading, setLoading] = useState(false)
    const handleItemPress = (itemId) => {
        const isSelected = selectedItems.includes(itemId);
        if (isSelected) {
            setSelectedItems((prevSelectedItems) =>
                prevSelectedItems.filter((id) => id !== itemId)
            );
        } else {
            // Item is not selected, add it to the selectedItems array
            setSelectedItems((prevSelectedItems) => [...prevSelectedItems, itemId]);
        }
    };
    console.log("selectedItems>>", selectedItems)
    const getHodList = async () => {
        var formdata = new FormData();
        formdata.append("empolee_id", mngmntId);
        formdata.append("role_id",'3');
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: initUrl + admin.getemployeeForHodAndMgm,
            headers: {},
            data: formdata
        };
        setLoading(true)
        await NewServiceCall(config)
            .then((res) => {
                setLoading(false)
                if (res.status === 200) {
                    setHodList(res?.data?.result)
                    setSearchData(res?.data?.result)
                }
                else {
                    setHodList([])
                }
                console.log("getHodlist res>>>", res)
            })
            .catch((err) => {
                setLoading(false)
                setHodList([])
                console.log("getHodlist reerrs>>>", err)
            })
    }

    const AssignHodtoMngmnt = async () => {
        // console.log('seeeeeAddedsekcy???????>>>', selectedItems)
        const formdata = new FormData();
        formdata.append("mgm_id", mngmntId);
        formdata.append("hod_ids", selectedItems.join(','));
        console.log("AssignHodtoMngmnt hod_ids", selectedItems.join(','))
        console.log("AssignHodtoMngmnt mgm_id>>", mngmntId)
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: initUrl + admin.mngmnttoHodAssign,
            headers: {},
            data: formdata
        };
        setLoading(true)
       
        await NewServiceCall(config)
            .then((res) => {
                setLoading(false)
                if (res.status === 200) {
                    // setHodList(res?.data?.result)
                    // setSearchData(res?.data?.result)
                    notifySuccess(res?.data?.message)
                    console.log('AssignHodtoMngmnt:::::::::::??????', res?.data?.message)
                    setTimeout(()=>{
                        close()
                        refresh()
                    },3000)
                }
                else {
                    // setHodList([])
                }
                console.log("AssignHodtoMngmnt res>>>", res?.data)
            })
            .catch((err) => {
                setLoading(false)
                // setHodList([])
                console.log("AssignHodtoMngmnt reerrs>>>", err)
            })
    }
    useEffect(() => {
        getHodList()
    }, [])
    const onSearch = (text: any) => {
        if (text) {
            const newData = hodList.filter(function (item: any) {
                const itemData = item.name
                    ? item.name.toUpperCase()
                    : ''.toUpperCase();
                const textData = text.toUpperCase();
                console.log('datattatext::::', textData)
                return itemData.indexOf(textData) > -1;
            });
            setSearchData(newData);
            console.log('searchedbjqbjhqbwjfbq', searchData)
            setSearchText(text);
        } else {
            setSearchData(hodList);
            setSearchText(text);
        }
    };
    return (
        <div>
            {isLoading ?
                <LoadingSpinner loading={isLoading} />
                :
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={open}
                    closeAfterTransition
                    slots={{ backdrop: Backdrop }}
                    slotProps={{
                        backdrop: {
                            timeout: 500,
                        },
                    }}
                >
                    <Fade in={open}>
                        <Box sx={style}>
                            <div className='d-flex justfyContent-center column'>
                                <div className='d-flex row justfyContent-end p-5px'>
                                    <img src={cross} className='popUp-cross' onClick={() => close()} />
                                </div>
                                <div className='d-flex p-10px'>
                                    <Paper component="form"
                                        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%', backgroundColor: '#F4F4F4', boxShadow: 'none', borderRadius: '10px' }}>
                                        <InputBase
                                            sx={{ ml: 1, flex: 1 }}
                                            placeholder="Search..."
                                            value={searchText}
                                            onChange={(e) => {
                                                if (e.target.value) {
                                                    setSearchText(e.target.value)
                                                    onSearch(e.target.value)

                                                }
                                                else {
                                                    setSearchText('')
                                                    setSearchData(hodList)
                                                }
                                            }}
                                            inputProps={{ 'aria-label': 'search google maps' }} />
                                        <IconButton
                                            // onClick={onSearch}
                                            type="button" sx={{ p: '10px' }} aria-label="search">
                                            <img src={search} />
                                        </IconButton>
                                    </Paper>
                                </div>
                            </div>
                            <div style={{ height: '50vh', width: '50vw', marginRight: '30px', overflowY: 'auto' }}>
                                <div className='d-flex justfyContent-center alignItem-start column'>
                                    {searchData?.map((item) =>
                                        <div style={{ padding: '10px', marginBottom: '10px', backgroundColor: selectedItems.includes(item.employe_id) ? '#e0e0e0' : 'white', }} className='d-flex row alignItem-center curser w-95per' key={item.id}
                                            onClick={() => handleItemPress(item.employe_id,)}

                                        >
                                            <div>
                                                <img src={user} />
                                            </div>
                                            <div className='d-flex column pl-10px pr-10px w-95per'>
                                                <span style={{ fontSize: '15px', color: 'black' }} >Name : {item?.name}</span>
                                                <span style={{ fontSize: '12px', color: '#6a737d' }}
                                                >
                                                    Department : {item?.dept}
                                                </span>

                                                <span style={{ fontSize: '12px', color: '#6a737d' }}
                                                >
                                                    email : {item?.email}
                                                </span>
                                                <span style={{ fontSize: '12px', color: '#6a737d' }}
                                                >
                                                    Designation : {item?.designation}
                                                </span>
                                                <hr className='w-100per' />
                                            </div>
                                        </div>

                                    )}

                                </div>
                            </div>
                            <div className='d-flex w-95per justfyContent-end m-10px'>
                                <BlueCommonButton
                                    title={"Done"}
                                    subTitle={""}
                                    buttonClick={() => {
                                        selectedEmployee(selectedItems)
                                        AssignHodtoMngmnt()
                                        setOpen(false)
                                    }}
                                />
                            </div>
                        </Box>

                    </Fade>
                </Modal>
            }
            {toastContainer()}
        </div>
    );
}