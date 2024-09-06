import PropTypes from 'prop-types';
const RegistrationForm = ({ handleSubmit, name, setName, employeeId, setEmployeeId }) => (
    <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Employee Registration</h2>
        <div className="flex flex-col">
            <label className="block text-gray-700 font-medium mb-1">Name:</label>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
            />
        </div>
        <div className="flex flex-col">
            <label className="block text-gray-700 font-medium mb-1">Employee ID:</label>
            <input
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your employee ID"
            />
        </div>
        <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
        >
            Register
        </button>
    </form>
);

RegistrationForm.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    setName: PropTypes.func.isRequired,
    employeeId: PropTypes.string.isRequired,
    setEmployeeId: PropTypes.func.isRequired,
  };
  

export default RegistrationForm;
