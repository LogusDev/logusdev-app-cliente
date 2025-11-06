import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import ReceiptButton from "../../components/ReceiptButton/ReceiptButton";

export default function ReceiptScreen({ 
    user,
    avatar,
    date,
    startTime, 
    endTime, 
    startAddress, 
    endAddress, 
    price 
 }) {
        const navigation = useNavigation();
  
return (
  <ScrollView style={styles.container}>
    <View style={styles.receiptHeader}>
    <Image
        source={require("../../assets/images/serrilhado.png")}
        style={styles.serrilhado}
    />  
    <ReceiptButton />
    </View>
    {/* Header com logo e botões */}
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <Image
          source={require("../../assets/images/logoguinchAqui.png")}
          style={styles.logo}
        />
      </View>
    </View>

    {/* Dados do motorista */}
    <View style={styles.profileBox}>
      <Image
        source={avatar ? { uri: avatar } : require("../../assets/images/driverImage.png")}
        style={styles.avatar}
    />
      <View style={styles.profileInfo}>
        <Text style={styles.userName}>{user}José Almeida</Text>
        <Text style={styles.date}>{date}23/04/2025</Text>
        <Text style={styles.time}>
            {startTime || "23:47"} <Ionicons name="timer-outline" size={14} color="#1F284E" /> {endTime || "00:15"}
        </Text>
      </View>
    </View>

    {/* Mapa */}
    <Image
      source={require("../../assets/images/mapImage.png")}
      style={styles.map}
    />

    {/* Dados do veículo e pagamento */}
    <View style={styles.vehicleBox}>
      <Text style={styles.vehicleName}>Atego 1726 – Branco</Text>
      <Text style={styles.vehicleDetails}>Mercedes-Benz</Text>
      <Text style={styles.vehicleDetails}>2010 - 8m x 2.60m – 4m</Text> 

      <View style={styles.paymentBox}>
         <Ionicons name="card-outline" size={40} top={20} left={30} color="#1F284E" />
        <Text style={styles.paymentMethod}>CARTÃO</Text>
      </View>
      <Text style={styles.price}>
        R$: 
      <Text style={styles.priceValue}> 247,42</Text>
     </Text>

    </View>

    {/* Endereços */}
    <View style={styles.addressContainer}>
    <View style={styles.addressBox}>
        <View style={styles.startAddressBox}>
        <Text style={styles.cityText}>Embu das Artes, SP.</Text>
        <Text style={styles.streetText}>R. Capivari, Parque Luiza</Text>
        <Text style={styles.numberText}>N°12</Text>
        </View>

        <Ionicons name="arrow-forward-circle-outline" size={35} color="#1F284E" />

        <View style={styles.endAddressBox}>
        <Text style={styles.cityText}>Embu das Artes, SP.</Text>
        <Text style={styles.streetText}>R. Marcelino Pinto, Parque Industrial</Text>
        <Text style={styles.numberText}>N°529</Text>
        </View>
    </View>
    </View>

  </ScrollView>
);
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
  },

  header: {
    alignItems: "center",
    marginBottom: 10,
  },

  logo: {
    top: "20%",
    margin: 'auto',
    width: 250,
    height: 50,
    resizeMode: "contain",
  },
  iconButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#1F284E",
    borderRadius: 50,
    padding: 8,
    marginLeft: 8,
    elevation: 2,
  },

  profileBox: {
    top: "-1%",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  avatar: {
    top: 20,
    width: 65,
    height: 65,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#1F284E",
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    top: 40,
    fontSize: 23,
    fontWeight: "700",
    color: "#1F284E",
  },
  date: {
    top: "20%",
    left: "67%",
    fontSize: 15,
    fontWeight: "700",
    color: "#1F284E",
    textDecorationLine: 'underline',
  },
  time: {
    top: "35%",
    left: "61%",
    fontSize: 15,
    fontWeight: "700",
    color: "#1F284E",
    marginTop: 4,
  },

  map: {
    top: "-2%",
    width: "90%",
    height: 400,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000000ff",
    marginVertical: 15,
    margin: 'auto',
  },

  vehicleBox: {
    top: "-3%",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F284E",
  },
  vehicleDetails: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1F284E",
  },
  paymentBox: {
    top: "-60%",
    left: "12%",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
  },

  paymentMethod: {
    top: "-20%",
    left: "25%",
    flexDirection: "row",
    alignItems: "center",
    fontSize: 17,
    fontWeight: "600",
    color: "#1F284E",
  },

  price: {
    left: "68%",
    top: "-62%",
    fontSize: 21,
    fontWeight: "bold",
    color: "#1F284E", 
  },

    priceValue: {
    color: "green",
    },

    addressContainer: {
    top: "-15%",
    width: "90%",
    margin: "auto",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#1F284E",
    borderRadius: 5,
    padding: 12,
    },

    addressBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    },

    startAddressBox: {
    width: "40%",
    },

    endAddressBox: {
    width: "40%",
    alignItems: "flex-end",
    },

    cityText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1F284E",
    },

    streetText: {
    fontSize: 13,
    color: "#333",
    fontWeight: "500",
    },

    numberText: {
    fontSize: 13,
    color: "#333",
    fontWeight: "700",
    },

    serrilhado: {
        marginTop: -110,
        width: "220%",
        height: 180,
        alignSelf: "center",
        color: "#ffffffff",
        resizeMode: "cover",
    },


});

