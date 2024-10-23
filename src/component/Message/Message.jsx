import React, { useEffect, useState, useRef } from 'react';
import style from './Message.module.css';
import { getDatabase, ref, onValue, off } from 'firebase/database';
import app from '../../Middleware/firebase';

const Message = ({ senderUserId, receiverUserId }) => {
  const [messages, setMessages] = useState([]);
  const [receiverImage, setReceiverImage] = useState('');
  const database = getDatabase(app);
  const user = JSON.parse(localStorage.getItem('user'));

  // Ref for the message container to auto-scroll
  const messageContainerRef = useRef(null);

  useEffect(() => {
    if (senderUserId && receiverUserId) {
      setReceiverImage(receiverUserId.photoURL);

      // Construct paths for both directions
      const chatPath1 = `chats/${senderUserId}-${receiverUserId.id}`;
      const chatPath2 = `chats/${receiverUserId.id}-${senderUserId}`;

      const chatRef1 = ref(database, chatPath1);
      const chatRef2 = ref(database, chatPath2);

      const handleData = (snapshot, path) => {
        const data = snapshot.val();
        if (data) {
          const chatMessages = Object.entries(data).map(([key, value]) => ({
            ...value,
            id: key,
          }));

          setMessages((prevMessages) => {
            // Filter out previous messages from the same path to prevent duplication
            const filteredMessages = prevMessages.filter(
              (msg) => msg.path !== path
            );
            // Merge new messages and add the path as metadata
            return [
              ...filteredMessages,
              ...chatMessages.map((msg) => ({ ...msg, path })),
            ].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
          });
        }
      };

      // Listen for messages in both paths
      onValue(chatRef1, (snapshot) => handleData(snapshot, chatPath1));
      onValue(chatRef2, (snapshot) => handleData(snapshot, chatPath2));

      // Cleanup listeners when component unmounts or sender/receiver changes
      return () => {
        off(chatRef1);
        off(chatRef2);
        setMessages([]); // Clear messages when user or receiver changes
      };
    }
  }, [senderUserId, receiverUserId, database]);

  useEffect(() => {
    // Auto-scroll to the bottom whenever messages change
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className={style.container}>
      <div className={style.title}>
        <img src={receiverUserId.photoURL} alt={`${receiverUserId.displayName}'s profile`} />
        <p>{receiverUserId.displayName}</p>
      </div>
      <div className={style.MessageBox} ref={messageContainerRef}>
        <div className={style.MessageContainer}>
          {!receiverUserId && <p>Select a user to chat with</p>}

          {receiverUserId &&
            messages.map((message) => (
              <div
                key={message.id}
                className={
                  message.senderId === senderUserId ? style.sender : style.receiver
                }
              >
                <img
                  src={message.senderId === senderUserId ? user.photoURL : receiverImage}
                  alt={message.senderId === senderUserId ? user.displayName : 'Receiver'}
                  className={style.senderImage}
                />
                <div className={style.messageContent}>
                  <h4>{message.senderId === senderUserId ? user.displayName : receiverUserId.displayName}</h4>
                  <p>{message.message}</p>
                  <p className={style.timestamp}>{new Date(message.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Message;
