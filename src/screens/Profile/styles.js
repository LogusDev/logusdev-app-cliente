import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:"center",
        backgroundColor:"#FFFFFF",
    },
    title:{
        alignItems:"flex-start",
        color:"#1F284E",
        fontSize:32,
        fontWeight:200,
        marginRight:"50%",
        marginTop:33,
        fontFamily:"Poppins-SemiBold",
    },

    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },

    modalContent: {
        width: "80%",
        backgroundColor: "#fff",
        padding: 25,
        borderRadius: 20,
        alignItems: "center",
    },

    modalTitle: {
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
        marginBottom: 20,
        color: "#333",
    },

    modalButtons: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        marginTop: 10,
    },

    cancelButton: {
        flex: 1,
        marginRight: 10,
        paddingVertical: 12,
        backgroundColor: "#eee",
        borderRadius: 10,
        alignItems: "center",
    },

    cancelText: {
        color: "#333",
        fontSize: 16,
        fontWeight: "600",
    },

    confirmButton: {
        flex: 1,
        marginLeft: 10,
        paddingVertical: 12,
        backgroundColor: "#e66b00ff",
        borderRadius: 10,
        alignItems: "center",
    },

    confirmText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },

    
})

export default styles;