// // // import React from "react";

// // // export const GoogleMap =()=>{
// // //     return(
// // //         <div>Google Map</div>
// // //     )
// // // }
// // import axios from 'axios';
// // import React, { useEffect } from "react";
// // import GoogleMapReact from 'google-map-react';
// // import { useState } from 'react';

// // const AnyReactComponent = ({ text }) => <div>{text}</div>;

// // export default function GoogleMap() {
// //     const defaultProps = {
// //         center: {
// //             lat: 10.99835602,
// //             lng: 77.01502627
// //         },
// //         zoom: 11
// //     };
// //     // useEffect(() => {
// //     //     ServiceCall("https://maps.googleapis.com/maps/api/distancematrix/json?origins=Seattle&destinations=San+Francisco&key=AIzaSyBT3XhTYSxX_qkt_pTejFOrB5TWeFUL6Jk")
// //     // })
// //     const ServiceCall = async (url) => {
// //         try {
// //             console.log("ServiceCall call")
// //             const response = await axios.post(url);
// //             console.log("response>>", response);
// //             return response.data; // You may want to return some data to the caller
// //         } catch (error) {
// //             console.error("error>>", error);
// //             // throw error; // Rethrow the error to allow the calling code to handle it
// //         } finally {
// //             // always executed
// //         }
// //     };

// //     return (
// //         // Important! Always set the container height explicitly
// //         <div style={{ height: '100vh', width: '100%' }}>
// //             <GoogleMapReact
// //                 bootstrapURLKeys={{ key: "AIzaSyBT3XhTYSxX_qkt_pTejFOrB5TWeFUL6Jk" }}
// //                 defaultCenter={defaultProps.center}
// //                 defaultZoom={defaultProps.zoom}
// //             >
// //                 <AnyReactComponent
// //                     lat={59.955413}
// //                     lng={30.337844}
// //                     text="My Marker sjhdadsjhcf dafds f"
// //                 />
// //             </GoogleMapReact>
// //         </div>
// //     );
// // }


// // this one

// import React, { useEffect,useState } from 'react';
// import GoogleMapReact from 'google-map-react';
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

// const GoogleMap = () => {
//     const handleMapClick = ({ lat, lng }) => {
//         console.log(`Latitude: ${lat}, Longitude: ${lng}`);
//     };
//     const [location, setLocation] = useState({ lat: null, lng: null });

//     const center = { lat: 37.7749, lng: -122.4194 }; // Initial center coordinates
//     const zoom = 15; // Initial zoom level

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
//     console.log("current location>>",location)
//     return (
//         <div>
//             <h1>Click on the map to get coordinates</h1>
//             <Map onClick={handleMapClick} center={center} zoom={zoom} />
//         </div>
//     );
// };

// export default GoogleMap;



















// import React, { useState, useEffect } from 'react';
// import GoogleMapReact from 'google-map-react';
// import pin from '../assets/images/pin.svg'

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
//     // const handleMapClick = ({ lat, lng }) => {
//     //     console.log(`Latitude: ${lat}, Longitude: ${lng}`);
//     // };
//     const [location, setLocation] = useState({ lat: null, lng: null });

//     const center = { lat: 37.7749, lng: -122.4194 }; // Initial center coordinates
//     const zoom = 15; // Initial zoom level


//     const [pinLocation, setPinLocation] = useState({ lat: 37.7749, lng: -122.4194 });

//     const handleMapClick = (event) => {
//         console.log("event>>",event)
//         setPinLocation({ lat: event.lat, lng: event.lng });
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
//                 {/* <Map onClick={handleMapClick} center={center} zoom={zoom} /> */}
//             </GoogleMapReact>
//         </div>
//     );
// };

// export default GoogleMap;




// // import React, { useEffect, useState } from 'react';
// // import GoogleMapReact from 'google-map-react';

// // const Map = ({ onClick, center, zoom, pinLocation }) => {
// //   return (
// //     <div style={{ height: '500px', width: '100%' }}>
// //       <GoogleMapReact
// //         bootstrapURLKeys={{ key: 'AIzaSyBT3XhTYSxX_qkt_pTejFOrB5TWeFUL6Jk' }} // Replace with your API key
// //         defaultCenter={center}
// //         defaultZoom={zoom}
// //         onClick={(event) => onClick({ lat: event.lat, lng: event.lng })}
// //       >
// //         {/* Render the pin at the specified location */}
// //         {pinLocation && <Pin lat={pinLocation.lat} lng={pinLocation.lng} />}
// //       </GoogleMapReact>
// //     </div>
// //   );
// // };

// // // Pin component to render at the clicked location
// // const Pin = () => (
// //   <img
// //     src="path/to/pin-icon.png" // Replace with the path to your pin icon
// //     alt="pin"
// //     style={{
// //       width: '30px',
// //       height: '30px',
// //       position: 'absolute',
// //       transform: 'translate(-50%, -50%)',
// //     }}
// //   />
// // );

// // const GoogleMap = () => {
// //   const [location, setLocation] = useState({ lat: null, lng: null });
// //   const [pinLocation, setPinLocation] = useState(null);

