import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput, ScrollView, } from 'react-native';

const BASE_URL = 'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main';

const HomeScreen = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch(`${BASE_URL}/capstone.json`);
        const data = await response.json();
        setMenuItems(data.menu);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMenuItems();
  }, []);

  const handleCategorySelection = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleSearchTextChange = (text) => {
    setSearchText(text);
  };

  const filteredMenuItems = menuItems.filter((menuItem) =>
  (selectedCategories.length === 0 || selectedCategories.includes(menuItem.category)) &&
  (searchText === '' || menuItem.name.toLowerCase().includes(searchText.toLowerCase()) || menuItem.description.toLowerCase().includes(searchText.toLowerCase()))
);


  return (
    <ScrollView keyboardDismissMode="on-drag">
      <View style={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.h1}>Little Lemon</Text>
        <View style={styles.hero2container}>
          <Text style={styles.h3}><Text style={styles.h2}>Chicago</Text><Text>{"\n"}{"\n"}</Text>We are a family owned Mediterranean restaurant focused on traditional recipes served with a modern twist.</Text>
          <Image source={require('../Img/Hero.jpeg')} resizeMode="cover" style={styles.heroimage} />
        </View>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search"
          value={searchText}
          onChangeText={handleSearchTextChange}
        />
      </View>
      <View style={styles.categories}>
        <TouchableOpacity
          style={[
            styles.categoryButton,
            selectedCategories.includes('starters') && styles.selectedCategoryButton,
          ]}
          onPress={() => handleCategorySelection('starters')}
        >
          <Text style={[styles.categoryButtonText, selectedCategories.includes('starters') && styles.selectedCategoryButtonText]}>Starters</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.categoryButton,
            selectedCategories.includes('mains') && styles.selectedCategoryButton,
          ]}
          onPress={() => handleCategorySelection('mains')}
        >
          <Text style={[styles.categoryButtonText, selectedCategories.includes('mains') && styles.selectedCategoryButtonText]}>Mains</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.categoryButton,
            selectedCategories.includes('desserts') && styles.selectedCategoryButton,
          ]}
          onPress={() => handleCategorySelection('desserts')}
        >
          <Text style={[styles.categoryButtonText, selectedCategories.includes('desserts') && styles.selectedCategoryButtonText]}>Desserts</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.categoryButton,
            selectedCategories.includes('drinks') && styles.selectedCategoryButton,
          ]}
          onPress={() => handleCategorySelection('drinks')}
        >
          <Text style={[styles.categoryButtonText, selectedCategories.includes('drinks') && styles.selectedCategoryButtonText]}>Drinks</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.menu}>
        {filteredMenuItems.map((menuItem) => (
          <View key={menuItem.id} style={styles.menuItem}>
            <Image
              source={{ uri: `${BASE_URL}/images/${menuItem.image}?raw=true` }}
              style={styles.menuItemImage}
            />
            <View style={styles.menuItemDetails}>
              <Text style={styles.menuItemName}>{menuItem.name}</Text>
              <Text style={styles.menuItemDescription}> {menuItem.description.length > 100 ? (
                  <Text>{`${menuItem.description.slice(0, 50)}...`}</Text>
                ) : (
                  <Text>{menuItem.description}</Text>
                )}
                <Text style={styles.menuItemPrice}>Price: {menuItem.price}</Text></Text>
            </View>
          </View>
        ))}
      </View>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },

    searchContainer: {
      marginBottom: 20,
      height: 50,
      backgroundColor: '#495e57',
      position: 'relative',
    },

    searchBar: {
      position: 'absolute',
      bottom: 10,
      left: 10,
      right: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 7,
      backgroundColor: 'white',
    },

    categories: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
      paddingHorizontal: 10,
    },

    categoryButton: {
      backgroundColor: 'gray',
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 10,
    },

    selectedCategoryButton: {
      backgroundColor: 'green',
    },

    categoryButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },

    selectedCategoryButtonText: {
      color: '#fff',
    },

    menu: {
      flex: 1,
      paddingHorizontal: 10,
    },

    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 1,
      backgroundColor: '#f9f9f9',
      borderRadius: 10,
      overflow: 'hidden',
    },

    menuItemImage: {
      width: 100,
      height: 100,
    },

    menuItemDetails: {
      flex: 1,
      padding: 10,
      flexDirection: 'column',
    },

    menuItemName: {
      fontWeight: 'bold',
      fontSize: 16,
      marginBottom: 5,
    },

    menuItemDescription: {
      marginBottom: 5,
    },

    menuItemPrice: {
      fontWeight: 'bold',
    },

    hero: {
      backgroundColor: '#495e57',
      paddingBottom: 20,
    },

    h1: {
      paddingLeft:25,
      paddingTop:35,
      color:'#f4ce14',
      fontSize:'40',
    },

    h2: {
      paddingLeft:25,
      color:'white',
      fontSize:'30',
    },

    h3: {
      paddingLeft:25,
      color:'white',
      fontSize:'15',
      paddingRight:20,
    },

  hero2container: {
    flexDirection: 'row',
    justifyContent:'center',
    paddingLeft: 70,
    paddingRight: 85,
    },

  heroimage: {
    width: 150,
    height: 160,
    borderRadius: 20,
  },

  });

  export default HomeScreen;
