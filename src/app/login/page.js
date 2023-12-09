'use client'
import { useRouter } from "next/navigation"
import { loginWithFacebook } from "../config/firebase";
import { useState } from "react";
import { loginUser } from "../config/firebase";

export default function Login() {
    const router = useRouter()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [data, setUserData] = useState(null);

    const onLogin = async () => {
        try {
            const login = await loginWithFacebook()
            router.push('./dashboard', { scroll: false })
        } catch (error) {
            console.error(error)
        }
    }

    const signin = async () => {
        if (!email || !password) {
            return alert("please fill all fields");
          }
        const res = await loginUser(email, password);
        console.log(res);
        router.push("/dashboard");
    }

    return <div className="signinContainer">
        <h1 style={{ marginTop: '20px' }}>Welcome!</h1>
        <p>Sign up or log in to continue</p>
        <input style={{border: '2px solid black', width: '90%', margin: 5 }}  onChange={(e)=>setEmail(e.target.value)} placeholder="Enter your email" />
        <input  style={{border: '2px solid black', width: '90%',  margin: 5 }} onChange={(e)=>setPassword(e.target.value)} placeholder="Enter your password" />
        <button style={{ width: '90%', height: '35px', fontSize: 'large', borderRadius: '5px', color: 'white', backgroundColor: 'blue', marginBottom: '10px', border: '1px solid blue' }} onClick={onLogin}>Continue with Facebook</button>
        <button style={{ width: '90%', height: '35px', fontSize: 'large', borderRadius: '5px', color: 'black', backgroundColor: 'white', marginBottom: '10px', border: '1px solid grey' }} >Continue with Google</button>
        <button style={{ width: '90%', height: '35px', fontSize: 'large', borderRadius: '5px', color: 'white', backgroundColor: 'black', marginBottom: '10px', border: '1px solid black' }} >Continue with Apple</button>
        <p>or</p>
        <button onClick={signin} style={{ width: '90%', height: '35px', fontSize: 'large', borderRadius: '5px', color: 'white', backgroundColor: 'deeppink', marginBottom: '10px', border: '1px solid deeppink' }}  >Sign In</button>
        <center>
           <center> <p>Don't have an account?<span style={{ cursor: 'pointer', color: 'blue' }} onClick={() => router.push('/register')}> Register</span></p> </center>
        </center>
        <p>By signing up, you agree to our <span style={{ color: 'deeppink' }}>Terms and Conditions</span> and <span style={{ color: 'deeppink' }}>Privacy Policy</span></p>
    </div>
}