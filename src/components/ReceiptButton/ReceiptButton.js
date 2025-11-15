import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ReceiptButton({ onPDFPress, onSharePress, ...props }) {
  return (
    <View style={styles.button}>
      <TouchableOpacity onPress={onPDFPress}>
        <View style={styles.pdfContainer}>
          <Text style={styles.buttonText}>PDF</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={onSharePress}>
        <Ionicons name="share-social-outline" size={35} color="#1F284E" />
      </TouchableOpacity>

      <TouchableOpacity onPress={props.onPress}>
        <Ionicons name="help-circle-outline" size={40} color="#1F284E" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    justifyContent: "space-around", 
    alignItems: "center", 
    position: "absolute",
    top: "15%",
    left: "44%",
    backgroundColor: "#EF8108",
    borderWidth: 3,
    borderColor: "#000000ff",
    width: "50%",
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 10,
  },

  pdfContainer: {
    backgroundColor: "#000",
    width: 35,
    height: 35,
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#EF8108",
    fontSize: 15,
    fontWeight: "900",
  },
});
