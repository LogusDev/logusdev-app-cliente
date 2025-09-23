import { useRoute } from '@react-navigation/native';
import AutocompleteOrigemDestino from '../../components/GooglePlaces';
import { StatusBar } from 'react-native';

export default function OriginDestiny() {
  const route = useRoute();
  const userLocation = route.params?.userLocation; // { latitude, longitude }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <AutocompleteOrigemDestino
        userLocation={userLocation}
        onConfirm={(locais) => {
          console.log('Origem:', locais.origem);
          console.log('Destino:', locais.destino);
        }}
      />
    </>
  );
}