import { checkTokenExpiration, fetchCurrentUser } from './authSlice';
import store from '../../redux/store';

const initializeAuth = async () =>
{
    const state = store.getState();

    try
    {
        // Kiểm tra và làm mới token
        if (!state.auth.token)
        {
            await store.dispatch(checkTokenExpiration());
        }

        // Lấy thông tin người dùng
        await store.dispatch(fetchCurrentUser());
    } catch (error)
    {
        console.error('Authentication initialization failed:', error);
    }
};

export default initializeAuth;
