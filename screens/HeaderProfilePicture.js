import React, { useState, useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HeaderProfilePicture = ({ firstName, lastName }) => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [initials, setInitials] = useState(null);

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

  return (
    <View>
      {profilePicture ? (
        <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
      ) : (
        <View style={styles.initialsContainer}>
          <Text style={styles.initials}>
            {initials ? initials : generateInitials(firstName, lastName)}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = {
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 75,
  },
  initialsContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#495e57',
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
};

export default HeaderProfilePicture;
