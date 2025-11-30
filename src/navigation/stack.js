import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import 'react-native-get-random-values';
import Login from '../screens/Login/';
import Register from '../screens/Register/';
import Register1 from '../screens/Register1/';
import Register2 from '../screens/Register2/';
import Register3 from '../screens/Register3/';
import EditProfile from '../screens/EditProfile';
import OriginDestiny from '../screens/OriginDestiny';
import Splash from '../screens/Splash';
import MyTabs from './bottomTabs';
import {UserProvider} from '../contexts/UserContext';
import CallConfirmation from '../screens/CallConfirmation';
import PaymentConfirmation from '../screens/PaymentConfirmation';
import SearchCall from '../screens/SearchCall';
import SelectDriver from '../screens/SelectDriver';
import WaitingDriverResponse from '../screens/WaitingDriverResponse';
import CallProgress from '../screens/CallProgress';
import CallCompleted from '../screens/CallCompleted';
import ActivityScreen from '../screens/ActivityScreen';
import ReceiptScreen from '../screens/ReceiptScreen';
import CarSelection from '../screens/CarSelection';
import NearbyPlacesMap from '../screens/NearbyPlacesMap';
import Chat from '../screens/Chat';


const Stack = createNativeStackNavigator({
    screens:{
        EditProfile: {
            Screen:EditProfile,
            options:{
                headerBackTitle:'Voltar',
                headerBackTitleStyle:{fontSize:10}
            }
        }
    }
});

export default function StackNavigator(){
    return(
        <UserProvider>
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Splash" screenOptions={{headerShown:false}}>
                <Stack.Screen name="Splash" component={Splash} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Register" component={Register} />
                <Stack.Screen name="Register1" component={Register1} />
                <Stack.Screen name="Register2" component={Register2} />
                <Stack.Screen name="Register3" component={Register3} />
                <Stack.Screen name="MainHome" component={MyTabs} />
                <Stack.Screen name="EditProfile" component={EditProfile} />
                <Stack.Screen name="OriginDestiny" component={OriginDestiny} />
                <Stack.Screen name="CallConfirmation" component={CallConfirmation} />
                <Stack.Screen name="PaymentConfirmation" component={PaymentConfirmation} />
                <Stack.Screen name='SelectDriver' component={SelectDriver} />
                <Stack.Screen name='WaitingDriverResponse' component={WaitingDriverResponse} />
                <Stack.Screen name='SearchCall' component={SearchCall} />
                <Stack.Screen name="CallProgress" component={CallProgress} />
                <Stack.Screen name="CallCompleted" component={CallCompleted} />
                <Stack.Screen name="ActivityScreen" component={ActivityScreen} />
                <Stack.Screen name="ReceiptScreen" component={ReceiptScreen} />
                <Stack.Screen name='CarSelect' component={CarSelection} />
                <Stack.Screen name="NearbyPlaces" component={NearbyPlacesMap} />
                <Stack.Screen name="Chat" component={Chat} />
            </Stack.Navigator>
        </NavigationContainer>
        </UserProvider>
    )
}