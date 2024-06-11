import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";

const styles = StyleSheet.create({
    dangerButton: {
        backgroundColor: "red",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        marginVertical: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: 'bold',
    },
});

interface DangerButtonProps {
    onPress?: any;
    title: string;
    style?: any
}

const DangerButton: React.FC<DangerButtonProps> = ({ onPress, title, style }) => (
    <TouchableOpacity style={[styles.dangerButton, ...(style ? [style] : [])]} onPress={onPress}>
        <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
);


export default DangerButton;