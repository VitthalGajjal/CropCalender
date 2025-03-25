import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import { StyleSheet } from 'react-native'; // Import StyleSheet
import color from '../assets/Color';
const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Crop Header',
            headerStyle: styles.headerStyle,    // Apply header style
            headerTitleStyle: styles.headerTitleStyle, // Apply header title style
          }}
        />
        {/* Add other screens here */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: color.secondary, // Example background color
    // Add more styles as needed (e.g., shadow, border)
  },
  headerTitleStyle: {
    fontWeight: 'bold',       // Example title style
    color: 'white',             // Example text color
    // Add more styles as needed (e.g., fontSize, fontFamily)
  },
});

export default AppNavigator;