import { Colors } from "@/constants/Colors";
import { API_URL } from "@/services/axiosConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { ActivityIndicator, Button, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const Login = () => {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState({
    email: "",
    password: ""
  });

  const [pVisible, setPVisible] = useState<boolean>(false);

  const handlelogin = async () => {
    setIsLoading(true);

    if (!data.email || !data.password) {
      setError('E-mail e Password são obrigatórios.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/user/login`, {
        email: data.email,
        password: data.password
      });

      const token = response.data.token;

      console.log(response.data);

      await AsyncStorage.setItem('token', token);

      const _response = await axios.post(`${API_URL}/user`, {}, {
        headers: {
          token: token
        }
      });

      const userId = _response.data.user.id;
      await AsyncStorage.setItem('userId', String(userId));

      setData({
        email: "",
        password: ""
      });

      setError("");
      router.replace('/app/home');

    } catch (error: any) {
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setError("");
  }, [data]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* <Text style={styles.title}>EA Facility</Text> */}
        <Image source={require('@/assets/images/logo.png')} style={styles.logo} />
        
        <Text style={styles.subtitle}>
          Consectetur adipisicing elit. Aut aliquam, culpa eligendi deleniti, soluta libero doloribus quibusdam ipsa voluptas.
        </Text>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.inputContainer}>
          <TextInput
            label="E-mail"
            left={<TextInput.Icon icon="email" />}
            style={styles.input}
            underlineColor={Colors.primaryDarkest}
            disabled={isLoading}
            theme={{ colors: { text: Colors.dark1, primary: Colors.primaryDarkest } }}
            onChangeText={(value) => setData({ ...data, email: value })}
          />

          <TextInput
            label="Password"
            secureTextEntry={!pVisible}
            left={<TextInput.Icon icon="lock" />}
            right={<TextInput.Icon icon={!pVisible ? "eye-off" : "eye"} onPress={() => setPVisible(!pVisible)} />}
            style={[styles.input, styles.passwordInput]}
            underlineColor={Colors.primaryDarkest}
            disabled={isLoading}
            theme={{ colors: { text: Colors.dark1, primary: Colors.primaryDarkest } }}
            onChangeText={(value) => setData({ ...data, password: value })}
          />

          <Button
            mode="contained"
            onPress={handlelogin}
            style={styles.button}
            labelStyle={styles.buttonLabel}
            disabled={isLoading}
          >
            {isLoading ? <ActivityIndicator size={20} color={"#fff"} style={{ marginTop: 8 }} /> : <Text>Entrar</Text>}
          </Button>

          <View style={styles.registerContainer}>
            <Button onPress={() => router.replace('/auth/register')}>
              <Text>Criar conta</Text>
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    padding: 20,
    marginTop: 60,
  },
  title: {
    fontSize: 25,
    fontWeight: '800',
    color: "#000",
  },
  subtitle: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '500',
    color: "#000",
  },
  errorText: {
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
  },
  inputContainer: {
    marginTop: 20,
  },
  input: {
    backgroundColor: Colors.transparentPrimaryLight,
    fontWeight: 'bold',
    fontSize: 15,
  },
  passwordInput: {
    marginTop: 15,
  },
  button: {
    marginTop: 15,
    backgroundColor: Colors.dark1,
    padding: 6,
    margin: 0,
    borderRadius: 10,
  },
  buttonLabel: {
    color: Colors.dark9,
    fontWeight: 'bold',
    fontSize: 15,
  },
  registerContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  logo: {
    width: 260,
    height: 40
  }
});

export default Login;
