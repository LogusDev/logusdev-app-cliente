import { View, Image, Text, StatusBar, ScrollView, Modal, TouchableOpacity } from "react-native";
import styles from "./styles.js";
import { useContext, useState } from 'react';
import { UserContext } from '../../contexts/UserContext.js';
import ProfileCard from "../../components/ProfileCard";
import Options from "../../components/Options/index.js"; 
import { useNavigation } from "@react-navigation/native";  

export default function Profile(){
    const { user } = useContext(UserContext);
    const { logout } = useContext(UserContext);
    const navigation = useNavigation();

    const [logoutModalVisible, setLogoutModalVisible] = useState(false);

    const handleLogout = () => {
        logout();
        navigation.replace("Login");
    }

    return(
        <>
            <View style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor="#FFFFFF" />
                
                <View style={styles.viewTitle}>
                    <Text style={styles.title}>Meu Perfil</Text>
                </View>

                <ProfileCard onPress={() => navigation.navigate('EditProfile')} />

                <Options name={"lock-closed-outline"} text={"Trocar senha"} onPress={() => navigation.navigate("ChangePassword")} />
                <Options name={"people-outline"} text={"Parcerias"} />
                <Options name={"help-circle-outline"} text={"Ajuda"} onPress={() => navigation.navigate("Help")} />
                <Options name={"information-circle-outline"} text={"Sobre nós"} onPress={() => navigation.navigate("About")} />
                <Options name={"log-out-outline"} text={"Sair da conta"} color={'red'} onPress={() => setLogoutModalVisible(true)} />
            </View>

            <Modal
                transparent
                visible={logoutModalVisible}
                animationType="fade"
                onRequestClose={() => setLogoutModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Tem certeza que deseja sair dessa conta?</Text>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setLogoutModalVisible(false)}
                            >
                                <Text style={styles.cancelText}>Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.confirmButton}
                                onPress={handleLogout}
                            >
                                <Text style={styles.confirmText}>Sair</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
}
