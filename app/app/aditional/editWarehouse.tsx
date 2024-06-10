import MyPicker from '@/components/MyPicker';
import MyTouchableOpacity from '@/components/MyTouchableOpacity';
import { Colors } from '@/constants/Colors';
import { API_URL } from '@/services/axiosConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router, useFocusEffect } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Text, TextInput } from 'react-native-paper';

const pickerStyles = StyleSheet.create({
    pickerContainer: {
        height: 45,
        padding: 0,
        fontSize: 15,
        paddingHorizontal: 20,
    },
});

const EditWarehouse = () => {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState<boolean>(false);
    const [warehouse, setWarehouse] = useState<any>({
        id: undefined,
        name: undefined,
        category: "",
        description: "",
    });

    const handleValueChange = (value: any) => {
        setWarehouse({
            ...warehouse,
            category: value
        });
    };

    //Loading categories
    const [isCategoriaLoading, setIsCategoriaLoading] = useState<boolean>(true);
    const [items, setItems] = useState([]);

    const execCategoryList = async () => {
        setIsCategoriaLoading(true);

        try {
            const categoriasResponse = await axios.get(`${API_URL}/category/all`);
            setItems(categoriasResponse.data.categories);
        } catch (error) {
            console.log(error);
        } finally {
            setIsCategoriaLoading(false);
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            execCategoryList();
        }, [])
    );
    //Loading categories

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

            if (!response.data.user) {
                router.replace('/auth/login');
            }

            const warehouseId = response.data.user.warehouse.id;
            const warehouseInf = await axios.get(`${API_URL}/warehouse/show/${warehouseId}`);

            setWarehouse({
                id: warehouseInf.data.data.id,
                name: warehouseInf.data.data.name,
                description: warehouseInf.data.data.description,
                category: warehouseInf.data.data.category.id,
            });
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

    const handleNewWarehouse = async () => {
        try {
            if (!warehouse.name || !warehouse.description || !warehouse.category) {
                throw new Error("Todos os campos são obrigatórios.");
            }

            setLoading(true);
            setError("");

            await axios.put(`${API_URL}/warehouse/update`, {
                name: warehouse.name,
                description: warehouse.description,
                warehouseId: warehouse.id,
                categoryId: warehouse.category
            });

            router.replace('/app/warehouse');
        } catch (error: any) {
            console.error('Error:', error.response ? error.response.data : error.message);
            setError(error.response ? error.response.data.info.message : "Algum erro ocorreu. Verifique seus dados ou tente mais tarde.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={styles.scrollViewColor} showsVerticalScrollIndicator={false}>
                {isCategoriaLoading ? (<ActivityIndicator style={{ marginTop: 20 }} color={Colors.dark1} size={30} />) : (
                    <View style={styles.storePaddingView}>
                        <Text style={styles.title}>Registrar Armazem</Text>
                        <Text style={styles.description}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse explicabo iusto impedit temporibus ut ratione nisi reiciendis voluptate atque assumenda. Tenetur molestiae fugit eos esse iusto harum nihil, quam numquam.</Text>

                        {error != "" ? <Text style={styles.AlertComponent}>
                            {error}
                        </Text> : ""}

                        <View style={{ marginTop: 20 }}>
                            <Text style={styles.inputTitle}>Nome do armazem</Text>
                            <TextInput
                                placeholder={`Defina um nome para o seu armazem`}
                                maxLength={50}
                                value={warehouse.name}
                                onChangeText={(text: any) => setWarehouse({ ...warehouse, name: text })}
                                disabled={loading ? true : false}
                            />
                        </View>

                        <View style={{ marginTop: 20 }}>
                            <Text style={styles.inputTitle}>Selecione uma categoria</Text>

                            <View>
                                <MyPicker
                                    onValueChange={handleValueChange}
                                    value={warehouse.catId}
                                    items={items} style={pickerStyles.pickerContainer}
                                    disabled={loading ? true : false}
                                />
                            </View>
                        </View>

                        <View style={{ marginTop: 20 }}>
                            <Text style={styles.inputTitle}>Adicione uma descricao</Text>
                            <TextInput
                                mode="outlined"
                                label="Description"
                                placeholder="Esta descrição vai aparecer em seu perfil da loja"
                                value={warehouse.description}
                                onChangeText={(text) => setWarehouse({ ...warehouse, description: text })}
                                style={styles.textArea}
                                maxLength={101}
                                disabled={loading}
                                outlineColor={Colors.primary}
                            />
                        </View>

                        <MyTouchableOpacity
                            text={`Actualizar armazem ${(warehouse.name != "" ? "\"" + warehouse.name + "\"" : "")}`}
                            style={{ alignItems: "center", marginTop: 20 }}
                            onPress={handleNewWarehouse}
                            loading={loading}
                        />

                        <Button onPress={() => router.back()}>
                            <Text>Cancelar</Text>
                        </Button>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

export default EditWarehouse;

const styles = StyleSheet.create({
    SafeAreaViewFlex: {
        flex: 1
    },
    scrollViewColor: {
        backgroundColor: "#fff",
        flex: 1,
        padding: 10
    },
    IntroTextContainer: {
        marginBottom: 20
    },
    TextTitle: {
        fontSize: 22,
        color: "#000",
        marginBottom: 5
    },
    TextTitleSmall: {
        fontSize: 17,
        color: "#000",
        marginBottom: -5
    },
    IntroText: {
        fontSize: 15,
        color: "rgb(120,120,120)"
    },
    storePaddingView: {
        padding: 20,
    },
    title: {
        fontSize: 22
    },
    inputTitle: {
        fontSize: 14,
        marginBottom: 5,
    },
    description: {
        marginTop: 10,
        fontSize: 14
    },
    AlertComponent: {
        marginBottom: 0,
        marginTop: 20,
        borderWidth: 1,
        borderColor: "red",
        padding: 5,
        paddingVertical: 10,
        paddingHorizontal: 14,
        paddingTop: 9,
        borderRadius: 8,
        backgroundColor: "#ff000034",
        fontSize: 14,
        lineHeight: 18
    },
    InputCopper: {
        position: "relative"
    },
    leftIconInput: {
        flex: 1,
        width: 50,
        height: 45,
        position: "absolute",
        justifyContent: "center",
        alignItems: "center"
    },
    iconEmail: {
        width: 28,
        height: 28,
        marginTop: 9
    },
    iconLocked: {
        width: 32,
        height: 32,
        marginTop: 2,
        marginLeft: -2
    },
    inputStyleBasics: {
        height: 55,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "rgb(200,200,200)",
        borderRadius: 8,
        fontSize: 15,
        paddingHorizontal: 20,
    },
    forgotPassword: {
        textAlign: "right",
        fontSize: 15,
        marginBottom: 20
    },
    submitButton: {
        height: 55,
        backgroundColor: Colors.dark1,
        paddingTop: 10,
        paddingBottom: 10,
        paddingRight: 10,
        paddingLeft: 10,
        borderRadius: 8,
    },
    container: {
        padding: 20,
    },
    label: {
    },
    input: {
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonText: {
        color: '#FFFFFF',
    },
    imageContainer: {
        marginVertical: 10,
        alignItems: 'center',
    },
    image: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
    },
    textArea: {
        height: 100,
    },
});