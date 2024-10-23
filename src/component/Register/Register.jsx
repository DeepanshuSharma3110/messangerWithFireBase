import React, { useState } from 'react'
import style from './Register.module.css'
import { Link } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import useNav from '../Hooks/useNav';
import { doc, setDoc } from "firebase/firestore"; 
import { db } from '../../Middleware/firebase';

const Register = () => {
    const navigate = useNav();
const [user,setUser] = useState({
    email:'',password:''
})

const handleChange = (e)=>{
    setUser({ ...user, [e.target.name]:e.target.value});
}

const handleValidation = ()=>{
    if(user.email==='' || user.password===''){
        toast.error('both the values are required');
        return false;
    }else if(user.email.length<3){
        toast.error('enter a valid email');
        return false;
    }
    else if(user.password.length<8){
        toast.error('the password should be 8 digits long');
        return false;
    }
    return true;
}


const handleSubmit = (e)=>{
    e.preventDefault();
    if(handleValidation()){

        const auth = getAuth();
        createUserWithEmailAndPassword(auth, user.email, user.password)
          .then((userCredential) => {
            const user = userCredential.user;
            toast.success('User Created Sucessfully');
            navigate('/login',500);
                     })
          .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              toast.error(errorMessage);
          });
    }
}

    return (
    <div className={style.container}>
          <ToastContainer />
      <h3>Register</h3>
      <div className={style.loginContainer}>
        <form onSubmit={handleSubmit}>
        <input placeholder='Enter Your Email Id' name='email'  type='text' onChange={(e)=>handleChange(e)} />
        <input placeholder='Enter Your Password' name='password' type='password' onChange={(e)=>handleChange(e)} />
        <button type='submit'>Submit</button>
        </form>
        <p><Link to='/login'>Already Joined</Link></p>
      </div>
    </div>
  )
}

export default Register
