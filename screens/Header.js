import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const Header = ({ navigation, profilePicture: newProfilePicture, pictureDeleted }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    async function loadProfileData() {
      const savedFirstName = await AsyncStorage.getItem('firstName');
      const savedLastName = await AsyncStorage.getItem('lastName');
      const savedProfilePicture = await AsyncStorage.getItem('profilePicture');

      setFirstName(savedFirstName || '');
      setLastName(savedLastName || '');

      if (savedProfilePicture) {
        setProfilePicture(savedProfilePicture);
      } else {
        setProfilePicture(null);
      }
    }

    const unsubscribe = navigation.addListener('focus', () => {
      loadProfileData();
    });

    loadProfileData();

    return unsubscribe;
  }, []);


  useEffect(() => {
    if (newProfilePicture) {
      setProfilePicture(newProfilePicture);
    }
  }, [newProfilePicture]);

  useEffect(() => {
    if (pictureDeleted) {
      setProfilePicture(null);
    }
  }, [pictureDeleted]);

  const getInitials = (firstName, lastName) => {
    return firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase();
  };

  const reloadProfileData = async () => {
    const savedFirstName = await AsyncStorage.getItem('firstName');
    const savedLastName = await AsyncStorage.getItem('lastName');
    const savedProfilePicture = await AsyncStorage.getItem('profilePicture');

    setFirstName(savedFirstName || '');
    setLastName(savedLastName || '');

    if (savedProfilePicture) {
      setProfilePicture(savedProfilePicture);
    } else {
      setProfilePicture(null);
    }
  };


  const renderBackButton = () => {
    if (navigation.canGoBack()) {
      return (
        <View style={styles.backButton}>
          <TouchableOpacity onPress={() => {
            navigation.goBack();
            reloadProfileData();
          }}>
            <Ionicons name="arrow-back" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
      );
    }
    return <View style={{ width: 30 }} />;
  };


  const handleProfilePicturePress = () => {
    navigation.navigate('Profile');
  };

  return (
    <View style={styles.container}>
      {renderBackButton()}
      <View style={styles.flexSpacer} />
      <View style={styles.logoContainer}>
          <Image
            source={require('/Users/kaanbalkan/Desktop/capstone/little-lemon/Img/LittleLemonLogo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
      {profilePicture ? (
        <TouchableOpacity onPress={handleProfilePicturePress}>
          <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={handleProfilePicturePress}>
          <View style={styles.initialsContainer}>
            <Text style={styles.initialsText}>{getInitials(firstName, lastName)}</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 110,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    backgroundColor: '#495e57',
  },
  profilePicture: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  initialsContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#C4C4C4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
    flex: 1,
    height: 55,
    alignSelf: 'center',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
});

export default Header;
