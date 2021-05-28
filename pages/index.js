import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';
import Head from 'next/head';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import Image from 'next/image';
import Link from 'next/link';
let id;

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default function Home() {
  const googleProvider = new firebase.auth.GoogleAuthProvider();
  const githubProvider = new firebase.auth.GithubAuthProvider();
  const facebookProvider = new firebase.auth.FacebookAuthProvider();

  const [user, setUser] = useState();
  const [data, setData] = useState();

  const signOut = () => {
    firebase.auth().signOut();
  };

  const signInWithGoogle = () => {
    firebase
      .auth()
      .signInWithPopup(googleProvider)
      .then(data => {
        setUser(user);
      });
  };

  const signInWithGithub = () => {
    firebase
      .auth()
      .signInWithPopup(githubProvider)
      .then(data => {
        setUser(user);
      });
  };

  const signInWithFacebook = () => {
    firebase
      .auth()
      .signInWithPopup(facebookProvider)
      .then(data => {
        setUser(user);
      });
  };

  useEffect(() => {
    id = window.localStorage.getItem('id');

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    firebase
      .firestore()
      .collection(id)
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type === 'added') {
            setData(change.doc.data());
          }
        });
      });
  }, []);

  return (
    <div>
      <Head>
        <title>SkeletonSell. - Sell anything. Anything buy Skeletons.</title>
        <meta
          name='description'
          content='Have some stuff that you don&#x27;t need? Sell it on SkeletonSell!'
        />
      </Head>
      {!user && (
        <div className={styles.loggedOut}>
          <Image src='/logoskeletonsell.svg' width='528' height='100' />
          <h1 className={styles.title}>
            Sign in / Sign Up to{' '}
            <span className={styles.redItalic}>continue</span>.
          </h1>
          <div className={styles.row}>
            <button className={styles.btn} onClick={signInWithGoogle}>
              Continue with{' '}
              <Image
                src='/googleLogo.svg'
                className={styles.icon}
                width={28}
                height={28}
              />
            </button>
            <button className={styles.btn} onClick={signInWithGithub}>
              Continue with{' '}
              <Image
                src='/githubLogo.svg'
                className={styles.icon}
                width={28}
                height={28}
              />
            </button>
            <button className={styles.btn} onClick={signInWithFacebook}>
              Continue with{' '}
              <Image
                src='/facebookLogo.svg'
                className={styles.icon}
                width={28}
                height={28}
              />
            </button>
          </div>
        </div>
      )}
      {user && (
        <div className={styles.loggedIn}>
          <nav className={styles.navbar}>
            <h4>Welcome, {user.displayName}</h4>
            <ul>
              <li>
                <Link href='/page/createItem'>
                  <a>{'Sell / Update Your Item'}</a>
                </Link>
              </li>
            </ul>
            <button className={styles.btn} onClick={signOut}>
              Sign Out
            </button>
          </nav>
          <h1 className={styles.title}>Find Latest items to Buy.</h1>
          {data && (
            <div className={styles.container}>
              <Link href={`/page/item/?id=${id}`}>
                <a className={styles.link}>
                  <div className={styles.cardItem}>
                    <img
                      className={styles.cardImg}
                      src={data.imageUrl || '/google.svg'}
                    />
                    <div className={styles.content}>
                      {console.log(data)}
                      <h2>{data.itemName}</h2>
                      <p>{data.itemSmallDescription}</p>
                    </div>
                  </div>
                </a>
              </Link>
            </div>
          )}
          {!data && <h1 className={styles.title}>All Items are sold!</h1>}
        </div>
      )}
    </div>
  );
}
