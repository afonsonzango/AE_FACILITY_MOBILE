import UpperNavbar from "@/components/UpperNavbar";
import { Alert, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./home";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "@/services/axiosConfig";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Button, Title, Text as PaperText } from "react-native-paper";
import { Colors } from "@/constants/Colors";

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
                if (data.success) {
                  console.log("Product deleted successfully.");
                } else {
                  console.error(data.message);
                  removeProduct(productId);
                }
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
                    <View style={{ flexDirection: "row" }}>
                      <Text
                        onPress={() => setModalVisible(true)}
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
                    </View>

                    {modalVisible && <View style={{ justifyContent: "center", alignItems: "center", height: Dimensions.get('window').height - 106, width: Dimensions.get('window').width, position: "absolute", zIndex: 100, backgroundColor: "rgba(0,0,0,0.5)", left: -10, top: -10 }}>
                      <View style={{ width: Dimensions.get('window').width - 20, backgroundColor: "#fff", padding: 20, borderRadius: 10 }}>
                        <Title style={{ marginBottom: 20, fontWeight: "bold" }}>Configuracoes</Title>

                        <Button
                          style={{ marginBottom: 10, backgroundColor: Colors.dark1 }}
                          mode="contained"
                          onPress={() => router.replace("/app/aditional/editWarehouse")}
                        >
                          Editar armazem
                        </Button>

                        <Button
                          mode="text"
                          style={{ marginBottom: 10, backgroundColor: "red" }}
                          labelStyle={{ color: "#fff" }}
                          onPress={() => {/* Add your delete function here */ }}
                        >
                          Eliminar armazem
                        </Button>

                        <Button
                          mode="contained"
                          style={{ backgroundColor: "#fff" }}
                          labelStyle={{ color: "#000" }}
                          onPress={() => setModalVisible(false)}
                        >
                          Sair
                        </Button>
                      </View>
                    </View>}

                    <View style={{ paddingVertical: 10, marginTop: 50, flexDirection: "row", width: "100%", justifyContent: "space-around", borderBottomColor: "#f0f0f0", borderBottomWidth: 1 }}>
                      <TouchableOpacity style={{backgroundColor: activeTab.tabOne ? Colors.primary : "#f0f0f0", padding: 10, paddingHorizontal: 50, borderRadius: 10}} onPress={() => setActiveTab({ tabOne: true, tabTwo: false })}><PaperText style={{ color: activeTab.tabOne ? "#fff" : "#000", fontWeight: "bold"}}>Productos</PaperText></TouchableOpacity>
                      <TouchableOpacity style={{backgroundColor: activeTab.tabTwo ? Colors.primary : "#f0f0f0", padding: 10, paddingHorizontal: 50, borderRadius: 10}} onPress={() => setActiveTab({ tabOne: false, tabTwo: true })}><PaperText style={{ color: activeTab.tabTwo ? "#fff" : "#000", fontWeight: "bold" }}>Reservas</PaperText></TouchableOpacity>
                    </View>

                    {/* Componentes do tab que criei - One */}
                    {activeTab.tabOne && <View style={{ paddingVertical: 10 }}>
                        <Text style={{ fontWeight: "bold" }}>Produtos</Text>
                    </View>}

                    {/* Componentes do tab que criei - Two */}
                    {activeTab.tabTwo && <View style={{ paddingVertical: 10 }}>
                        <Text style={{ fontWeight: "bold" }}>Reservas</Text>
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
  }
})