import React, {useContext} from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { UserContext } from '../../contexts/UserContext';

export default function ProfileCard() {

    const { user } = useContext(UserContext);

  return (
    <View style={styles.cardContainer}>
      <Image
        source={require('../../assets/images/capaProfile.png')}
        style={styles.coverImage}
      />

      <Image
        source={{ uri: user.foto_url}}
        style={styles.avatar}
      />

      <TouchableOpacity style={styles.editButton}>
        <Ionicons name="create-outline" size={20} color="#1F284E" />
      </TouchableOpacity>

      <View style={styles.textContainer}>
        <Text style={styles.name}>{user.nome}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#FFFFFF",
    width: "90%",
    height: 150,
    alignSelf: "center",
    borderRadius: 16,
    marginTop: 30,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
    overflow: "hidden",
    position: "relative",
  },
  coverImage: {
    width: "100%",
    height: "60%",
    resizeMode: "cover",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    position: "absolute",
    top: 50,
    left: 20,
  },
  editButton: {
    position: "absolute",
    right: 20,
    top: 70,
    backgroundColor: "#FFFFFF",
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  textContainer: {
    position: "absolute",
    top: 60,
    left: 100,
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1F284E",
    marginBottom: 4,
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 1,blur:5 },
    
  },
  email: {
    marginTop: 4,
    fontSize: 14,
    color: "#6C6C6C",
  },
});