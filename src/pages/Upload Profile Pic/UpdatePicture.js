import React, { useEffect, useState } from 'react';
import style from './UpdatePicture.module.css';
import useNav from '../../component/Hooks/useNav';
import { getAuth, updateProfile } from "firebase/auth";
import app, { db } from '../../Middleware/firebase.js';
import { toast, ToastContainer } from 'react-toastify';
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore"; 

const UpdatePicture = () => {
  const navigate = useNav();

  const [updatedInfo, setUpdatedInfo] = useState({
    displayName: '',
    photoURL: '',
  });

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
      navigate('/login', 0);
    }
  }, [navigate, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedInfo((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUpdatedInfo((prevState) => ({ ...prevState, photoURL: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const updateUserInfo = async(uid, displayName, photoURL,email)=>{
    await setDoc(doc(db, "users", uid), {
     displayName:displayName,
     photoURL:photoURL,
     email:email
    });
  }

  const handleSubmit = async () => {
    const data = {
      displayName: updatedInfo.displayName || user?.displayName,
      photoURL: updatedInfo.photoURL || user?.photoURL,
    };
    const auth = getAuth(app);
    const storage = getStorage(app);

    if (user.photoURL !== updatedInfo.photoURL && updatedInfo.photoURL) {
      toast.loading('please wait');
        //upload the image to store
      const storageRef = ref(storage, `profile_pictures/${auth.currentUser.uid}`);
      await uploadString(storageRef, updatedInfo.photoURL, 'data_url');

      // Get the download URL
      const photoURL = await getDownloadURL(storageRef);

      // Update user profile with new info
      if (auth.currentUser) {
        updateProfile(auth.currentUser, {
          displayName: data.displayName,
          photoURL: photoURL, 
        })
          .then(() => {
            updateUserInfo(auth.currentUser.uid, data.displayName,photoURL,auth.currentUser.email )
            toast.success('User info updated successfully!');
            navigate('/',0)
          })
          .catch((error) => {
            toast.error(`Error updating profile: ${error.message}`);
          });
      } else {
        toast.error('No user is currently logged in.');
      }
    } else {
      // If the photo URL hasn't changed, just update the display name
      if (auth.currentUser) {
        updateProfile(auth.currentUser, {
          displayName: data.displayName,
        })
          .then(() => {
            toast.success('User info updated successfully!');
            navigate('/',300)
          })
          .catch((error) => {
            toast.error(`Error updating profile: ${error.message}`);
          });
      }
    }
  };

  return (<>
    <div className={style.body}>
      <div className={style.container}>
        <h1>Welcome</h1>
        <div>
          <label>Name</label>
          <input
            type='text'
            value={updatedInfo.displayName || user?.displayName} // Use updatedInfo for controlled input
            name='displayName'
            onChange={handleChange}
            />
        </div>

        <div>
          <label>Email</label>
          <input type='text' value={user?.email} readOnly />
        </div>

        <div>
          <label>Profile Pic</label>
          <input
            type="file"
            name='photoURL'
            onChange={handleFileChange}
            accept="image/*"
            />
          {updatedInfo.photoURL && (
              <img src={updatedInfo.photoURL} alt="Profile Preview" width="100" height="100" />
            )}
        </div>

        <button onClick={handleSubmit}>Update</button>
      </div>
    </div>
    <ToastContainer />
            </>
  );
};

export default UpdatePicture;
