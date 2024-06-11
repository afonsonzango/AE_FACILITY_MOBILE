import React, { useCallback, useState } from 'react';
import UpperNavbar from '@/components/UpperNavbar';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { StyleSheet, Text, ScrollView, Dimensions, TouchableOpacity, Image } from 'react-native';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_URL } from '@/services/axiosConfig';
import axios from 'axios';
import { ActivityIndicator } from 'react-native-paper';
import { router, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

function HomeScreen() {

  const [catLoading, setCatLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    setCatLoading(true);

    try {
      const response = await axios.get(`${API_URL}/category/all`);
      setCategories(response.data.categories);
    } catch (error) {
      console.log(error);
    } finally {
      setCatLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchCategories();
    }, [])
  );


  // Loading products
  const [isProductLoading, setIsProductLoading] = useState<boolean>();
  const [loadedProducts, setLoadedProducts] = useState([]);

  const execProductList = async () => {
    setIsProductLoading(true);

    try {
      const productsResponse = await axios.get(`${API_URL}/product/all`);
      setLoadedProducts(productsResponse.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        setIsProductLoading(false);
      }, 1000);
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      execProductList();
    }, [])
  );

  // Make sure the token is still valid
  const checkTokenAndNavigate = async () => {
    const userToken = await AsyncStorage.getItem('token');

    try {
      const response = await axios.post(
        `${API_URL}/user`,
        {},
        {
          headers: {
            token: userToken
          },
        }
      );

      console.log("Response: ");
      console.log(response.data.user);
    } catch (error) {
      router.replace('/auth/login');
      console.log(error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      checkTokenAndNavigate();
    }, [])
  );

  return (
    <SafeAreaView>
      <UpperNavbar />
      <ScrollView showsHorizontalScrollIndicator={false} style={styles.container}>
        <View style={{ padding: 10 }}>
          {catLoading ? <ActivityIndicator color={Colors.dark1} size={24} /> : (
            categories.length !== 0 && (
              <ScrollView horizontal style={styles.categories} showsHorizontalScrollIndicator={false}>
                <View style={[styles.categoryItem, styles.activeCategory]}>
                  <TabBarIcon name={'list'} color={"#000"} size={20} style={{ marginTop: -3, marginRight: 4 }} />
                  <Text style={styles.categoryText}>Todas</Text>
                </View>

                {categories.map((category: any) => (
                  <TouchableOpacity>
                    <View style={styles.categoryItem}>
                      <Text style={styles.categoryText}>{category.name}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )
          )}

          {isProductLoading ? <ActivityIndicator size={24} color={Colors.dark1} style={{ marginTop: 20 }} /> : (
            <>
              <View style={[styles.flexRowWrapProduct, styles.marginBottom25]}>
                {loadedProducts.map((element: any, index) => {
                  const imageUrl = element.img_path !== "" ? API_URL + "/file/" + element.img_path : API_URL + "/file/default.png";
                
                  return (
                    <View key={index} style={[styles.productItemComponent, index % 2 === 0 && styles.evenItem]}>
                      <View style={styles.viewImage}>
                        <Image
                          source={{ uri: imageUrl }}
                          style={styles.product_image}
                          resizeMode='cover'
                        />

                        <View style={styles.viewRating}>
                          <TabBarIcon name={'heart'} color={"#999"} size={30} />
                        </View>
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
                })}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const deviceHeight = Dimensions.get('window').height;
const desiredHeight = deviceHeight - 90;

export const VIEW_PADDING = 10;

const { width } = Dimensions.get("window");
const categoryComponentWidth: number = (width - VIEW_PADDING * 2) / 2

export const styles = StyleSheet.create({
  container: {
    marginTop: -25,
    height: desiredHeight,
    backgroundColor: '#fff'
  },
  categories: {
    flexDirection: 'row',
    paddingHorizontal: 0,
    marginBottom: 10
  },
  categoryItem: {
    backgroundColor: '#f0f0f0',
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 10,
    alignItems: 'center',
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: '#f0f0f0'
  },
  categoryText: {
    fontSize: 15,
    // fontWeight: 800,
  },
  activeCategory: {
    backgroundColor: Colors.light8,
    borderWidth: 2,
    borderColor: Colors.primary
  },
  introText: {
    fontSize: 18,
    marginBottom: 5
  },
  marginBottom25: {
    marginBottom: 25
  },
  flexRowWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  flexRowWrapProduct: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  productItemComponent: {
    width: categoryComponentWidth - 3,
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
  }
});

export default HomeScreen;
