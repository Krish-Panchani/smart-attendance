import { useEffect, useState } from "react";
import { collection, addDoc, Timestamp, query, onSnapshot} from 'firebase/firestore';
import { db } from '../../firebase';
import PropTypes from 'prop-types';
// import { query } from "firebase/database";

const AddOffice = ({ user }) => {
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const [officeName, setOfficeName] = useState('');
    const [currentLocation, setCurrentLocation] = useState({ lat: '', lng: '' });
    const [offices, setOffices] = useState([]);


    console.log("user", user);
    useEffect(() => {
        const q = query(collection(db, "offices"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const offices = [];
            querySnapshot.forEach((doc) => {
                offices.push({ ...doc.data(), id: doc.id });
            });
            setOffices(offices);
        });
        return unsubscribe;
    }, []);
    console.log(offices);


    const handleSetCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCurrentLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            (error) => console.error('Error fetching location:', error)
        );
        console.log(currentLocation);
    }

    const handleOficeName = (e) => {
        setOfficeName(e.target.value);
        console.log(officeName);
    }
    const handleLat = (e) => {
        setLatitude(e.target.value);
        console.log(latitude);
    }
    const handleLng = (e) => {
        setLongitude(e.target.value);
        console.log(longitude);
    }




    const handleSubmit = async () => {
        try {
            const randomId = () => Math.random().toString(36).substr(2, 4);


            await addDoc(collection(db, 'offices'), {
                uniqueId: officeName.replace(/\s+/g, '-').toLowerCase() + '-' + randomId(),
                name: officeName,
                lat: currentLocation.lat || latitude,  // Use currentLocation.lat if available, otherwise fallback to latitude state
                lng: currentLocation.lng || longitude, // Use currentLocation.lng if available, otherwise fallback to longitude state
                createdOn: Timestamp.now(),
                createdBy: user.uid,
                admin: user.email,
            });

            setOfficeName('');
            setLatitude(0);
            setLongitude(0);
            alert('Office added successfully!');
        } catch (error) {
            console.error('Error adding office:', error);
        }
    }

    AddOffice.propTypes = {
        user: PropTypes.object.isRequired,
    };

    const handleAddEmployee = () => {
        console.log("Add Employee");
    }


    return (
        <>
  {!offices && (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Add Office</h1>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Office Name"
          value={officeName}
          onChange={handleOficeName}
          className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:border-indigo-500"
        />
        <input
          type="number"
          placeholder="Latitude"
          value={currentLocation ? currentLocation.lat : latitude}
          onChange={handleLat}
          className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:border-indigo-500"
        />
        <input
          type="number"
          placeholder="Longitude"
          value={currentLocation ? currentLocation.lng : longitude}
          onChange={handleLng}
          className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:border-indigo-500"
        />
        <div className="flex space-x-4 mt-4">
          <button
            onClick={handleSetCurrentLocation}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Set Current Location
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            Add Office
          </button>
        </div>
      </div>
    </div>
  )}

  <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
    <h1 className="text-2xl font-bold mb-4 text-gray-800">Offices</h1>
    <ul className="space-y-4">
      {offices.map((office) => (
        <li
          key={office.id}
          className="p-4 bg-gray-100 rounded-lg shadow-md flex justify-between items-center"
        >
          <div>
            <p className="text-sm font-medium text-gray-500">ID: {office.uniqueId}</p>
            <p className="text-lg font-semibold text-gray-700">{office.name}</p>
            <p className="text-sm text-gray-600">Latitude: {office.lat}</p>
            <p className="text-sm text-gray-600">Longitude: {office.lng}</p>
          </div>
          <div className="flex space-x-2">
            <button className="bg-yellow-400 text-white px-2 py-1 rounded-md hover:bg-yellow-500">
              Edit Office
            </button>
            <button
              onClick={handleAddEmployee}
              className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600"
            >
              Add Employee
            </button>
          </div>
        </li>
      ))}
    </ul>
  </div>
</>

    );
}

export default AddOffice;