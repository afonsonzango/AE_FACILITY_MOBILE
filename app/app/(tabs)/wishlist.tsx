import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, Image, TouchableOpacity, Alert, ActivityIndicator, StyleSheet, Dimensions, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import UpperNavbar from '@/components/UpperNavbar';
import { Colors } from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@/services/axiosConfig';
import { deleteWishlistItem, getWishlist, sendReservationRequest } from '@/components/addToWishList';
import { router, useFocusEffect } from 'expo-router';
import MyTouchableOpacity from '@/components/MyTouchableOpacity';
import axios from 'axios';

const WishlistScreen = () => {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<number | null>(null);

  const fetchWishlist = async (userId: number) => {
    setLoading(true);
    try {
      const data = await getWishlist(userId);
      console.log('Wishlist data:', data); // Log para verificar a estrutura dos dados
      setWishlist(Array.isArray(data) ? data : []); // Garantir que seja uma matriz
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível buscar a lista de desejos');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const getUserId = async () => {
        const id = await AsyncStorage.getItem('userId');
        if (id) {
          setUserId(Number(id));
          fetchWishlist(Number(id));
        }
      };
      getUserId();
    }, [])
  )

  const handleDelete = async (productId: number) => {
    try {
      await deleteWishlistItem(productId);
      setWishlist((prevWishlist) => prevWishlist.filter(item => item.id !== productId));
      Alert.alert('Sucesso', 'Produto removido da lista de desejos');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível remover o produto da lista de desejos');
    }
  };

  const [warehouseId, setWarehouseId] = useState<any>(null);

  const checkTokenAndNavigate = async () => {
    const userToken = await AsyncStorage.getItem('token');

    try {
      const userStatus = await axios.post(
        `${API_URL}/user`,
        {},
        {
          headers: {
            token: userToken
          },
        }
      );

      setWarehouseId(userStatus.data.user.warehouse.id);
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

  const [quantities, setQuantities] = useState<{ [key: number]: string }>({});

  const updateQuantity = (productId: number, quantity: string) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: quantity,
    }));
  };

  return (
    <SafeAreaView>
      <UpperNavbar />
      <ScrollView showsHorizontalScrollIndicator={false} style={styles.container}>
        <View>
          {loading ? (
            <ActivityIndicator size={24} color={Colors.dark1} />
          ) : wishlist.length === 0 ? (
            <Text style={styles.emptyText}>Sua lista de desejos está vazia.</Text>
          ) : (
            wishlist.map((item, index) => (
              <View key={index} style={styles.productItemComponent}>
                <View style={styles.viewImage}>
                  <Image
                    source={{ uri: `${API_URL}/file/${item.product.img_path || 'default.png'}` }}
                    style={styles.product_image}
                    resizeMode='cover'
                  />
                </View>
                <View style={styles.productTitle}>
                  <Text style={styles.productname}>{item.product.name}</Text>
                  <Text style={styles.productDesc}>{item.product.description}</Text>
                  <View>
                    <TextInput
                      placeholder='Quantidade'
                      value={quantities[item.id] || ''}
                      onChangeText={(text) => updateQuantity(item.product.id, text)}
                    />
                  </View>
                  <MyTouchableOpacity text='Pedir reserva'
                    onPress={() =>
                      sendReservationRequest(
                        item.product.id,
                        parseInt(quantities[item.product.id]) || 1,
                        Number(userId),
                        warehouseId
                      ).then(() => {
                        Alert.alert('Sucesso', 'Produto reservado com sucesso.');
                      })
                    }
                  />
                  <TouchableOpacity style={styles.buttonDelete} onPress={() => handleDelete(item.id)}>
                    <Text style={styles.buttonText}>Remover</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WishlistScreen;

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
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  productItemComponent: {
    marginBottom: 16,
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 10,
  },
  viewImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
  },
  product_image: {
    width: '100%',
    height: '100%',
  },
  productTitle: {
    marginTop: 10,
  },
  productname: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productDesc: {
    fontSize: 14,
    color: '#555',
    marginVertical: 5,
  },
  buttonDelete: {
    marginTop: 10,
    paddingVertical: 10,
    backgroundColor: 'red', // Botão vermelho
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff', // Texto branco
    fontSize: 16,
  }
});
