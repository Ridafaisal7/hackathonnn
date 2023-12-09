"use client";
import { addUser } from "../config/firebase";
import { useRouter } from "next/navigation";
import { useState } from "react";
export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [passwrod, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  async function register() {
    if (!email || !passwrod || !fullName) {
      return alert("please fill all the fields")
    }
    const signup = await addUser(email, passwrod, fullName);
    setEmail("")
    setPassword("")
    setFullName("")
    alert('Registered Successfully!')

    router.push('/login')
  }

  return (
    <div className='signinContainer'>
      <h1 style={{ textAlign: 'center' }}>Sign Up</h1>
      <input style={{ border: '2px solid black', width: '90%', margin: 5 }} type="text" placeholder="Full Name" onChange={e => setFullName(e.target.value)} />
      <input style={{ border: '2px solid black', width: '90%', margin: 5 }} type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} /><br />
      <input style={{ border: '2px solid black', width: '90%', margin: 5 }} type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} /><br />
      <button className='btn' type="submit" onClick={register}>Sign Up</button>
      <center>
        <center> <p>Already have an account?<span style={{ cursor: 'pointer', color: 'blue' }} onClick={() => router.push('/login')}> Login</span></p> </center>
      </center>
    </div>
  )
}