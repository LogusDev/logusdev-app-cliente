import StackNavigator from './src/navigation/stack';
import * as Font from 'expo-font';
import { useFonts } from 'expo-font';
import { LogBox } from 'react-native';
import Toast from 'react-native-toast-message';

LogBox.ignoreAllLogs();

export default function App() {

  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('./src/assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Bold': require('./src/assets/fonts/Poppins-Bold.ttf'),
    'Poppins-SemiBold': require('./src/assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Light': require('./src/assets/fonts/Poppins-Light.ttf'),
  });
  

  if (!fontsLoaded) {
    return null;
  }

  return (
  <>
    <StackNavigator/>
    <Toast/>
  </>
  )
}