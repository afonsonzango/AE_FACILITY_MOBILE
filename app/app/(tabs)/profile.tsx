import axios from "axios"
import UpperNavbar from "@/components/UpperNavbar"
import { Alert, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { ActivityIndicator, Button, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@/services/axiosConfig";
import { router, useFocusEffect } from "expo-router";
import React, { useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import { Colors } from "@/constants/Colors";
import { styles as container } from "./home";

const imageUrl = "https://imgs.search.brave.com/MWlI8P3aJROiUDO9A-LqFyca9kSRIxOtCg_Vf1xd9BA/rs:fit:860:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAyLzE1Lzg0LzQz/LzM2MF9GXzIxNTg0/NDMyNV90dFg5WWlJ/SXllYVI3TmU2RWFM/TGpNQW15NEd2UEM2/OS5qcGc"

interface FormData {
  name: string | null,
  email: string | null,
  phone_number: string | null
}

interface PasswordFieldsInterface {
  currentPassword: string,
  newPassword: string
}

const Profile = () => {
  const [isReady, setIsReady] = useState<boolean>(false);

  const [isPersonalInformationLoading, setIsPersonalInformationLoading] = useState<boolean>(false);
  const [personalInformationError, setPersonalInformationError] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({
    name: null, email: null, phone_number: null
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isPasswordLoading, setIsPasswordLoading] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string>("");
  const [passwordFields, setPasswordFields] = useState<PasswordFieldsInterface>({
    currentPassword: "",
    newPassword: ""
  });

  const checkTokenAndNavigate = async () => {
    const userToken = await AsyncStorage.getItem('token');
    setIsReady(false);

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

      setFormData({
        name: response.data.user.name,
        email: response.data.user.email,
        phone_number: response.data.user.phone_number
      });

      setProfileImage(response.data.user.image);

    } catch (error) {
      router.replace('/auth/login');
      console.log(error);
    } finally {
      setIsReady(true);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      checkTokenAndNavigate();
    }, [])
  );

  const handleLogOut = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem("userId");

      router.replace('/auth/login');
    } catch (error: any) {
      console.error('Erro ao realizar logout:', error.message);
    }
  }

  const HandlePasswordChange = async () => {
    setIsPasswordLoading(true);

    if (passwordFields.newPassword === "" || passwordFields.currentPassword === "") {
      setPasswordError("Todos os campos sao necesarios");
      setIsPasswordLoading(false);
    } else {
      try {
        const userId = await AsyncStorage.getItem('userId');

        if (!userId) {
          handleLogOut();
        }

        const _response = await axios.post(`${API_URL}/user/compare`, {
          user_id: Number(userId),
          password_compare: String(passwordFields.currentPassword)
        });

        if (_response.data.data.passwordMatches) {
          await axios.put(`${API_URL}/user/update`, {
            id: userId,
            password: passwordFields.newPassword
          });

          setPasswordError("Senha altersada com sucesso!");

          setPasswordFields({
            currentPassword: "",
            newPassword: ""
          })
        } else {
          setPasswordError("A password actual que inseiu esta incorrecta!");
        }
      } catch {
        setPasswordError("Algum erro interno aconteceu.");
      } finally {
        setIsPasswordLoading(false);
      }
    }
  }

  const HandlePessoalInformation = async () => {
    setIsPersonalInformationLoading(true);
    const userId = await AsyncStorage.getItem('userId');

    if (!formData.name || !formData.email || !formData.phone_number)
      setPersonalInformationError("Todos os campos sao necesarios");

    try {
      await axios.put(`${API_URL}/user/update`, {
        id: userId,
        name: formData.name,
        phone_number: formData.phone_number,
        email: formData.email
      });

      setPersonalInformationError("Informacoes pessoais actualizadas com sucesso");
    } catch (error: any) {
      console.log(error);
      setPersonalInformationError(error.response.data.message);
    } finally {
      setIsPersonalInformationLoading(false);
    }
  }

  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // Request permission to access media library
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission to access camera roll is required!');
      return;
    }

    // Launch image picker
    const result: any = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!image) {
      Alert.alert('No image selected', 'Please select an image first.');
      return;
    }

    const userId = await AsyncStorage.getItem('userId');
    console.log(userId);

    const formData: any = new FormData();
    formData.append('userId', userId);
    formData.append('image', {
      uri: image,
      type: 'image/jpeg', // or other appropriate MIME type
      name: 'photo.jpg',
    });

    try {
      const response = await axios.put(`${API_URL}/user/update/picture`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      Alert.alert('Success', 'Image uploaded successfully');

      setImage(null);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Image upload failed');
    }
  };

  return (
    <SafeAreaView>
      <UpperNavbar />
      <ScrollView showsHorizontalScrollIndicator={false} style={container.container}>
        <View style={{ padding: 10 }}>
          {isReady ? (
            <View style={styles.paddingProfile}>
              <View style={styles.centerImage}>
                <View style={styles.imageCopper}>

                  {image ? (
                    <TouchableOpacity onPress={pickImage}>
                      <View style={styles.hideBorderView}>
                        <Image source={{ uri: image }} style={styles.profileImage} />
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={pickImage}>
                      <View style={styles.hideBorderView}>
                        <Image source={{ uri: `${API_URL}/file/` + profileImage || imageUrl }} style={styles.profileImage} />
                      </View>
                    </TouchableOpacity>
                  )}

                  {/* <TouchableOpacity style={styles.btnChange} onPress={pickImage}></TouchableOpacity> */}
                </View>
              </View>

              <View style={styles.container}>
                {image && <Button onPress={uploadImage}>Upload Image</Button>}
              </View>

              <Text>{profileImage}</Text>
              <View>
                <View style={{ marginTop: 20, marginBottom: 18 }}>
                  <Text style={styles.titleInterger}>Informacoes & Dados pessoais</Text>
                </View>

                {personalInformationError !== "" ? <Text style={styles.AlertComponent}>
                  {personalInformationError}
                </Text> : ""}

                <View>
                  <View style={styles.inputElementCopper}>
                    <Text style={styles.textInput}>Nome</Text>
                    <TextInput
                      placeholder='Nome'
                      value={String(formData.name)}
                      onChangeText={(text) => setFormData({ ...formData, name: text })}
                      style={styles.input}
                      underlineColor={Colors.primaryDarkest}
                      disabled={isPersonalInformationLoading}
                      theme={{ colors: { text: Colors.dark1, primary: Colors.primaryDarkest } }}
                    />
                  </View>
                  <View style={styles.inputElementCopper}>
                    <Text style={styles.textInput}>E-mail</Text>
                    <TextInput
                      placeholder='E-mail'
                      value={String(formData.email)}
                      onChangeText={(text) => setFormData({ ...formData, email: text })}
                      style={styles.input}
                      underlineColor={Colors.primaryDarkest}
                      disabled={isPersonalInformationLoading}
                      theme={{ colors: { text: Colors.dark1, primary: Colors.primaryDarkest } }}
                    />
                  </View>
                  <View style={styles.inputElementCopper}>
                    <Text style={styles.textInput}>Telefone</Text>
                    <TextInput
                      placeholder='Telefone'
                      value={String(formData.phone_number)}
                      onChangeText={(text) => setFormData({ ...formData, phone_number: text })}
                      style={styles.input}
                      underlineColor={Colors.primaryDarkest}
                      disabled={isPersonalInformationLoading}
                      theme={{ colors: { text: Colors.dark1, primary: Colors.primaryDarkest } }}
                    />
                  </View>

                  <Button
                    mode="contained"
                    onPress={HandlePessoalInformation}
                    disabled={isPasswordLoading}
                    loading={isPasswordLoading}
                    style={[styles.button, { borderRadius: 10 }]}
                    labelStyle={styles.buttonLabel}
                  >
                    Alterar dados pessoais
                  </Button>
                </View>
              </View>


              <View style={{ marginTop: 30 }}>
                <View style={{ marginTop: 20, marginBottom: 18 }}>
                  <Text style={styles.titleInterger}>Alterar Password</Text>
                </View>

                {passwordError !== "" ? <Text style={styles.AlertComponent}>
                  {passwordError}
                </Text> : ""}

                <View>
                  <View style={styles.inputElementCopper}>
                    <Text style={styles.textInput}>Password Actual</Text>
                    <TextInput
                      placeholder='Password actual'
                      onChangeText={(text) => setPasswordFields({ ...passwordFields, currentPassword: text })}
                      secureTextEntry={true}
                      value={String(passwordFields.currentPassword)}
                      style={styles.input}
                      underlineColor={Colors.primaryDarkest}
                      disabled={isPasswordLoading}
                      theme={{ colors: { text: Colors.dark1, primary: Colors.primaryDarkest } }}
                    />
                  </View>
                  <View style={styles.inputElementCopper}>
                    <Text style={styles.textInput}>Nova password</Text>
                    <TextInput
                      placeholder='Nova password'
                      secureTextEntry={false}
                      onChangeText={(text) => setPasswordFields({ ...passwordFields, newPassword: text })}
                      value={String(passwordFields.newPassword)}
                      style={styles.input}
                      underlineColor={Colors.primaryDarkest}
                      disabled={isPasswordLoading}
                      theme={{ colors: { text: Colors.dark1, primary: Colors.primaryDarkest } }}
                    />
                  </View>
                </View>

                <Button
                  mode="contained"
                  onPress={HandlePasswordChange}
                  disabled={isPasswordLoading}
                  loading={isPasswordLoading}
                  style={[styles.button, { borderRadius: 10 }]}
                  labelStyle={styles.buttonLabel}
                >
                  Mudar senha
                </Button>

              </View>

              <View style={{ marginTop: 30 }}>
                <View style={{ marginTop: 20, marginBottom: 18 }}>
                  <Text style={styles.titleInterger}>Minha Sessao</Text>
                </View>

                <TouchableOpacity style={styles.dangerButton} onPress={handleLogOut}>
                  <Text style={styles.buttonTextIng}>Terminar sessao</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) :
            <ActivityIndicator style={{ marginTop: 20 }} size={25} color={Colors.dark1} />
          }
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Profile;


const styles = StyleSheet.create({
  paddingProfile: {},
  centerImage: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 20
  },
  imageCopper: {
    width: 140,
    height: 140,
    borderRadius: 100,
    position: "relative",
  },
  hideBorderView: {
    overflow: "hidden",
    borderRadius: 100,
    backgroundColor: "#ddd"
  },
  btnChange: {
    width: 30,
    height: 30,
    backgroundColor: "blue",
    position: "absolute",
    bottom: 10,
    right: 10,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: "#fff"
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  inputElementCopper: {
    marginBottom: 12
  },
  textInput: {
    fontWeight: "bold",
    marginBottom: 10
  },
  inputElement: {
    borderBottomWidth: 1,
    height: 34,
    padding: 0,
    marginTop: -6,
    paddingHorizontal: 5,
  },
  hithLightButton: {
    width: "100%",
    height: 50,
    borderRadius: 6,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  dangerButton: {
    width: "100%",
    height: 50,
    backgroundColor: "red",
    borderRadius: 6,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  buttonTextIng: {
    color: "#fff",
  },
  titleInterger: {
    fontSize: 18,
    color: "#000",
    fontWeight: "bold"
  },
  AlertComponent: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "red",
    padding: 5,
    paddingHorizontal: 10,
    paddingTop: 7,
    borderRadius: 8,
    backgroundColor: "#ff000034",
    fontSize: 14,
    lineHeight: 20
  },
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
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
});