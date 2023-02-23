export function ImagePickerExample({ firstName, lastName }) {
  // ...
}

import React, { useState, useEffect } from 'react';
import {
  View,
  Button,
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
  ImageBackground,
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { CheckBox } from 'react-native-elements';
import { Alert } from 'react-native';
import Onboarding from './Onboarding';
import { Avatar, reloadProfileData } from './Avatar';

export default function Profile({ navigation }) {
  const [emailNotification, setEmailNotification] = useState(false);
  const [passwordChanges, setPasswordChanges] = useState(false);
  const [specialOffers, setSpecialOffers] = useState(false);
  const [newsLetter, setNewsletter] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [changesMade, setChangesMade] = useState(false);

  const [preferences, setPreferences] = useState({
    orderStatuses: false,
    passwordChanges: false,
    specialOffers: false,
    newsLetter: false,
  });

  const handleLogout = async () => {
    try {
      // Remove profile picture from local storage
      await AsyncStorage.removeItem('profilePicture');

      // Remove login status from local storage
      await AsyncStorage.removeItem('isLoggedIn');

      // Check login status in local storage
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
      console.log('isLoggedIn', isLoggedIn);

      // Navigate to HomeScreen
      navigation.reset({
        index: 0,
        routes: [{ name: 'Onboarding' }],
      });
    } catch (e) {
      console.error('Error logging out: ', e);
    }
  };

  const handleRemovePicture = async () => {
    // Remove profile picture from local storage
    await AsyncStorage.removeItem('profilePicture');
    setProfilePicture(null);

    // Set profilePicture state to null
    setProfilePicture(null);
  };

  function ImagePickerExample({ firstName, lastName }) {
    const [image, setImage] = useState(null);
    const [initials, setInitials] = useState(null);

    const pickImage = async () => {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      console.log(result);
      if (!result.cancelled) {
        if (result.assets && result.assets.length > 0) {
          await AsyncStorage.setItem('profilePicture', result.assets[0].uri);
          setProfilePicture(result.assets[0].uri);
        } else {
          await AsyncStorage.setItem('profilePicture', result.uri);
          setProfilePicture(result.uri);
        }
        setImage
        setImage(null);
        setInitials(null);
      }
    };


    useEffect(() => {
      async function loadProfileData() {
        const savedFirstName = await AsyncStorage.getItem('firstName');
        const savedLastName = await AsyncStorage.getItem('lastName');
        const savedEmail = await AsyncStorage.getItem('email');
        const savedPhoneNumber = await AsyncStorage.getItem('phoneNumber');

        setFirstName(savedFirstName);
        setLastName(savedLastName);
        setEmail(savedEmail);
        setPhoneNumber(savedPhoneNumber);
      }

      loadProfileData();
    }, []);

    useEffect(() => {
      async function loadProfilePicture() {
        const savedProfilePicture = await AsyncStorage.getItem('profilePicture');
        if (savedProfilePicture) {
          setProfilePicture(savedProfilePicture);
        }
      }
      loadProfilePicture();
    }, []);

    const generateInitials = (firstName, lastName) => {
      let initials = '';
      if (firstName) {
        initials += firstName.charAt(0);
      }
      if (lastName) {
        initials += lastName.charAt(0);
      }
      return initials || (profilePicture ? null : 'N/A');
    };

    useEffect(() => {
      async function loadCheckboxInputs() {
        const savedEmailNotification = await AsyncStorage.getItem('emailNotification');
        setEmailNotification(savedEmailNotification === 'true');
        console.log('Email notification:', savedEmailNotification);

        const savedPasswordChanges = await AsyncStorage.getItem('passwordChanges');
        setPasswordChanges(savedPasswordChanges === 'true');
        console.log('Password changes:', savedPasswordChanges);

        const savedSpecialOffers = await AsyncStorage.getItem('specialOffers');
        setSpecialOffers(savedSpecialOffers === 'true');
        console.log('Special offers:', savedSpecialOffers);

        const savedNewsLetter = await AsyncStorage.getItem('newsLetter');
        setNewsletter(savedNewsLetter === 'true');
        console.log('Newsletter:', savedNewsLetter);
      }

      loadCheckboxInputs();
    }, []);


    return (
      <>
      <View style={styles.buttonContainer}>
        {profilePicture ? (
          <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
        ) : image ? (
          <Image source={{ uri: image }} style={styles.profilePicture} />
        ) : (
          <View style={styles.initialsContainer}>
            <Text style={styles.initials}>
              {initials ? initials : generateInitials(firstName, lastName)}
            </Text>
          </View>
        )}

       <Pressable style={styles.changeButton} onPress={() => {pickImage()}}>
          <Text style={{color: 'white'}} >Change</Text>
        </Pressable>

        <Pressable style={styles.removebutton} onPress={() => {handleRemovePicture()}} >
        <Text style={styles.buttonText2}>Remove</Text>
        </Pressable>

        </View>
      </>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView keyboardDismissMode="on-drag">
        <Text style={styles.headingSection}>Personal Information</Text>
        <ImagePickerExample firstName={firstName} lastName={lastName} />
        <Text style={styles.regularText}>First Name:</Text>
        <TextInput style={styles.input} placeholder={'First Name'} value={firstName} onChangeText={setFirstName} />
        <Text style={styles.regularText}>Last Name:</Text>
        <TextInput style={styles.input} placeholder={'Last Name'} value={lastName} onChangeText={setLastName} />
        <Text style={styles.regularText}>Email:</Text>
        <TextInput style={styles.input} placeholder={'Email'} keyboardType={'email-address'} value={email} onChangeText={setEmail} />
        <Text style={styles.regularText}>Phone Number:</Text>
        <TextInput style={styles.input} placeholder={'Phone Number'} keyboardType={'phone-pad'} value={phoneNumber} onChangeText={setPhoneNumber} />
        <Text style={styles.headingSection}>Email notifications</Text>
        <View style={styles.checkboxContainer}>

        <CheckBox
        style={styles.chekbox}
          title="Order status"
          checked={emailNotification}
          onPress={() => {
          setEmailNotification(!emailNotification);
          setChangesMade(true);
          AsyncStorage.setItem('emailNotification', (!emailNotification).toString())
          .then(() => console.log('Email notification saved:', (!emailNotification).toString()))
          .catch((error) => console.error('Error saving email notification:', error));
          }}
          />
        <CheckBox
        style={styles.chekbox}
          title="Password changes"
          checked={passwordChanges}
          onPress={() => {
          setPasswordChanges(!passwordChanges);
          setChangesMade(true);
          AsyncStorage.setItem('passwordChanges', (!passwordChanges).toString())
          .then(() => console.log('Password changes saved:', (!passwordChanges).toString()))
          .catch((error) => console.error('Error saving password changes:', error));
        }}
        />
        <CheckBox
        style={styles.chekbox}
          title="Special offers"
          checked={specialOffers}
          onPress={() => {
          setSpecialOffers(!specialOffers);
          setChangesMade(true);
          AsyncStorage.setItem('specialOffers', (!specialOffers).toString())
          .then(() => console.log('Special offers saved:', (!specialOffers).toString()))
          .catch((error) => console.error('Error saving special offers:', error));
        }}
        />
        <CheckBox
          title="Newsletter"
          checked={newsLetter}
          onPress={() => {
          setNewsletter(!newsLetter);
          setChangesMade(true);
          AsyncStorage.setItem('newsLetter', (!newsLetter).toString())
          .then(() => console.log('Newsletter saved:', (!newsLetter).toString()))
          .catch((error) => console.error('Error saving newsletter:', error));
        }}
        />

        </View>
        <Pressable style={styles.logoutButton} onPress={() => {handleLogout()}}>
          <Text style={{color: 'black'}} >Log out</Text>
        </Pressable>
        <View style={styles.myButtons}>
        <Pressable style={styles.discardButton} >
          <Text style={{color: 'black'}} >Discard changes</Text>
        </Pressable>
        <Pressable style={styles.saveButton}  onPress={() => {
        // Save checkbox changes to AsyncStorage
        AsyncStorage.setItem('firstName', firstName);
        AsyncStorage.setItem('lastName', lastName);
        AsyncStorage.setItem('email', email);
        AsyncStorage.setItem('phoneNumber', phoneNumber);
        AsyncStorage.setItem('emailNotification', emailNotification.toString());
        AsyncStorage.setItem('passwordChanges', passwordChanges.toString());
        AsyncStorage.setItem('specialOffers', specialOffers.toString());
        AsyncStorage.setItem('newsLetter', newsLetter.toString());
        // Reset changesMade to false
        setChangesMade(false);
        // Show alert
        Alert.alert('Changes saved', 'Your changes have been saved successfully.', [{ text: 'OK' }]);
        }}>
          <Text style={{color: 'white'}} >Save changes</Text>
        </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  regularText: {
    marginLeft: 12,
    marginTop: 15,
    fontSize: 16,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    fontSize: 16,
    borderColor: 'EDEFEE',
    borderRadius: 10,
  },
  messageInput: {
    height: 100,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    fontSize: 16,
    borderRadius: 5,
  },
  headingSection: {
    fontSize: 28,
    padding: 20,
    marginVertical: 8,
    color: 'black',
    textAlign: 'left',
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 20,
  },
  profilePicture: {
    width: 70,
    height: 70,
    borderRadius: 75,
  },
  initialsContainer: {
    width: 70,
    height: 70,
    backgroundColor: '#495e57',
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  changeButton: {
    right: 10,
    borderRadius: 8,
    backgroundColor: '#495e57',
    padding: 8,
    borderRadius: 10,
    alignSelf: 'center',
    alignItems: 'center',
    transform: [{ scale: 1.2 }],
    marginLeft: 10,
  },
  removebutton: {
    backgroundColor: 'white', // Red
    padding: 10,
    color: '#495e57',
    marginRight: 40,
    borderColor: '#495e57',
    borderWidth: 1,
  },
  logoutButton: {
    borderRadius: 8,
    backgroundColor: '#F4CE14',
    padding: 8,
    borderRadius: 10,
    marginHorizontal: 20,
    height: 40,
    borderWidth: 1,
    borderColor: '#dbb275',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    alignItems: 'center',
  },
  discardButton: {
    borderRadius: 8,
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 8,
    marginHorizontal: 20,
    height: 33,
    borderWidth: 1,
    borderColor: '#495e57',
    alignSelf: 'center',
    alignItems: 'center',
  },
  saveButton: {
    right: 10,
    borderRadius: 8,
    backgroundColor: '#495e57',
    padding: 8,
    borderRadius: 10,
    marginHorizontal: 20,
    height: 33,
    alignSelf: 'center',
    alignItems: 'center',
  },
  myButtons: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 20,
    alignSelf: 'center',
    alignItems: 'center',
  },
});
