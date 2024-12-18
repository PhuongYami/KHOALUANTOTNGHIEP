import { useEffect, useRef, useState } from 'react';
import socket from './socket';
import iceServerService from '../services/iceServerService';
import 'webrtc-adapter';

const useVideoCall = (conversationId) =>
{
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerConnection = useRef(null);
    const [callStatus, setCallStatus] = useState('idle');
    const [iceServers, setIceServers] = useState([]);

    // Fetch ICE Servers từ backend khi khởi tạo hook
    useEffect(() =>
    {
        const fetchICEServers = async () =>
        {
            try
            {
                const servers = await iceServerService.getICEServers();
                setIceServers(servers);
            } catch (error)
            {
                console.error('Không thể lấy ICE Servers:', error);
            }
        };

        fetchICEServers();
    }, []);
    // Kiểm tra hỗ trợ WebRTC
    const checkWebRTCSupport = () =>
    {
        const RTCPeer = window.RTCPeerConnection ||
            window.mozRTCPeerConnection ||
            window.webkitRTCPeerConnection;

        if (!RTCPeer)
        {
            console.error('WebRTC không được hỗ trợ trên trình duyệt này');
            return false;
        }

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia)
        {
            console.error('Không thể truy cập camera và micro');
            return false;
        }

        return true;
    };

    // Cấu hình STUN/TURN servers
    // const getICEServers = () => [
    //     { urls: 'stun:stun.l.google.com:19302' },
    //     { urls: 'stun:stun1.l.google.com:19302' },
    //     { urls: 'stun:stun2.l.google.com:19302' },
    //     // Bạn có thể thêm TURN servers ở đây nếu cần
    // ];

    // Lắng nghe các sự kiện từ socket
    useEffect(() =>
    {
        if (!socket)
        {
            console.error('Socket không được khởi tạo');
            return;
        }

        socket.on('offer', handleReceiveOffer);
        socket.on('answer', handleReceiveAnswer);
        socket.on('iceCandidate', handleReceiveICECandidate);

        return () =>
        {
            socket.off('offer', handleReceiveOffer);
            socket.off('answer', handleReceiveAnswer);
            socket.off('iceCandidate', handleReceiveICECandidate);
        };
    }, [conversationId]);

    // Bắt đầu cuộc gọi video
    const startVideoCall = async () =>
    {
        if (!checkWebRTCSupport())
        {
            setCallStatus('error');
            return;
        }
        if (iceServers.length === 0)
        {
            console.error('Chưa cấu hình ICE Servers');
            setCallStatus('error');
            return;
        }

        try
        {
            setCallStatus('connecting');
            const PeerConnection = window.RTCPeerConnection ||
                window.mozRTCPeerConnection ||
                window.webkitRTCPeerConnection;

            // Lấy luồng media local
            const localStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                    facingMode: 'user'
                },
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                },
            });

            // Hiển thị video local
            if (localVideoRef.current)
            {
                localVideoRef.current.srcObject = localStream;
            }

            // Tạo peer connection
            peerConnection.current = new PeerConnection({ iceServers, sdpSemantics: 'unified-plan' });

            // Thêm track local vào peer connection
            localStream.getTracks().forEach((track) =>
            {
                peerConnection.current.addTrack(track, localStream);
            });

            // Xử lý track từ remote
            peerConnection.current.ontrack = (event) =>
            {
                if (remoteVideoRef.current)
                {
                    remoteVideoRef.current.srcObject = event.streams[0];
                }
                setCallStatus('connected');
            };

            // Xử lý ICE candidate
            peerConnection.current.onicecandidate = (event) =>
            {
                if (event.candidate)
                {
                    socket.emit('iceCandidate', {
                        conversationId,
                        candidate: event.candidate
                    });
                }
            };

            // Tạo và gửi offer
            const offer = await peerConnection.current.createOffer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true
            });

            await peerConnection.current.setLocalDescription(offer);
            socket.emit('offer', { conversationId, offer });

        } catch (error)
        {
            console.error('Lỗi bắt đầu video call:', error);
            setCallStatus('error');

            // Xử lý các lỗi cụ thể
            if (error.name === 'NotAllowedError')
            {
                alert('Vui lòng cấp quyền truy cập camera và micro');
            } else if (error.name === 'NotFoundError')
            {
                alert('Không tìm thấy camera hoặc micro');
            }
        }
    };

    // Xử lý offer từ phía bên kia
    const handleReceiveOffer = async ({ offer }) =>
    {
        if (!checkWebRTCSupport()) return;

        const PeerConnection = window.RTCPeerConnection ||
            window.mozRTCPeerConnection ||
            window.webkitRTCPeerConnection;

        try
        {
            setCallStatus('connecting');

            if (!peerConnection.current)
            {
                peerConnection.current = new PeerConnection({ iceServers, sdpSemantics: 'unified-plan' });
            }

            await peerConnection.current.setRemoteDescription(
                new RTCSessionDescription(offer)
            );

            const answer = await peerConnection.current.createAnswer();
            await peerConnection.current.setLocalDescription(answer);

            socket.emit('answer', { conversationId, answer });

        } catch (error)
        {
            console.error('Lỗi xử lý offer:', error);
            setCallStatus('error');
        }
    };

    // Xử lý answer từ phía bên kia
    const handleReceiveAnswer = async ({ answer }) =>
    {
        if (!peerConnection.current) return;

        try
        {
            await peerConnection.current.setRemoteDescription(
                new RTCSessionDescription(answer)
            );
            setCallStatus('connected');
        } catch (error)
        {
            console.error('Lỗi xử lý answer:', error);
            setCallStatus('error');
        }
    };

    // Xử lý ICE candidate
    const handleReceiveICECandidate = async ({ candidate }) =>
    {
        if (peerConnection.current)
        {
            try
            {
                await peerConnection.current.addIceCandidate(
                    new RTCIceCandidate(candidate)
                );
            } catch (error)
            {
                console.error('Lỗi thêm ICE candidate:', error);
            }
        }
    };

    // Kết thúc cuộc gọi
    const endVideoCall = () =>
    {
        if (peerConnection.current)
        {
            peerConnection.current.close();
            peerConnection.current = null;
        }

        if (localVideoRef.current)
        {
            const localStream = localVideoRef.current.srcObject;
            if (localStream)
            {
                localStream.getTracks().forEach(track => track.stop());
                localVideoRef.current.srcObject = null;
            }
        }

        if (remoteVideoRef.current)
        {
            remoteVideoRef.current.srcObject = null;
        }

        setCallStatus('idle');
        socket.emit('endCall', { conversationId });
    };

    return {
        localVideoRef,
        remoteVideoRef,
        startVideoCall,
        endVideoCall,
        callStatus
    };
};

export default useVideoCall;