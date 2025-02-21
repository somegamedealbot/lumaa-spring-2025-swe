import axios from "axios";
import React from "react";
import { useState } from "react"
import toast from "react-hot-toast";

interface FormData {
    username: string,
    password: string
}

interface AuthProps {
    setIsAuth: React.Dispatch<React.SetStateAction<boolean>>
}

export const Auth : React.FC<AuthProps> = ({setIsAuth}) => {
    const [isSignUp, setIsSignUp] = useState<boolean>(false);
    const [formData, setFormData] = useState<FormData>({ username: "", password: "" });
    const [fieldError, setFieldError] = useState<string>('');

    const changeField = (e : React.ChangeEvent<HTMLInputElement>) => {
        const newFormData = {
            ...formData,
            [e.target.name]: e.target.value
        };
        setFormData(newFormData);
    }

    const submitHandler = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (formData.username === "" || formData.password === ""){
            setFieldError('Missing one or more fields');
        }

        const res = await axios.post(import.meta.env.VITE_API_SERVER + 
            `/auth/${isSignUp ? 'register' : 'login'}`, formData);

        if (res.status === 201) {
            let msg = 'Logged In'
            if (isSignUp) {
                msg = 'Successfully registered account';
                setIsSignUp(false);
            }
            else {
                localStorage.setItem('jwt', res.data.access_token);
                setIsAuth(localStorage.getItem('jwt') ? true : false);
                console.log(localStorage.getItem('jwt'));
            }
            toast.success(msg);
        }
        else {
            toast.error(`Unable to ${isSignUp ? 'register' : 'login'}`, {})
        }
    }

    return <>
        <h2>{isSignUp ? 'Sign Up' : 'Login'}</h2>
        <form onSubmit={submitHandler}>
            <div>
                <h3>{fieldError}</h3>
            </div>
            <div>
                <input type="text" name="username" placeholder="Username" 
                    onChange={changeField} value={formData.username}/>
            </div>
            <div>
                <input type="password" name="password" placeholder="Password" 
                    onChange={changeField} value={formData.password}/>
            </div>
            <div>
                <button type="submit">{isSignUp ? 'Register' : 'Login'}</button>
            </div>
        </form>

        <a onClick={() => setIsSignUp(!isSignUp)}>
            Click here to <b>{isSignUp ? 'login' : 'register'}</b></a>
    </>
}