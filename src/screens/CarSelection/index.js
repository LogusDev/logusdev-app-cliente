import { View, Text, StatusBar, ScrollView, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import VehicleCard from "../../components/VehicleCard";
import styles from "./styles";
import AddButton from "../../components/AddButton";
import { useContext, useEffect } from "react";
import { getVehicles } from '../../services/services';
import { UserContext } from "../../contexts/UserContext";

export default function CarSelection() {
    const { user } = useContext(UserContext);
    const [vehicles, setVehicles] = useState([]);

    const fetchVehicles = async () => {
        try {
            const response = await getVehicles(user.id);
            console.log('Tipo:', typeof response);
            console.log('É array?', Array.isArray(response));
            console.log('Valor:', response);
            
            let vehiclesArray = [];
            
            if (Array.isArray(response)) {
                vehiclesArray = response;
            } 
            else if (response && response.data && Array.isArray(response.data)) {
                vehiclesArray = response.data;
            }
            else if (response && response.vehicles && Array.isArray(response.vehicles)) {
                vehiclesArray = response.vehicles;
            }
            else if (response && typeof response === 'object') {
                vehiclesArray = [response];
            }
            
            console.log('Veículos final:', vehiclesArray);
            setVehicles(vehiclesArray);
            
        } catch (error) {
            console.error('Erro ao buscar veículos:', error);
            setVehicles([]);
        }
    };

    useEffect(() => {
        if (user?.id) {
            fetchVehicles();
        }
    }, [user]);

     return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#FFFFFF" />
            

            <View style={styles.header}>
                <Text style={styles.title}>Veículos ({vehicles.length})</Text>
            </View>


            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {vehicles.map((vehicle, index) => (
                    <View key={vehicle.id || index}>
                        <VehicleCard vehicle={vehicle} active={index === 0} />
                        <View style={styles.separatorLine} />
                    </View>
                ))}

                

                <AddButton/>

                {vehicles.length === 0 && (
                    <Text style={styles.noVehicles}>Nenhum veículo cadastrado</Text>
                )}
            </ScrollView>
        </View>
    );
}