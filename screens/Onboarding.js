import React, { useState, useEffect, setFirstName }from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAllData, saveData } from '../Async';
import { useHeaderHeight } from '@react-navigation/elements';
import { MaskedTextInput } from 'react-native-mask-text';

import {
  Alert,
  View,
  ScrollView,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
  KeyboardAvoidingView,
  Platform,
  colorScheme
} from 'react-native';

export default Onboarding = ({navigation}) => {
const [email, setEmail] = useState('');
const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');
const [phoneNumber, setPhoneNumber] = useState('');
const [emailValidError, setEmailValidError] = useState(false);
const [errorMessage, setErrorMessage] = useState('email adress must be valid');
const [nameValidError, setNameValidError] = useState(false);
const [nameErrorMessage, setNameErrorMessage] = useState('name is required');
const headerHeight = useHeaderHeight();

const isValidPhoneNumber = (phoneNumber) => {
  const phoneRegex = /^(\+?1-?)?(\([2-9][0-8][0-9]\)|[2-9][0-8][0-9])[-.]?[2-9][0-9]{2}[-.]?[0-9]{4}$/;
  return phoneRegex.test(phoneNumber);
}


const handleSave = async () => {
  try {
    await AsyncStorage.setItem('firstName', firstName);
    await AsyncStorage.setItem('lastName', lastName);
    await AsyncStorage.setItem('email', email);
    await AsyncStorage.setItem('phoneNumber', phoneNumber);
    await saveData('isLoggedIn', 'true');
    navigation.navigate('Profile', {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: phoneNumber,
    });
  } catch (e) {
    console.error('Error saving data: ', e);
  }
};





useEffect(()=>{

getAllData().then((dataObject) => {
  if (dataObject['isLoggedIn'] === 'true') {
    navigation.replace('HomeScreen');

  }
  else{
    console.log('ben giris yapmadim')
  }
});
},[]);

const handleValidName = val => {
  if (val.length >= 1) {
    setNameValidError(true);
    setNameErrorMessage('name is valid');
  } else {
    setNameValidError(false);
    setNameErrorMessage('name is required');
  }
};


const handleValidEmail = val => {
let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

if (reg.test(val) === false) {
  setEmailValidError(false);
  setErrorMessage('email adress must be valid')
} else if (reg.test(val) === true) {
  setEmailValidError(true);
  setErrorMessage('email verified')
}
};

const showAlert = () => {
  if (emailValidError) {
    return;
  }

  Alert.alert(
    'Thanks for subscribing, stay tuned!',
  );
};

return (
  <>
 <KeyboardAvoidingView
    keyboardVerticalOffset={headerHeight}
    style={styles.container}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
  >
    <ScrollView style={[
        styles.container,
        colorScheme === 'light'
          ? { backgroundColor: '#fff'}
          : { backgroundColor: '#333333'},
      ]} keyboardDismissMode="on-drag">
      <View>
        <Image
          style={styles.logo}
          source={require('../Img/little-lemon-logo-grey.png')}
          resizeMode="center"
          accessible={true}
          accessibilityLabel={'Little Lemon Logo'}
        />
        <Text style={[
          styles.headerText,
          colorScheme === 'light'
            ? { color: '#333333' }
            : { color: 'white' }
          ]}
        >
          Let us get to know you!
        </Text>
      </View>
      <View>
      <TextInput
  style={styles.inputBox}
  placeholder={'First Name:  '}
  placeholderTextColor={'black'}
  keyboardType={'default'}
  autoCorrect={false}
  autoCapitalize="none"
  onChangeText={value => {
    setFirstName(value);
    handleValidName(value);
  }}
/>
        <TextInput
          style={styles.inputBox}
          value={Text}
          placeholder={'Last Name:  '}
          placeholderTextColor={'black'}
          keyboardType={'default'}
          autoCorrect={false}
          autoCapitalize="none"
          onChangeText={value => {
            setLastName(value);
            handleValidName(value);
          }}
        />
        <MaskedTextInput
          style={styles.inputBox}
          mask="+1-999-999-9999"
          onChangeText={(text, rawText) => {
            console.log(text);
            console.log(rawText);
          }}
          value={phoneNumber}
          placeholder={'Phone Number:  '}
          placeholderTextColor={'black'}
          keyboardType={'phone-pad'}
          textContentType={'telephoneNumber'}
        />
        <TextInput
          style={styles.inputBox}
          value={email}
          placeholder={'Email: '}
          placeholderTextColor={'black'}
          keyboardType={'email-address'}
          autoCorrect={false}
          autoCapitalize="none"
          onChangeText={value => {
            setEmail(value);
            handleValidEmail(value);
          }}
        />
        {!emailValidError ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}
        {emailValidError ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}
      </View>
      {(!emailValidError || !nameValidError) && (
        <Pressable style={[styles.button, {
          backgroundColor: emailValidError ? '#33413e' : 'red',
          borderColor: emailValidError ? '#33413e' : 'red'
        }]}>
          <Text style={styles.buttonText}>Next</Text>
        </Pressable>
      )}
      {emailValidError && nameValidError && (
        <Pressable style={[styles.button, {
          backgroundColor: emailValidError ? '#33413e' : 'red',
          borderColor: emailValidError ? '#33413e' : 'red'
        }]}
        onPress={() => {
          saveData('isLoggedIn', 'true')
          {handleSave()}
          navigation.replace('HomeScreen', {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phoneNumber: phoneNumber,
          });
          }}>

          <Text style={styles.buttonText}>Subscribe</Text>
        </Pressable>
      )}
    </ScrollView>
  </KeyboardAvoidingView>
  </>
)};



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerText: {
    padding: 5,
    fontSize: 25,
    color: 'black',
    textAlign: 'center',
  },
    logo: {
     height: 200,
     width: 100,
     resizeMode: 'contain',
     flex: 1,
     alignSelf: 'center',
     marginTop: 30,
  },
  inputBox: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    fontSize: 16,
    borderColor: 'EDEFEE',
    backgroundColor: '#EDEFEE',
    borderRadius: 10,
  },
    button: {
    fontSize: 22,
    padding: 8,
    marginVertical: 15,
    margin: 25,
    backgroundColor: '#33413e',
    borderColor: '#33413e',
    borderWidth: 2,
    borderRadius: 10,
  },
    buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 22,
  },
  errorText: {
  color: 'red',
  fontSize: 17,
  padding: 5,
  textAlign: 'center',
},
});
