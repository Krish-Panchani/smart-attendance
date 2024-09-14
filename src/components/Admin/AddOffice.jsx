import { useEffect, useState } from "react";
import { collection, addDoc, updateDoc, doc, Timestamp, query, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import PropTypes from 'prop-types';

const AddOffice = ({ user }) => {
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const [officeName, setOfficeName] = useState('');
    const [checkinDistance, setCheckinDistance] = useState(0); // Add state for checkinDistance
    const [offices, setOffices] = useState([]);
    const [editingOffice, setEditingOffice] = useState(null);
    const [userOfficeExists, setUserOfficeExists] = useState(false);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const q = query(collection(db, "offices"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const allOffices = [];
            querySnapshot.forEach((doc) => {
                allOffices.push({ ...doc.data(), id: doc.id });
            });
            
            const adminOffices = allOffices.filter(office => office.admin === user.email);
            setOffices(adminOffices);
            setUserOfficeExists(adminOffices.length > 0);
        });
        return unsubscribe;
    }, [user.email]);

    const handleSetCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLatitude(latitude);
                setLongitude(longitude);
            },
            (error) => console.error('Error fetching location:', error)
        );
    };

    const handleOfficeName = (e) => {
        setOfficeName(e.target.value);
    };

    const handleLat = (e) => {
        setLatitude(parseFloat(e.target.value));
    };

    const handleLng = (e) => {
        setLongitude(parseFloat(e.target.value));
    };

    const handleCheckinDistance = (e) => {
        setCheckinDistance(parseFloat(e.target.value)); // Update checkinDistance state
    };

    const handleSubmit = async () => {
        try {
            if (userOfficeExists && !editingOffice) {
                alert('You already have an office. You cannot add another.');
                return;
            }

            if (editingOffice) {
                const officeRef = doc(db, 'offices', editingOffice.id);
                await updateDoc(officeRef, {
                    name: officeName,
                    lat: latitude,
                    lng: longitude,
                    checkinDistance, // Include checkinDistance in update
                });
                alert('Office updated successfully!');
            } else {
                const randomId = () => Math.random().toString(36).substr(2, 4);
                await addDoc(collection(db, 'offices'), {
                    uniqueId: officeName.replace(/\s+/g, '-').toLowerCase() + '-' + randomId(),
                    name: officeName,
                    lat: latitude,
                    lng: longitude,
                    checkinDistance, // Include checkinDistance in addition
                    createdOn: Timestamp.now(),
                    createdBy: user.uid,
                    admin: user.email,
                });
                alert('Office added successfully!');
            }

            resetForm();
            setShowForm(false);
        } catch (error) {
            console.error('Error adding/updating office:', error);
        }
    };

    const resetForm = () => {
        setOfficeName('');
        setLatitude(0);
        setLongitude(0);
        setCheckinDistance(0); // Reset checkinDistance
        setEditingOffice(null);
    };

    const handleEditOffice = (office) => {
        setEditingOffice(office);
        setOfficeName(office.name);
        setLatitude(office.lat);
        setLongitude(office.lng);
        setCheckinDistance(office.checkinDistance || 0); // Set checkinDistance for editing
        setShowForm(true);
    };

    const handleAddOfficeClick = () => {
        setShowForm(true);
    };

    const handleCancel = () => {
        resetForm();
        setShowForm(false);
    };

    AddOffice.propTypes = {
        user: PropTypes.object.isRequired,
    };

    const handleAddEmployee = () => {
        console.log("Add Employee");
    };

    return (
        <>
            {!showForm && !userOfficeExists && (
                <button
                    onClick={handleAddOfficeClick}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 mt-8 mx-auto block"
                >
                    Add Office
                </button>
            )}

            {(showForm || editingOffice) && (
                <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
                    <h1 className="text-2xl font-bold mb-4 text-gray-800">{editingOffice ? 'Edit Office' : 'Add Office'}</h1>
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Office Name"
                            value={officeName}
                            onChange={handleOfficeName}
                            className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:border-indigo-500"
                        />
                        <input
                            type="number"
                            placeholder="Latitude"
                            value={latitude}
                            onChange={handleLat}
                            className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:border-indigo-500"
                        />
                        <input
                            type="number"
                            placeholder="Longitude"
                            value={longitude}
                            onChange={handleLng}
                            className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:border-indigo-500"
                        />
                        <input
                            type="number"
                            placeholder="Check-in Distance"
                            value={checkinDistance}
                            onChange={handleCheckinDistance} // Add handler for checkinDistance
                            className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:border-indigo-500"
                        />
                        <div className="flex flex-wrap space-x-4 mt-4">
                            <button
                                onClick={handleSetCurrentLocation}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full sm:w-auto"
                            >
                                Set Current Location
                            </button>
                            <button
                                onClick={handleSubmit}
                                className={`bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 w-full sm:w-auto ${userOfficeExists && !editingOffice ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={userOfficeExists && !editingOffice}
                            >
                                {editingOffice ? 'Update Office' : 'Add Office'}
                            </button>
                            {editingOffice && (
                                <button
                                    onClick={handleCancel}
                                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 w-full sm:w-auto"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {offices.length > 0 && (
                <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
                    <h1 className="text-2xl font-bold mb-4 text-gray-800">Your Office</h1>
                    <ul className="space-y-4">
                        {offices.map((office) => (
                            <li
                                key={office.id}
                                className="p-4 bg-gray-100 rounded-lg shadow-md flex justify-between items-center flex-wrap"
                            >
                                <div className="w-full sm:w-auto">
                                    <p className="text-sm font-medium text-gray-500">ID: {office.uniqueId}</p>
                                    <p className="text-lg font-semibold text-gray-700">{office.name}</p>
                                    <p className="text-sm text-gray-600">Latitude: {office.lat}</p>
                                    <p className="text-sm text-gray-600">Longitude: {office.lng}</p>
                                    <p className="text-sm text-gray-600">Check-in Distance: {office.checkinDistance || 'N/A'}</p> {/* Display checkinDistance */}
                                </div>
                                <div className="flex space-x-2 mt-2 sm:mt-0">
                                    <button
                                        onClick={() => handleEditOffice(office)}
                                        className="bg-yellow-400 text-white px-2 py-1 rounded-md hover:bg-yellow-500"
                                    >
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
            )}
        </>
    );
}

export default AddOffice;
