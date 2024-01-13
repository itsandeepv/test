// import React, { useState, useRef, useEffect } from "react";
// import axios from "axios";
// import { GoogleMap, StandaloneSearchBox, Marker,useJsApiLoader } from "@react-google-maps/api";
// const google = window.google;

// export const Map = () => {
//   const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 });
//   const [markers, setMarkers] = useState([]);
//   const [bounds, setBounds] = useState(null);
//   const [pinLocation, setPinLocation] = useState(null);
//   const { isLoaded } = useJsApiLoader({
//     id: 'google-map-script',
//     googleMapsApiKey: "YOUR_API_KEY"
//   })

//   const searchBoxRef = useRef(null);
//   // const fetchDistanceMatrix = async () => {
//   //   try {
//   //     const response = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=jaipur&destinations=delhi&key=AIzaSyBT3XhTYSxX_qkt_pTejFOrB5TWeFUL6Jk`);
//   //     // Handle the response here
//   //     console.log(response.data.rows);
//   //     let data = response.data.rows
//   //     data.map((item) => {
//   //       console.log('item::::::::', item)
//   //     })
//   //   } catch (error) {
//   //     // Handle any errors here
//   //     console.error(error);
//   //   }
//   // };
//   const onMapLoad = (map) => {
//     navigator?.geolocation.getCurrentPosition(({ coords: { latitude: lat, longitude: lng } }) => {
//       const pos = { lat, lng };
//       setCurrentLocation(pos);
//       console.log('posssss::::::',pos)
//     });

//     google.maps.event.addListener(map, "bounds_changed", () => {
//       setBounds(map.getBounds());
//     });
//   };
//   const handleMapClick = ({ lat, lng }) => {
//         console.log(`Latitude: ${lat}, Longitude: ${lng}`);
//         setPinLocation({ lat, lng });
//         console.log('pinloaction lat long:::',pinLocation)
//       };
//   const onSBLoad = (ref) => {
//     searchBoxRef.current = ref;
//   };

//   const onPlacesChanged = () => {
//     const newMarkers = searchBoxRef.current.getPlaces().map((result) => result.geometry.location);
//     setMarkers(newMarkers);
//   };
//   useEffect(() => {
//     // fetchDistanceMatrix()
//     if ('geolocation' in navigator) {
//             navigator.geolocation.getCurrentPosition(
//               (position) => {
//                 const { latitude, longitude } = position.coords;
//                 setCurrentLocation({ lat: latitude, lng: longitude });
//               },
//               (error) => {
//                 console.error('Error getting location:', error.message);
//               }
//             );
//           } else {
//             console.error('Geolocation is not supported by your browser');
//           }
//     console.log(markers);
//   }, [markers]);

//   return (
//     <div>
//       <div id="searchbox mt-30px alignSelf-center">
//         <StandaloneSearchBox onLoad={onSBLoad} onPlacesChanged={onPlacesChanged} bounds={bounds}>
//           <input
//             type="text"
//             placeholder="Customized your placeholder"
//             style={{
//               boxSizing: `border-box`,
//               border: `1px solid transparent`,
//               width: `240px`,
//               height: `32px`,
//               padding: `0 12px`,
//               borderRadius: `3px`,
//               boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
//               fontSize: `14px`,
//               outline: `none`,
//               textOverflow: `ellipses`,
//               position: "absolute",
//               left: "50%",
//               marginLeft: "-120px",
//             }}
//           />
//         </StandaloneSearchBox>
//       </div>
//       <br />
//       {isLoaded ? (

//       <div className="mt-30px">
//         <GoogleMap
//           center={currentLocation}
//           zoom={10}
//           onClick={handleMapClick}
//           onLoad={(map) => onMapLoad(map)}
//           mapContainerStyle={{ height: "600px", width: "800px" }}
//           pinLocation={pinLocation}
//         >
//           {markers.map((mark, index) => (
//             <Marker key={index} position={mark} />
//           ))}
//         </GoogleMap>
//       </div>
//       ): <></>
//           }
//     </div>
//   );
// };

// export default Map;


// import React, { useEffect, useState } from 'react';
// import GoogleMapReact from 'google-map-react';
// import axios from 'axios';
// import pin from '../assets/images/pin.svg'
// import CustomizedSearchInput from './search.tsx';
// const Map = ({ onClick, center, zoom }) => {
//   const [pinLocation, setPinLocation] = useState({ lat: 37.7749, lng: -122.4194 });

//   const PinMarker = ({ text }) => (
//     <div>
//       <img src={pin} style={{ height: '30px', width: '30px' }} />
//     </div>
//   );


//   return (
//     <div style={{ height: '500px', width: '100%' }}>
//       <GoogleMapReact
//         bootstrapURLKeys={{ key: 'AIzaSyBT3XhTYSxX_qkt_pTejFOrB5TWeFUL6Jk' }}
//         defaultCenter={center}
//         defaultZoom={zoom}
//         onClick={(event) => onClick({ lat: event.lat, lng: event.lng })}

//       >

