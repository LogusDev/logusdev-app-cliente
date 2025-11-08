import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import ReceiptButton from "../../components/ReceiptButton/ReceiptButton";
import { useState, useEffect } from "react";
import { CallSearch } from "../../services/calls";
import { ActivityIndicator } from "react-native";

export default function ReceiptScreen({ route }) {
    const [driverData, setDriverData] = useState(null);
    const [loading, setLoading] = useState(true);

    const { receiptData } = route.params || {};
    const id = receiptData?.id;
    console.log("Dados: ", receiptData);
    console.log("[ReceiptScreen] ID recebido:", id);
    console.log(driverData)

    useEffect(() => {
        async function fetchCallDetails() {
            const data = await CallSearch(id);
            console.log("[TESTE] Resultado do callSearch:", data);
            if (data) {
                setDriverData(data);
            }
            setLoading(false);
        }
        fetchCallDetails();
    }, []);
  
return (
  <ScrollView style={styles.container}>
    <View style={styles.receiptHeader}>
    <Image
        source={require("../../assets/images/serrilhado.png")}
        style={styles.serrilhado}
    />  
    <ReceiptButton />
    </View>
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <Image
          source={require("../../assets/images/logoguinchAqui.png")}
          style={styles.logo}
        />
      </View>
    </View>

    <View style={styles.profileBox}>
      <Image
        source={receiptData.avatar ? { uri: receiptData.avatar } : require("../../assets/images/driverImage.png")}
        style={styles.avatar}
    />
      <View style={styles.profileInfo}>
        <Text style={styles.userName}>{receiptData.user}</Text>
        <Text style={styles.date}>{receiptData.date || "23/04/2025"}</Text>
        <Text style={styles.time}>
            {receiptData.startTime || "23:47"} <Ionicons name="timer-outline" size={14} color="#1F284E" /> {receiptData.endTime || "00:15"}
        </Text>
      </View>
    </View>
    
    <Image
      source={require("../../assets/images/mapImage.png")}
      style={styles.map}
    />

    {!loading && driverData ? (
    <View style={styles.vehicleBox}>
        <Text style={styles.vehicleName}>
        {driverData.guincho?.modelo || "Atego 1726 – Branco"}
        </Text>
        <Text style={styles.vehicleDetails}>
        {driverData.guincho?.marca || "Mercedes-Benz"}
        </Text>
        <Text style={styles.vehicleDetails}>
        {driverData.guincho?.ano_fabricacao || "2010"} - 
        {driverData.guincho?.comprimento_plataforma || "ABC-1234"}m
        </Text>
        <View style={styles.paymentBox}>
        <Ionicons name="card-outline" size={40} top={20} left={30} color="#1F284E" />
        <Text style={styles.paymentMethod}>CARTÃO</Text>
        </View>
        <Text style={styles.price}>
        R$: <Text style={styles.priceValue}>{receiptData.price || "247,42"}</Text>
        </Text>
    </View>
    ) : (
    <View style={{ alignItems: "center", marginTop: 20 }}>
        <ActivityIndicator size="small" color="#1F284E" />
        <Text style={{ color: "#1F284E", marginTop: 5 }}>Carregando dados do guincho...</Text>
    </View>
    )}


    {/* Endereços */}
    <View style={styles.addressContainer}>
    <View style={styles.addressBox}>
        <View style={styles.startAddressBox}>
        <Text style={styles.cityText}>{receiptData.startAddress}</Text>
        </View>


        <Ionicons name="arrow-forward-circle-outline" size={35} color="#1F284E" />

        <View style={styles.endAddressBox}>
        <Text style={styles.cityText}>{receiptData.endAddress}</Text>
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
    left: "64%",
    fontSize: 15,
    fontWeight: "700",
    color: "#1F284E",
    textDecorationLine: 'underline',
  },
  time: {
    top: "35%",
    left: "58%",
    fontSize: 15,
    fontWeight: "700",
    color: "#1F284E",
    marginTop: 4,
  },

  map: {
    top: "-2%",
    width: "85%",
    height: 380,
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
    left: "5%",
    fontSize: 16,
    fontWeight: "700",
    color: "#1F284E",
  },
  vehicleDetails: {
    left: "5%",
    fontSize: 13,
    fontWeight: "700",
    color: "#1F284E",
  },
  paymentBox: {
    top: "-60%",
    left: "10%",
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
    left: "65%",
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
    width: "85%",
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

