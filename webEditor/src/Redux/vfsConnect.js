import axios from 'axios';

// set up a .env file BEFORE COMMIT
const API_URL = 'http://localhost:3000';

export const addFiles = async (files) => {
    try {
        const response = await axios.post(`${API_URL}/upldFiles`, { files } );
        return response.data;
    } catch (err) {
        console.error('Error adding files: ', err);
    }
};

export const updateFiles = async (parentHandleName, fileHandleName) => {
    try {
        const response = axios.put(`${API_URL}/updtFiles`)
    } catch (err) {
        console.error('Error updating files: ', err);
    }
};