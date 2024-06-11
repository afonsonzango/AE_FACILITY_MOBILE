import axios from 'axios';
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_URL } from '@/services/axiosConfig';
import { Button, TextInput } from 'react-native-paper';
import MyTouchableOpacity from '@/components/MyTouchableOpacity';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';

const NewProduct = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState<number>(0);
    const [file, setFile] = useState<any>(null);
    const [error, setError] = useState<any>(null);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
        } else {
            const result: any = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 4],
                quality: 1,
            });

            if (!result.cancelled && result.assets && result.assets.length > 0 && result.assets[0].uri) {
                setFile(result.assets[0]);
                setError(null);
            } else {
                setError('Error selecting image');
            }
        }
    };

    const handleSubmit = async () => {
        if (!name || !price || !file) {
            Alert.alert('Por favor, preencha todos os campos e selecione uma imagem');
            return;
        }

        try {
            const token = await AsyncStorage.getItem("token");

            if (!token) {
                Alert.alert('Token not found', 'Please login again.');
                return;
            }

            console.log("Retrieved Token:", token);

            const response = await axios.post(`${API_URL}/user`, {}, {
                headers: {
                    token: token
                }
            });

            const warehouseId = response.data.user.warehouse.id;

            const formData: any = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('price', price);
            formData.append('newPrice', 0);
            formData.append('warehouseId', warehouseId);

            const localUri = file.uri;
            const filename = localUri.split('/').pop();
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : `image`;

            formData.append('image', {
                uri: localUri,
                name: filename,
                type: type
            });

            const createResponse = await axios.post(`${API_URL}/product/create`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    token: token
                }
            });

            console.log(createResponse.data);
            Alert.alert('Sucesso', 'Produto criado com sucesso!');

            setName('');
            setDescription('');
            setPrice(0);
            setFile(null);
        } catch (error: any) {
            console.error("Error during submission:", error);
            Alert.alert(
                'Oops!',
                error.response ? error.response.data.info.message : error.message
            );
        }
    };

    return (
        <ScrollView style={styles.container}>
            <SafeAreaView>
                <View style={styles.IntroTextContainer}>
                    <Text style={styles.TextTitle}>Adicionar Novo produto</Text>
                </View>

                <Text style={styles.label}>Nome do produto</Text>
                <TextInput
                    value={name}
                    onChangeText={(text) => setName(text)}
                    style={[styles.input, { marginBottom: 15 }]}
                />

                <Text style={styles.label}>Selecione uma imagem</Text>
                <TouchableOpacity style={styles.button} onPress={pickImage}>
                    <Text style={styles.buttonText}>Choose Image</Text>
                </TouchableOpacity>

                {file && (
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: file.uri }} style={styles.image} />
                    </View>
                )}

                <Text style={styles.label}>Descricao do produto</Text>
                <TextInput
                    value={description}
                    onChangeText={(text) => setDescription(text)}
                    style={[styles.input, { marginBottom: 15 }]}
                />

                <Text style={styles.label}>Preco</Text>
                <TextInput
                    value={String(price)}
                    onChangeText={(text) => {
                        const numericValue = text.replace(/[^0-9]/g, '');
                        setPrice(Number(numericValue));
                    }}
                    style={styles.input}
                />

                <View style={{ marginBottom: 40, marginTop: 20 }}>
                    <MyTouchableOpacity text='Novo produto' onPress={handleSubmit} />
                    <Button style={{ marginTop: 10 }} onPress={() => router.replace("/app/warehouse")}>Concluido</Button>
                </View>
            </SafeAreaView>
        </ScrollView>
    );
};

export default NewProduct;

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
        padding: 10,
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
    }
});