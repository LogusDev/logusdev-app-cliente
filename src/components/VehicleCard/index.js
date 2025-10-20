import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Hatch from '../../assets/images/carHatch.svg'
import Sedan from '../../assets/images/carSedan.svg'
import Suv from '../../assets/images/carSuv.svg'

export default function VehicleCard({ vehicle, active, onSelect, onEdit }) {

    const { modelo, ano_fabricacao, marca, placa ,categoria } = vehicle || {};

    console.log(categoria)

    const carImages = {
      hatch: Hatch,
      sedan: Sedan,
      suv: Suv,
      picape: Suv,
    };

    const normalizedCategory = categoria?.toLowerCase().trim();
    const CarImage = carImages[normalizedCategory] || Hatch;

    console.log('Vehicle completo:', vehicle);

    const formattedLicensePlate = (placa ) => {
      if (!placa) return 'Não informada';

      const clearLicensePlate = placa.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()

      if (clearLicensePlate.length > 3) return clearLicensePlate.slice(0, 3) + "-" + clearLicensePlate.slice(3);

      return clearLicensePlate
    }

    return (
        <>
        <TouchableOpacity 
            style={[
                styles.cardContainer,
                active && {borderColor: '#EF8108'}
            ]}
            onPress={onSelect}
            activeOpacity={0.8}
        >

          {active && (  
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>Atual</Text>
            </View>
          )}
            <View style={styles.textContainer}>
                <Text style={styles.name}>{(modelo ? modelo.split(' ').slice(0, 1).join(' ') : 'Modelo não informado')}</Text>
                <Text style={styles.yearBrand}>{ano_fabricacao} - {marca}</Text>
            </View>
            
            <TouchableOpacity style={styles.editButton} onPress={onEdit}>
                <Ionicons name="create-outline" size={20} color="#1F284E"/>
            </TouchableOpacity>
            
            <CarImage width={130} height={120} left={98} top={20}/>
            
            <Text style={styles.color}>{'Vermelho'}</Text>
            
            <View style={styles.textContainer2}>
                <Text style={styles.class}>Categoria: {categoria}</Text>
                <Text style={styles.placa}>Placa: {formattedLicensePlate(placa) || 'Não informada'}</Text>
            </View> 
        </TouchableOpacity>

        </>
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
    // overflow: "hidden",
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

  textContainer2: {
    position: "absolute",
    top: '60%',
    left: "67%",
  },

  name: {
    fontSize: 16,
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
    fontSize: 12,
    color: "#1F284E",
  },

  class : {
    left: "4%",
    marginTop: 4,
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

  carImage: {
    width: "80%",
    height: "60%",
    position: "absolute",
    left: "6%", 
    top: "20%", 
    resizeMode: "contain" 
    },
    
  color: {
    position: "absolute",
    top: "80%",
    left: "42%",
    color: "#454545ff",
    width: "30%",
    height: "20%",
    textDecorationLine: 'underline',
    fontSize: 12, 
    },

  badgeContainer: {
    position: "absolute",
    top: -12,
    left: '80%',
    width: 60,
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