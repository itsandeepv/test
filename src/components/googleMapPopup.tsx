import React, { useState } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import GoogleMapReact from 'google-map-react';
import axios from 'axios';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import search from '../assets/images/search.svg'
import { BlueCommonButton } from './button.tsx';
import map from '../assets/images/travel/map.svg'
import cross from '../assets/images/cross.svg'

import { useDispatch, useSelector } from 'react-redux';
import { setStartLocationName, setEndLocationName, startLocationReduxData, endLocationReduxData } from '../Redux/features/googleLocation/googleLocationSlicer.js'
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
    fieldType: any
}

export const GoogleMaps: React.FC<modelProps> = ({ close, locations, passData, fieldType }) => {

    const dispatch = useDispatch();
    const startLocationData = useSelector(startLocationReduxData);
    const endLocationData = useSelector(endLocationReduxData);

    const [open, setOpen] = React.useState(true);
    const [center, setCenter] = useState({ lat: 40.7128, lng: -74.0060 }); // Default to New York City
    const [zoom, setZoom] = useState(11);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [searchData, setSearchData] = useState<any>([]);
    const [startlocation, setStartLocation] = useState('')
    const [combiledata, setCombineData] = useState({})
    const [location, setLocation] = useState('');


    const [locationData, setLocationData] = useState({ locationInfo: "", field: fieldType })

    const searchFunction = (item) => {
        console.log('searchFunction>>>', item)
        if (fieldType.field === "start_location") {
            dispatch(setStartLocationName(item?.geometry?.location))
        }
        if (fieldType.field === "end_location") {
            dispatch(setEndLocationName(item?.geometry?.location))
        }

        setStartLocation(item?.name)
        setLocationData({ locationInfo: item, field: fieldType })
        setSearchText(startlocation)
        // locations(combiledata)
        setCombineData(searchText)

        passData({ locationInfo: item, field: fieldType })
        close()
    }
    const placesApi = () => {
        var requestOptions = {
            method: 'GET',
        };
        fetch(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${searchText}&inputtype=textquery&fields=formatted_address%2Cname%2Crating%2Copening_hours%2Cgeometry&key=AIzaSyBT3XhTYSxX_qkt_pTejFOrB5TWeFUL6Jk`, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('places api result:::::', result)
                setSearchResult(result?.candidates)
                setSearchData(result?.candidates)
            })
            .catch(error => console.log('error', error));
    }
    return (
        <div>
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
                                        placeholder="Search location"
                                        value={searchText}
                                        onChange={(e) => {
                                            if (e.target.value) {
                                                setSearchText(e.target.value)
                                            }
                                            else {
                                                setSearchText('')
                                            }
                                            placesApi()
                                        }}
                                        inputProps={{ 'aria-label': 'search google maps' }} />
                                    <IconButton
                                        onClick={placesApi}
                                        type="button" sx={{ p: '10px' }} aria-label="search">
                                        <img src={search} />
                                    </IconButton>
                                </Paper>
                            </div>
                        </div>
                        {searchData?.length === 0||searchData==='' ?
                            <>
                                <div style={{ height: '50vh', width: '50vw', marginRight: '30px', overflowY: 'auto',  }}>
                                    <div className='d-flex justfyContent-center column w-95per h-30vh'>
                                        <span style={{ fontSize: '25px', color: 'grey', textAlign: 'center' }} >Search location</span>
                                    </div>
                                </div>
                            </>
                            :
                            <div style={{ height: '50vh', width: '50vw', marginRight: '30px', overflowY: 'auto' }}>
                                <div className='d-flex justfyContent-center alignItem-start column'>
                                    {searchData?.map((item) =>
                                        <div style={{ padding: '10px' }} className='d-flex row alignItem-center curser w-95per'>
                                            <div>
                                                <img src={map} />
                                            </div>
                                            <div className='d-flex column pl-10px pr-10px w-95per' onClick={() => searchFunction(item)} >
                                                <span style={{ fontSize: '15px', color: 'black' }} >{item?.name}</span>
                                                <span style={{ fontSize: '12px', color: '#6a737d' }}
                                                >
                                                    {item?.formatted_address}
                                                </span>
                                                <hr className='w-100per' />
                                            </div>


                                        </div>
                                    )}

                                </div>
                                {/* <GoogleMapReact
                            bootstrapURLKeys={{ key: 'AIzaSyBT3XhTYSxX_qkt_pTejFOrB5TWeFUL6Jk' }}
                            center={center}
                            zoom={zoom}

                            yesIWantToUseGoogleMapApiInternals
                            onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
                        >
                            {selectedLocation && (
                                <Marker
                                    lat={selectedLocation.lat}
                                    lng={selectedLocation.lng}
                                    text="Selected Location"
                                />
                            )}
                        </GoogleMapReact> */}

                            </div>
                        }
                    </Box>

                </Fade>
            </Modal>
        </div>
    );
}