import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import IncidentDetailsScreen from '../screens/IncidentDetailsScreen';
import LoginScreen from '../screens/LoginScreen';
import BottomTabs from './BottomTabs';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MainTabs" component={BottomTabs} />
        <Stack.Screen name="IncidentDetails" component={IncidentDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}