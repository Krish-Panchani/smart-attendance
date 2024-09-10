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
        <div>
            <h1>Add Office</h1>
            <input type="text" placeholder="Office Name" value={officeName} onChange={handleOficeName} />
            <input type="number" placeholder="Latitude" value={currentLocation ? currentLocation.lat : latitude} onChange={handleLat} />
            <input type="number" placeholder="Longitude" value={currentLocation ? currentLocation.lng : longitude} onChange={handleLng} />
            <button onClick={handleSetCurrentLocation}>Set Current Location</button>
            <button onClick={handleSubmit}>Add Office</button>
        </div>
        <div>
            <h1>Offices</h1>
            <ul>
                {offices.map((offices) => (
                    <>
                    <li key={offices.id}>
                        <p>{offices.uniqueId}</p>
                        <p>{offices.name}</p>
                        <p>{offices.lat}</p>
                        <p>{offices.lng}</p>
                    </li>
                    <button onClick={handleAddEmployee}>Add Employee</button>
                    </>
                ))}
            </ul>
        </div>
        </>
    );
}

export default AddOffice;