import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';

import Login from '../screens/Login/';
import Register from '../screens/Register/';
import Register1 from '../screens/Register1/';
import Register2 from '../screens/Register2/';


import bottomTabs from './bottomTabs';
 
import {UserProvider} from '../contexts/UserContext';


const Stack = createNativeStackNavigator();

export default function StackNavigator(){
    return(
        <UserProvider>
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login" screenOptions={{headerShown:false}}>
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Register" component={Register} />
                <Stack.Screen name="Register1" component={Register1} />
                <Stack.Screen name="Register2" component={Register2} />
                <Stack.Screen name="MainHome" component={bottomTabs} />
            </Stack.Navigator>
        </NavigationContainer>
        </UserProvider>
    )
}