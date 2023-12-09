// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, FacebookAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, collection, onSnapshot, query, where, addDoc, getDocs, updateDoc, doc, serverTimestamp} from "firebase/firestore"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC5O1hoYbdzAaJmyJnyOxVZruoRe36-JkM",
  authDomain: "final-project-d0a7e.firebaseapp.com",
  projectId: "final-project-d0a7e",
  storageBucket: "final-project-d0a7e.appspot.com",
  messagingSenderId: "284011778566",
  appId: "1:284011778566:web:e98f08ade439c4a52c6987"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const provider = new FacebookAuthProvider();
const auth = getAuth(app);
const db = getFirestore(app)
const storage = getStorage(app)

// var emailAuthProvider = new firebase.auth.EmailAuthProvider();
// var facebookAuthProvider = new firebase.auth.FacebookAuthProvider();

// // Example of email/password sign-up
// firebase.auth().createUserWithEmailAndPassword(email, password)
//   .then((userCredential) => {
//     // User signed up successfully
//     var user = userCredential.user;
//     console.log(user);
//   })
//   .catch((error) => {
//     console.error(error.code, error.message);
//   });

//   // Example of Facebook login
// firebase.auth().signInWithPopup(facebookAuthProvider)
// .then((result) => {
//   // User signed in with Facebook successfully
//   var user = result.user;
//   console.log(user);
// })
// .catch((error) => {
//   console.error(error.code, error.message);
// });

async function addUser(email, password, fullName) {
  await createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up
      const user = userCredential.user;
      console.log('user', user)
      addDetail(user.uid, fullName, user.email);
      console.log('addData', addDetail)
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
}

function loginUser(email, password) {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
}

function loginWithFacebook() {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      const credential = FacebookAuthProvider.credentialFromResult(result);
      const accessToken = credential.accessToken;
      console.log('user', user)
      return user
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      const credential = FacebookAuthProvider.credentialFromError(error)
    })
}

async function addDetail(uid, fullName, email) {
  const doc = await addDoc(collection(db, "users"), {
    uid,
    displayName: fullName,
    email,
    status: 'pending'
  });
  console.log('doc', doc)
}

async function getUsers() {
  const list = [];
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
    list.push(doc.data());
  });
  return list;
}

async function post( description, file, type) {
  try {
    const url = await uploadImage(file)
    const videoUrl = await uploadVideo(file);
    console.log('video url ==> ', videoUrl)
   const docRef =  await addDoc(collection(db, "data"), {
      description,
      imageUrl: url,
      video : videoUrl,
      type: type
    });
    alert('Post posted successfully')
  } catch (e) {
    alert(e.message)
  }
}

async function uploadVideo(file) {
  try {
    const storageRef = ref(storage, 'videos/' + file.name);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (e) {
    console.error("Uploading video", e.message);
  }
}

async function uploadImage(file) {
  try {
    const storageRef = ref(storage, 'data/' + file.name);
    await uploadBytes(storageRef, file)
    const url = await getDownloadURL(storageRef)
    return url
  } catch (e) {
    alert(e.message)
  }
}

async function getPosts() {
  const querySnapshot = await getDocs(collection(db, "data"));
  const data = []
  querySnapshot.forEach((doc) => {
    const postData = doc.data()
    data.push(postData)
    console.log(doc.id, " => ", doc.data());
    console.log('data', data)
  });
  return data
}

async function updateStatus(id, status) {
  await updateDoc(doc(db, "users", id), {
    status
  });
}

async  function postMessages(newMessages,room){
  const docRef = await addDoc(collection(db, "messages"), {
    text:newMessages,
    createdAt: serverTimestamp(),
    user: auth.currentUser.displayName,
    room:room
  });
  }

export { loginWithFacebook, getPosts, post, collection, query, where, onSnapshot, db
  , getUsers, getDocs, doc, postMessages, updateStatus, addUser, loginUser
}