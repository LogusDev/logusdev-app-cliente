import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 100, 
        backgroundColor: '#FFFFFF',
        zIndex: 1000, 
        justifyContent: 'flex-end',
        paddingBottom: 10,
        paddingHorizontal: 20,
    },

    title: {
        color: "#1F284E",
        fontSize: 32,
        fontWeight: '200',
        fontFamily: "Poppins-SemiBold",
    },

    scrollView: {
        flex: 1,
        marginTop: 100, 
    },

    scrollContent: {
        paddingTop: 20, 
        paddingBottom: 20, 
    },

    noVehicles: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: '#666',
        fontStyle: 'italic',
    },

    separatorLine: {
        height: 1,
        backgroundColor: '#1F284E',
        marginTop: 30,
        marginVertical: 10,
        opacity: 0.3,
        width: '75%',
        alignSelf: 'center',
    },

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },

    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#1F284E',
        fontFamily: 'Poppins-Regular',
    }
});

export default styles;