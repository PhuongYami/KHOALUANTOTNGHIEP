import
{
    deleteMessageApi,
    markMessageAsReadApi,
    fetchMessagesApi,
    sendMessageApi,
} from '../api/messageApi';

// Xóa tin nhắn
export const deleteMessage = async (messageId, setMessages) =>
{
    try
    {
        await deleteMessageApi(messageId);
        setMessages((prevMessages) => prevMessages.filter((msg) => msg._id !== messageId));
    } catch (error)
    {
        console.error('Error deleting message:', error);
    }
};

// Đánh dấu tin nhắn đã đọc
export const markMessagesAsRead = async (messages, userId, setMessages) =>
{
    const unreadMessages = messages.filter(
        (msg) =>
            msg.status !== 'read' &&
            msg.receiver === userId &&
            msg.sender !== userId // Loại bỏ tin nhắn của chính mình
    );

    try
    {
        for (const msg of unreadMessages)
        {
            await markMessageAsReadApi(msg._id); // Gọi API

            // Chỉ cập nhật trạng thái nếu cần
            setMessages((prevMessages) =>
                prevMessages.map((m) =>
                    m._id === msg._id ? { ...m, status: 'read', read_at: new Date() } : m
                )
            );
        }
    } catch (error)
    {
        console.error('Error marking messages as read:', error);
    }
};

// Lấy danh sách tin nhắn
export const fetchMessages = async (conversationId, limit, offset, setMessages) =>
{
    try
    {
        const response = await fetchMessagesApi(conversationId, limit, offset);
        if (response.data.success)
        {
            setMessages((prevMessages) => [...response.data.messages, ...prevMessages]);
        }
    } catch (error)
    {
        console.error('Error fetching messages:', error);
    }
};

// Gửi tin nhắn
export const sendMessage = async (
    conversationId,
    content,
    messageType,
    receiver,
    setMessages,
    socket
) =>
{
    if (!content.trim()) return;

    try
    {
        const response = await sendMessageApi(conversationId, content, messageType, receiver);
        if (response.data.success)
        {
            const newMessage = {
                ...response.data.message,
                original_id: response.data.message._id,
            };

            socket.emit('sendMessage', {
                conversationId,
                message: newMessage,
            });

            setMessages((prevMessages) =>
            {
                const isDuplicate = prevMessages.some((msg) => msg.original_id === newMessage._id);
                return isDuplicate ? prevMessages : [...prevMessages, newMessage];
            });
        }
    } catch (error)
    {
        console.error('Error sending message:', error);
    }
};
