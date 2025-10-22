import React, { useState, useEffect } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert} from "react-native";
import Button from "../../components/Button";
import PickerSelect from "../../components/PickerSelect";
import axios from "axios";
import styles from "./style";
import { createVehicle } from "../../services/services";
import Icon from 'react-native-vector-icons/Ionicons';
import { UserContext } from "../../contexts/UserContext";
import { useContext } from "react";


export default function VehicleAddModal({ visible, onClose, vehicle, onSave }) {
  const { user } = useContext(UserContext);
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [anos, setAnos] = useState([]);

  const [marcaSelecionada, setMarcaSelecionada] = useState(null);
  const [modeloSelecionado, setModeloSelecionado] = useState(null);
  const [anoSelecionado, setAnoSelecionado] = useState(null);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [placaSelecionada, setPlacaSelecionada] = useState(null);
  const [corSelecionada, setCorSelecionada] = useState(null);

  useEffect(() => {
    if(vehicle) {
      setMarcaSelecionada(vehicle.marca);
      setModeloSelecionado(vehicle.modelo);
      setAnoSelecionado(vehicle.ano_fabricacao);
      setCategoriaSelecionada(vehicle.categoria);
      setPlacaSelecionada(vehicle.placa);
      setCorSelecionada(vehicle.cor);
    } else {
      setMarcaSelecionada(null);
      setModeloSelecionado(null);
      setAnoSelecionado(null);
      setCategoriaSelecionada(null);
      setPlacaSelecionada(null);
      setCorSelecionada(null);
    }
  }, [vehicle, visible]);

  // Buscar marcas
  useEffect(() => {
    if (visible) {
      axios.get("https://fipe.parallelum.com.br/api/v2/cars/brands/")
        .then((response) => {
          const lista = response.data.map((item) => ({
            label: item.name,
            value: item.code,
          }));
          console.log("Marca selecionada:", marcaSelecionada);
          setMarcas(lista);
        })
        .catch((error) => console.log("Erro ao buscar marcas:", error));
    } 
  }, [visible]);

  // Buscar modelos
  useEffect(() => {
    if (marcaSelecionada) {
      setModelos([]);
      axios.get(`https://fipe.parallelum.com.br/api/v2/cars/brands/${marcaSelecionada}/models`)
        .then((response) => {
          const lista = response.data.map((item) => ({
            label: item.name,
            value: item.code,
          }));
          setModelos(lista);
        })
        .catch((error) => console.log("Erro ao buscar modelos:", error));
    }
  }, [marcaSelecionada]);

  // Buscar anus kk
  useEffect(() => {
    if (modeloSelecionado) {
      setAnos([]);
      axios.get(`https://fipe.parallelum.com.br/api/v2/cars/brands/${marcaSelecionada}/models/${modeloSelecionado}/years`)
        .then((response) => {
          const lista = response.data.map((item) => ({
            label: item.name,
            value: item.code,
          }));
          setAnos(lista);
        })
        .catch((error) => console.log("Erro ao buscar anos:", error));
    }
  }, [modeloSelecionado]);

  const handleSave = async () => {
    if (!marcaSelecionada || !modeloSelecionado || !anoSelecionado || !categoriaSelecionada || !placaSelecionada || !corSelecionada) {
      Alert.alert("Atenção", "Por favor, preencha todos os campos.");
      return;
    }

    const anoFormated = anoSelecionado.split("-")[0];
    const modeloNome = modelos.find(m => m.value == modeloSelecionado)?.label || modeloSelecionado; //Troca Id pelo nome da marca

    const vehicleData = {
      marca: marcaSelecionada,
      modelo: modeloNome,
      ano_fabricacao: anoFormated,
      categoria: categoriaSelecionada,
      placa: placaSelecionada,
      cor: corSelecionada,
      cliente_id: user.id,
    };

    try {
      const savedVehicle = await createVehicle(vehicleData, user.token);
      if (onSave) onSave(savedVehicle);
      onClose();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível adicionar o veículo.");
      console.log("Erro ao adicionar veículo:", error);
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <Text style={styles.title}>{vehicle ? "Editar Veículo" : "Adicionar novo Veículo"}</Text>

            {/* Marcas */}
            <View style={styles.pickerWrapper}>
              <PickerSelect
                placeholder={{ label: "Marca do seu carro...", value: null }}
                items={marcas}
                value={marcaSelecionada}
                onValueChange={setMarcaSelecionada}
                style={{ inputIOS: styles.textInput, inputAndroid: styles.textInput }}
                name={"key-outline"}
                useNativeAndroidPickerStyle={false}
              />
            </View>

            {/* Modelos */}
            <View style={styles.pickerWrapper}>
              <PickerSelect
                placeholder={{ label: "Modelo...", value: null }}
                items={modelos}
                value={modeloSelecionado}
                onValueChange={setModeloSelecionado}
                style={{ inputIOS: styles.textInput, inputAndroid: styles.textInput }}
                name={"car-outline"}
                useNativeAndroidPickerStyle={false}
              />
            </View>

            {/* Anos */}
            <View style={styles.pickerWrapper}>
              <PickerSelect
                placeholder={{ label: "Ano...", value: null }}
                items={anos}
                value={anoSelecionado}
                onValueChange={setAnoSelecionado}
                style={{ inputIOS: styles.textInput, inputAndroid: styles.textInput }}
                name={"calendar-outline"}
                useNativeAndroidPickerStyle={false}
              />
            </View>

            {/* Categoria */}
            <View style={styles.pickerWrapper}>
              <PickerSelect
                placeholder={{ label: "Categoria...", value: null }}
                items={[
                  { label: "Suv", value: "suv" },
                  { label: "Hatch", value: "hatch" },
                  { label: "Sedan", value: "sedan" },
                  { label: "Picape", value: "picape" },
                  { label: "Van", value: "van" },
                  { label: "MiniVan", value: "minivan" },
                  { label: "Coupê", value: "coupe" },
                  { label: "Perua", value: "perua" },
                ]}
                value={categoriaSelecionada}
                onValueChange={setCategoriaSelecionada}
                style={{ inputIOS: styles.textInput, inputAndroid: styles.textInput }}
                name={"car-sport-outline"}
                useNativeAndroidPickerStyle={false}
              />
            </View>

            {/* Placa e Cor */}
            <View style={styles.divInputHalf}>
              {/* Placa */}
              <View style={[styles.inputHalf, {borderColor: 'transparent'}]}>
                <View style={styles.inputWithIcon}>
                  <TextInput
                    style={styles.textInputWithIcon}
                    placeholder="Placa"
                    value={placaSelecionada}
                    onChangeText={(text) => {
                      let formatted = text.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
                      if (formatted.length > 3) {
                        formatted = formatted.slice(0, 3) + "-" + formatted.slice(3);
                      }

                      if (formatted.length > 8) {
                        formatted = formatted.slice(0, 8);
                      }

                      setPlacaSelecionada(formatted);
                    }}
                    maxLength={8}
                    autoCapitalize="characters"
                  />
                  <Icon
                    name="pricetag-outline"
                    size={24}
                    color="#b9b9b9ff"
                    style={styles.iconStyleRight}
                  />
                </View>
              </View>

              {/* Cor */}
              <View style={[styles.inputHalf, {borderColor: 'transparent'}]}>
                <View style={styles.inputWithIcon}>
                  <TextInput
                    style={styles.textInputWithIcon}
                    placeholder="Cor"
                    value={corSelecionada}
                    onChangeText={setCorSelecionada}
                  />
                  <Icon
                    name="color-palette-outline"
                    size={24}
                    color="#b9b9b9ff"
                    style={styles.iconStyleRight}
                  />
                </View>
              </View>
            </View>

            {/* Botões */}
            <Button style={styles.button} text="Salvar" onPress={handleSave} />
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}
