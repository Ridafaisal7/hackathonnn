'use client'
import Link from 'next/link'
import React from 'react';
import { useRouter } from "next/navigation"
import { FaHome, FaCompass, FaShoppingBag, FaHeart, FaEnvelope, FaCog, FaVideo, FaCamera, FaSmile, } from 'react-icons/fa';
import { getPosts } from '../config/firebase';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faComment, faShare } from '@fortawesome/free-solid-svg-icons';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { updateStatus } from "../config/firebase"
import { collection, query, where, onSnapshot, db } from '../config/firebase'

export default function Dashboard() {
    const [post, setPost] = useState([])
    const [file, setFile] = useState()
    const [friendRequest, setFriendRequest] = useState([])
    const [friends, setFriends] = useState([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const [userDetail, setUserDetail] = useState()
    const [newMessages, setNewMessages] = useState()
    const [msg, setMsg] = useState()
    const auth = getAuth();

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;
                setUserDetail(user)
            } else {
            }
        });
        getData()
        request()
        MyContacts()
    }, [auth])

    // useEffect(() => {
    //     onAuthStateChanged(auth, (user) => {
    //         if (user) {
    //             const uid = user.uid;
    //             setUserDetail(user)
    //         } else {
    //         }
    //     });
    // }, [logOut])

    console.log('users', userDetail)

    const handlePost = async (description, file) => {
        try {
            getPosts()
        } catch (error) {
            alert(error.message);
        }
    };

    const getData = async () => {
        try {
            const data = await getPosts();
            setPost(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    }
    console.log('post --->', post)

    if (!post) {
        return <div>Loading...</div>
    }

    const request = async () => {
        const q = query(collection(db, "users"), where("status", "==", "pending"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const data = [];
            querySnapshot.forEach((doc) => {
                data.push({ id: doc.id, ...doc.data() });
            });
            setFriendRequest(data)
        });
    }

    async function MyContacts() {
        const q = query(collection(db, "users"), where("status", "==", "accepted"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const data = [];
            querySnapshot.forEach((doc) => {
                data.push({ id: doc.id, ...doc.data() });
            });
            setFriends(data)
        });
    }

    console.log('friend', friends)

    if (!friends) {
        return <div>Loading...</div>
    }

    const handleClick = async (item) => {
        router.push('/chats')
    }

    async function logOut() {
        try {
            await signOut(auth)
                .then(() => {
                    setUserDetail(null)
                    router.push('/login', { scroll: false })
                })
        } catch (e) {
            console.log(e.message)
        }
    }

    return <div>
        <div className="header">
            <h1 style={{ fontSize: 28, position: 'absolute', top: 2, left: 30, color: 'black' }}>Scrolllink</h1>
            <input className="input" type="text" placeholder="Type something here ..." />
            <button className='button-logout' onClick={() => router.push('/login')}>Logout</button>
            {userDetail && userDetail.displayName ? (
                <div>
                    {userDetail.photoURL ? (
                        <img width={39} style={{ marginRight: 20 }}
                            src={userDetail.photoURL}
                            alt="User Photo"
                        />
                    ) : (
                        <span>No Photos </span>
                    )}
                    <span style={{ color: 'black', position: 'absolute', top: 8, right: 82, fontSize: 20 }}>{userDetail.displayName}</span>
                </div>
            ) : (
                <span>Loading...</span>
            )}
        </div>

        <div style={{ display: 'flex' }}>
            <div className='side-bar' style={{ flex: 1, padding: '5px' }}>
                <div className='menu-container'>

                    <div>
                        <h1 style={{ fontSize: 'large', marginTop: '25px', pdding: '10px', height: '40px', fontWeight: 'bolder', textDecoration: 'underline' }} >My Contacts </h1>
                        {friends.map((item, index) => {
                            return <div key={index} style={{ border: '1px solid grey', borderRadius: '8px', margin: '10px', padding: '10px' }} >
                                <h1> {item.displayName}</h1>
                            </div>
                        })}
                    </div>
                    <div className='menu-item'>
                        <FaCog /> <Link href="/">Setting</Link>
                    </div>
                    <div className='menu-item'>
                        <FaEnvelope /> <Link href="/explore">Messages</Link>
                    </div>
                    <div className='menu-item'>
                        <FaHeart /> <Link href="/marketplace">My favorite</Link>
                    </div>
                    <div className='menu-item'>
                        <FaShoppingBag /> <Link href="/favorites">Marketplace</Link>
                    </div>
                    <div className='menu-item'>
                        <FaCompass /> <Link href="/messages">Explore</Link>
                    </div>
                    <div className='menu-item'>
                        <FaHome /> <Link href="/settings">Feed</Link>
                    </div>
                </div>
            </div>

            <div className='post' style={{ flex: 2, padding: '20px', width: '510px', backgroundColor: '#eeeeee' }}>
                <input style={{ border: '2px solid black', borderRadius: 5, marginLeft: 24, width: '90%', border: '1px solid #ccc;', height: '40px' }} placeholder=" What's happening? " /><br /><br />
                <div style={{ display: 'flex' }} className="menuu-container">
                    <div className='menuu-item'>
                        <FaVideo /> <Link href="/postad">Video </Link>
                    </div>
                    <div className='menuu-item'>
                        <FaCamera /> <Link href="/explore">Photos</Link>
                    </div>
                    <div className='menuu-item'>
                        <FaSmile /> <Link href="/marketplace">Feelings</Link>
                    </div>
                    <div className='menuuu-item'>
                        <button className="button-post" onClick={() => router.push('/postad')}>Post</button>
                    </div>

                </div> <br />
                <div>
                    {post.map((item, index) => {
                        return <div key={index} style={{ marginTop: 10 }}>
                            <div>
                                <span style={{ display: 'flex' }}>
                                    <img style={{ marginLeft: 5 }} width={30} src={userDetail.photoURL} />
                                    <p style={{ fontSize: 18, color: 'black ', marginLeft: 5 }}>{userDetail.displayName}</p>
                                </span>
                                <h2 style={{ color: 'aaaaaa' }}>Description: {item.description}</h2>
                                {item.type === 'image' ? (
                                    <img src={item.imageUrl} alt={item.description} style={{ maxWidth: '100%', maxHeight: '400px' }} />
                                ) : item.type === 'video' ? (
                                    <video controls width="400">
                                        <source src={item.video} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                ) : null}
                                {/* <img height={70} width='100%' src={item.imageUrl} />
                                {post.map((post) => (
                                    <div key={post.id} videoUrl={post.videoUrl} > </div>
                                ))} */}

                                {/* <div>
                                    {post.map((item, index) => (
                                        <div key={index}>
                                            <h1>{item.description}</h1>
                                            {item.type === 'image' ? (
                                                <img src={item.url} alt={item.description} style={{ maxWidth: '100%', maxHeight: '400px' }} />
                                            ) : item.type === 'video' ? (
                                                <video controls width="400">
                                                    <source src={item.url} type="video/mp4" />
                                                    Your browser does not support the video tag.
                                                </video>
                                            ) : null}
                                        </div>
                                    ))}
                                </div> */}

                                {/* {file && Array.from(file).map((item, index) => {
                                    return <div key={index}>
                                        {isImage(item) && (
                                            <Image
                                                src={URL.createObjectURL(item)}
                                                width={200}
                                                height={200}
                                                alt="uploading"
                                            />
                                        )}

                                        {isVideo(item) && (
                                            <ReactPlayer url={URL.createObjectURL(item)} controls={true} />
                                        )}

                                        {isAudio(item) && (
                                            <ReactPlayer url={URL.createObjectURL(item)} controls={true} />
                                        )}

                                    </div>

                                })} */}
                            </div>
                            <div style={{ borderTop: '2px solid grey', borderBottom: '2px solid grey', color: 'black', fontSize: 21 }}>
                                <FontAwesomeIcon icon={faThumbsUp} /> Like
                                <FontAwesomeIcon icon={faComment} style={{ marginLeft: 80 }} /> Comment
                                <FontAwesomeIcon icon={faShare} style={{ marginLeft: 80 }} /> Share
                            </div>
                        </div>
                    })}
                </div>
            </div>

            <div style={{ flex: 3, padding: '15px', backgroundColor: 'white', borderRadius: 6 }}>
                <div className='request'>
                    <h1 style={{ fontSize: 'large', fontWeight: 'bolder', textAlign: 'left', borderBottom: '1px solid black' }}> You might like </h1>
                    {friendRequest.map((item, index) => {
                        return (<div key={index} style={{ borderRadius: '10px', margin: '10px', padding: '10px' }} >
                            <h1 style={{ textAlign: 'left' }}>{item.displayName}</h1>
                            <button onClick={() => { updateStatus(item.id, 'accepted') }} style={{ padding: '10px', margin: '2px', fontSize: 'small', backgroundColor: 'deeppink', borderRadius: '5px', width: '90px' }}>Accept</button>
                            <button onClick={() => { updateStatus(item.id, 'decline') }} style={{ padding: '10px', margin: '2px', fontSize: 'small', backgroundColor: 'white', border: '1px solid black', borderRadius: '5px', width: '90px' }}>Ignore</button>
                        </div>
                        )
                    })}
                </div>
                <div className='request'>
                    <h1 style={{ fontSize: 'large', fontWeight: 'bolder', textAlign: 'left', padding: 10 }}>Upcoming events</h1>
                    <div>
                        <span><image width={30} src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJukIYseLOtlMDhYKfQfx0uDqurOqoXNmQOw&usqp=CAU' />
                            <h2 style={{ position: 'relative', bottom: 34, right: 59 }}>Design Talks</h2>
                            <h4 style={{ position: 'relative', bottom: 38, right: 59, fontSize: 12 }}>12 Oct, 13:00 IST</h4>
                            <p style={{ fontSize: 12, position: 'relative', bottom: 30, borderBottom: '1px solid grey' }}>A general talks about design is a set of <br />  Designer of Logitech Michael Skunpit</p>
                        </span>
                        <p style={{ fontSize: 14 }}>112 Joined</p>
                    </div>
                </div>

                <div className='request'>
                    <h1 style={{ fontSize: 'large', fontWeight: 'bolder', textAlign: 'left', padding: 10 }}>Upcoming events</h1>
                    <div>
                        <span><image width={30} src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJukIYseLOtlMDhYKfQfx0uDqurOqoXNmQOw&usqp=CAU' />
                            <h2 style={{ position: 'relative', bottom: 34, right: 59 }}>Design Talks</h2>
                            <h4 style={{ position: 'relative', bottom: 38, right: 59, fontSize: 12 }}>30 Dec, 16:00 IST</h4>
                            <p style={{ fontSize: 12, position: 'relative', bottom: 30, borderBottom: '1px solid grey' }}>A general talks about design is a set of <br />  Designer of Logitech Michael Skunpit</p>
                        </span>
                        <p style={{ fontSize: 14 }}>80 Joined</p>
                    </div>
                </div>

            </div>

            <div style={{ flex: 3, backgroundColor: 'pink', width: '80px' }}>
                <h1 style={{ fontSize: 'large', margin: '10px', padding: '10px', height: '40px', fontWeight: 'bolder' }} >CHATS</h1>
                {friends.map((item, index) => {
                    return <div key={index} onClick={(item) => handleClick(item)} style={{ border: '1px solid black', borderRadius: '10px', margin: '10px', padding: '10px', width: '280px', display: 'flex', justifyContent: 'space-between' }} >
                        <h1> {item.displayName}</h1>
                        <FaEnvelope />
                    </div>
                })}
            </div>
        </div>
    </div>
}