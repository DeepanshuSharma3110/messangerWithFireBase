import React, { useEffect, useState } from 'react';
import style from './Contact.module.css';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../Middleware/firebase';

const Contact = ({setSenderUserId,setReciverUserId}) => {
  const [users, setUsers] = useState([]);

 
  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setSenderUserId(user.uid);
        fetchUsers(user.uid);
      } else {
        setUsers([]);
      }
    });

    return () => unsubscribe();
  }, [setSenderUserId]);

  const fetchUsers = async (currentUserId) => {
    try {
      // Fetch users from Firestore
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((user) => user.id !== currentUserId); 

      setUsers(usersList);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

 const handleClick = (user)=>{
  setReciverUserId(user);
 }

  return (
    <div>
      <div className={style.users}>
        {users && users.map((user) => (
          <div key={user.id} className={style.oneUser} onClick={()=>handleClick(user)}>
            <img src={user.photoURL || 'default_image_url.png'} alt={user.displayName || 'User'} />
            <p>{user.displayName || 'No Name Provided'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Contact;