import UpperNavbar from '@/components/UpperNavbar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, ScrollView } from 'react-native';
import { styles } from './home';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '@/services/axiosConfig';
import { router, useFocusEffect } from 'expo-router';
import React from 'react';

function SearchScreen() {
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
          <Text>Afonso Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod dolore repellendus rerum consectetur, nemo inventore harum natus quis quidem, sapiente ea eos quos ullam accusamus mollitia impedit alias vel cum?</Text>
          <Text>Afonso Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod dolore repellendus rerum consectetur, nemo inventore harum natus quis quidem, sapiente ea eos quos ullam accusamus mollitia impedit alias vel cum?</Text>
          <Text>Afonso Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod dolore repellendus rerum consectetur, nemo inventore harum natus quis quidem, sapiente ea eos quos ullam accusamus mollitia impedit alias vel cum?</Text>
          <Text>Afonso Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod dolore repellendus rerum consectetur, nemo inventore harum natus quis quidem, sapiente ea eos quos ullam accusamus mollitia impedit alias vel cum?</Text>
          <Text>Afonso Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod dolore repellendus rerum consectetur, nemo inventore harum natus quis quidem, sapiente ea eos quos ullam accusamus mollitia impedit alias vel cum?</Text>
          <Text>Afonso Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod dolore repellendus rerum consectetur, nemo inventore harum natus quis quidem, sapiente ea eos quos ullam accusamus mollitia impedit alias vel cum?</Text>
          <Text>Afonso Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod dolore repellendus rerum consectetur, nemo inventore harum natus quis quidem, sapiente ea eos quos ullam accusamus mollitia impedit alias vel cum?</Text>
          <Text>Afonso Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod dolore repellendus rerum consectetur, nemo inventore harum natus quis quidem, sapiente ea eos quos ullam accusamus mollitia impedit alias vel cum?</Text>
          <Text>Afonso Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod dolore repellendus rerum consectetur, nemo inventore harum natus quis quidem, sapiente ea eos quos ullam accusamus mollitia impedit alias vel cum?</Text>
          <Text>Afonso Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod dolore repellendus rerum consectetur, nemo inventore harum natus quis quidem, sapiente ea eos quos ullam accusamus mollitia impedit alias vel cum?</Text>
          <Text>Afonso Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod dolore repellendus rerum consectetur, nemo inventore harum natus quis quidem, sapiente ea eos quos ullam accusamus mollitia impedit alias vel cum?</Text>
          <Text>Afonso Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod dolore repellendus rerum consectetur, nemo inventore harum natus quis quidem, sapiente ea eos quos ullam accusamus mollitia impedit alias vel cum?</Text>
          <Text>Afonso Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod dolore repellendus rerum consectetur, nemo inventore harum natus quis quidem, sapiente ea eos quos ullam accusamus mollitia impedit alias vel cum?</Text>
          <Text>Afonso Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod dolore repellendus rerum consectetur, nemo inventore harum natus quis quidem, sapiente ea eos quos ullam accusamus mollitia impedit alias vel cum?</Text>
          <Text>Afonso Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod dolore repellendus rerum consectetur, nemo inventore harum natus quis quidem, sapiente ea eos quos ullam accusamus mollitia impedit alias vel cum?</Text>
          <Text>Afonso Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod dolore repellendus rerum consectetur, nemo inventore harum natus quis quidem, sapiente ea eos quos ullam accusamus mollitia impedit alias vel cum?</Text>
          <Text>Afonso Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod dolore repellendus rerum consectetur, nemo inventore harum natus quis quidem, sapiente ea eos quos ullam accusamus mollitia impedit alias vel cum?</Text>
          <Text>Afonso Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod dolore repellendus rerum consectetur, nemo inventore harum natus quis quidem, sapiente ea eos quos ullam accusamus mollitia impedit alias vel cum?</Text>
          <Text>Afonso Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod dolore repellendus rerum consectetur, nemo inventore harum natus quis quidem, sapiente ea eos quos ullam accusamus mollitia impedit alias vel cum?</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default SearchScreen;