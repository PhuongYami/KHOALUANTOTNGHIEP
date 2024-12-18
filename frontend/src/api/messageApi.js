import axiosInstance from '../utils/axiosInstance';

// Gọi API xóa tin nhắn
export const deleteMessageApi = (messageId) =>
{
    return axiosInstance.delete(`/message/${ messageId }`);
};

// Gọi API đánh dấu tin nhắn đã đọc
export const markMessageAsReadApi = (messageId) =>
{
    return axiosInstance.patch(`/message/${ messageId }/read`);
};

// Gọi API lấy danh sách tin nhắn
export const fetchMessagesApi = (conversationId, limit, offset) =>
{
    return axiosInstance.get(`/conversations/messages/${ conversationId }`, {
        params: { limit, offset },
    });
};

// Gọi API gửi tin nhắn
export const sendMessageApi = (conversationId, content, messageType, receiver) =>
{
    return axiosInstance.post('/conversations/send', {
        conversationId,
        content,
        message_type: messageType,
        receiver,
    });
};
/**
 * Get unread messages count for a user.
 * @param {string} userId - ID of the user.
 * @returns {Promise<number>} - Number of unread messages.
 */
export const getUnreadMessagesCount = async (userId) =>
{
    try
    {
        const response = await axiosInstance.get(`/message/unread-messages/${ userId }`);
        return response.data.unreadCount;
    } catch (error)
    {
        console.error('Error fetching unread messages count:', error);
        throw error;
    }
};
// Gọi API tạo hoặc lấy conversation giữa hai người dùng
export const createOrGetConversationApi = (userId) =>
{
    return axiosInstance.get(`/conversations/${ userId }`);
};
