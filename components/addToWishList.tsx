import axios from 'axios';
import { Alert } from 'react-native';
import { API_URL } from '@/services/axiosConfig';

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