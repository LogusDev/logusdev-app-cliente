import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import ActivityScreen from "./src/screens/ActivityScreen";
import ReceiptScreen from "./src/screens/ReceiptScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Activities" component={ActivityScreen} options={{ title: "Atividades" }} />
        <Stack.Screen name="Receipt" component={ReceiptScreen} options={{ title: "Comprovante" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
