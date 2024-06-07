import { Colors } from "@/constants/Colors";
import { API_URL } from "@/services/axiosConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native"
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
      setError('E-mail e Password sao obrigatorios.');
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
    <SafeAreaView>
      <View style={{ flex: 1, padding: 20, marginTop: 60 }}>
        <Text style={{ fontSize: 25, fontWeight: 800, color: "#000" }}>EA Facility</Text>
        <Text style={{ marginTop: 12, fontSize: 16, fontWeight: 500, color: "#000" }}>
          Consectetur adipisicing elit. Aut aliquam, culpa eligendi deleniti, soluta libero doloribus quibusdam ipsa voluptas.
        </Text>

        {error && <Text style={{
          marginTop: 15,
          fontSize: 15,
          fontWeight: 600,
          color: "#000",
          paddingHorizontal: 15,
          paddingVertical: 15,
          borderRadius: 6,
          backgroundColor: "#ff1212"
        }}>{error}</Text>}

        <View style={{ marginTop: 20 }}>
          <TextInput
            label="E-mail"
            left={<TextInput.Icon icon="email" />}
            style={styles.input}
            underlineColor={Colors.primaryDarkest}
            disabled={isLoading}
            theme={{ colors: { text: Colors.dark1, primary: Colors.primaryDarkest } }} // Set primary color
            onChangeText={(value) => setData({ ...data, email: value })}
          />

          <TextInput
            label="Password"
            secureTextEntry={!pVisible}
            left={<TextInput.Icon icon="lock" />}
            right={<TextInput.Icon icon={!pVisible ? "eye-off" : "eye"} onPress={() => setPVisible(!pVisible)} />}
            style={[styles.input, { marginTop: 15 }]}
            underlineColor={Colors.primaryDarkest}
            disabled={isLoading}
            theme={{ colors: { text: Colors.dark1, primary: Colors.primaryDarkest } }} // Set primary color
            onChangeText={(value) => setData({ ...data, password: value })}
          />

          <Button
            mode="contained"
            onPress={handlelogin}
            style={[styles.button, { borderRadius: 10 }]}
            labelStyle={styles.buttonLabel}
            disabled={isLoading}
          >
            {isLoading ? <ActivityIndicator size={20} color={"#fff"} style={{ marginTop: 8 }} /> : <Text>Entrar</Text>}
          </Button>

          <hr style={{ marginTop: 20, width: 100 }} />

          <View style={{display: "flex", justifyContent: "center", alignItems: "center", marginTop: 15}}>
            <Text onPress={() => router.push('/auth/register')}>Criar nova conta</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: Colors.transparentPrimaryLight,
    fontWeight: 'bold',
    fontSize: 15
  },
  button: {
    marginTop: 15,
    backgroundColor: Colors.dark1,
    padding: 6,
    margin: 0
  },
  buttonLabel: {
    color: Colors.dark9,
    fontWeight: 'bold',
    borderRadius: 10,
    fontSize: 15
  },
});

export default Login;