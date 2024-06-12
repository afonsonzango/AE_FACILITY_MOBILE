import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, Text, View, ActivityIndicator, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { API_URL } from '@/services/axiosConfig';
import { Colors } from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import UpperNavbar from '@/components/UpperNavbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import DangerButton from '@/components/DangerButton';

const ReservationScreen = ({ route }: { route: any }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [reservations, setReservations] = useState<any[]>([]);

    const fetchReservations = async () => {
        try {
            const userId = await AsyncStorage.getItem('userId');

            const response = await axios.get(`${API_URL}/reservation/user/${userId}`);
            setReservations(response.data.data);
        } catch (error) {
            console.error('Error fetching reservations:', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchReservations();
        }, [])
    )

    const handleCancelReservation = async (reservationId: number) => {
        try {
            await axios.delete(`${API_URL}/reservation/cancel`, {
                data: {
                    reservationId: reservationId
                }
            });
            // Remova a reserva cancelada da lista de reservas
            setReservations(prevReservations => prevReservations.filter(reservation => reservation.id !== reservationId));
            Alert.alert('Sucesso', 'Reserva cancelada com sucesso.');
        } catch (error) {
            console.error('Erro ao cancelar a reserva:', error);
            Alert.alert('Erro', 'Não foi possível cancelar a reserva.');
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            <UpperNavbar />
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <TouchableOpacity onPress={() => router.replace("/app/home")} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.goBackButton}>Voltar</Text>
                </TouchableOpacity>
                {loading ? (
                    <ActivityIndicator size="large" color={Colors.dark1} />
                ) : reservations.length === 0 ? (
                    <Text style={styles.emptyText}>Nenhuma reserva encontrada.</Text>
                ) : (
                    reservations.map((reservation, index) => (
                        <View key={index} style={styles.reservationItem}>
                            <Text>Quantidade: {reservation.quantity}</Text>
                            <Text>Estado: {reservation.accepted ? 'Aceita' : 'Pendente'}</Text>
                            <Text>Data da Reserva: {new Date(reservation.insertedAt).toLocaleDateString()}</Text>
                            <DangerButton title='Cancelar Reserva' onPress={() => handleCancelReservation(reservation.id)} />
                        </View>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollViewContent: {
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
    reservationItem: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    goBackButton: {
        fontSize: 16,
        color: '#000',
        marginTop: -18,
        padding: 10,
        backgroundColor: "#aaa",
        paddingHorizontal: 20,
        borderRadius: 10
    },
});

export default ReservationScreen;
