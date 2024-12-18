export const isTokenExpired = (token) =>
{
    if (!token) return true; // Nếu không có token, coi như đã hết hạn

    try
    {
        const base64Url = token.split('.')[1]; // Lấy phần payload của JWT
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const decodedPayload = JSON.parse(atob(base64)); // Giải mã payload từ Base64

        const currentTime = Date.now() / 1000; // Lấy thời gian hiện tại (tính bằng giây)
        return decodedPayload.exp < currentTime; // So sánh thời gian hết hạn
    } catch (error)
    {
        console.error('Error decoding token:', error);
        return true; // Nếu token không hợp lệ, coi như đã hết hạn
    }
};
