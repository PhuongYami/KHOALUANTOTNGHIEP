import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import userReducer from '../features/user/userSlice';

// Middleware ví dụ: Thêm token vào headers
const tokenMiddleware = (storeAPI) => (next) => (action) =>
{
    const state = storeAPI.getState();
    const token = state.auth.token;

    // Nếu action yêu cầu thêm token
    if (token && action.meta?.auth)
    {
        action.meta.headers = {
            ...action.meta.headers,
            Authorization: `Bearer ${ token }`,
        };
    }

    return next(action);
};

// Cấu hình store và thêm middleware
const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(tokenMiddleware),
});

export default store;
