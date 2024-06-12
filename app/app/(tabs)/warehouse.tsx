import UpperNavbar from "@/components/UpperNavbar";
import { Alert, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./home";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "@/services/axiosConfig";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Button, Title, Text as PaperText } from "react-native-paper";
import { Colors } from "@/constants/Colors";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import MyTouchableOpacity from "@/components/MyTouchableOpacity";
import DangerButton from "@/components/DangerButton";

const WarehouseScreen = () => {

  const [name, setName] = useState('');

  const [isWarehouseLoading, setIsWarehouseLoading] = useState<boolean>(true);
  const [hashWarehouse, setHasWarehouse] = useState<boolean>(false);
  const [warehouse, setWarehouse] = useState({
    id: null,
    name: "",
    description: "",
    category: {
      id: null,
      name: null
    },
    products: null,
    user: {
      name: null,
      email: null
    }
  });

  const [products, setProducts] = useState<any>();

  useEffect(() => {
    setProducts(warehouse.products);
  }, [warehouse]);

  const removeProduct = (idToRemove: any) => {
    const updatedProducts = products.filter((product: any) => product.id !== idToRemove);
    setProducts(updatedProducts);
  };

  const execWarehouseStatus = async () => {
    try {
      setIsWarehouseLoading(true);
      const token = await AsyncStorage.getItem("token");

      const userStatus = await axios.post(`${API_URL}/user`, {}, {
        headers: {
          token: token
        }
      });

      if (userStatus.data.user.warehouse?.id) {
        setHasWarehouse(true);

        const warehouseID = userStatus.data.user.warehouse.id;
        const _warehouse = await axios.get(`${API_URL}/warehouse/show/${warehouseID}`);

        setWarehouse({
          id: _warehouse.data.data.id,
          name: _warehouse.data.data.name,
          description: _warehouse.data.data.description,
          category: {
            id: _warehouse.data.data.category.id,
            name: _warehouse.data.data.category.name
          },
          products: _warehouse.data.data.products,
          user: {
            name: _warehouse.data.data.user.name,
            email: _warehouse.data.data.user.email
          }
        });
      } else {
        setHasWarehouse(false);
      }

      setName(userStatus.data.user.name);
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        setIsWarehouseLoading(false);
      }, 1000);
    }
  }

  useFocusEffect(
    useCallback(() => {
      execWarehouseStatus();
    }, [])
  );


  // Product delete handleing
  const handleDelete = (productId: any) => {
    const deleteData = {
      productId: productId,
      warehouseId: warehouse.id
    };

    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este produto?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Confirmar',
          onPress: () => {
            fetch(API_URL + "/product/delete", {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(deleteData),
            })
              .then(response => response.json())
              .then(data => {
                removeProduct(productId);
              })
              .catch(error => {
                console.error('Error:', error);
              });
          }
        }
      ]
    );
  };

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


  // Working on the modal thing
  const [modalVisible, setModalVisible] = React.useState(false);

  // Woking on separated tabs
  const [activeTab, setActiveTab] = React.useState({
    tabOne: true,
    tabTwo: false
  });

  // Showing products in list or grid
  // Loading products
  const [isProductLoading, setIsProductLoading] = useState<boolean>();
  const [loadedProducts, setLoadedProducts] = useState([]);

  const execProductList = async () => {
    setIsProductLoading(true);

    try {
      const userToken = await AsyncStorage.getItem('token');

      const response: any = await axios.post(
        `${API_URL}/user`,
        {},
        {
          headers: {
            token: userToken
          },
        }
      );

      const warehouseId = response.data.user.warehouse.id;

      const productsResponse = await axios.get(`${API_URL}/product/warehouse/all/${warehouseId}`);

      setLoadedProducts(productsResponse.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsProductLoading(false);
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      execProductList();
    }, [])
  );





  // -----------------------------------------
  const [loading, setLoading] = useState(false);
  const [reservations, setReservations] = useState<any>([]);

  const getReservations = async () => {
    setLoading(true);

    try {
      const response: any = await axios.get(`${API_URL}/reservation/warehouse/${warehouse.id}`);
      
      console.log("response-----------------------------------------");
      console.log(response.data.data);
      setReservations(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      getReservations();
    }, [])
  )

  const handleAcceptReservation = async (reservationId: number) => {
    try {
      await axios.post(`${API_URL}/reservation/accept`, {
        reservationId: reservationId
      });
      Alert.alert('Sucesso', 'Reserva aceita com sucesso.');
      router.replace('/app/warehouse');
    } catch (error) {
      console.error('Erro ao aceitar a reserva:', error);
      Alert.alert('Erro', 'Não foi possível aceitar a reserva.');
    }
  };

  const handleCancelReservation = async (reservationId: number) => {
    try {
      await axios.delete(`${API_URL}/reservation/cancel`, {
        data: {
          reservationId: reservationId
        }
      });
      Alert.alert('Sucesso', 'Reserva cancelada com sucesso.');
      router.replace('/app/warehouse');
    } catch (error) {
      console.error('Erro ao cancelar a reserva:', error);
      Alert.alert('Erro', 'Não foi possível cancelar a reserva.');
    }
  };

  return (
    <View>
      <SafeAreaView>
        <UpperNavbar />
        <ScrollView showsHorizontalScrollIndicator={false} style={styles.container}>
          <View style={{ padding: 10 }}>
            {isWarehouseLoading ? <ActivityIndicator size={30} color={Colors.dark1} style={{ marginTop: 20 }} /> : (
              <>
                {hashWarehouse ? (
                  <View>
                    <View><Title style={{ fontWeight: "bold" }}>{warehouse.name}</Title></View>
                    <View style={{ flexDirection: "row", marginBottom: 10, gap: 8, alignItems: "center" }}>
                      <View style={{ flexDirection: "row" }}><Text style={{ fontWeight: 700, padding: 5, paddingHorizontal: 15, backgroundColor: Colors.primaryLight, borderWidth: 1, borderColor: Colors.dark1, borderRadius: 15 }}>{warehouse.category.name}</Text></View>
                      <View style={{ flexDirection: "row" }}><Text style={{ fontWeight: 700, padding: 5, paddingHorizontal: 15, backgroundColor: "#f0f0f0", borderWidth: 1, borderColor: "#ddd", borderRadius: 15 }}>{warehouse.description}</Text></View>
                    </View>
                    <View style={{ flexDirection: "row", gap: 10 }}>
                      <Text
                        onPress={() => router.replace("/app/aditional/editWarehouse")}
                        style={{
                          fontWeight: 700,
                          padding: 5,
                          paddingHorizontal: 15,
                          backgroundColor: "#f0f0f0",
                          borderWidth: 1,
                          borderColor: "#ddd",
                          borderRadius: 15
                        }}>
                        Configuracoes
                      </Text>

                      <Text
                        style={{
                          fontWeight: 700,
                          padding: 5,
                          paddingHorizontal: 15,
                          backgroundColor: "#f0f0f0",
                          borderWidth: 1,
                          borderColor: "#ddd",
                          borderRadius: 15
                        }}>
                        Eliminar Armazem
                      </Text>
                    </View>

                    <View style={{ paddingVertical: 10, marginTop: 50, flexDirection: "row", width: "100%", justifyContent: "space-around", borderBottomColor: "#f0f0f0", borderBottomWidth: 1 }}>
                      <TouchableOpacity style={{ backgroundColor: activeTab.tabOne ? Colors.primary : "#f0f0f0", padding: 10, paddingHorizontal: 50, borderRadius: 10 }} onPress={() => setActiveTab({ tabOne: true, tabTwo: false })}><PaperText style={{ color: activeTab.tabOne ? "#fff" : "#000", fontWeight: "bold" }}>Productos</PaperText></TouchableOpacity>
                      <TouchableOpacity style={{ backgroundColor: activeTab.tabTwo ? Colors.primary : "#f0f0f0", padding: 10, paddingHorizontal: 50, borderRadius: 10 }} onPress={() => setActiveTab({ tabOne: false, tabTwo: true })}><PaperText style={{ color: activeTab.tabTwo ? "#fff" : "#000", fontWeight: "bold" }}>Reservas</PaperText></TouchableOpacity>
                    </View>

                    {/* Componentes do tab que criei - One */}
                    {activeTab.tabOne && <View style={{ paddingVertical: 10 }}>
                      {isProductLoading ? <ActivityIndicator size={24} color={Colors.dark1} style={{ marginTop: 20 }} /> : (
                        <>
                          <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 15 }}>
                            <MyTouchableOpacity text="Novo produto" onPress={() => router.replace("/app/aditional/newProduct")} />
                          </View>

                          <View style={[styles.flexRowWrapProduct, styles.marginBottom25]}>
                            {products.map((element: any, index: any) => {
                              const imageUrl = element.img_path !== "" ? API_URL + "/file/" + element.img_path : API_URL + "/file/default.png";

                              return (
                                <View key={index} style={[styles.productItemComponent, index % 2 === 0 && styles.evenItem]}>
                                  <View style={styles.viewImage}>
                                    <Image source={{ uri: imageUrl }} style={styles.product_image} resizeMode='cover' />

                                    <View style={styles.PriceNum}>
                                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                        <Text style={{ fontWeight: 'bold' }}>Kz {element.price}</Text>
                                      </View>
                                    </View>
                                  </View>
                                  <View style={styles.productTitle}>
                                    <Text style={styles.productname}>{element.name}</Text>
                                    <Text style={styles.productDesc}>{element.description}</Text>

                                    <DangerButton title="Eliminar Produto" onPress={() => handleDelete(element.id)} />
                                  </View>
                                </View>
                              );
                            })}
                          </View>
                        </>
                      )}
                    </View>}

                    {/* Componentes do tab que criei - Two */}
                    {activeTab.tabTwo && <View style={{ paddingVertical: 10 }}>
                      <Text style={{ fontWeight: "bold" }}>Reservas</Text>

                      {loading ? (
                        <ActivityIndicator size={24} color="#000" style={{ marginTop: 20 }} />
                      ) : reservations.length === 0 ? (
                        <Text style={stylesp.emptyText}>Nenhuma reserva encontrada.</Text>
                      ) : (
                        reservations.map((reservation: any, index: any) => (
                          <View key={index} style={stylesp.reservationItem}>
                            <Text>Reserva ID: {reservation.id}</Text>
                            <Text>Quantidade: {reservation.quantity}</Text>
                            <Text>Status: {reservation.accepted ? 'Aceita' : 'Pendente'}</Text>
                            {/* <Text>Cliente: {reservation.user.name}</Text> */}
                            {/* <Text>Email: {reservation.user.email}</Text> */}
                            {/* <Text>Telefone: {reservation.user.phone_number}</Text> */}
                            <View style={stylesp.buttonContainer}>
                              <TouchableOpacity style={stylesp.acceptButton} onPress={() => handleAcceptReservation(reservation.id)}>
                                <Text style={stylesp.buttonText}>Aceitar</Text>
                              </TouchableOpacity>
                              <TouchableOpacity style={stylesp.cancelButton} onPress={() => handleCancelReservation(reservation.id)}>
                                <Text style={stylesp.buttonText}>Cancelar</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        ))
                      )}
                    </View>}
                  </View>
                ) : (
                  <View style={stylesp.newStorePaddingView}>
                    <View style={stylesp.centerItem}>
                      <Text style={stylesp.title}>{name}, Nao tens uma Loja!</Text>
                      <Text style={stylesp.description}>Crie uma nova Loja para poder partilhar os seus produtos</Text>
                      <Button
                        mode="contained"
                        style={stylesp.button}
                        onPress={() => router.push('/app/aditional/newWarehouse')}
                      >
                        Criar Loja agora!
                      </Button>
                    </View>
                  </View>
                )}
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

export default WarehouseScreen;

const stylesp = StyleSheet.create({
  newStorePaddingView: {
    height: "100%",
    padding: 20
  },
  centerItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%"
  },
  title: {
    fontSize: 19,
    marginTop: 30,
    textAlign: "center"
  },
  description: {
    fontSize: 15,
    textAlign: "center",
    marginTop: 10,
    paddingHorizontal: 50,
    fontWeight: 500
  },
  button: {
    marginTop: 15,
    backgroundColor: Colors.dark1,
    padding: 6,
    margin: 0,
    borderRadius: 10,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
  },
  reservationItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  acceptButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
  },
})