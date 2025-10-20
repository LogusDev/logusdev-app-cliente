import { View, Text, StatusBar, ScrollView } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import VehicleCard from "../../components/VehicleCard";
import styles from "./styles";
import AddButton from "../../components/AddButton";
import { getVehicles } from "../../services/services";
import { UserContext } from "../../contexts/UserContext";
import VehicleEditModal from "../VehicleEditModal";
import VehicleAddModal from "../VehicleAddModal";

export default function CarSelection() {
  const { user } = useContext(UserContext);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isVehicleEditModalVisible, setVehicleEditModalVisible] = useState(false);
  const [isVehicleAddModalVisible, setVehicleAddModalVisible] = useState(false);
  const [vehicleEdit, setVehicleEdit] = useState(null);

  const fetchVehicles = async () => {
    try {
      const response = await getVehicles(user.id, user.token);
      console.log("Tipo:", typeof response);
      console.log("É array?", Array.isArray(response));
      console.log("Valor:", response);

      let vehiclesArray = [];

      if (Array.isArray(response)) {
        vehiclesArray = response;
      } else if (response && response.data && Array.isArray(response.data)) {
        vehiclesArray = response.data;
      } else if (response && response.vehicles && Array.isArray(response.vehicles)) {
        vehiclesArray = response.vehicles;
      } else if (response && typeof response === "object") {
        vehiclesArray = [response];
      }

      console.log("Veículos final:", vehiclesArray);
      setVehicles(vehiclesArray);
    } catch (error) {
      console.error("Erro ao buscar veículos:", error);
      setVehicles([]);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchVehicles();
    }
  }, [user]);

  const handleSelectedVehicle = (vehicleId) => {
    setSelectedVehicle(vehicleId);
  };

  const handleEditVehicle = (vehicle) => {
    setVehicleEdit(vehicle);
    setVehicleEditModalVisible(true);
  }

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
            <VehicleCard
              vehicle={vehicle}
              active={selectedVehicle === vehicle.id}
              onSelect={() => handleSelectedVehicle(vehicle.id)}
              onEdit={() => handleEditVehicle(vehicle)}
            />
            <View style={styles.separatorLine} />
          </View>
        ))}

        <AddButton onPress={() => setVehicleAddModalVisible(true)} />

        {vehicles.length === 0 && (
          <Text style={styles.noVehicles}>Nenhum veículo cadastrado</Text>
        )}
      </ScrollView>
      <VehicleEditModal
        visible={isVehicleEditModalVisible}
        onClose={() => setVehicleEditModalVisible(false)}
        vehicle={vehicleEdit}
        onSave={(updatedVehicle) => {
          setVehicles((prevVehicles) =>
            prevVehicles.map((v) =>
              v.id === updatedVehicle.id ? updatedVehicle : v
            )
          );
          setVehicleEditModalVisible(false);
        }}
      />

        <VehicleAddModal
            visible={isVehicleAddModalVisible}
            onClose={() => setVehicleAddModalVisible(false)}
            onSave={(newVehicle) => {
                setVehicles((prevVehicles) => [...prevVehicles, newVehicle]);
                setVehicleAddModalVisible(false);
            }}
        />

    </View>
  );
}
