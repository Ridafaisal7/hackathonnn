'use client'
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { post } from "../config/firebase"

export default function PostAd() {
    const router = useRouter()
    const [description, setDescription] = useState()
    const [file, setFile] = useState()
    const [loading, setLoading] = useState(false)
    const [type, setType] = useState()

    
    const addPost = async () => {
        setLoading(true)
        await post(description, file[0], type)
        alert('Post added successfully!')
        router.push('/dashboard')
    }

    return (<div style={{ marginTop: 80 }} className="postAdd">
        <h3 style={{ position: 'relative', left: 140, fontSize: 25 }} >Post</h3><br />
        <input style={{ border: '1px solid black', width: '330px', height: '35px' }} type="text" onChange={(e) => setDescription(e.target.value)} placeholder=" DESCRIPTION" /> <br /> <br />
        <input style={{ border: '1px solid black', width: '330px', height: '35px' }} type="text" onChange={(e) => setType(e.target.value)} placeholder=" Write Image / Audio / Video" /> <br /> <br />
        <input className="postfile" onChange={(e) => setFile(e.target.files)} type="file" /><br /><br />
        {loading ? <img src='https://i.gifer.com/ZKZg.gif' width='20' />
            :
            <center> <button style={{ fontSize: 20, marginLeft: '120px' }} className="button-post" onClick={addPost}>Submit</button> </center>
        }
    </div>)
}