import StackNavigator from './src/navigation/stack';
import * as Font from 'expo-font';
import { useFonts } from 'expo-font';

export default function App() {

  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('./src/assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Bold': require('./src/assets/fonts/Poppins-Bold.ttf'),
    'Poppins-SemiBold': require('./src/assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Light': require('./src/assets/fonts/Poppins-Light.ttf'),
  });
  

  if (!fontsLoaded) {
    return null; // ou uma SplashScreen
  }

  return (
  <StackNavigator/>
  )
}