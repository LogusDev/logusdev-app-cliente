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
import Button from "../../components/Button";
import PickerSelect from "../../components/PickerSelect";
import axios from "axios";
import styles from "./style";
import Icon from 'react-native-vector-icons/Ionicons';
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
  const [placaSelecionada, setPlacaSelecionada] = useState("");
  const [corSelecionada, setCorSelecionada] = useState("");

  // Inicializa valores do veículo ao abrir modal
    useEffect(() => {
    if (vehicle) {
        setMarcaSelecionada(vehicle.marca_codigo || null);
        setModeloSelecionado(vehicle.modelo_codigo || null);
        setAnoSelecionado(vehicle.ano_fabricacao?.toString() || null);
        setCategoriaSelecionada(vehicle.categoria || null);
        setPlacaSelecionada(vehicle.placa || "");
        setCorSelecionada(vehicle.cor || "");
    }
    }, [vehicle, visible]);


    useEffect(() => {
    if (vehicle?.marca && marcas.length > 0) {
        const marcaObj = marcas.find(m => m.label === vehicle.marca);
        if (marcaObj) {
        setMarcaSelecionada(marcaObj.value);
        }
    }
    }, [marcas, vehicle]);


  // Buscar marcas
  useEffect(() => {
    axios.get("https://fipe.parallelum.com.br/api/v2/cars/brands/")
      .then((response) => {
        const lista = response.data.map((item) => ({
          label: item.name,
          value: item.code,
        }));
        setMarcas(lista);
      })
      .catch(err => console.log("Erro ao buscar marcas:", err));
    }, [vehicle]);

  // Buscar modelos quando marca muda
  useEffect(() => {
    if(!marcaSelecionada) return;

    console.log(`Buscando modelos da ${marcaSelecionada}`)

    axios.get(`https://fipe.parallelum.com.br/api/v2/cars/brands/${marcaSelecionada}/models`)
      .then(res => {
        const lista = res.data.map(item => ({
          label: item.name,
          value: item.code
        }));
        setModelos(lista);

        if(vehicle) {
          const modeloObj = lista.find(m => m.label === vehicle.modelo);
          if(modeloObj) setModeloSelecionado(modeloObj.value);
        }
      })
      .catch(err => console.log("Erro ao buscar modelos:", err));
  }, [marcaSelecionada]);

  // Buscar anos quando modelo muda
  useEffect(() => {
    if(!marcaSelecionada || !modeloSelecionado) return;

    console.log(`Buscando o ano com: ${marcaSelecionada}, ${modeloSelecionado}`)
    axios.get(`https://fipe.parallelum.com.br/api/v2/cars/brands/${marcaSelecionada}/models/${modeloSelecionado}/years`)
      .then(res => {
        const lista = res.data.map(item => ({
          label: item.name,
          value: item.code
        }));
        setAnos(lista);

        if(vehicle) {
          const anoObj = lista.find(a => a.label.startsWith(vehicle.ano_fabricacao?.toString()));
          if(anoObj) setAnoSelecionado(anoObj.value);
        }
      })
      .catch(err => console.log("Erro ao buscar anos:", err));
  }, [marcaSelecionada, modeloSelecionado]);

  const handleSave = async () => {
    if(!marcaSelecionada || !modeloSelecionado || !anoSelecionado || !categoriaSelecionada || !placaSelecionada || !corSelecionada) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }

    const marcaNome = marcas.find(m => m.value === marcaSelecionada)?.label || marcaSelecionada;
    const modeloNome = modelos.find(m => m.value === modeloSelecionado)?.label || modeloSelecionado;
    const anoNome = anos.find(a => a.value === anoSelecionado)?.label.split("-")[0] || anoSelecionado;

    const vehicleData = {
      marca: marcaNome,
      modelo: modeloNome,
      ano_fabricacao: parseInt(anoNome),
      categoria: categoriaSelecionada,
      placa: placaSelecionada,
      cor: corSelecionada,
      cliente_id: user.id,
    };

    try {
      const updatedVehicle = await updateVehicle(vehicle.id, vehicleData, user.token);
      if(onSave) onSave({
        ...vehicle,
        ...vehicleData,
        id: updatedVehicle?.id || vehicle.id
    });
      onClose();
    } catch(err) {
      Alert.alert("Erro", "Não foi possível atualizar o veículo.");
      console.log("Erro ao atualizar veículo:", err);
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <KeyboardAvoidingView behavior={Platform.OS==="ios"?"padding":"height"} style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <Text style={styles.title}>Editar Veículo</Text>

            {/* Marcas */}
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

            {/* Modelos */}
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

            {/* Anos */}
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
                      if(formatted.length>3) formatted = formatted.slice(0,3)+"-"+ formatted.slice(3);
                      if(formatted.length>8) formatted = formatted.slice(0,8);
                      setPlacaSelecionada(formatted);
                    }}
                    maxLength={8}
                    autoCapitalize="characters"
                  />
                  <Icon name="pricetag-outline" size={24} color="#b9b9b9ff" style={styles.iconStyleRight} />
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
                  <Icon name="color-palette-outline" size={24} color="#b9b9b9ff" style={styles.iconStyleRight} />
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
