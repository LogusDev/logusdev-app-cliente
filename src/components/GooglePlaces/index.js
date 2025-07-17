import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import Button from '../Button';
import { useNavigation } from '@react-navigation/native';

const GOOGLE_API_KEY = 'AIzaSyBS5TYszHyw5VyTUU9gUCWYdNqOQ5pt7ik'; // Substitua pela sua key

export default function GooglePlaces({userLocation, onConfirm }) {
  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');
  const [sugestoesOrigem, setSugestoesOrigem] = useState([]);
  const [sugestoesDestino, setSugestoesDestino] = useState([]);
  const [origemSelecionada, setOrigemSelecionada] = useState(null);
  const [destinoSelecionada, setDestinoSelecionada] = useState(null);

  const navigation = useNavigation();


  const buscarSugestoes = async (input, setSugestoes) => {
    if (input.length < 2) {
      setSugestoes([]);
      return;
    }

    try {
      const locationStr = userLocation
        ? `${userLocation.latitude},${userLocation.longitude}`
        : '-23.55052,-46.633308'; // fallback para São Paulo

      const { data } = await axios.get(
        'https://maps.googleapis.com/maps/api/place/autocomplete/json',
        {
          params: {
            input,
            key: GOOGLE_API_KEY,
            language: 'pt-BR',
            location: locationStr,
            radius: 10000,
            types: 'geocode',
          },
        }
      );

      if (data.status === 'OK') {
        const filtrados = data.predictions.filter((p) =>
          p.description.includes('São Paulo') ||
          p.description.includes('SP') ||
          p.description.includes('Itapecerica')
        );
        setSugestoes(filtrados);
      } else {
        setSugestoes([]);
      }
    } catch (err) {
      console.error('Erro ao buscar locais:', err.message);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => buscarSugestoes(origem, setSugestoesOrigem), 300);
    return () => clearTimeout(timer);
  }, [origem]);

  useEffect(() => {
    const timer = setTimeout(() => buscarSugestoes(destino, setSugestoesDestino), 300);
    return () => clearTimeout(timer);
  }, [destino]);

  const renderSugestoes = (sugestoes, onSelect) => (
    <FlatList
      data={sugestoes}
      keyExtractor={(item) => item.place_id}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.suggestionItem} onPress={() => onSelect(item)}>
          <Ionicons name="location-outline" size={20} color="#555" style={styles.icon} />
          <View style={styles.textContainer}>
            <Text style={styles.primaryText}>{item.structured_formatting.main_text}</Text>
            <Text style={styles.secondaryText}>{item.structured_formatting.secondary_text}</Text>
          </View>
        </TouchableOpacity>
      )}
      keyboardShouldPersistTaps="handled"
    />
  );

  const handleSelecionarOrigem = (item) => {
    setOrigem(item.description);
    setSugestoesOrigem([]);
    setOrigemSelecionada(item);
  };

  const handleSelecionarDestino = (item) => {
    setDestino(item.description);
    setSugestoesDestino([]);
    setDestinoSelecionada(item);
  };

  const confirmationRide = () => {
    onConfirm &&
              onConfirm({
                origem: origemSelecionada,
                destino: destinoSelecionada,
              })
  }

  return (
    <View style={styles.container}>
      {/* ORIGEM */}
      <View>
      <TextInput
        style={styles.input}
        placeholder="Local de origem"
        placeholderTextColor="#888"
        value={origem}
        onChangeText={(text) => {
          setOrigem(text);
          setOrigemSelecionada(null);
        }}
      />
      </View>
      {sugestoesOrigem.length > 0 && (
        <View style={styles.suggestionsBox}>
          {renderSugestoes(sugestoesOrigem, handleSelecionarOrigem)}
        </View>
      )}

      {/* DESTINO */}
      <TextInput
        style={[styles.input, { marginTop: 20 }]}
        placeholder="Destino"
        placeholderTextColor="#888"
        value={destino}
        onChangeText={(text) => {
          setDestino(text);
          setDestinoSelecionada(null);
        }}
      />
      {sugestoesDestino.length > 0 && (
        <View style={styles.suggestionsBox}>
          {renderSugestoes(sugestoesDestino, handleSelecionarDestino)}
        </View>
      )}

      {/* BOTÃO DE CONFIRMAR */}
      {origemSelecionada && destinoSelecionada && (
        <View style={{justifyContent:"center",alignItems:"center"}}>
          <Button
          text="Confirmar"
          onPress={confirmationRide}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 30,
    backgroundColor: '#fff',
    flex: 1,
    
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#eaeaea',
    fontSize: 16,
    paddingHorizontal: 15,
    elevation: 3,
    marginTop:50
  },
  suggestionsBox: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginTop: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 5,
    elevation: 4,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  icon: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  primaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  secondaryText: {
    fontSize: 14,
    color: '#777',
    marginTop: 2,
  },
  confirmButton: {
    marginTop: 30,
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
