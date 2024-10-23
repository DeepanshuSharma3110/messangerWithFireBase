import React, { useState, useEffect } from 'react';
import style from './Login.module.css';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithRedirect, getRedirectResult, onAuthStateChanged } from "firebase/auth";
import useNav from '../Hooks/useNav';
import app from '../../Middleware/firebase.js';

const Login = () => {
    const navigate = useNav();
    const [user, setUser] = useState({
        email: '', password: ''
    });
  //  const [googleUser, setGoogleUser] = useState(null);

    useEffect(() => {
        const auth = getAuth(app);

        // Check for a Google login result when the component mounts
        getRedirectResult(auth)
            .then((result) => {
                if (result) {
                    const loggedInUser = result.user;
                    setGoogleUser(loggedInUser);
                    toast.success(`Welcome ${loggedInUser.displayName}!`);
                    navigate('/', 500);
                }
            })
            .catch((error) => {
                const errorMessage = error.message;
                toast.error(errorMessage);
            });

        // Monitor authentication state changes
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setGoogleUser(currentUser); // Set the user state when authenticated
            } else {
                setGoogleUser(null); // Clear the user state if logged out
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleValidation = () => {
        if (user.email === '' || user.password === '') {
            toast.error('Both the values are required');
            return false;
        } else if (user.email.length < 3) {
            toast.error('Enter a valid email');
            return false;
        } else if (user.password.length < 8) {
            toast.error('The password should be 8 characters long');
            return false;
        }
        return true;
    };

    // const handleGoogleSignUp = () => {
    //     const auth = getAuth(app);
    //     const provider = new GoogleAuthProvider();
    //     signInWithRedirect(auth, provider);
    // };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (handleValidation()) {
            const auth = getAuth(app);
            signInWithEmailAndPassword(auth, user.email, user.password)
                .then((userCredential) => {
                 //   const loggedInUser = userCredential.user;
                    toast.success('Login Successful');
                    navigate('/', 500);
                })
                .catch((error) => {
                    const errorMessage = error.message;
                    toast.error(errorMessage);
                });
        }
    };

    return (
        <div className={style.container}>
            <ToastContainer />
            <h3>Login</h3>
            <div className={style.loginContainer}>
                <form onSubmit={handleSubmit}>
                    <input placeholder='Enter Your Email Id' name='email' type='text' onChange={handleChange} />
                    <input placeholder='Enter Your Password' name='password' type='password' onChange={handleChange} />
                    <button type='submit'>Submit</button>
                </form>
                <p><Link to='/register'>Create new user</Link></p>
                {/* <button onClick={handleGoogleSignUp}>Login With Google</button> */}
            </div>
        </div>
    );
};

export default Login;
