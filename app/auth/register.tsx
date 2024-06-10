import { Colors } from "@/constants/Colors";
import { API_URL } from "@/services/axiosConfig";
import axios from "axios";
import { router, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { ActivityIndicator, Button, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const Register = () => {
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [data, setData] = useState({
        name: '',
        email: '',
        phone_number: '',
        password1: '',
        password2: '',
    });

    const [pVisible, setPVisible] = useState<boolean>(false);
    // const router = useRouter();

    const handleRegister = async () => {
        setIsLoading(true);

        if (!data.name || !data.email || !data.password1 || !data.password2) {
            setError('Nome, E-mail, Password são campos obrigatórios.');
            setIsLoading(false);
            return;
        }

        if (data.password1.length < 8) {
            setError('A senha deve ter pelo menos 8 caracteres.');
            setIsLoading(false);
            return;
        }

        if (data.password1 !== data.password2) {
            setError('As senhas não coincidem.');
            setIsLoading(false);
            return;
        }

        try {
            await axios.post(`${API_URL}/user/create`, {
                name: data.name,
                email: data.email,
                phone_number: data.phone_number,
                password: data.password1,
            });

            Alert.alert('Sucesso', 'Registro realizado com sucesso.');

            setData({
                name: '',
                email: '',
                phone_number: '',
                password1: '',
                password2: '',
            });

            setError('');
            router.replace('/auth/login');
        } catch (error: any) {
            console.log(error);

            if (error.response) {
                setError(error.response.data.info.message || error.response.data);
            } else {
                setError('Ocorreu um erro. Por favor, tente novamente.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setError('');
    }, [data]);

    return (
        <ScrollView showsHorizontalScrollIndicator={false}>
            <SafeAreaView>
                <View style={{ flex: 1, padding: 20, marginTop: 60 }}>
                    <Text style={{ fontSize: 25, fontWeight: '800', color: '#000' }}>EA Facility</Text>
                    <Text style={{ fontSize: 17, fontWeight: '800', color: '#000', marginTop: 10 }}>Criar nova conta</Text>
                    <Text style={{ marginTop: 12, fontSize: 16, fontWeight: '500', color: '#000' }}>
                        Consectetur adipisicing elit. Aut aliquam, culpa eligendi deleniti, soluta libero doloribus quibusdam ipsa
                        voluptas.
                    </Text>

                    {error && (
                        <Text
                            style={{
                                marginTop: 15,
                                fontSize: 15,
                                fontWeight: '600',
                                color: "#000",
                                paddingHorizontal: 15,
                                paddingVertical: 15,
                                borderRadius: 6,
                                backgroundColor: "#ff6666", // lighter red color
                                borderWidth: 2, // thickness of the border
                                borderColor: "#b30000", // darker red color for the border
                            }}
                        >
                            {error}
                        </Text>
                    )}

                    <View style={{ marginTop: 20 }}>
                        <TextInput
                            label="Nome"
                            left={<TextInput.Icon icon="account" />}
                            style={styles.input}
                            underlineColor={Colors.primaryDarkest}
                            disabled={isLoading}
                            theme={{ colors: { text: Colors.dark1, primary: Colors.primaryDarkest } }}
                            onChangeText={(value) => setData({ ...data, name: value })}
                        />

                        <TextInput
                            label="E-mail"
                            left={<TextInput.Icon icon="email" />}
                            style={[styles.input, { marginTop: 15 }]}
                            underlineColor={Colors.primaryDarkest}
                            disabled={isLoading}
                            theme={{ colors: { text: Colors.dark1, primary: Colors.primaryDarkest } }}
                            onChangeText={(value) => setData({ ...data, email: value })}
                        />

                        <TextInput
                            label="Número de Telefone"
                            left={<TextInput.Icon icon="phone" />}
                            style={[styles.input, { marginTop: 15 }]}
                            underlineColor={Colors.primaryDarkest}
                            disabled={isLoading}
                            theme={{ colors: { text: Colors.dark1, primary: Colors.primaryDarkest } }}
                            onChangeText={(value) => setData({ ...data, phone_number: value })}
                        />

                        <TextInput
                            label="Senha"
                            secureTextEntry={!pVisible}
                            left={<TextInput.Icon icon="lock" />}
                            right={<TextInput.Icon icon={!pVisible ? 'eye-off' : 'eye'} onPress={() => setPVisible(!pVisible)} />}
                            style={[styles.input, { marginTop: 15 }]}
                            underlineColor={Colors.primaryDarkest}
                            disabled={isLoading}
                            theme={{ colors: { text: Colors.dark1, primary: Colors.primaryDarkest } }}
                            onChangeText={(value) => setData({ ...data, password1: value })}
                        />

                        <TextInput
                            label="Confirmar Senha"
                            secureTextEntry={!pVisible}
                            left={<TextInput.Icon icon="lock" />}
                            right={<TextInput.Icon icon={!pVisible ? 'eye-off' : 'eye'} onPress={() => setPVisible(!pVisible)} />}
                            style={[styles.input, { marginTop: 15 }]}
                            underlineColor={Colors.primaryDarkest}
                            disabled={isLoading}
                            theme={{ colors: { text: Colors.dark1, primary: Colors.primaryDarkest } }}
                            onChangeText={(value) => setData({ ...data, password2: value })}
                        />

                        <Button
                            mode="contained"
                            onPress={handleRegister}
                            style={[styles.button, { borderRadius: 10 }]}
                            labelStyle={styles.buttonLabel}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator size={20} color={'#fff'} style={{ marginTop: 8 }} />
                            ) : (
                                <Text>Cadastrar</Text>
                            )}
                        </Button>

                        <View style={styles.registerContainer}>
                            <Button onPress={() => router.replace('/auth/login')}>
                                <Text>Já possui uma conta? Faça login</Text>
                            </Button>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </ScrollView>
    )
}

export default Register;

const styles = StyleSheet.create({
    input: {
        backgroundColor: Colors.transparentPrimaryLight,
        fontWeight: 'bold',
        fontSize: 15,
    },
    button: {
        marginTop: 15,
        backgroundColor: Colors.dark1,
        padding: 6,
        margin: 0,
    },
    buttonLabel: {
        color: Colors.dark9,
        fontWeight: 'bold',
        borderRadius: 10,
        fontSize: 15,
    },
    registerContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 15,
    },
});