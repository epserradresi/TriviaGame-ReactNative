import React, {useState, useEffect} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import auth from '@react-native-firebase/auth';
import {launchImageLibrary} from 'react-native-image-picker';
import {showMessage} from 'react-native-flash-message';
import database from '@react-native-firebase/database';

import Button from '../../../components/Button/Button';
import styles from './Home.style';
import ChooseModal from '../../../components/modals/ChooseModal/ChooseModal';

const Home = ({navigation}) => {
  const [userInfo, setUserInfo] = useState();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    // It pulls user data from database and adds it to userInfo state.
    const user = auth().currentUser;
    const userId = user.uid;
    database()
      .ref(`users/${userId}/`)
      .on('value', snapshot => {
        setUserInfo(snapshot.val());
      });
  }, []);

  function handleAddPhoto() {
    // With React Native Image Picker, it allows the user to upload a photo from their gallery, then the uploaded photo is sent to the database.
    const user = auth().currentUser;
    const userId = user.uid;
    const options = {
      title: 'Titlee',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        showMessage({
          message: 'Something went wrong.',
          type: 'danger',
        });
      } else if (response.errorCode) {
        showMessage({
          message: 'Something went wrong.',
          type: 'danger',
        });
      } else {
        const path = response.assets[0].uri;
        database().ref(`users/${userId}/photos/profile`).set(path);
      }
    });
  }

  function handleStartChallenge() {
    setModalVisible(!modalVisible);
  }

  const handleLeaderboard = () => {
    navigation.navigate('Leaderboard');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.header_title}>HOME</Text>
      </View>
      <View style={styles.info_container}>
        <View style={styles.logo_container}>
          <Image source={require('../../../assests/images/triviaLogo.png')} />
        </View>
        <View style={styles.user_info_container}>
          <TouchableOpacity onPress={handleAddPhoto}>
            {userInfo && userInfo.photos && userInfo.photos.profile ? (
              <Image
                style={styles.user_image}
                source={{uri: userInfo.photos.profile}}
              />
            ) : (
              <Image
                style={styles.user_image}
                source={require('../../../assests/images/defaultUserImage.jpg')}
              />
            )}
          </TouchableOpacity>
          {userInfo && userInfo.username ? (
            <Text style={styles.username}>{userInfo.username}</Text>
          ) : (
            <Text style={styles.username}> </Text>
          )}
        </View>
        <Text style={styles.ready_text}>Are you ready for the challenge?</Text>
        <View style={styles.button_container}>
          <Button
            text="Start Challenge"
            theme="secondary"
            onPress={handleStartChallenge}
          />
        </View>
        <Button
          onPress={handleLeaderboard}
          text="Leaderboard"
          theme="primary"
        />
        <View style={styles.logout_button}>
          <Button
            text="Logout"
            theme="tertiary"
            onPress={() => auth().signOut()}
          />
        </View>
      </View>
      <ChooseModal isVisible={modalVisible} onClose={handleStartChallenge} />
    </View>
  );
};

export default Home;
