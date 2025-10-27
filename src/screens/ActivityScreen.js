import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import ActivityCard from "../components/ActivityCards";

export default function ActivityScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Atividade</Text>

      {/* Data */}
      <Text style={styles.date}>23/04/2025</Text>
      <ActivityCard
        user="José Almeida"
        avatar="https://i.pravatar.cc/100?img=1"
        startTime="23:47"
        endTime="00:32"
        startAddress="Rua Capivari, Parque Luiz..."
        endAddress="R. Marcelino Pinto, Parque Industrial..."
      />

      <Text style={styles.date}>12/01/2025</Text>
      <ActivityCard
        user="Anderson Costa"
        avatar="https://i.pravatar.cc/100?img=2"
        startTime="10:31"
        endTime="10:54"
        startAddress="Rua Andorinha, Jardim S. Eduardo..."
        endAddress="Rua das Acácias Pinto, Jardim V..."
      />

      <Text style={styles.date}>27/11/2024</Text>
      <ActivityCard
        user="Julio Jamerson"
        avatar="https://i.pravatar.cc/100?img=3"
        startTime="15:03"
        endTime="15:23"
        startAddress="Rua da Fonte, Jardim Vista..."
        endAddress="Rua Cândido Portinari, Vila..."
      />

      <Text style={styles.footer}>Você entrou no app em: 03/05/2025</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 20,
  },
  date: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginTop: 15,
  },
  footer: {
    textAlign: "center",
    fontSize: 12,
    color: "#999",
    marginTop: 20,
  },
});
