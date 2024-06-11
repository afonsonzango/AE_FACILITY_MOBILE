import React, { useState, useEffect } from 'react';
import UpperNavbar from '@/components/UpperNavbar';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { API_URL } from '@/services/axiosConfig';
import { router, useFocusEffect } from 'expo-router';
import { View, TextInput, Text, StyleSheet, Alert, ScrollView, Dimensions, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, Checkbox } from 'react-native-paper';
import MyTouchableOpacity from '@/components/MyTouchableOpacity';
import { Colors } from '@/constants/Colors';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { addToWishlist } from '@/components/addToWishList';

const SearchScreen = () => {
  const [inputText, setInputText] = useState<any>('');
  const [recent, setRecent] = useState<any>(false);
  const [cheaper, setCheaper] = useState<any>(false);
  const [userId, setUserId] = useState<any>(null);

  const [sLoading, setSLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any>([]);

  const [hLoading, setHLoading] = useState(false);
  const [historyResults, setHistoryResults] = useState<any>([]);

  // Make sure the token is still valid
  const checkTokenAndNavigate = async () => {
    const userToken = await AsyncStorage.getItem('token');

    try {
      await axios.post(
        `${API_URL}/user`,
        {},
        {
          headers: {
            token: userToken
          },
        }
      );
    } catch (error) {
      router.replace('/auth/login');
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      checkTokenAndNavigate();
    }, [])
  );

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id: any = await AsyncStorage.getItem('userId');

        if (id !== null) {
          setUserId(id);
        }
      } catch (error) {
        console.error('Failed to fetch the user ID from AsyncStorage', error);
      }
    };

    fetchUserId();
  }, []);

  const handleSearch = async () => {
    if (!userId) {
      Alert.alert('User ID not found');
      return;
    }

    if (!inputText) {
      Alert.alert('Por favor, digite algo para pesquisar');
      return;
    }

    setSLoading(true);

    try {
      // Send search request
      const searchResponse = await axios.post(`${API_URL}/search/product`, {
        string: inputText,
        recent,
        cheaper,
        userId,
      });

      setSearchResults(searchResponse.data.data);

      // Send search history request
      await axios.post(`${API_URL}/search/history/add`, {
        text: inputText,
        userId,
      });
    } catch (error) {
      Alert.alert('Por favor, digite algo para pesquisar');
    } finally {
      setSLoading(false);
    }
  };

  const getUserHistory = async () => {
    setHLoading(true);

    try {
      const userId: any = await AsyncStorage.getItem('userId');
      const historyResponse = await axios.get(`${API_URL}/search/user/history/${userId}`);

      setHistoryResults(historyResponse.data.data);
    } catch (error) {
      Alert.alert('Ocorreu um erro buscando o historico de busca');
    } finally {
      setHLoading(false);
    }
  }

  useEffect(() => {
    getUserHistory();
  }, [searchResults]);

  return (
    <SafeAreaView>
      <UpperNavbar />

      <ScrollView showsHorizontalScrollIndicator={false} style={styles.container}>
        <View>
          <View style={{ flexDirection: 'row', display: "flex", gap: 10 }}>
            <TextInput
              style={{ height: 40, width: Dimensions.get("window").width - 120, borderRadius: 10, borderColor: '#aaa', borderWidth: 1, paddingHorizontal: 10 }}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Pesquisar..."
            />
            <MyTouchableOpacity text='Procurar' onPress={handleSearch} />
          </View>

          <View style={{ flexDirection: 'row', display: "flex" }}>
            <Checkbox.Item label="Mais recentes" status={recent ? 'checked' : 'unchecked'} onPress={() => setRecent(!recent)} />
            <Checkbox.Item label="Mais baratos" status={cheaper ? 'checked' : 'unchecked'} onPress={() => setCheaper(!cheaper)} />
          </View>

          {hLoading ? <ActivityIndicator size={24} color={Colors.dark1} /> : (
            !inputText && <View style={styles.resultsContainer}>
              <Text style={styles.resultsTitle}>Presquisas anteriores:</Text>
              {historyResults.map((result: any, index: any) => (
                <View key={index} style={styles.resultItem}>
                  <Text style={styles.resultText}>{result.text}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={[styles.flexRowWrapProduct, styles.marginBottom25]}>
            {sLoading ? <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}><ActivityIndicator size={24} color={Colors.dark1} /></View> : (
              inputText && (
                searchResults.length > 0 ? (
                  searchResults.map((element: any, index: any) => {
                    const imageUrl = element.img_path !== "" ? API_URL + "/file/" + element.img_path : API_URL + "/file/default.png";

                    return (
                      <View key={index} style={[styles.productItemComponent, index % 2 === 0 && styles.evenItem]}>
                        <View style={styles.viewImage}>
                          <Image
                            source={{ uri: imageUrl }}
                            style={styles.product_image}
                            resizeMode='cover'
                          />

                          <TouchableOpacity onPress={() => addToWishlist(userId, element.id)}>
                            <View style={styles.viewRating}>
                              <TabBarIcon name={'heart'} color={"#999"} size={30} />
                            </View>
                          </TouchableOpacity>
                          <View style={styles.PriceNum}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                              <Text>{element.price}</Text>
                            </View>
                          </View>
                        </View>

                        <View style={styles.productTitle}>
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.warehouseName}>{element.warehouse.name}</Text>
                          </View>

                          <Text style={styles.productname}>{element.name}</Text>
                          <Text style={styles.productDesc}>{element.description}</Text>

                          <TouchableOpacity style={styles.buttonReserve}>
                            <Text style={styles.buttonText}>Reservar</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })
                ) : (
                  <Text style={styles.noResults}>Nenhum produto encontrado.</Text>
                )
              )
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchScreen;

const deviceHeight = Dimensions.get('window').height;
const desiredHeight = deviceHeight - 90;

export const VIEW_PADDING = 10;

const { width } = Dimensions.get("window");
const categoryComponentWidth: number = (width - VIEW_PADDING * 2) / 2

const styles = StyleSheet.create({
  container: {
    marginTop: -25,
    height: desiredHeight,
    backgroundColor: '#fff',
    padding: 10
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
  },
  resultsContainer: {
    marginTop: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultItem: {
    marginBottom: 10,
  },
  resultText: {
    fontSize: 16,
  },
  productItemComponent: {
    width: categoryComponentWidth - 5,
    marginBottom: 6,
    padding: 5,
    position: "relative",
    backgroundColor: "#eee",
    borderRadius: 10
  },
  product_image: {
    height: "100%",
    width: '100%', // or specify a fixed width
    borderRadius: 10
  },
  viewImage: {
    width: "100%",
    height: categoryComponentWidth - 3 - 20,
    padding: 5,
    borderRadius: 10
  },
  productTitle: {
  },
  productname: {
    fontSize: 15,
    marginTop: 5,
    // fontWeight: 800,
    marginLeft: 6,
    marginBottom: 10
  },
  productDesc: {
    fontSize: 14,
    marginLeft: 6,
    // fontWeight: 500
  },
  buttonReserve: {
    borderRadius: 5,
    marginTop: 10,
    paddingVertical: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary
  },
  buttonText: {
    color: "#fff",
  },
  evenItem: {
    marginRight: 6
  },
  viewRating: {
    position: "absolute",
    bottom: 14,
    right: 14,
    padding: 5,
    borderRadius: 50,
    width: 40,
    height: 40,
    backgroundColor: "#fff"
  },
  PriceNum: {
    position: "absolute",
    top: 14,
    left: 14,
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 50,
    backgroundColor: "#fff",
    display: "flex"
  },
  warehouseName: {
    backgroundColor: "#aaa",
    color: "#000",
    paddingVertical: 5,
    paddingHorizontal: 10,
    display: "flex",
    borderRadius: 15,
    marginTop: 10,
    // fontWeight: 800
  },
  noResults: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
  },
  flexRowWrapProduct: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  marginBottom25: {
    marginBottom: 25
  },
});
