import React, {useState, useEffect } from 'react'
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  ActivityIndicator
} from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import Button from '../Button';
import { useNavigation } from '@react-navigation/native';
import { getCurrentPositionAsync } from 'expo-location';

// Função para limpar sufixos indesejados dos endereços
function limparEndereco(endereco) {
  if (!endereco) return '';
  return endereco
    .replace(/\s*-\s*SP,\s*Brasil$/i, '')
    .replace(/\s*-\s*Brasil$/i, '')
    .replace(/\s*-\s*SP$/i, '');
}

const GOOGLE_API_KEY = 'AIzaSyBkx6mo29bFuoPzoNSLpE97c8EoWptHl1M'; 

export default function GooglePlaces({userLocation, onConfirm }) {
  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');
  const [sugestoesOrigem, setSugestoesOrigem] = useState([]);
  const [sugestoesDestino, setSugestoesDestino] = useState([]);
  const [origemSelecionada, setOrigemSelecionada] = useState(null);
  const [destinoSelecionada, setDestinoSelecionada] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();

  // --- TODA A SUA LÓGICA ORIGINAL FOI MANTIDA ---
  const buscarSugestoes = async (input, setSugestoes) => {
    if (input.length < 2) {
      setSugestoes([]);
      return;
    }
    try {
      const locationStr = userLocation ? `${userLocation.latitude},${userLocation.longitude}` : '-23.55052,-46.633308';
      const { data } = await axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
        params: { input, key: GOOGLE_API_KEY, language: 'pt-BR', location: locationStr, radius: 10000, types: 'geocode' },
      });
      if (data.status === 'OK') {
        const filtrados = data.predictions.filter((p) => p.description.includes('São Paulo') || p.description.includes('SP') || p.description.includes('Itapecerica'));
        setSugestoes(filtrados);
      } else {
        setSugestoes([]);
      }
    } catch (err) {
      console.error('Erro ao buscar locais:', err.message);
    }
  };

  useEffect(() => {
    if (focusedInput === 'origem') {
      const timer = setTimeout(() => buscarSugestoes(origem, setSugestoesOrigem), 300);
      return () => clearTimeout(timer);
    } else {
      setSugestoesOrigem([]);
    }
  }, [origem, focusedInput]);

  useEffect(() => {
    if (focusedInput === 'destino') {
      const timer = setTimeout(() => buscarSugestoes(destino, setSugestoesDestino), 300);
      return () => clearTimeout(timer);
    } else {
      setSugestoesDestino([]);
    }
  }, [destino, focusedInput]);

  const handleSelecionarOrigem = (item) => {
    setOrigem(limparEndereco(item.description));
    setSugestoesOrigem([]);
    setOrigemSelecionada(item);
    setFocusedInput(null);
    Keyboard.dismiss();
  };

  const handleSelecionarDestino = (item) => {
    setDestino(limparEndereco(item.description));
    setSugestoesDestino([]);
    setDestinoSelecionada(item);
    setFocusedInput(null);
    Keyboard.dismiss();
  };

  const getPlaceDetails = async (placeId) => {
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
        params: { place_id: placeId, key: GOOGLE_API_KEY },
      });
      const location = response.data.result.geometry.location;
      return { latitude: location.lat, longitude: location.lng };
    } catch (error) {
      console.error('Erro ao buscar detalhes:', error);
      return null;
    }
  };

  const confirmationRide = async () => {
    if (!origemSelecionada || !destinoSelecionada) {
        alert("Por favor, selecione uma origem e um destino válidos.");
        return;
    }
    try {
        let origemFinal, destinoFinal;
        setIsLoading(true);
        if (origemSelecionada.lat && origemSelecionada.lng) {
            origemFinal = { lat: origemSelecionada.lat, lng: origemSelecionada.lng, endereco: limparEndereco(origemSelecionada.endereco) };
        } else {
            const coords = await getPlaceDetails(origemSelecionada.place_id);
            if (!coords) throw new Error("Não foi possível obter as coordenadas da origem.");
            origemFinal = { lat: coords.latitude, lng: coords.longitude, endereco: limparEndereco(origemSelecionada.description) };
        }
        const destinoCoords = await getPlaceDetails(destinoSelecionada.place_id);
        if (!destinoCoords) throw new Error("Não foi possível obter as coordenadas do destino.");
        destinoFinal = { lat: destinoCoords.latitude, lng: destinoCoords.longitude, endereco: limparEndereco(destinoSelecionada.description) };

        navigation.navigate('CallConfirmation', { origem: origemFinal, destino: destinoFinal });
    } catch (error) {
        console.error("Erro na confirmação da corrida:", error.message);
        alert("Ocorreu um erro ao confirmar os locais. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  async function handleUseCurrentLocation() {
    setLoadingLocation(true);
    try {
      const position = await getCurrentPositionAsync({});
      const { latitude, longitude } = position.coords;
      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`);
      const endereco = response.data.results[0]?.formatted_address || 'Localização atual';
      setOrigem(limparEndereco(endereco));
      setOrigemSelecionada({ endereco, lat: latitude, lng: longitude, titulo: 'Localização atual' });
    } catch (error) {
      alert('Não foi possível obter sua localização.');
    }
    setLoadingLocation(false);
  }

  const renderSugestoes = (sugestoes, onSelect) => (
    <FlatList
      data={sugestoes}
      keyExtractor={(item) => item.place_id}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.suggestionItem} onPress={() => onSelect(item)}>
          <Ionicons name="location-outline" size={20} color="#555" style={styles.suggestionIcon} />
          <View style={styles.suggestionTextContainer}>
            <Text style={styles.primaryText}>{item.structured_formatting.main_text}</Text>
            <Text style={styles.secondaryText}>{limparEndereco(item.structured_formatting.secondary_text)}</Text>
          </View>
        </TouchableOpacity>
      )}
      keyboardShouldPersistTaps="handled"
    />
  );

  // Condições para decidir se a caixa de sugestões deve ser mostrada
  const showOrigemSuggestions = focusedInput === 'origem' && sugestoesOrigem.length > 0;
  const showDestinoSuggestions = focusedInput === 'destino' && sugestoesDestino.length > 0;

  // Cálculo dinâmico da posição da caixa de sugestões
  const suggestionBoxTopPosition = focusedInput === 'origem' 
    ? 118 // Posição para a lista de origem (abaixo do primeiro input)
    : 184; // Posição para a lista de destino (abaixo do segundo input)

  return (
    <View style={styles.container}>
      {/* SEÇÃO DOS INPUTS */}
      <View style={styles.inputContainer}>
        <View style={styles.lineConnector} />
        <View style={styles.inputRow}>
          <Ionicons name="book-outline" size={22} color="#888" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Local atual..."
            placeholderTextColor="#999"
            value={origem}
            onChangeText={setOrigem}
            onFocus={() => setFocusedInput('origem')}
          />
        </View>
        <View style={{ height: 16 }} />
        <View style={styles.inputRow}>
          <Ionicons name="location-outline" size={22} color="#888" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Onde vamos..."
            placeholderTextColor="#999"
            value={destino}
            onChangeText={setDestino}
            onFocus={() => setFocusedInput('destino')}
          />
        </View>
      </View>

      {/* SEÇÃO DE BOTÕES DE ATALHO */}
      <View style={styles.quickActionsContainer}>
        <TouchableOpacity style={styles.quickActionButton}>
          <Ionicons name="build-outline" size={28} color="#D9534F" />
          <Text style={styles.quickActionText}>Oficina mais{"\n"}próxima</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton}>
          <Ionicons name="car-outline" size={28} color="#555" />
          <Text style={styles.quickActionText}>Borracharia{"\n"}mais próxima</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton}>
          <Ionicons name="flame-outline" size={28} color="#F0AD4E" />
          <Text style={styles.quickActionText}>Posto de{"\n"}combustível</Text>
        </TouchableOpacity>
      </View>

      {/* LISTA DE SUGESTÕES FLUTUANTE COM NOVAS REGRAS */}
      {(showOrigemSuggestions || showDestinoSuggestions) && (
        <View style={[styles.suggestionsBox, { top: suggestionBoxTopPosition }]}>
          {showOrigemSuggestions && renderSugestoes(sugestoesOrigem, handleSelecionarOrigem)}
          {showDestinoSuggestions && renderSugestoes(sugestoesDestino, handleSelecionarDestino)}
        </View>
      )}

      {/* BOTÃO DE CONFIRMAR (OPCIONAL) */}
      {origemSelecionada && destinoSelecionada && (
        <View style={styles.confirmButtonContainer}>
          <Button text={isLoading ? <ActivityIndicator size={'small'} color={'#ffffff'} /> : "Confirmar"} onPress={confirmationRide} />
        </View>
      )}
    </View>
  );
}

// ESTILOS FINAIS E CORRIGIDOS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  inputContainer: {
    position: 'relative',
    zIndex: 10,
  },
  lineConnector: {
    position: 'absolute',
    left: 23,
    top: 25,
    bottom: 25,
    width: 1.5,
    backgroundColor: '#E0E0E0',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  inputIcon: {
    marginHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
    paddingRight: 15,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
  },
  quickActionButton: {
    width: '31%',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  quickActionText: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 12,
    color: '#555',
    fontWeight: '500',
  },
  suggestionsBox: {
    position: 'absolute',
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    elevation: 11,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    maxHeight: 250,
    zIndex: 20,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionIcon: {
    marginRight: 15,
  },
  suggestionTextContainer: {
    flex: 1,
  },
  primaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  secondaryText: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  confirmButtonContainer: {
      position: 'absolute',
      bottom: 30,
      left: 20,
      right: 20,  
      justifyContent: 'center',
      alignItems: 'center',
  }
});