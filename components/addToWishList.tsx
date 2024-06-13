import axios from 'axios';
import { Alert } from 'react-native';
import { API_URL } from '@/services/axiosConfig';
import { router } from 'expo-router';

export const addToWishlist = async (userId: number, productId: number) => {
  try {
    console.log(12345);

    await axios.post(`${API_URL}/wishlist/create`, {
      userId,
      productId
    });

    Alert.alert('Sucesso', 'Produto adicionado à lista de desejos');
  } catch (error: any) {
    console.error('Erro ao adicionar produto à lista de desejos:', error);
    Alert.alert('Erro', error.response ? error.response.data.info.message : 'Não foi possível adicionar o produto à lista de desejos');
  }
};

export const getWishlist = async (userId: number) => {
  try {
    const response = await axios.get(`${API_URL}/wishlist/user/${userId}`);
    return response.data.data; // Acesso ao campo correto da resposta da API
  } catch (error) {
    console.error('Erro ao buscar a lista de desejos:', error);
    throw error;
  }
};

export const deleteWishlistItem = async (productId: number) => {
  try {
    await axios.post(`${API_URL}/wishlist/delete/${productId}`);
  } catch (error) {
    console.error('Erro ao deletar item da lista de desejos:', error);
    throw error;
  }
};

export const sendReservationRequest = async (
  productId: number,
  quantity: number,
  userId: number,
  warehouseId: number
) => {
  try {
    const response = await axios.post(`${API_URL}/reservation/create`, {
      productId,
      quantity,
      userId,
      warehouseId
    });

    Alert.alert('Sucesso', `Reserva de ${quantity} unidades foi bem-sucedida.`);
    return response.data;
  } catch (error) {
    Alert.alert('Erro', 'Não foi possível realizar a reserva.');
    throw error;
  }
};

export const deleteWarehouse = async (warehouseId: number, userId: number) => {
  Alert.alert(
    'Confirmar Exclusão',
    'Você tem certeza que deseja deletar esta warehouse?',
    [
      {
        text: 'Cancelar',
        style: 'cancel'
      },
      {
        text: 'Deletar',
        onPress: async () => {
          try {
            await axios.delete(`${API_URL}/warehouse/delete`, {
              data: {
                warehouseId: warehouseId,
                userId: userId
              }
            });
            Alert.alert('Sucesso', 'Warehouse deletada com sucesso.');

            router.replace("/app/warehouse");
          } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Não foi possível deletar a warehouse.');
          }
        }
      }
    ]
  );
};

export const deleteUser = async (userId: number) => {
  Alert.alert(
    'Confirmar Exclusão',
    'Você tem certeza que deseja deletar esta conta de usuário?',
    [
      {
        text: 'Cancelar',
        style: 'cancel'
      },
      {
        text: 'Deletar',
        onPress: async () => {
          try {
            await axios.delete(`${API_URL}/user/delete`, {
              data: {
                id: userId
              }
            });
            Alert.alert('Sucesso', 'Conta de usuário deletada com sucesso.');
          } catch (error) {
            console.error('Erro ao deletar a conta de usuário:', error);
            Alert.alert('Erro', 'Não foi possível deletar a conta de usuário.');
          }
        }
      }
    ]
  );
};