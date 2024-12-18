import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    MessageSquare, Search, Paperclip, 
    Send, Video, Phone, Smile, MoreVertical, ArrowLeft
} from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';
import socket from '../utils/socket.js';
import { fetchCurrentUser } from '../features/user/userSlice.js';
import { format } from 'date-fns';
import { deleteMessage, markMessagesAsRead } from '../services/messageService.js';
import useVideoCall from '../utils/useVideoCall.js';
import VideoCallModal from '../components/VideoCallModal.jsx';

const Messages = () => {
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedConversationId, setSelectedConversationId] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [offset, setOffset] = useState(0);
    const [showConversationList, setShowConversationList] = useState(true);
    const messagesEndRef = useRef(null);
    const [messagesByConversation, setMessagesByConversation] = useState({});
    const [showVideoCallModal, setShowVideoCallModal] = useState(false);
    const [incomingCall, setIncomingCall] = useState(false);
    const [caller, setCaller] = useState(null);
    const { userId, user: currentUser } = useSelector(state => state.user);
    
    const limit = 20;
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const { 
        localVideoRef, 
        remoteVideoRef, 
        startVideoCall, 
        endVideoCall,
        handleIncomingCall
    } = useVideoCall(selectedConversationId);
    useEffect(() => {
        const handleIncomingVideoCall = (data) => {
            setIncomingCall(true);
            setCaller(data.caller);
            setShowVideoCallModal(true);
        };

        socket.on('incomingVideoCall', handleIncomingVideoCall);

        return () => {
            socket.off('incomingVideoCall', handleIncomingVideoCall);
        };
    }, []);

    const handleStartVideoCall = () => {
        const selectedConversation = conversations.find(c => c._id === selectedConversationId);
        const otherParticipant = selectedConversation?.participants.find(p => p._id !== userId);
        
        // Emit video call invitation to the other participant
        socket.emit('initiateVideoCall', {
            conversationId: selectedConversationId,
            caller: { 
                _id: userId, 
                username: currentUser.username, 
                avatar: currentUser.avatar 
            }
        });

        setShowVideoCallModal(true);
        setIncomingCall(false);
        startVideoCall();
    };

    const handleAcceptCall = () => {
        setIncomingCall(false);
        startVideoCall();
    };

    const handleEndVideoCall = () => {
        setShowVideoCallModal(false);
        setIncomingCall(false);
        endVideoCall();
        
        // Optional: Emit end call event to other participant
        socket.emit('endVideoCall', { conversationId: selectedConversationId });
    };
    

    // Scroll to bottom when messages change
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    // Fetch current user
    useEffect(() => {
        if (!userId) {
            dispatch(fetchCurrentUser());
        }
    }, [dispatch, userId]);
    useEffect(() => {
        if (messages.length && selectedConversationId) {
            markMessagesAsRead(messages, userId, setMessages);
        }
    }, [messages, selectedConversationId, userId]);

    // Reset state when userId changes
    useEffect(() => {
        if (userId) {
            setConversations([]);
            setMessages([]);
            setSelectedConversationId(null);
            fetchConversations();
        }
    }, [userId]);

    // Socket message handling
    useEffect(() => {
        const handleReceiveMessage = (newMessage) => {
            if (newMessage.conversation !== selectedConversationId) return;

            setMessages((prevMessages) => {
                const isDuplicate = prevMessages.some((msg) => msg._id === newMessage._id);
                return isDuplicate ? prevMessages : [...prevMessages, newMessage];
            });

            setConversations((prevConversations) =>
                prevConversations.map((conversation) =>
                    conversation._id === newMessage.conversation
                        ? { ...conversation, last_message: newMessage }
                        : conversation
                )
            );
        };

        socket.on('receiveMessage', handleReceiveMessage);

        return () => {
            socket.off('receiveMessage', handleReceiveMessage);
        };
    }, [selectedConversationId]);
    

    // Fetch conversations
    const fetchConversations = async () => {
        setLoadingConversations(true);
        try {
            const response = await axiosInstance.get('/conversations');
            if (response.data.success) {
                setConversations(response.data.conversations);
            }
        } catch (error) {
            console.error('Error fetching conversations:', error);
        } finally {
            setLoadingConversations(false);
        }
    };

    // Fetch messages for conversation
    const fetchMessages = async (conversationId, limit = 20, offset = 0) => {
        setLoadingMessages(true);
        try {
            const response = await axiosInstance.get(`/conversations/messages/${conversationId}`, {
                params: { limit, offset },
            });
    
            if (response.data.success) {
                setMessagesByConversation((prevState) => ({
                    ...prevState,
                    [conversationId]: [
                        ...(prevState[conversationId] || []), // Keep existing messages for the conversation
                        ...response.data.messages,
                    ],
                }));
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoadingMessages(false);
        }
    };

    // Handle conversation selection
    const handleConversationSelect = (conversationId) => {
        setSelectedConversationId(conversationId);
    
        // Fetch messages only if not already loaded for the selected conversation
        if (!messagesByConversation[conversationId]) {
            fetchMessages(conversationId);
        }
    
        socket.emit('joinConversation', conversationId);
        if (window.innerWidth < 768) {
            setShowConversationList(false);
        }
    };

    // Send message
    const handleSendMessage = async () => {
        if (!messageInput.trim()) return;

        try {
            const selectedConversation = conversations.find((c) => c._id === selectedConversationId);
            const receiverId = selectedConversation.participants.find((p) => p._id !== userId)?._id;

            const response = await axiosInstance.post('/conversations/send', {
                conversationId: selectedConversationId,
                content: messageInput,
                message_type: 'text',
                receiver: receiverId,
            });

            if (response.data.success) {
                const newMessage = response.data.message;

                socket.emit('sendMessage', {
                    conversationId: selectedConversationId,
                    message: newMessage,
                });

                setMessages((prevMessages) => {
                    const isDuplicate = prevMessages.some((msg) => msg._id === newMessage._id);
                    return isDuplicate ? prevMessages : [...prevMessages, newMessage];
                });

                setMessageInput('');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleBackToConversations = () => {
        setShowConversationList(true);
        setSelectedConversationId(null);
        setMessages([]);
    };

    const handleDeleteMessage = (messageId) => {
        deleteMessage(messageId, setMessages);
    };

    const handleReceiveMessage = (newMessage) => {
        setMessagesByConversation((prevState) => {
            const conversationMessages = prevState[newMessage.conversation] || [];
            const isDuplicate = conversationMessages.some((msg) => msg._id === newMessage._id);
    
            if (isDuplicate) return prevState;
    
            return {
                ...prevState,
                [newMessage.conversation]: [...conversationMessages, newMessage],
            };
        });
    };
    
    // Update messages displayed based on selected conversation
    useEffect(() => {
        if (selectedConversationId) {
            setMessages(messagesByConversation[selectedConversationId] || []);
        }
    }, [selectedConversationId, messagesByConversation]);

    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col md:flex-row">
            {/* Conversations List */}
            <div 
                className={`
                    w-full md:w-96 bg-white border-r border-neutral-200 p-4 md:p-6 
                    ${showConversationList ? 'block' : 'hidden md:block'}
                `}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl md:text-3xl font-thin text-neutral-800">Messages</h2>
                    <button className="text-neutral-600 hover:text-neutral-800">
                        <MessageSquare />
                    </button>
                </div>

                <div className="relative mb-6">
                    <input 
                        type="text" 
                        placeholder="Search conversations" 
                        className="w-full border border-neutral-200 rounded-full px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300"
                    />
                    <Search className="absolute left-3 top-3 text-neutral-500" size={16} />
                </div>

                <div className="space-y-4">
                    {loadingConversations ? (
                        <p>Loading conversations...</p>
                    ) : (
                        conversations.map((conversation) => (
                            <ConversationItem
                                key={conversation._id}
                                conversation={conversation}
                                isSelected={selectedConversationId === conversation._id}
                                onClick={() => handleConversationSelect(conversation._id)}
                                currentUserId={userId}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Chat Window */}
            <div 
                className={`
                    flex-1 flex flex-col  
                    ${!showConversationList ? 'block' : 'hidden md:flex'}
                `}
            >
                {selectedConversationId ? (
                    <>
                        {/* Mobile Back Button */}
                        <div className="md:hidden bg-white border-b border-neutral-200 p-4 flex items-center">
                            <button 
                                onClick={handleBackToConversations} 
                                className="mr-4 text-neutral-600 hover:text-neutral-800"
                            >
                                <ArrowLeft />
                            </button>
                            {renderChatHeader(conversations, selectedConversationId, userId, true, handleStartVideoCall)}
                        </div>

                        {/* Desktop Header */}
                        <div className="hidden md:flex bg-white border-b border-neutral-200 p-6 justify-between items-center">
                            {renderChatHeader(conversations, selectedConversationId, userId, true,handleStartVideoCall)}
                        </div>

                        {/* Messages Container */}
                        <div 
                            className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 messages-container"
                        >
                            {loadingMessages && offset > 0 ? (
                                <p>Loading more messages...</p>
                            ) : null}
                            {messages.map((message) => (
                                <MessageBubble 
                                    key={message._id} 
                                    message={message} 
                                    currentUserId={userId} 
                                    onDelete={handleDeleteMessage}
                                />
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <div className="bg-white p-4 md:p-6 border-t border-neutral-200">
                            <div className="flex items-center space-x-2 md:space-x-4">
                                <button className="text-neutral-600 hover:text-neutral-800">
                                    <Paperclip size={20} />
                                </button>
                                <button className="text-neutral-600 hover:text-neutral-800">
                                    <Smile size={20} />
                                </button>
                                <input 
                                    type="text" 
                                    placeholder="Type a message..." 
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    className="flex-1 border border-neutral-200 rounded-full px-3 py-2 md:px-4 md:py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300"
                                />
                                <button 
                                    className="bg-neutral-800 text-white rounded-full p-2 md:p-3 hover:bg-neutral-700"
                                    onClick={handleSendMessage}
                                    disabled={!messageInput}
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-neutral-100">
                        <p className="text-neutral-600 text-base md:text-xl text-center">
                            Select a conversation to start messaging
                        </p>
                    </div>
                )}
            </div>
            {showVideoCallModal && (
                <VideoCallModal 
                    localVideoRef={localVideoRef}
                    remoteVideoRef={remoteVideoRef}
                    onEndCall={handleEndVideoCall}
                    incomingCall={incomingCall}
                    onAcceptCall={handleAcceptCall}
                    otherParticipant={caller || 
                        (conversations.find(c => c._id === selectedConversationId)
                            ?.participants.find(p => p._id !== userId))
                    }
                />
            )}
        </div>
        
    );
};

const renderChatHeader = (conversations, selectedConversationId, currentUserId, isDesktop = false, handleStartVideoCall) => {
    const selectedConversation = conversations.find(c => c._id === selectedConversationId);
    const otherParticipants = selectedConversation?.participants.filter(p => p._id !== currentUserId) || [];
    const otherUsername = otherParticipants.map(p => p.username).join(', ');
    const otherAvatar = otherParticipants[0]?.avatar || '/placeholder.jpg';

    const headerClasses = isDesktop 
        ? "flex items-center space-x-4" 
        : "flex items-center space-x-3";

    const avatarClasses = isDesktop 
        ? "w-12 h-12 rounded-full object-cover"
        : "w-10 h-10 rounded-full object-cover";

    const nameClasses = isDesktop 
        ? "text-xl font-light text-neutral-800"
        : "text-base font-light text-neutral-800";

    return (
        <div className="flex items-center justify-between w-full">
            <div className={headerClasses}>
                <img 
                    src={otherAvatar} 
                    alt="User Avatar" 
                    className={avatarClasses}
                />
                <div>
                    <h3 className={nameClasses}>{otherUsername}</h3>
                    <p className="text-sm text-neutral-500">Active now</p>
                </div>
            </div>
            {isDesktop && (
                <div className="flex space-x-4">
                    <button className="text-neutral-600 hover:text-neutral-800">
                        <Phone />
                    </button>
                    <button className="text-neutral-600 hover:text-neutral-800">
                        <Video  onClick={handleStartVideoCall} />
                    </button>
                    <button className="text-neutral-600 hover:text-neutral-800">
                        <MoreVertical />
                    </button>
                </div>
            )}
        </div>
    );
};

const ConversationItem = ({ conversation, isSelected, onClick, currentUserId }) => (
    <div
        className={`flex items-center space-x-4 p-4 rounded-lg cursor-pointer ${
            isSelected ? 'bg-neutral-100' : 'hover:bg-neutral-50'
        }`}
        onClick={onClick}
    >
        <img
            src={conversation.participants.find(p => p._id !== currentUserId)?.avatar || '/placeholder.jpg'}
            alt="Avatar"
            className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1">
            <div className="flex justify-between items-center">
                <h4 className="text-sm md:text-base text-neutral-800 font-medium">
                    {conversation.participants
                        .filter(p => p._id !== currentUserId)
                        .map(p => p.username)
                        .join(', ')}
                </h4>
                <span className="text-[10px] md:text-xs text-neutral-500">
                    {conversation.last_message 
                        ? new Date(conversation.last_message.sent_at).toLocaleTimeString() 
                        : ''}
                </span>
            </div>
            <p className="text-xs md:text-sm text-neutral-600 truncate">
                {conversation.last_message?.content?.slice(0, 30) || 'No messages yet'}
                {conversation.last_message?.content?.length > 30 ? '...' : ''}
            </p>
        </div>
    </div>
);

const MessageBubble = ({ message, currentUserId, onDelete }) => {
    const statusLabel = message.status === 'read' ? '✔✔' 
        : message.status === 'delivered' ? '✔' 
        : '';

    return (
        <div className={`flex ${message.sender === currentUserId ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`relative max-w-[250px] md:max-w-md p-3 md:p-4 rounded-2xl ${
                    message.sender === currentUserId 
                        ? 'bg-neutral-800 text-white' 
                        : 'bg-neutral-100 text-neutral-800'
                }`}
            >
                <p className="text-xs md:text-sm">{message.content}</p>
                <p className="text-[10px] md:text-xs mt-1 md:mt-2 opacity-60">
                    {format(new Date(message.sent_at), 'hh:mm:ss a')} {statusLabel}
                </p>
                {currentUserId === message.sender && (
                    <button 
                        onClick={() => onDelete(message._id)} 
                        className="absolute top-2 right-2 text-neutral-500 hover:text-red-500"
                    >
                        <MoreVertical size={16} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default Messages;
