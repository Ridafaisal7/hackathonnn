'use client'
import { useEffect, useState, useRef, useCallback } from 'react';
import { postMessages } from '../config/firebase';
import { collection, query, where, db, onSnapshot } from '../config/firebase';
import React from 'react';
import { FaPlus, FaPaperclip, FaPaperPlane } from 'react-icons/fa';
import { getDisplayName } from 'next/dist/shared/lib/utils';

const Chats = () => {
  const [newMessages, setNewMessages] = useState('');
  const [room, setRoom] = useState('');
  const [chats, setChats] = useState([]);

  const roomInputRef = useRef();

  const getChat = useCallback(() => {
    if (room !== '') {
      const q = query(collection(db, 'messages'), where('room', '==', room));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const chat = [];
        querySnapshot.forEach((doc) => {
          chat.push({ id: doc.id, ...doc.data() });
        });
        console.log('chat', chat);
        setChats(chat);
      });
      return () => unsubscribe();
    }
  }, [room]);

  useEffect(() => {
    getChat();
  }, [getChat]);

  const handleMessages = async (e) => {
    e.preventDefault();
    if (newMessages === '') return;
    await postMessages(newMessages, room);
    setNewMessages('');
    getChat();
  };

  return (
    <div>
      {room ? (
        <div className='signinContainer' style={{height: '600px'}}>
          <center>
          <div>         
        <center>
        {chats.map((item, index) => {
          return <div key={index} style={{border:'1px solid black',marginBottom:'6px', width: '60%',padding:'5px',borderRadius:'10px',backgroundColor:'white', flexDirection: 'column-reverse'}}>{item.text}</div>
        })}
        </center>
      </div>
      <div style={{display: 'flex', fontSize: '25px', padding: 'absolute'}}>
      <FaPlus style={{position: 'absolute', bottom: 29}}/>
      <FaPaperclip style={{position: 'absolute', bottom: 29, left: 535}}/>
      </div >
      <FaPaperPlane onClick={handleMessages} style={{position: 'absolute', bottom: 29, right: 505, fontSize: '25px'}}/>
            <input  
             style={{border:'1px solid black',borderRadius:'4px',padding:'5px',width:'242px', position: 'absolute', bottom: '22px', right: '540px'}}
              type='text'
              placeholder='Type your message here'
              value={newMessages}
              onChange={(e) => setNewMessages(e.target.value)}
            />
          </center>
        </div>
      ) : (
        <div className='signinContainer'>
          <center>
          <label style={{fontSize:'large'}}>Enter Room Name:</label><br/>
          <input style={{border:'1px solid black',borderRadius:'10px',padding:'5px',margin:'10px'}} ref={roomInputRef} /><br/>
          <button style={{backgroundColor:'deeppink',color:'black',padding:'10px',margin:'10px',borderRadius:'10px'}} onClick={() => setRoom(roomInputRef.current.value)}>Enter</button>
          </center>
        </div>
      )}
    </div>
  );
};

export default Chats;