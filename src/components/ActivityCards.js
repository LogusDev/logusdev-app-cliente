import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {avatar} from "../screens/ActivityScreen";

export default function ActivityCard({ user, avatar, startTime, endTime, startAddress, endAddress, date, price }) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("Receipt", { user, avatar, startTime, endTime, startAddress, endAddress, date, price })
      }
    >
      <View style={styles.header}>
        <Image source={{ uri: avatar }} style={styles.avatar} />
        <Text style={styles.user}>{user}</Text>
        <View style={styles.timeBox}>
          <Text style={styles.time}>{startTime}</Text>
          <Text style={styles.time}>{endTime}</Text>
        </View>
      </View>
      <View style={styles.addressBox}>
        <Text style={styles.address}>{startAddress}</Text>
        <Text style={styles.address}>{endAddress}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#000000ff",
    padding: 15,
    marginVertical: 10,
    width: "95%",
    alignSelf: "center",
    elevation: 3,
  },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  user: { flex: 1, fontSize: 16, fontWeight: "bold" },
  timeBox: { alignItems: "flex-end" },
  time: { fontSize: 14, fontWeight: "600" },
  addressBox: { marginTop: 10 },
  address: { fontSize: 12, color: "#666" },
});
