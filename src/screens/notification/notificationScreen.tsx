import React, { useState, useEffect } from 'react'
import profile from '../../assets/images/user.svg'
import { NewServiceCall } from '../../service/config.js';
import { notification, initUrl } from '../../service/url.js'
import { useDispatch, useSelector } from 'react-redux';
import { selectData } from '../../Redux/features/login/loginSlicer.js'
import LoadingSpinner from '../../../src/components/loader.tsx';
import Moment from 'react-moment';
import './notificationStyles.css';
import DataNotFound from '../../components/dataNotFound.tsx';

export const NotificationScreen = () => {

    useEffect(() => {
        getNotificationList()
    }, [])
    const [isLoading, setLoading] = useState(false)
    const [data, setData] = useState<any>([])
    const loginStatus = useSelector(selectData);
    const user_id = loginStatus.items[0]?.empcode

    const getNotificationList = async () => {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: initUrl + notification.getNotification,
            headers: {},
            params: { user_id: user_id }
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
                console.log("getNotificationList res>>>", res)
            })
            .catch((err) => {
                setLoading(false)
                setData([])
                console.log("getNotificationList reerrs>>>", err)
            })
    }

    console.log("getNotificationList data>=>>", data)
    return (
        <div className='mt-20px'>
            <LoadingSpinner loading={isLoading} />
            {
                data.length !== 0 ?
                    <>
                        <div className='ml-5px mr-5px d-flex mt-30px m-10px mb-1_5rem'>
                            <span className='bold1Rem commonBlackcolor'>New Expense -&nbsp;</span><span className='light0_813Rem commonGraycolor'>Add your expenses details here</span>
                        </div>
                        {
                            data.map((item, id) =>
                                <div className={`d-flex row space-between moduleBorderWithoutPadding p-10px ${item.status === 'unread' ? 'unReadNotifiction' : 'readNotifiction'}`} key={id}
                                >
                                    <div className='d-flex row'>
                                        <img src={profile} />
                                        <span className='d-flex column textAlign-Start ml-15px'>
                                            <span className='bold0_813Rem commonGraycolor'>{item.noti}<span className='light0_813Rem commonGraycolor'></span> </span>
                                            <span className='light0_813Rem commonGraycolor'>On expense - { }</span>
                                            {/* A meeting with Suzuki */}
                                        </span>
                                    </div>
                                    <div className='light0_813Rem commonGraycolor'>
                                        <Moment format='DD MMM, HH:mm'>{item.created_at}</Moment>
                                    </div>
                                </div>
                            )
                        }
                    </>
                    :
                    isLoading === false ?
                        <DataNotFound />
                        :
                        ""
            }
        </div>
    )
}