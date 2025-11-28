import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";
import api from "../../services/api";
import { UserContext } from "../../contexts/UserContext";

export default function ChangePassword() {
  const { user } = useContext(UserContext);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return Alert.alert("Erro", "Preencha todos os campos.");
    }

    if (newPassword !== confirmPassword) {
      return Alert.alert("Erro", "As senhas novas não coincidem.");
    }

    try {
      setLoading(true);
      const response = await api.put(`/clientes/update-password/${user.id}`, {
        currentPassword,
        newPassword
      });

      Alert.alert("Sucesso", response.data.message);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

    } catch (err) {
      Alert.alert("Erro", err.response?.data?.error || "Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      
      <Text style={styles.title}>Alterar Senha</Text>
      <Text style={styles.subtitle}>Mantenha sua conta sempre segura</Text>

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={22} color="#1F284E" />
        <TextInput
          style={styles.input}
          placeholder="Senha atual"
          placeholderTextColor="#777"
          secureTextEntry
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="key-outline" size={22} color="#1F284E" />
        <TextInput
          style={styles.input}
          placeholder="Nova senha"
          placeholderTextColor="#777"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="checkmark-done-outline" size={22} color="#1F284E" />
        <TextInput
          style={styles.input}
          placeholder="Confirmar nova senha"
          placeholderTextColor="#777"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleChangePassword}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Alterando..." : "Salvar nova senha"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
