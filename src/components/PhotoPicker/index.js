import { StyleSheet } from "react-native";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';

export default function PhotoPicker({ name, onPress }) {
    return (
        <View>
            <TouchableOpacity onPress={onPress}>
                <View style={styles.container}>
                    <Ionicons style={{ marginRight: 10 }} name={name} size={24} color="#A7A7A7" />
                    <Text style={styles.texto}>Foto do motorista</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF",
        width: 360,
        height: 61,
        borderRadius: 8,
        paddingHorizontal: 15, 
        marginVertical: 5,
        borderWidth: 1,
        borderColor: "#E0E0E0", 
        marginBottom: 15,
    },
    texto: {
        fontSize: 14,
        color: '#A7A7A7',
    }
});
