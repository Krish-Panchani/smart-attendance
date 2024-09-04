import {APIProvider, Map} from '@vis.gl/react-google-maps';

export default function GoogleMap() {
  return (
    <APIProvider apiKey={import.meta.env.VITE_REACT_GOOGLE_MAPS_API_KEY}>
    <Map
      style={{ width: "100vw", height: "100vh" }}
      defaultCenter={{ lat: 53.54992, lng: 10.00678 }}
      defaultZoom={13}
      gestureHandling={"greedy"}
      disableDefaultUI={true}
      
    >
    </Map>
  </APIProvider>
  );
}