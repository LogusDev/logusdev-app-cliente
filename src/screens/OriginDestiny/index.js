import { useRoute } from '@react-navigation/native';
import AutocompleteOrigemDestino from '../../components/GooglePlaces';
import { StatusBar } from 'react-native';

export default function OriginDestiny() {
  const route = useRoute();
  const userLocation = route.params?.userLocation; // { latitude, longitude }
  const destinoLat = route.params?.destinoLat;
  const destinoLng = route.params?.destinoLng;
  const destinoNome = route.params?.destinoNome;
  const destinoEndereco = route.params?.destinoEndereco;

  console.log("Dados recebidos pela tela OriginDestiny:", {
  userLocation,
  destinoLat,
  destinoLng,
  destinoNome,
  destinoEndereco
});


  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <AutocompleteOrigemDestino
        userLocation={userLocation}
        destinoInicial={{
        nome: route.params?.destinoNome,
        endereco: route.params?.destinoEndereco,
        lat: route.params?.destinoLat,
        lng: route.params?.destinoLng,
        
      }}
        onConfirm={(locais) => {
          console.log('Origem:', locais.origem);
          console.log('Destino:', locais.destino);
        }}
      />
    </>
  );
}