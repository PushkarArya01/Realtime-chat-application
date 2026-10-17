import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';

const ChatPage = () => {
    const { accessToken } = useSelector((state) => state.auth);

    const socketRef = useRef(null);

    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState([]);

    function sendMessage(event) {
        event.preventDefault();

        const message = inputValue.trim();

        if (!message) return;
        if (!socketRef.current) return;

        socketRef.current.emit('message', {
            content: message,
        });

        setMessages((prevMessages) => [
            ...prevMessages,
            {
                content: message,
                outgoing: true,
            },
        ]);

        setInputValue('');
    }

    useEffect(() => {
        if (!accessToken) return;

        const socket = io(import.meta.env.VITE_SOCKET_URL, {
            withCredentials: true,
            auth: {
                token: accessToken,
            },
        });

        socketRef.current = socket;

        socket.on('message', (msg) => {
            setMessages((prevMessages) => [
                ...prevMessages,
                msg,
            ]);
        });

        socket.on('connect_error', (error) => {
            console.error('Socket connection failed:', error.message);
        });

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, [accessToken]);

    return (
        <section className="chat-page">
            <div className="conversation-area">

                <div className="messages">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`message ${
                                msg.outgoing ? 'outgoing' : 'incoming'
                            }`}
                        >
                            {msg.content}

                            {msg.email ? (
                                <small>{msg.email}</small>
                            ) : null}
                        </div>
                    ))}
                </div>

                <form
                    className="input-area"
                    onSubmit={sendMessage}
                >
                    <input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        type="text"
                        placeholder="Type a message..."
                    />

                    <button type="submit">
                        Send
                    </button>
                </form>

            </div>
        </section>
    );
};

export default ChatPage;