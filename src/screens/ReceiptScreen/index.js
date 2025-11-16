import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ReceiptButton from "../../components/ReceiptButton/ReceiptButton";
import { useState, useEffect, useRef } from "react";
import { CallSearch } from "../../services/calls";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import { captureRef } from "react-native-view-shot";
import { Asset } from "expo-asset";

export default function ReceiptScreen({ route }) {
  const { receiptData } = route.params || {};
  const id = receiptData?.id;

  const [driverData, setDriverData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hideButton, setHideButton] = useState(false);

  const [serrilhadoUri, setSerrilhadoUri] = useState(null);
  const [logoUri, setLogoUri] = useState(null);
  const [mapUri, setMapUri] = useState(null);
  const [driverPlaceholderUri, setDriverPlaceholderUri] = useState(null);

  const receiptRef = useRef();
  const offscreenRef = useRef();

  const { width, height } = Dimensions.get("screen");

  useEffect(() => {
    async function fetchCallDetails() {
      const data = await CallSearch(id);
      if (data) setDriverData(data);
      setLoading(false);
    }
    fetchCallDetails();
  }, [id]);

  useEffect(() => {
    async function loadAssets() {
      const serrilhadoAsset = require("../../assets/images/serrilhado.png");
      const logoAsset = require("../../assets/images/logoguinchAqui.png");
      const mapAsset = require("../../assets/images/mapImage.png");
      const driverAsset = require("../../assets/images/driverImage.png");

      const loaded = await Asset.loadAsync([serrilhadoAsset, logoAsset, mapAsset, driverAsset]);

      const serr = loaded[0].localUri || loaded[0].uri;
      const log = loaded[1].localUri || loaded[1].uri;
      const mp = loaded[2].localUri || loaded[2].uri;
      const drv = loaded[3].localUri || loaded[3].uri;

      setSerrilhadoUri(serr);
      setLogoUri(log);
      setMapUri(mp);
      setDriverPlaceholderUri(drv);
    }

    loadAssets();
  }, []);

  const handleGeneratePDF = async () => {
    try {
      setHideButton(true);

      const base64 = await captureRef(offscreenRef, {
        format: "png",
        quality: 1,
        result: "base64",
      });

      const htmlContent = `
        <html>
          <head>
            <style>
                @page { 
                margin: 10px;
                size: A4 portrait; 
              }

              body {
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                background: #fff;
              }

              img {
                width: 90%;
                max-height: 120%;
                object-fit: contain; 
              }
            </style>
          </head>
          <body>
            <img src="data:image/png;base64,${base64}" />
          </body>
        </html>
      `;


      const { uri: pdfUri } = await Print.printToFileAsync({ html: htmlContent });

      const pdfPath = FileSystem.documentDirectory + "recibo.pdf";

      await FileSystem.moveAsync({ from: pdfUri, to: pdfPath });
      await Sharing.shareAsync(pdfPath);
    } catch (error) {
      console.log("Erro ao gerar PDF:", error);
    } finally {
      setHideButton(false);
    }
  };

  const handleShareScreenshot = async () => {
    try {
      setHideButton(true);
      const uri = await captureRef(offscreenRef, { format: "png", quality: 1 });
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.log("Erro ao compartilhar recibo", error);
    } finally {
      setHideButton(false);
    }
  };

  const renderPaymentMethod = (method) => {
  if (!method) return { icon: "card-outline", label: "CARTÃO" };

  const lower = method.toLowerCase();
  let iconName = "card-outline";
  let label = "";

  switch (lower) {
    case "dinheiro":
      iconName = "cash-outline";
      label = "DINHEIRO";
      break;
    case "pix":
      iconName = "logo-bitcoin"; 
      label = "PIX";
      break;
    case "cartao":
      iconName = "card-outline";
      label = "CARTÃO";
      break;
    default:
      iconName = "card-outline";
      label = method.toUpperCase();
  }

  return { iconName, label };
};

  return (
    <>
      <View style={{ backgroundColor: "#F5F5F5" }}>
        <View style={styles.receiptHeader}>
          <Image source={require("../../assets/images/serrilhado.png")} style={styles.serrilhado} />
          {!hideButton && <ReceiptButton onPDFPress={handleGeneratePDF} onSharePress={handleShareScreenshot} />}
        </View>
        <View style={styles.header}>
          <Image source={require("../../assets/images/logoguinchAqui.png")} style={styles.logo} />
        </View>
        <View style={styles.profileBox}>
          <Image
            source={receiptData?.avatar ? { uri: receiptData.avatar } : require("../../assets/images/driverImage.png")}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.userName} numberOfLines={1}>{receiptData?.user}</Text>
            <Text style={styles.date}>{receiptData?.date || "23/04/2025"}</Text>
            <Text style={styles.time}>
              {receiptData?.startTime || "23:47"} <Ionicons name="timer-outline" size={14} color="#1F284E" />{" "}
              {receiptData?.endTime || "00:15"}
            </Text>
          </View>
        </View>

        <Image source={require("../../assets/images/mapImage.png")} style={styles.map} />

        {!loading && driverData ? (
          <View style={styles.vehicleBox}>
            <Text style={styles.vehicleName}>{driverData.guincho?.modelo || "Atego 1726 – Branco"}</Text>
            <Text style={styles.vehicleDetails}>{driverData.guincho?.marca || "Mercedes-Benz"}</Text>
            <Text style={styles.vehicleDetails}>
              {driverData.guincho?.ano_fabricacao || "2010"} {" "}
              {!driverData.guincho?.comprimento_plataforma ? (
              driverData.guincho?.comprimento_plataforma || ""
              ) : ""}
            </Text>
            <View style={styles.paymentBox}>
            {(() => {
              const { iconName, label } = renderPaymentMethod(driverData?.metodo_pagamento);
              return (
                <>
                  <Ionicons name={iconName} size={40} top={20} left={30} color="#1F284E" />
                  <Text style={styles.paymentMethod}>{label}</Text>
                  <Text style={styles.price}>
                    R$: <Text style={styles.priceValue}>{driverData?.preco || "247,42"}</Text>
                  </Text>
                </>
              );
            })()}
          </View>
          </View>
        ) : (
          <View style={{ alignItems: "center", marginTop: 20 }}>
            <ActivityIndicator size="small" color="#1F284E" />
            <Text style={{ color: "#1F284E", marginTop: 5 }}>Carregando dados do guincho...</Text>
          </View>
        )}

        <View style={styles.addressContainer}>
          <View style={styles.addressBox}>
            <View style={styles.startAddressBox}>
              <Text style={styles.cityText}>{receiptData?.startAddress}</Text>
            </View>
            <Ionicons name="arrow-forward-circle-outline" size={35} color="#1F284E" />
            <View style={styles.endAddressBox}>
              <Text style={styles.cityText}>{receiptData?.endAddress}</Text>
            </View>
          </View>
        </View>
      </View>

      <View
  ref={offscreenRef}
  collapsable={false}
  style={{
    position: "absolute",
    top: -10000,
    left: -10000,
    width: width,
    height: height,
    backgroundColor: "#F5F5F5",
  }}
>
  <View style={styles.receiptHeader}>
    {serrilhadoUri && <Image source={{ uri: serrilhadoUri }} style={styles.serrilhado} />}
  </View>

  <View style={styles.header}>
    {logoUri && <Image source={{ uri: logoUri }} style={styles.logo} />}
  </View>

  <View style={styles.profileBox}>
    <Image
      source={
        receiptData?.avatar
          ? { uri: receiptData.avatar }
          : driverPlaceholderUri
          ? { uri: driverPlaceholderUri }
          : null
      }
      style={styles.avatar}
    />
    <View style={styles.profileInfo}>
      <Text style={styles.userName}>{receiptData?.user}</Text>
      <Text style={styles.date}>{receiptData?.date || "23/04/2025"}</Text>
      <Text style={styles.time}>
        {receiptData?.startTime || "23:47"}{" "}
        <Ionicons name="timer-outline" size={14} color="#1F284E" />{" "}
        {receiptData?.endTime || "00:15"}
      </Text>
    </View>
  </View>

  {mapUri && <Image source={{ uri: mapUri }} style={styles.map} />}

  {!loading && driverData && (
    <View style={styles.vehicleBox}>
      <Text style={styles.vehicleName}>{driverData.guincho?.modelo || "Atego 1726 – Branco"}</Text>
      <Text style={styles.vehicleDetails}>{driverData.guincho?.marca || "Mercedes-Benz"}</Text>
      <Text style={styles.vehicleDetails}>
        {driverData.guincho?.ano_fabricacao || "2010"} - {driverData.guincho?.comprimento_plataforma || "ABC-1234"}m
      </Text>

      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons
            name={renderPaymentMethod(driverData?.metodo_pagamento).iconName}
            size={40}
            color="#1F284E"
          />
          <Text style={[styles.paymentMethod, { marginLeft: 10 }]}>
            {renderPaymentMethod(driverData?.metodo_pagamento).label}
          </Text>
        </View>
        <Text style={styles.price}>
          R$: <Text style={styles.priceValue}>{driverData?.preco || "247,42"}</Text>
        </Text>
      </View>
    </View>
  )}

  <View style={styles.addressContainer}>
    <View style={styles.addressBox}>
      <View style={styles.startAddressBox}>
        <Text style={styles.cityText}>{receiptData?.startAddress}</Text>
      </View>
      <Ionicons name="arrow-forward-circle-outline" size={35} color="#1F284E" />
      <View style={styles.endAddressBox}>
        <Text style={styles.cityText}>{receiptData?.endAddress}</Text>
      </View>
    </View>
  </View>
</View>

      </>
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
    margin: "auto",
    width: 250,
    height: 50,
    resizeMode: "contain",
  },

  profileBox: {
    top: "-1%",
    left: "2%",
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
    top: "50%",
    maxWidth: "60%",
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
    textDecorationLine: "underline",
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
    alignSelf: "center",
  },

  vehicleBox: {
    top: "-3%",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },

  vehicleName: {
    left: "6%",
    fontSize: 16,
    fontWeight: "700",
    color: "#1F284E",
  },

  vehicleDetails: {
    left: "6%",
    fontSize: 13,
    fontWeight: "700",
    color: "#1F284E",
  },

  paymentBox: {
    top: "-56%",
    left: "10%",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
  },

  paymentMethod: {
    top: "-16%",
    left: "24%",
    flexDirection: "row",
    alignItems: "center",
    fontSize: 17,
    fontWeight: "600",
    color: "#1F284E",
  },

  price: {
    left: "20%",
    top: "-2%",
    fontSize: 21,
    fontWeight: "bold",
    color: "#1F284E",
  },

  priceValue: {
    color: "green",
  },

  addressContainer: {
    top: "-14%",
    width: "85%",
    alignSelf: "center",
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

  serrilhado: {
    left: "-7.5%",
    marginTop: -110,
    width: "220%",
    height: 180,
    alignSelf: "center",
    color: "#ffffffff",
    resizeMode: "cover",
  },

  receiptHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
});
