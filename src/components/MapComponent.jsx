import { useState, useEffect } from 'react';
import { Map, Marker, InfoWindow, AdvancedMarker } from '@vis.gl/react-google-maps';
import PropTypes from 'prop-types';

const MapComponent = ({ userLocation, officeLocation, range }) => {
  const [infoContent, setInfoContent] = useState('');
  console.log('userLocation', userLocation);
  console.log('officeLocation', officeLocation);

  useEffect(() => {
    if (userLocation && officeLocation) {
      const getDistance = (loc1, loc2) => {
        const R = 6371; // Radius of Earth in kilometers
        const dLat = toRad(loc2.lat - loc1.lat);
        const dLng = toRad(loc2.lng - loc1.lng);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(toRad(loc1.lat)) * Math.cos(toRad(loc2.lat)) *
          Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in kilometers
        return distance * 1000; // Convert to meters
      };

      const distance = getDistance(userLocation, officeLocation);
      setInfoContent(distance <= range ? 'You are in range. Check-in now!' : '');
    }
  }, [userLocation, officeLocation, range]);

  const toRad = (value) => value * (Math.PI / 180);

  return (

    <Map
      // style={{ width: "100vw", height: "100vh" }}
      className='w-full h-[500px] rounded-2xl border-2 border-black shadow-xl px-1 py-1'

      defaultCenter={officeLocation}
      defaultZoom={13}
      gestureHandling={"greedy"}
      disableDefaultUI={true}
      mapId={import.meta.env.VITE_MAP_ID}
    >

      {officeLocation && (
        <Marker
          position={officeLocation}
          label="Office"
        // onClick={() => setInfoContent('Office Location')}
        />
      )}

      {officeLocation && (
        <AdvancedMarker
          position={officeLocation}
          className="w-[250px] bg-white flex flex-col items-center gap-1 py-3 px-3 rounded-xl shadow-xl"
        >
          <h2 className="text-[20px] font-medium">Your Office</h2>
          {infoContent && <p>{infoContent}</p>}

          <svg
            className="absolute text-white h-10 w-full left-0 top-full"
            x="0px"
            y="0px"
            viewBox="0 0 255 255"
            xmlSpace="preserve"
          >
            <polygon
              className="fill-current shadow-lg"
              points="0,0 127.5,127.5 255,0"
            />
          </svg>
        </AdvancedMarker>
      )}
      {userLocation && (
       <Marker position={userLocation} />
      )}
      {/* Use a different way to represent the range if necessary */}
      {infoContent && userLocation && (
        <InfoWindow position={userLocation}>
          <div>{infoContent}</div>
        </InfoWindow>
      )}
    </Map>
  );
};

MapComponent.propTypes = {
  userLocation: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }),
  officeLocation: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }),
  range: PropTypes.number.isRequired,
};

MapComponent.defaultProps = {
  userLocation: { lat: 0, lng: 0 },
  officeLocation: { lat: 0, lng: 0 },
  range: 0,
};

export default MapComponent;
