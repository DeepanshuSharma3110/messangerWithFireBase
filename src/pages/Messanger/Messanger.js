import React, { useState } from 'react';
import style from './Messanger.module.css';
import Contact from '../../component/Contact/Contact';
import Message from '../../component/Message/Message';
import InputBar from '../../component/InputBar/InputBar';
import useNav from '../../component/Hooks/useNav';


const Messanger = () => {
    const [senderUserId, setSenderUserId] = useState('');
    const [reciverUserId, setReciverUserId] = useState('');

    const navigate = useNav();
    if (!localStorage.getItem('user')) {
        navigate('/login', 0);
    }



    return (
        <div className={style.container}>
            <div className={style.Contact} >
                <Contact setSenderUserId={setSenderUserId} setReciverUserId={setReciverUserId} />
              

            </div>
            <div className={style.message}>
                <Message senderUserId={senderUserId} receiverUserId={reciverUserId} />
                <div className={style.input}>
                    <InputBar senderUserId={senderUserId} reciverUserId={reciverUserId.id} />
                </div>
            </div>
        </div>
    );
};

export default Messanger;
