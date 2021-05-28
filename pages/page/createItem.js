import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import styles from '../../styles/CreateItem.module.css';
import Image from 'next/image';
import { v4 as uuidV4 } from 'uuid';

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

const CreateItem = () => {
  const [image, setImage] = useState();
  const [imageUrl, setImageUrl] = useState();
  const [itemName, setItemName] = useState();
  const [itemPrice, setItemPrice] = useState();
  const [userPhoneNumber, setUserPhoneNumber] = useState();
  const [userAddress, setUserAddress] = useState();
  const [itemPriceMrp, setItemPriceMrp] = useState();
  const [itemSmallDescription, setItemSmallDescription] = useState();
  const router = useRouter();
  const storage = firebase.storage();

  useEffect(() => {
    window.localStorage.setItem('id', uuidV4());
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    firebase
      .firestore()
      .collection(localStorage.getItem('id'))
      .add({
        id: localStorage.getItem('id'),
        imageUrl,
        userAddress,
        userPhoneNumber,
        itemName,
        itemPrice,
        itemSmallDescription,
      });
    router.push('/');
  };

  const handleChange = e => {
    if (
      (e.target.files[0] && e.target.files[0].type === 'image/png') ||
      (e.target.files[0] && e.target.files[0].type === 'image/jpeg')
    ) {
      setImage(e.target.files[0]);
    } else {
      document.write('Please refresh and then select a png or jpeg image.');
    }
  };

  const handleUploadImage = e => {
    if (image) {
      const uploadTask = storage.ref(`/images/${image.name}`).put(image);
      uploadTask.on(
        'state_changed',
        snapshot => {
          if (snapshot._delegate.state === 'running') {
            e.target.textContent = 'Uploading...';
          }
        },
        error => console.error(error),
        () => {
          storage
            .ref('images')
            .child(image.name)
            .getDownloadURL()
            .then(url => {
              setImageUrl(url);
              e.target.textContent = 'Uploaded!';
              e.target.setAttribute('disabled', true);
            });
        }
      );
    } else {
      document.write("You can't make us fool? Can You?");
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Sell a Item - SkeletonSell.</title>
      </Head>
      <form className={styles.formGroup} onSubmit={e => e.preventDefault()}>
        <div className='imageContainer'>
          {imageUrl && <img src={imageUrl} className={styles.bannerImage} />}
        </div>
        <div className={styles.imageUploadGroup}>
          <label className={styles.uploadBtnSelect} htmlFor='uploadPhoto'>
            Browse Image
          </label>
          <input
            type='file'
            className={styles.uploadPhoto}
            id='uploadPhoto'
            onChange={handleChange}
            style={{ display: 'none' }}
          />
          <button className={styles.btn} onClick={handleUploadImage}>
            Upload (Image)
          </button>
        </div>
        <div className={styles.inputDetailsGroup}>
          <input
            className={styles.formInput}
            type='text'
            placeholder={'Item Name'}
            onChange={e => setItemName(e.target.value)}
            value={itemName}
            required
          />
          <input
            className={styles.formInput}
            type='number'
            value={itemPrice}
            onChange={e => setItemPrice(e.target.value)}
            placeholder={'Item Price That you want to sell.'}
            required
          />
          <input
            className={styles.formInput}
            type='number'
            placeholder={'Your Phone Number'}
            value={userPhoneNumber}
            onChange={e => setUserPhoneNumber(e.target.value)}
            required
          />
          <input
            className={styles.formInput}
            type='text'
            placeholder={'Your Full Address'}
            value={userAddress}
            onChange={e => setUserAddress(e.target.value)}
            required
          />
          <input
            className={styles.formInput}
            type='number'
            placeholder={'The Price of the item when you bought it.'}
            value={itemPriceMrp}
            onChange={e => setItemPriceMrp(e.target.value)}
            required
          />
          <input
            className={styles.formInput}
            type='text'
            placeholder={'Small Description of only 5 words.'}
            value={itemSmallDescription}
            onChange={e => setItemSmallDescription(e.target.value)}
            required
          />
          <button onClick={handleSubmit} className={styles.btn} type='submit'>
            Sell It!
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateItem;
