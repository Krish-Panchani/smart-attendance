import { useEffect, useState } from "react";
import { collection, addDoc, updateDoc, doc, Timestamp, query, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const AddOffice = ({ user }) => {
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const [officeName, setOfficeName] = useState('');
    const [checkinDistance, setCheckinDistance] = useState(0);
    const [offices, setOffices] = useState([]);
    const [editingOffice, setEditingOffice] = useState(null);
    const [userOfficeExists, setUserOfficeExists] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);

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
            setLoading(false);
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
                    checkinDistance,
                });
                alert('Office updated successfully!');
            } else {
                const randomId = () => Math.random().toString(36).substr(2, 4);
                await addDoc(collection(db, 'offices'), {
                    uniqueId: officeName.replace(/\s+/g, '-').toLowerCase() + '-' + randomId(),
                    name: officeName,
                    lat: latitude,
                    lng: longitude,
                    checkinDistance,
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
        setCheckinDistance(0);
        setEditingOffice(null);
    };

    const handleEditOffice = (office) => {
        setEditingOffice(office);
        setOfficeName(office.name);
        setLatitude(office.lat);
        setLongitude(office.lng);
        setCheckinDistance(office.checkinDistance || 0);
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

    return (
        <>
            {!showForm && !userOfficeExists && (
                <button
                    onClick={handleAddOfficeClick}
                    className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 mt-8 mx-auto block shadow-md transition-transform transform hover:scale-105"
                >
                    Add Office
                </button>
            )}

            {(showForm || editingOffice) && (
                <motion.div
                    className="max-w-lg mx-auto p-8 bg-white rounded-lg shadow-lg mt-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-2xl font-bold mb-4 text-gray-800">{editingOffice ? 'Edit Office' : 'Add Office'}</h1>
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Office Name"
                            value={officeName}
                            onChange={(e) => setOfficeName(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:border-indigo-500"
                        />
                        <input
                            type="number"
                            placeholder="Latitude"
                            value={latitude}
                            onChange={(e) => setLatitude(parseFloat(e.target.value))}
                            className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:border-indigo-500"
                        />
                        <input
                            type="number"
                            placeholder="Longitude"
                            value={longitude}
                            onChange={(e) => setLongitude(parseFloat(e.target.value))}
                            className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:border-indigo-500"
                        />
                        <input
                            type="number"
                            placeholder="Check-in Distance (meters)"
                            value={checkinDistance}
                            onChange={(e) => setCheckinDistance(parseFloat(e.target.value))}
                            className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:border-indigo-500"
                        />
                        <div className="flex flex-wrap space-x-4 mt-4">
                            <button
                                onClick={handleSetCurrentLocation}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all w-full sm:w-auto"
                            >
                                Set Current Location
                            </button>
                            <button
                                onClick={handleSubmit}
                                className={`bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-all w-full sm:w-auto ${userOfficeExists && !editingOffice ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={userOfficeExists && !editingOffice}
                            >
                                {editingOffice ? 'Update Office' : 'Add Office'}
                            </button>
                            {editingOffice && (
                                <button
                                    onClick={handleCancel}
                                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-all w-full sm:w-auto"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}

            {loading ? (
                <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
                    <h1 className="text-2xl font-bold mb-4 text-gray-800">Loading Your Office...</h1>
                    <div className="space-y-4">
                        {[1, 2, 3].map((index) => (
                            <motion.div
                                key={index}
                                className="p-6 bg-gray-100 rounded-lg shadow-md animate-pulse"
                                initial={{ opacity: 0.6 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <div className="w-24 h-5 bg-gray-300 rounded-lg mb-4"></div>
                                <div className="w-32 h-4 bg-gray-300 rounded-lg mb-2"></div>
                                <div className="w-36 h-4 bg-gray-300 rounded-lg mb-2"></div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            ) : (
                offices.length > 0 && (
                    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
                        <h1 className="text-2xl font-bold mb-4 text-gray-800">Your Offices</h1>
                        <ul className="space-y-4">
                            {offices.map((office) => (
                                <li
                                    key={office.id}
                                    className="p-6 bg-gray-100 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center border border-gray-200 hover:border-gray-300 transition-all"
                                >
                                    <div className="flex-shrink-0">
                                        <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 text-2xl font-semibold">
                                            {office.name.charAt(0)}
                                        </div>
                                    </div>
                                    <div className="mt-4 sm:mt-0 sm:ml-6 flex-grow">
                                        <p className="text-lg font-bold text-gray-800">{office.name}</p>
                                        <p className="text-sm text-gray-600">Latitude: {office.lat}</p>
                                        <p className="text-sm text-gray-600">Longitude: {office.lng}</p>
                                        <p className="text-sm text-gray-600">Check-in Distance: {office.checkinDistance || 'N/A'} meters</p>
                                    </div>
                                    <div className="flex space-x-2 mt-4 sm:mt-0">
                                        <button
                                            onClick={() => handleEditOffice(office)}
                                            className="bg-yellow-400 text-white px-4 py-2 rounded-md hover:bg-yellow-500 transition-all"
                                        >
                                            Edit Office
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            )}
        </>
    );
}

export default AddOffice;