//         <PinMarker lat={pinLocation.lat} lng={pinLocation.lng} text="Pin" />
//       </GoogleMapReact>
//     </div>
//   );
// };

// const GoogleMap = () => {
//   const [startLocationlat, setStartLocationlat] = useState()
//   const [startLocationlng, setStartLocationlng] = useState()
//   const [endLocationlat, setEndLocationlat] = useState()
//   const [endLocationlng, setEndLocationlng] = useState()
//   const handleMapClick = ({ lat, lng }) => {
//     console.log(`Latitude: ${lat}, Longitude: ${lng}`);
//     setStartLocationlat(lat)
//     setStartLocationlng(lng)
//     setEndLocationlat(lat)

//     console.log('startlocation data ::::::', startLocationlat)
//     console.log('endlocation data ::::::', endLocationlat)
//   };


//   const fetchDistanceMatrix = async () => {
//     try {
//       const response = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${startLocationlat}${startLocationlng}&destinations=${endLocationlat}${endLocationlng}&key=AIzaSyBT3XhTYSxX_qkt_pTejFOrB5TWeFUL6Jk`);
//       // Handle the response here
//       console.log(response.data.rows);
//       let data = response.data.rows
//       data.map((item) => {
//         console.log('item::::::::', item)
//       })
//     } catch (error) {
//       // Handle any errors here
//       console.error(error);
//     }
//   };
//   const [location, setLocation] = useState({ lat: null, lng: null });

//   const center = { lat: 37.7749, lng: -122.4194 }; // Initial center coordinates
//   const zoom = 15; // Initial zoom level

//   useEffect(() => {
//     fetchDistanceMatrix()
//     // Check if Geolocation is supported by the browser
//     if ('geolocation' in navigator) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords;
//           setLocation({ lat: latitude, lng: longitude });
//         },
//         (error) => {
//           console.error('Error getting location:', error.message);
//         }
//       );
//     } else {
//       console.error('Geolocation is not supported by your browser');
//     }
//   }, []);
//   console.log("current location>>", location)
//   return (
//     <div>
//       <h1>Click on the map to get coordinates</h1>
//       <div className='d-flex justfyContent-center'>
//         <CustomizedSearchInput />
//       </div>
//       <Map onClick={(e) => handleMapClick(e)} center={center} zoom={zoom} />
//     </div>
//   );
// };

// export default GoogleMap;

// import React from 'react';
// import {APIProvider, Map} from '@vis.gl/react-google-maps';
// const GoogleMap = () => (
//   <APIProvider apiKey={'AIzaSyBT3XhTYSxX_qkt_pTejFOrB5TWeFUL6Jk'}>
//     <Map
//       zoom={3}
//       center={{lat: 22.54992, lng: 0}}
//       gestureHandling={'greedy'}
//       disableDefaultUI={true}
//     />
//   </APIProvider>
// );

// export default GoogleMap


// import React, { useState, useEffect } from 'react';
// import GoogleMapReact from 'google-map-react';
// import pin from '../assets/images/pin.svg'
// import axios from 'axios';
// const Map = ({ onClick, center, zoom }) => {

//     return (
//         <div style={{ height: '500px', width: '100%' }}>
//             <GoogleMapReact
//                 bootstrapURLKeys={{ key: 'AIzaSyBT3XhTYSxX_qkt_pTejFOrB5TWeFUL6Jk' }}
//                 defaultCenter={center}
//                 defaultZoom={zoom}
//                 onClick={(event) => onClick({ lat: event.lat, lng: event.lng })}
//             ></GoogleMapReact>
//         </div>
//     );
// };

// const PinMarker = ({ text }) => (
//     <div>
//         <img src={pin} style={{ height: '30px', width: '30px' }} />
//     </div>
// );

// const GoogleMap = () => {
//     const [startLocationlat, setStartLocationlat] = useState()
//   const [startLocationlng, setStartLocationlng] = useState()
//   const [endLocationlat, setEndLocationlat] = useState()
//   const [endLocationlng, setEndLocationlng] = useState()
//     const [location, setLocation] = useState({ lat: null, lng: null });
//     const center = { lat: 37.7749, lng: -122.4194 }; // Initial center coordinates
//     const zoom = 15; // Initial zoom level
//     const [pinLocation, setPinLocation] = useState({ lat: 37.7749, lng: -122.4194 });
//     const fetchDistanceMatrix = async () => {
//         try {
//             const response = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${startLocationlat}${startLocationlng}&destinations=${endLocationlat}${endLocationlng}&key=AIzaSyBT3XhTYSxX_qkt_pTejFOrB5TWeFUL6Jk`);
//             // Handle the response here
//             console.log(response.data.rows);
//             let data = response.data.rows
//             data.map((item) => {
//                 console.log('item::::::::', item)
//             })
//         } catch (error) {
//             // Handle any errors here
//             console.error(error);
//         }
//     };
//     useEffect(() => {
//         fetchDistanceMatrix()
//     }, [])
//     const handleMapClick = (event) => {
//         console.log("event>>", event)
//         setPinLocation({ lat: event.lat, lng: event.lng });
//         console.log('pinlocation::::>>>',pinLocation)
//             console.log('startlocation data ::::::', startLocationlat)
//             console.log('endlocation data ::::::', endLocationlat)
//     };

