import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, getRedirectResult, GoogleAuthProvider } from "firebase/auth";
import app from '../../Middleware/firebase.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useNav from '../../component/Hooks/useNav.js';


const Home = () => {

    const auth = getAuth(app);
    const [user, setUser] = useState(null);
    const navigate = useNav();

    useEffect(() => {
        // Check for Google login result when the component mounts
        getRedirectResult(auth)
            .then((result) => {
                if (result) {
                    const user = result.user;
                    const credential = GoogleAuthProvider.credentialFromResult(result);
                    const token = credential.accessToken;

                    setUser(user); // Set the user
                    toast.success(`Welcome ${user.displayName}!`);
                    navigate('/', 500);
                }
            })
            .catch((error) => {
                const errorMessage = error.message;
                toast.error(errorMessage);
            });

        // Listen for changes in the authentication state
        const unsubscribe = onAuthStateChanged(auth,async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);   
                localStorage.setItem('user',JSON.stringify(currentUser));
                if (!currentUser.displayName || !currentUser.photoURL) {
                    navigate('/update-profile-pic', 0);
                }else{
                    navigate('/messenger', 0);
                }

            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();


      


    }, [auth, navigate,setUser]);
    if(!user){
        navigate('/login',0);   
    }
   
    return (
        <div>
            <ToastContainer />
            {user ? (
                <>
                    <p>Welcome, {user.displayName}</p>
                    <p>Email: {user.email}</p>
                    <p>User ID: {user.uid}</p>
                </>
            ) : (
                <p>Please Login First</p>
            )}
        </div>
    );
};

export default Home;
