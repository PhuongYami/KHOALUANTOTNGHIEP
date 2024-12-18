import axios from 'axios';

const ICE_SERVER_API_URL = process.env.REACT_APP_BACKEND_URL
    ? `${ process.env.REACT_APP_BACKEND_URL }/api/iceServers`
    : 'http://localhost:5000/api/iceServers';

const getICEServers = async () =>
{
    try
    {
        const response = await axios.get(ICE_SERVER_API_URL);
        return response.data.iceServers;
    } catch (error)
    {
        console.error('Lỗi khi gọi API ICE Servers:', error);
        throw new Error('Không thể lấy danh sách ICE Servers từ backend');
    }
};

export default {
    getICEServers
};
