import React, { useState } from 'react';
import style from './InputBar.module.css';
import { getDatabase, ref, push } from "firebase/database";
import app from '../../Middleware/firebase';

const InputBar = ({ senderUserId, reciverUserId }) => {
  const [sendMessage, setSendMessage] = useState('');

  const sendMessageHandler = () => {
    if (sendMessage && senderUserId && reciverUserId) {
      const db = getDatabase(app);
      // Create a reference for the chat between the sender and receiver
      const chatRef = ref(db, `chats/${senderUserId}-${reciverUserId}`);
      
      // Push a new message under this chat session
      push(chatRef, {
        senderId: senderUserId,
        receiverId: reciverUserId,
        message: sendMessage,
        timestamp: new Date().toISOString(),
      })
      .then(() => {
        setSendMessage(''); // Clear the input after sending the message
      })
      .catch((error) => {
        console.error('Error sending message:', error);
      });
    }
  };

  return (
    <div className={style.container}>
      {reciverUserId && (
        <div className={style.inputWrapper}>
          <input 
            type='text' 
            placeholder='Enter Your Text' 
            value={sendMessage}
            onChange={(e) => setSendMessage(e.target.value)} 
          />
          <button onClick={sendMessageHandler}>Send</button>  
        </div>
      )}  
    </div>
  );
}

export default InputBar;
