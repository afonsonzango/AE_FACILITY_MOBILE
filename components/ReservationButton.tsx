import React from 'react';
import { TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendReservationRequest } from './addToWishList';

interface ReservationButtonProps {
  productId: number;
  warehouseId: number;
}

const ReservationButton: React.FC<ReservationButtonProps> = ({ productId, warehouseId }) => {
  const handleReserve = async () => {
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) {
      Alert.alert('Erro', 'Usuário não encontrado.');
      return;
    }

    Alert.prompt(
      'Quantidade',
      'Digite a quantidade que deseja reservar:',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Enviar',
          onPress: async (quantityText :any) => {
            const quantity = parseInt(quantityText) || 1; // Default quantity is 1 if input is invalid
            try {
              await sendReservationRequest(productId, quantity, Number(userId), warehouseId);
              Alert.alert('Sucesso', 'Produto reservado com sucesso.');
            } catch (error) {
              console.error('Error reserving product:', error);
              Alert.alert('Erro', 'Não foi possível reservar o produto.');
            }
          },
        },
      ],
      'plain-text',
      '1' // Default value
    );
  };

  return (
    <TouchableOpacity onPress={handleReserve} style={styles.buttonReserve}>
      <Text style={styles.buttonText}>Reservar</Text>
    </TouchableOpacity>
  );
};

export default ReservationButton;

const styles = StyleSheet.create({
  buttonReserve: {
    borderRadius: 5,
    marginTop: 10,
    paddingVertical: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue',
  },
  buttonText: {
    color: '#fff',
  },
});