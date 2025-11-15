import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Hatch from '../../assets/images/carHatch.svg'
import Sedan from '../../assets/images/carSedan.svg'
import Suv from '../../assets/images/carSuv.svg'

export default function VehicleCard({ vehicle, active, onSelect, onEdit }) {
  const { modelo, ano_fabricacao, marca, placa, categoria, cor } = vehicle || {};

  const carImages = {
    hatch: Hatch,
    sedan: Sedan,
    suv: Suv,
    picape: Suv,
  };

  const normalizedCategory = categoria?.toLowerCase().trim();
  const CarImage = carImages[normalizedCategory] || Hatch;

  const formattedLicensePlate = (placa) => {
    if (!placa) return 'Não informada';
    const clearLicensePlate = placa.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()
    if (clearLicensePlate.length > 3) return clearLicensePlate.slice(0, 3) + "-" + clearLicensePlate.slice(3);
    return clearLicensePlate
  }

  const normalizeString = (str) => {
  if (!str) return "";
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  };  

  const colorMap = {
    vermelho: "#FF3B30",
    azul: "#007AFF",
    verde: "#34C759",
    amarelo: "#FFCC00",
    branco: "#FFFFFF",
    preto: "#000000",
    cinza: "#8E8E93",
    laranja: "#FF9500",
    marrom: "#A52A2A",
  };

  const colorKey = normalizeString(cor);

  console.log(colorKey, colorMap[colorKey]);

  return (
    <TouchableOpacity 
      style={[styles.cardContainer, active && {borderColor: '#EF8108'}]}
      onPress={onSelect}
      activeOpacity={0.8}
    >
      {active && (  
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>Atual</Text>
        </View>
      )}

      <View style={styles.textContainer}>
        <Text style={styles.name}>{(modelo ? modelo.split(' ')[0] : 'Modelo não informado')}</Text>
        <Text style={styles.yearBrand}>{ano_fabricacao} - {marca}</Text>
      </View>
        
      <TouchableOpacity style={styles.editButton} onPress={onEdit}>
        <Ionicons name="create-outline" size={20} color="#1F284E"/>
      </TouchableOpacity>
        
      <CarImage 
        width={115}
        height={120} 
        left={"32%"} 
        top={30} 
        style={{ transform: [{ scaleX: -1 }] }}
      />

      <View style={styles.infoRight}>
        {cor && (
          <View style={styles.colorWrapper}>
            <Text style={styles.colorText}>{cor}</Text>
            
            <View style={[styles.colorBadge, { backgroundColor: colorMap[colorKey] || "#CCC" }]} />
           
          </View>
        )}
        <Text style={styles.class}>Categoria: {categoria ? categoria.charAt(0).toUpperCase() + categoria.slice(1) : ''}</Text>
        <Text style={styles.placa}>Placa: {formattedLicensePlate(placa) || 'Não informada'}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#FFFFFF",
    width: "90%",
    height: 150,
    alignSelf: "center",
    borderRadius: 16,
    borderColor: "#BEBEBE",
    borderStyle: "solid",
    borderWidth: 5,
    marginTop: 30,
    elevation: 4,
    position: "relative",
  },

  editButton: {
    position: "absolute",
    right: "86%",
    top: "60%",
    backgroundColor: "#FFFFFF",
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  textContainer: {
    position: "absolute",
    top: '7%',
    left: '5%',
  },

  infoRight: {
    position: "absolute",
    top: '50%',
    right: '5%',
    alignItems: 'flex-end',
  },

  name: {
    fontSize: 18,
    color: '#1F284E',
    textShadowColor: 'rgba(255, 255, 255, 0.94)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5.8,
    fontWeight: "bold",
    textDecorationLine: 'underline'  
  },

  yearBrand : {
    top: "-10%",
    marginTop: 4,
    fontSize: 13,
    color: "#1F284E",
  },

  class : {
    marginTop: -4,
    fontSize: 13,
    color: "#1F284E",
  },

  placa: {
    fontSize: 13,
    color: '#1F284E',
    textShadowColor: 'rgba(255, 255, 255, 0.94)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5.8,
    fontWeight: "bold",
  },
    
  colorWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 4,
  },

  colorBadge: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ccc",
  },

  colorText: {
    fontSize: 12,
    color: "#454545",
    fontWeight: 'bold',
    textDecorationLine: "underline"
  },

  badgeContainer: {
    position: "absolute",
    top: -10,
    left: '80%',
    width: 90,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#EF8108",
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 12,
    zIndex: 10,
  },

  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontStyle: 'italic',
  },
});
