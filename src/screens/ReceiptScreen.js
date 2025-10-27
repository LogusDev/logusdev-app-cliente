import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import {avatar} from "../screens/ActivityScreen";

export default function ReceiptScreen({ route }) {
  const { user, date, startTime, endTime, startAddress, endAddress, price } = route.params;

  return (
    <View style={styles.container}>
      {}
      <View style={styles.header}>
        <Text style={styles.logo}>Apenas</Text>
      </View>

      {}
      <View style={styles.info}>
        <Image style={styles.avatar}>{avatar}</Image> 
        <View>
          <Text style={styles.user}>{user}</Text>
          <Text style={styles.date}>{date}</Text>
          <Text style={styles.time}>{startTime} → {endTime}</Text>
        </View>
      </View>

      
      <Image
        source={{ uri: "https://via.placeholder.com/300x200.png?text=Mapa+do+Trajeto" }}
        style={styles.map}
      />

      {/* Info do veículo e preço */}
      <Text style={styles.vehicle}>Atego 1726 – Branco</Text>
      <Text style={styles.subtext}>Mercedes-Benz, 2010 – 8m x 2.60m – 4m</Text>

      <View style={styles.payment}>
        <Text style={styles.method}>💳 CARTÃO</Text>
        <Text style={styles.price}>R$ 247,47 {price}</Text>
      </View>

      {/* Endereços */}
      <View style={styles.addressBox}>
        <Text style={styles.address}>{startAddress}</Text>
        <Text style={styles.address}>{endAddress}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  header: { alignItems: "center", marginBottom: 20 },
  logo: { fontSize: 22, fontWeight: "bold", color: "#FF6600" },
  info: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  user: { fontSize: 18, fontWeight: "bold" },
  date: { fontSize: 16, color: "#555" },
  time: { fontSize: 16, color: "#333" },
  map: { width: "100%", height: 200, borderRadius: 10, marginVertical: 15 },
  vehicle: { fontSize: 16, fontWeight: "bold", marginTop: 10 },
  subtext: { fontSize: 14, color: "#666", marginBottom: 10 },
  payment: { flexDirection: "row", justifyContent: "space-between", marginVertical: 10 },
  method: { fontSize: 14, fontWeight: "600" },
  price: { fontSize: 18, fontWeight: "bold", color: "green" },
  addressBox: { marginTop: 15 },
  address: { fontSize: 13, color: "#444", marginVertical: 3 },
});
