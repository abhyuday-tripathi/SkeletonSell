import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import styles from '../../styles/Item.module.css';
import Head from 'next/head';

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

const Item = () => {
  const router = useRouter();
  const [data, setData] = useState();
  const [user, setUser] = useState(null);
  const { id } = router.query;

  useEffect(() => {
    firebase
      .firestore()
      .collection('root')
      .doc(id)
      .get()
      .then(data => {
        setData(data.data());
      });

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
        document.body.innerHTML = '<h1>Please login to View a Item</h1>';
        document.body.style =
          'display: flex; align-items: center; justify-content: center; height: 100vh;';
        document.querySelector('h1').style =
          'color: #dee3ea !important; font-size: 1rem;';
      }
    });
  }, []);

  return (
    <div>
      {data && (
        <div className={styles.container}>
          <Head>
            <title>Buy {data.itemName} on SkeletonSell</title>
          </Head>
          <img
            className={styles.itemImg}
            src={data.imageUrl}
            alt='item-image'
            title='Item Image'
          />
          <div className={styles.wrapper}>
            <div className={styles.productName}>
              <h1 title='Item Name' className={styles.title}>
                Buy {data.itemName}
              </h1>
              <p className={styles.itemSmallDescription}>
                {data.itemSmallDescription}
              </p>
            </div>
            <div className={styles.contentContainer}>
              <h1 className={styles.subTitle}>Price</h1>
              <div className={styles.infoTextPrice}>
                <p>Original Price: {data.itemPriceMrp}</p>
                <p>Price Selling: {data.itemPrice}</p>
              </div>
            </div>
            <div className={styles.contentContainer}>
              <h1 className={styles.subTitle}>Product Info</h1>
              <p className={styles.infoText}>{data.itemDescription}</p>
              <div className={styles.contactInfo}>
                <p className={styles.infoText}>Address: {data.userAddress}</p>
                <p className={styles.infoText}>
                  Seller Name: {data.userFullName}
                </p>
                <p className={styles.infoText}>
                  Seller Phone Number: {data.userPhoneNumber}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Item;
