import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/auth';
import styles from '../../styles/CreateItem.module.css';

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
  const [itemDescription, setItemDescription] = useState();
  const [userFullName, setUserFullName] = useState();
  const [user, setUser] = useState(null);
  const router = useRouter();
  const storage = firebase.storage();

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
        document.body.innerHTML = '<h1>Please login to sell a Item</h1>';
        document.body.style =
          'display: flex; align-items: center; justify-content: center; height: 100vh;';
        document.querySelector('h1').style =
          'color: #dee3ea !important; font-size: 1rem;';
      }
    });
  }, []);

  let uuid;

  if (user !== null) {
    uuid = user.uid;
  }

  const data = {
    uid: uuid,
    imageUrl,
    userAddress,
    userPhoneNumber,
    itemName,
    itemPrice,
    itemPriceMrp,
    itemSmallDescription,
    itemDescription,
    userFullName,
  };

  const handleSubmit = e => {
    e.preventDefault();

    firebase
      .firestore()
      .collection('root')
      .add(data)
      .then(data => {
        console.log(data);
        router.push('/');
      })
      .catch(err => {
        console.error(err);
      });
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
          <button className={styles.btnRed} onClick={handleUploadImage}>
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
            placeholder={'Item Price That you want to sell'}
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
            placeholder={'The Price of the item when you bought it'}
            value={itemPriceMrp}
            onChange={e => setItemPriceMrp(e.target.value)}
            required
          />
          <input
            className={styles.formInput}
            type='text'
            placeholder={'A Small Description'}
            value={itemSmallDescription}
            onChange={e => setItemSmallDescription(e.target.value)}
            required
          />
          <input
            className={styles.formInput}
            type='text'
            placeholder={'Full Description of your Product'}
            value={itemDescription}
            onChange={e => setItemDescription(e.target.value)}
            required
          />
          <input
            className={styles.formInput}
            type='text'
            placeholder={'Your Full Name'}
            value={userFullName}
            onChange={e => setUserFullName(e.target.value)}
            required
          />
          <button
            onClick={handleSubmit}
            className={styles.btnRedTopMargin}
            type='submit'
          >
            Sell It!
          </button>
        </div>
        <p className={styles.infoText}>
          Note - If you don't get redirected to the home page, try re-clicking
          the 'Sell It!' button
        </p>
      </form>
    </div>
  );
};

export default CreateItem;
