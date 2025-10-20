import React, { useState, useEffect, useContext } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import PickerSelect from "../../components/PickerSelect";
import axios from "axios";
import Icon from "react-native-vector-icons/Ionicons";
import Button from "../../components/Button";
import styles from "./style";
import { UserContext } from "../../contexts/UserContext";
import { updateVehicle } from "../../services/services";

export default function VehicleEditModal({ visible, onClose, vehicle, onSave }) {
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
    if (vehicle) {
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

  useEffect(() => {
    if (visible) {
      axios
        .get("https://fipe.parallelum.com.br/api/v2/cars/brands/")
        .then((response) => {
          const lista = response.data.map((item) => ({
            label: item.name,
            value: item.code,
          }));
          setMarcas(lista);

          // Se já tiver veículo, ajusta marca pelo code
          if (vehicle) {
            const marcaObj = lista.find(m => m.label === vehicle.marca);
            if (marcaObj) setMarcaSelecionada(marcaObj.value);
          }
        })
        .catch((error) => console.log("Erro ao buscar marcas:", error));
    }
  }, [visible]);

  useEffect(() => {
    if (marcaSelecionada) {
      setModelos([]);
      axios
        .get(`https://fipe.parallelum.com.br/api/v2/cars/brands/${marcaSelecionada}/models`)
        .then((response) => {
          const lista = response.data.map((item) => ({
            label: item.name,
            value: item.code,
          }));
          setModelos(lista);

          if (vehicle) {
            const modeloObj = lista.find(m => m.label === vehicle.modelo);
            if (modeloObj) setModeloSelecionado(modeloObj.value);
          }
        })
        .catch((error) => console.log("Erro ao buscar modelos:", error));
    }
  }, [marcaSelecionada]);

  useEffect(() => {
    if (modeloSelecionado) {
      setAnos([]);
      axios
        .get(
          `https://fipe.parallelum.com.br/api/v2/cars/brands/${marcaSelecionada}/models/${modeloSelecionado}/years`
        )
        .then((response) => {
          const lista = response.data.map((item) => ({
            label: item.name,
            value: item.code,
          }));
          setAnos(lista);

          if (vehicle) {
            const anoObj = lista.find(a => a.label.startsWith(vehicle.ano_fabricacao));
            if (anoObj) setAnoSelecionado(anoObj.value);
          }
        })
        .catch((error) => console.log("Erro ao buscar anos:", error));
    }
  }, [modeloSelecionado]);

  const handleSave = async () => {
    if (!marcaSelecionada || !modeloSelecionado || !anoSelecionado || !categoriaSelecionada || !placaSelecionada || !corSelecionada) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }

    // Converte codes de volta para nomes
    const marcaNome = marcas.find(m => m.value === marcaSelecionada)?.label || marcaSelecionada;
    const modeloNome = modelos.find(m => m.value === modeloSelecionado)?.label || modeloSelecionado;
    const anoNome = anos.find(a => a.value === anoSelecionado)?.label.split("-")[0] || anoSelecionado;
    const anoNumerico = parseInt(anoSelecionado)

    const vehicleData = {
      marca: marcaNome,
      modelo: modeloNome,
      ano_fabricacao: anoNumerico,
      categoria: categoriaSelecionada,
      placa: placaSelecionada,
      cor: corSelecionada,
      cliente_id: user.id,
    };

    try {
      const updatedVehicle = await updateVehicle(vehicle.id, vehicleData, user.token);
      if (onSave) onSave(updatedVehicle);
      onClose();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar o veículo.");
      console.log("Erro ao atualizar veículo:", error);
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <Text style={styles.title}>Editar Veículo</Text>

            <View style={styles.pickerWrapper}>
              <PickerSelect
                placeholder={{ label: "Marca do carro...", value: null }}
                items={marcas}
                value={marcaSelecionada}
                onValueChange={setMarcaSelecionada}
                style={{ inputIOS: styles.textInput, inputAndroid: styles.textInput }}
                useNativeAndroidPickerStyle={false}
              />
            </View>

            <View style={styles.pickerWrapper}>
              <PickerSelect
                placeholder={{ label: "Modelo...", value: null }}
                items={modelos}
                value={modeloSelecionado}
                onValueChange={setModeloSelecionado}
                style={{ inputIOS: styles.textInput, inputAndroid: styles.textInput }}
                useNativeAndroidPickerStyle={false}
              />
            </View>

            <View style={styles.pickerWrapper}>
              <PickerSelect
                placeholder={{ label: "Ano...", value: null }}
                items={anos}
                value={anoSelecionado}
                onValueChange={setAnoSelecionado}
                style={{ inputIOS: styles.textInput, inputAndroid: styles.textInput }}
                useNativeAndroidPickerStyle={false}
              />
            </View>

            <View style={styles.pickerWrapper}>
              <PickerSelect
                placeholder={{ label: "Categoria...", value: null }}
                items={[
                  { label: "Suv", value: "suv" },
                  { label: "Hatch", value: "hatch" },
                  { label: "Sedan", value: "sedan" },
                  { label: "Picape", value: "picape" },
                  { label: "Coupe", value: "coupe" },
                  { label: "MiniVan", value: "minivan" },
                  { label: "Van", value: "van" },
                  { label: "Perua", value: "perua" },
                ]}
                value={categoriaSelecionada}
                onValueChange={setCategoriaSelecionada}
                style={{ inputIOS: styles.textInput, inputAndroid: styles.textInput }}
                useNativeAndroidPickerStyle={false}
              />
            </View>

            <View style={styles.divInputHalf}>
              <View style={[styles.inputHalf, { borderColor: "transparent" }]}>
                <View style={styles.inputWithIcon}>
                  <TextInput
                    style={styles.textInputWithIcon}
                    placeholder="Placa"
                    value={placaSelecionada}
                    onChangeText={(text) => {
                      let formatted = text.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
                      if (formatted.length > 3) formatted = formatted.slice(0, 3) + "-" + formatted.slice(3);
                      if (formatted.length > 8) formatted = formatted.slice(0, 8);
                      setPlacaSelecionada(formatted);
                    }}
                    maxLength={8}
                    autoCapitalize="characters"
                  />
                  <Icon name="pricetag-outline" size={24} color="#b9b9b9ff" style={styles.iconStyleRight} />
                </View>
              </View>

              <View style={[styles.inputHalf, { borderColor: "transparent" }]}>
                <View style={styles.inputWithIcon}>
                  <TextInput
                    style={styles.textInputWithIcon}
                    placeholder="Cor"
                    value={corSelecionada}
                    onChangeText={setCorSelecionada}
                  />
                  <Icon name="color-palette-outline" size={24} color="#b9b9b9ff" style={styles.iconStyleRight} />
                </View>
              </View>
            </View>

            <Button style={styles.button} text="Salvar alterações" onPress={handleSave} />
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}
