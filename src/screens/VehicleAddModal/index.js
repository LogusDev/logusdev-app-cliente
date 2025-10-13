import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import Button from "../../components/Button";
import styles from "./style";

export default function VehicleAddModal({ visible, onClose, vehicle, onSave }) {
  const [formData, setFormData] = useState({
    marca: "",
    modelo: "",
    ano: "",
    categoria: "",
    placa: "",
    cor: "",
  });

 
  useEffect(() => {
  if (visible) {
    if (vehicle) {

      setFormData({
        marca: vehicle.marca || "",
        modelo: vehicle.modelo || "",
        ano: vehicle.ano || "",
        categoria: vehicle.categoria || "",
        placa: vehicle.placa || "",
        cor: vehicle.cor || "",
      });
    } else {
    
      setFormData({
        marca: "",
        modelo: "",
        ano: "",
        categoria: "",
        placa: "",
        cor: "",
      });
    }
  }
}, [visible, vehicle]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {

    const { marca, modelo, ano, categoria, placa, cor } = formData;
    if (!marca || !modelo || !ano || !categoria || !placa || !cor) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    if (onSave) onSave(formData);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <Text style={styles.title}>Adicionar novo Veículo:</Text>

            <TextInput
              style={styles.input}
              placeholder="Marca do seu carro..."
              placeholderTextColor="#999"
              value={formData.marca}
              onChangeText={(text) => handleChange("marca", text)}
            />

            <TextInput
              style={styles.input}
              placeholder="Modelo..."
              placeholderTextColor="#999"
              value={formData.modelo}
              onChangeText={(text) => handleChange("modelo", text)}
            />

            <TextInput
              style={styles.input}
              placeholder="Ano..."
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={formData.ano}
              onChangeText={(text) => handleChange("ano", text)}
            />

            <TextInput
              style={styles.input}
              placeholder="Categoria..."
              placeholderTextColor="#999"
              value={formData.categoria}
              onChangeText={(text) => handleChange("categoria", text)}
            />

            <TextInput
              style={styles.input}
              placeholder="Placa..."
              placeholderTextColor="#999"
              value={formData.placa}
              onChangeText={(text) => handleChange("placa", text)}
            />

            <TextInput
              style={styles.input}
              placeholder="Cor..."
              placeholderTextColor="#999"
              value={formData.cor}
              onChangeText={(text) => handleChange("cor", text)}
            />

            <Button text="Salvar" onPress={handleSave} />

            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}
