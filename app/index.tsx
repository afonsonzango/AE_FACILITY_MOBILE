import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { Colors } from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router'; 
import axios from 'axios';
import { API_URL } from '@/services/axiosConfig';

const Index = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkTokenAndFetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        console.log("User token: ", token);

        if (!token) {
          router.replace('/auth/login');
          return;
        }

        const response = await axios.post(`${API_URL}/user`, {}, {
          headers: {
            token: token
          }
        });

        if (response.data.user) {
          router.replace('/app/home');
        } else {
          router.replace('/auth/login');
        }
      } catch (error) {
        console.log(error);
        router.replace('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    checkTokenAndFetchData();
  }, [router]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 }}>
        <ActivityIndicator size={30} color={Colors.dark1} />
        <Text>Aguarde</Text>
      </View>
    );
  }

  return null;
};

export default Index;