// //   const center = { lat: 37.7749, lng: -122.4194 }; // Initial center coordinates
// //   const zoom = 15; // Initial zoom level

// //   const handleMapClick = ({ lat, lng }) => {
// //     console.log(`Latitude: ${lat}, Longitude: ${lng}`);
// //     setPinLocation({ lat, lng });
// //   };

// //   useEffect(() => {
// //     // Check if Geolocation is supported by the browser
// //     if ('geolocation' in navigator) {
// //       navigator.geolocation.getCurrentPosition(
// //         (position) => {
// //           const { latitude, longitude } = position.coords;
// //           setLocation({ lat: latitude, lng: longitude });
// //         },
// //         (error) => {
// //           console.error('Error getting location:', error.message);
// //         }
// //       );
// //     } else {
// //       console.error('Geolocation is not supported by your browser');
// //     }
// //   }, []);

// //   return (
// //     <div>
// //       <h1>Click on the map to get coordinates</h1>
// //       <Map onClick={handleMapClick} center={center} zoom={zoom} pinLocation={pinLocation} />
// //     </div>
// //   );
// // };

// // export default GoogleMap;


// // import React, { useState, useRef, useEffect } from "react";
// // import axios from "axios";
// // import { GoogleMap, StandaloneSearchBox, Marker,LoadScript } from "@react-google-maps/api";
// // const google = window.google;

// // export const Map = () => {
// //   const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 });
// //   const [markers, setMarkers] = useState([]);
// //   const [bounds, setBounds] = useState(null);
// //   const [pinLocation, setPinLocation] = useState(null);

// //   const searchBoxRef = useRef(null);
// //   // const fetchDistanceMatrix = async () => {
// //   //   try {
// //   //     const response = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=jaipur&destinations=delhi&key=AIzaSyBT3XhTYSxX_qkt_pTejFOrB5TWeFUL6Jk`);
// //   //     // Handle the response here
// //   //     console.log(response.data.rows);
// //   //     let data = response.data.rows
// //   //     data.map((item) => {
// //   //       console.log('item::::::::', item)
// //   //     })
// //   //   } catch (error) {
// //   //     // Handle any errors here
// //   //     console.error(error);
// //   //   }
// //   // };
// //   const onMapLoad = (map) => {
// //     navigator?.geolocation.getCurrentPosition(({ coords: { latitude: lat, longitude: lng } }) => {
// //       const pos = { lat, lng };
// //       setCurrentLocation(pos);
// //       console.log('posssss::::::',pos)
// //     });

// //     google.maps.event.addListener(map, "bounds_changed", () => {
// //       setBounds(map.getBounds());
// //     });
// //   };
// //   const handleMapClick = ({ lat, lng }) => {
// //         console.log(`Latitude: ${lat}, Longitude: ${lng}`);
// //         setPinLocation({ lat, lng });
// //         console.log('pinloaction lat long:::',pinLocation)
// //       };
// //   const onSBLoad = (ref) => {
// //     searchBoxRef.current = ref;
// //   };

// //   const onPlacesChanged = () => {
// //     const newMarkers = searchBoxRef.current.getPlaces().map((result) => result.geometry.location);
// //     setMarkers(newMarkers);
// //   };
// //   useEffect(() => {
// //     // fetchDistanceMatrix()
// //     if ('geolocation' in navigator) {
// //             navigator.geolocation.getCurrentPosition(
// //               (position) => {
// //                 const { latitude, longitude } = position.coords;
// //                 setCurrentLocation({ lat: latitude, lng: longitude });
// //               },
// //               (error) => {
// //                 console.error('Error getting location:', error.message);
// //               }
// //             );
// //           } else {
// //             console.error('Geolocation is not supported by your browser');
// //           }
// //     console.log(markers);
// //   }, [markers]);

// //   return (
// //     <div>
// //       <div id="searchbox mt-30px alignSelf-center">
// //         <StandaloneSearchBox onLoad={onSBLoad} onPlacesChanged={onPlacesChanged} bounds={bounds}>
// //           <input
// //             type="text"
// //             placeholder="Customized your placeholder"
// //             style={{
// //               boxSizing: `border-box`,
// //               border: `1px solid transparent`,
// //               width: `240px`,
// //               height: `32px`,
// //               padding: `0 12px`,
// //               borderRadius: `3px`,
// //               boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
// //               fontSize: `14px`,
// //               outline: `none`,
// //               textOverflow: `ellipses`,
// //               position: "absolute",
// //               left: "50%",
// //               marginLeft: "-120px",
// //             }}
// //           />
// //         </StandaloneSearchBox>
// //       </div>
// //       <br />
// //       <div className="mt-30px">
// //         <GoogleMap
// //           center={currentLocation}
// //           zoom={10}
// //           onClick={handleMapClick}
// //           onLoad={(map) => onMapLoad(map)}
// //           mapContainerStyle={{ height: "600px", width: "800px" }}
// //           pinLocation={pinLocation}
// //         >
// //           {markers.map((mark, index) => (
// //             <Marker key={index} position={mark} />
// //           ))}
// //         </GoogleMap>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Map;
