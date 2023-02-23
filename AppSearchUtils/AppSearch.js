import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Text,
  View,
  StyleSheet,
  SectionList,
  SafeAreaView,
  StatusBar,
  Alert,
  Image,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { Searchbar } from 'react-native-paper';
import debounce from 'lodash.debounce';
import {
  createTable,
  getMenuItems,
  saveMenuItems,
  filterByQueryAndCategories,
} from './database';
import Filters from './Filters';
import { getSectionListData, useUpdateEffect } from './utils';

const API_URL =
  'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json';
const sections = ['starters', 'mains', 'desserts'];

const Item = ({ title, price, image, id }) => (
  <View style={styles.item} key={id}>
    <Image source={{ uri: image }} style={styles.itemImage} resizeMode='cover' />
    <View style={styles.itemText}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.title}>${price}</Text>
    </View>
  </View>
);

export default function AppSearch() {
  const [data, setData] = useState([]);
  const [searchBarText, setSearchBarText] = useState('');
  const [query, setQuery] = useState('');
  const [filterSelections, setFilterSelections] = useState(
    sections.map(() => false)
  );
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL);
      console.log(response.status); // check status code
      const json = await response.json();
      const menuItems = json.menu.map((item) => ({
        id: item.name,
        title: item.name,
        price: item.price,
        category: item.category,
        key: item.name,
        image: `https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/images/${item.image}?raw=true`,

      }));
      return menuItems;
    } catch (error) {
      console.error(error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    (async () => {
      try {
        await createTable();
        let menuItems = await getMenuItems();

        // The application only fetches the menu data once from a remote URL
        // and then stores it into a SQLite database.
        // After that, every application restart loads the menu from the database
        if (!menuItems.length) {
          const menuItems = await fetchData();
          saveMenuItems(menuItems);
        }

        const sectionListData = await Promise.all(
          getSectionListData(menuItems).map(async (section) => {
            const menuItemsWithImages = await Promise.all(
              section.data.map(async (item) => {
                const response = await fetch(item.image);
                const blob = await response.blob();
                const image = URL.createObjectURL(blob);
                return {
                  ...item,
                  image,
                };
              })
            );
            return {
              ...section,
              data: menuItemsWithImages,
            };
          })
        );

        setData(sectionListData);
        setIsLoading(false);
      } catch (e) {
        // Handle error
        Alert.alert(e.message);
      }
    })();
  }, []);

  useUpdateEffect(() => {
    (async () => {
      const activeCategories = sections.filter((s, i) => {
        // If all filters are deselected, all categories are active
        if (filterSelections.every((item) => item === false)) {
          return true;
        }
        return filterSelections[i];
      });
      try {
        const menuItems = await filterByQueryAndCategories(
          query,
          activeCategories
        );

        const sectionListData = await Promise.all(
          getSectionListData(menuItems).map(async (section) => {
            const menuItemsWithImages = await Promise.all(
              section.data.map(async (item) => {
                const response = await fetch(item.image);
                const blob = await response.blob();
                const image = URL.createObjectURL(blob);
                return {
                  ...item,
                  image,
                };
              })
            );
            return {
              ...section,
              data: menuItemsWithImages,
            };
          })
        );

        setData(sectionListData);
      } catch (e) {
        Alert.alert(e.message);
      }
    })();
  }, [filterSelections, query]);

  const lookup = useCallback((q) => {
    setQuery(q);
  }, []);

  const debouncedLookup = useMemo(() => debounce(lookup, 500), [lookup]);

  const handleSearchChange = (text) => {
    setSearchBarText(text);
    debouncedLookup(text);
  };

  const handleFiltersChange = async (index) => {
    const arrayCopy = [...filterSelections];
    arrayCopy[index] = !filterSelections[index];
    setFilterSelections(arrayCopy);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Searchbar
        placeholder="Search"
        placeholderTextColor="white"
        onChangeText={handleSearchChange}
        value={searchBarText}
        style={styles.searchBar}
        iconColor="white"
        inputStyle={{ color: 'white' }}
        elevation={0}
      />
      <Filters
        selections={filterSelections}
        onChange={handleFiltersChange}
        sections={sections}
      />
      {data.length > 0 ? (
        <FlatList
          style={styles.sectionList}
          sections={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Item key={item.id} title={item.title} price={item.price} image={item.image} />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.header}>{title}</Text>
          )}
        />
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="white" />
          <Text style={styles.loadingText}>Loading menu...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: '#495E57',
  },
  sectionList: {
    paddingHorizontal: 16,
  },
  searchBar: {
    marginBottom: 24,
    backgroundColor: '#495E57',
    shadowRadius: 0,
    shadowOpacity: 0,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  header: {
    fontSize: 24,
    paddingVertical: 8,
    color: '#FBDABB',
    backgroundColor: '#495E57',
  },
  title: {
    fontSize: 20,
    color: 'white',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#495E57',
  },
  loadingText: {
    fontSize: 20,
    color: 'white',
    marginTop: 16,
  },
});
