import React, { useState, useEffect } from "react";
import { Modal, View, Text, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from "react-native"; 
import styles from "./style";

export default function VehicleEditModal({ visible, onClose, vehicle, onSave }) {
    const [formData, setFormData] = useState({
        marca: '',
        modelo: '',
        ano: '',
        categoria: '',
        placa: '',
        cor: '',
    });

    useEffect(() => {
        if (vehicle) {
        setFormData(vehicle);
        }
    }, [vehicle]);

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    }

    const handleSave = () => {
        if (onSave) {
        onSave(formData);
        }
        onClose();
    };



    return (
        <Modal
            visible={visible} 
            onRequestClose={onClose}
            transparent={true}
        >
        <View style={styles.overlay}>
            <View style={styles.container}>
            <Text style={styles.title}>Editar veículo</Text>

            <TextInput
                style={styles.input}
                placeholder="Marca do carro"
                value={formData.marca}
                onChangeText={(text) => handleChange("marca", text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Modelo"
                value={formData.modelo}
                onChangeText={(text) => handleChange("modelo", text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Ano"
                keyboardType="numeric"
                value={formData.ano}
                onChangeText={(text) => handleChange("ano", text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Categoria"
                value={formData.categoria}
                onChangeText={(text) => handleChange("categoria", text)}
            />
            <View style={styles.row}>
                <TextInput
                style={[styles.input, { flex: 1, marginRight: 5 }]}
                placeholder="Placa"
                value={formData.placa}
                onChangeText={(text) => handleChange("placa", text)}
                />
                <TextInput
                style={[styles.input, { flex: 1, marginLeft: 5 }]}
                placeholder="Cor"
                value={formData.cor}
                onChangeText={(text) => handleChange("cor", text)}
                />
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Salvar alterações</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onClose}>
                <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            </View>
        </View>
        </Modal>
    );
}
