import { StyleSheet } from "react-native";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';

export default function PhotoPicker({ name, onPress, label = "Foto do Rosto" }) {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
            <View style={styles.container}>
                <Ionicons name={name || "person-outline"} size={24} color="#A7A7A7" style={styles.icon} />
                <Text style={styles.texto}>{label}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        width: 320,
        alignSelf: 'center',
        height: 61,
        borderRadius: 12,
        paddingHorizontal: 16,
        marginVertical: 10,
        marginBottom: 15,
        borderColor: '#E0E0E0',
        borderWidth: 1,
    },
    icon: {
        marginRight: 12,
    },
    texto: {
        fontSize: 14,
        color: '#A7A7A7',
        fontWeight: '400',
    }
});
