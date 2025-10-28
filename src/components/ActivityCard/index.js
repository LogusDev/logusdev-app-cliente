import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from 'react-native-vector-icons/Ionicons';


export default function ActivityCard({
  user,
  avatar,
  startTime,
  endTime,
  startAddress,
  endAddress,
  date,
  price,
}) {
  const navigation = useNavigation();

  return (
    <>
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.card}
      onPress={() =>
        navigation.navigate("Receipt", {
          user,
          avatar,
          startTime,
          endTime,
          startAddress,
          endAddress,
          date,
          price,
        })
      }
    >

      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image source={{ uri: avatar }} style={styles.avatar} />
          <Text style={styles.user}>{user}</Text>
        </View>

        <View style={styles.timeBox}>
          <Text style={styles.time}>{startTime}</Text>
          <Ionicons name="timer-outline" size={16} margin={2} color="#888" style={styles.timeIcon} />
          <Text style={styles.time}>{endTime}</Text>
        </View>
      </View>


      <View style={styles.addressContainer}>
        <Text style={styles.address} numberOfLines={2}>
          {startAddress}
        </Text>
        <View style={styles.divider} />
        <Text style={styles.address} numberOfLines={2}>
          {endAddress}
        </Text>
      </View>
    </TouchableOpacity>
    <View style={styles.separator} />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#F5f5f5",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginVertical: 10,
    alignSelf: "center",
    width: "100%",
    height: "20%",
    elevation: 2,
    borderWidth: 1,
    borderColor: "#1F284E",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 10,
    borderWidth: 2,
    borderColor: "#1F284E"
  },

  user: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    top: "-5%",
    left: "5%"
  },

  timeBox: {
    top: "20%",
    alignItems: "flex-end",
  },

  time: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
  },

  timeArrow: {
    fontSize: 12,
    color: "#888",
    marginVertical: 2,
  },

  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    backgroundColor: "#fff",
    width: "65%",
    height: "50%",
    margin: 'auto',
    borderWidth: 1,
    borderColor: "#1F284E",
    padding: 3,
    top: '-20%'
  },

  divider: {
    width: 1,
    height: 20,
    backgroundColor: "#D0D0D0",
    marginHorizontal: 8,
  },

  address: {
    flex: 1,
    fontSize: 13,
    color: "#2C2C2C",
    fontWeight: "400",
  },

  separator: {
    borderBottomColor: '#C0C0C0',
    borderBottomWidth: 1,
    width: '80%',
    margin: "auto",
    marginVertical: 8,
    marginTop: 10
    }
});
