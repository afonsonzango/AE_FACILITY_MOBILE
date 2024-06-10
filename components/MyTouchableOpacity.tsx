import { Colors } from '@/constants/Colors';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface ButtonProps {
    text: string;
    style?: any;
    onPress?: any;
    loading?: boolean;
}

const styles = StyleSheet.create({
    greenButton: {
        backgroundColor: Colors.dark1,
        paddingHorizontal: 25,
        paddingVertical: 12,
        borderRadius: 6,
        flexDirection: "row",
        justifyContent: "center"
    },
    ButtonText: {
        color: "#fff"
    }
});

const MyTouchableOpacity:React.FC<ButtonProps> = ({ text, style, loading, ...props }) => {
    loading = loading || false;

    return (
        <TouchableOpacity style={[styles.greenButton, style]} {...props}>
            {loading ? (
                <ActivityIndicator color={"#fff"} size={22} />
            ) : (
                <Text style={styles.ButtonText}>{text}</Text>
            )}
        </TouchableOpacity>
    );
};

export default MyTouchableOpacity;