//     useEffect(() => {
//         // Check if Geolocation is supported by the browser
//         if ('geolocation' in navigator) {
//             navigator.geolocation.getCurrentPosition(
//                 (position) => {
//                     const { latitude, longitude } = position.coords;
//                     setLocation({ lat: latitude, lng: longitude });
//                 },
//                 (error) => {
//                     console.error('Error getting location:', error.message);
//                 }
//             );
//         } else {
//             console.error('Geolocation is not supported by your browser');
//         }
//     }, []);

//     console.log("current location>>", location)
//     console.log("pinLocation location>>", pinLocation)

//     return (
//         <div style={{ height: '500px', width: '100%' }}>
//             <GoogleMapReact
//                 bootstrapURLKeys={{ key: 'AIzaSyBT3XhTYSxX_qkt_pTejFOrB5TWeFUL6Jk' }}
//                 center={pinLocation}
//                 defaultZoom={15}
//                 onClick={handleMapClick}
//             >
//                 <PinMarker lat={pinLocation.lat} lng={pinLocation.lng} text="Pin" />
//                 <Map onClick={handleMapClick} center={center} zoom={zoom} />
//             </GoogleMapReact>
//         </div>
//     );
// };

// export default GoogleMap;

import React, { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import axios from 'axios';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import search from '../assets/images/search.svg'
const GoogleMap = () => {
    const [center, setCenter] = useState({ lat: 40.7128, lng: -74.0060 }); // Default to New York City
    const [zoom, setZoom] = useState(11);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [searchData, setSearchData] = useState([]);
    const [startlocation,setStartLocation] = useState('')
    const handleApiLoaded = (map, maps) => {
        map.addListener('click', (e) => {
            setCenter({ lat: e.latLng.lat(), lng: e.latLng.lng() });
            setZoom(14);
            setSelectedLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() });
        });
    };
    const placesApi = () => {
        var requestOptions = {
            method: 'GET',
        };
        fetch(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${searchText}&inputtype=textquery&fields=formatted_address%2Cname%2Crating%2Copening_hours%2Cgeometry&key=AIzaSyBT3XhTYSxX_qkt_pTejFOrB5TWeFUL6Jk`, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('places api result:::::', result)
                const ResultApi = result.candidates;
                setSearchResult(ResultApi)
            })
            .catch(error => console.log('error', error));
    }
    const handleDistanceMatrixRequest = () => {
        if (selectedLocation) {
            const origins = `${center.lat},${center.lng}`;
            const destinations = `${selectedLocation.lat},${selectedLocation.lng}`;
            const apiKey = 'AIzaSyBT3XhTYSxX_qkt_pTejFOrB5TWeFUL6Jk';
            const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&key=${apiKey}`;

            axios.get(url)
                .then(response => {
                    // Handle the distance matrix API response here
                    console.log(response?.data?.rows);
                })
                .catch(error => {
                    // Handle any errors here
                    console.error(error);
                });
        }
    };

    return (
        <div style={{ height: '100vh', width: '100%' }}>
            <div className='d-flex justfyContent-center'>
                <Box component="form"
                    sx={{ '& > :not(style)': { m: 1 }, width: { sm: '30vw', xs: '45vw' }, }}
                    noValidate
                    autoComplete="off">
                    <Paper component="form"
                        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 'auto', backgroundColor: '#F4F4F4', boxShadow: 'none', borderRadius: '10px' }}>
                        <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="Search"
                            value={searchText}
                            onChange={(e) => {
                                console.log('staretttt:::', e.target.value)
                                if (e.target.value) {
                                    setSearchText(e.target.value)
                                    setSearchData(searchResult)
                                }
                                else {
                                    setSearchText('')
                                    setSearchData(null)
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
                </Box>

            </div>
            <div className='d-flex justfyContent-center'>
                {searchData?.map((item) => 
                    <div style={{ padding: '10px', display:'flex', flexDirection:'column'}}>
                        <span style={{ fontSize: '15px', color: 'black' }} onClick={()=>setStartLocation(item?.formatted_address)}>{item?.formatted_address}</span>
                        <span style={{ fontSize: '15px', color: 'black' }} onClick={()=>{
                            setStartLocation(item?.name)
                            setSearchText(startlocation)
                            }}>{item?.name}{console.log('datat::::>>',startlocation)}</span>
                         
                    </div>
                )}

            </div>
            <div style={{ height: '40px', width: '100px' }}>
                <button onClick={handleDistanceMatrixRequest}>Get Distance</button>

            </div>
            <div style={{ height: '50vh', width: '80vw', marginRight: '30px' }}>
                <GoogleMapReact
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
                </GoogleMapReact>

            </div>
        </div>
    );
};

const Marker = ({ text }) => <div style={{ color: 'red', backgroundColor: '#3456789' }}>{text}</div>;

export default GoogleMap;
