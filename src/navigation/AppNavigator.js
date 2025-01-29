// src/navigation/AppNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Telas de Auth
import LoginScreen from '../pages/Auth/LoginScreen';
import RegisterScreen from '../pages/Auth/RegisterScreen';

// Telas do Cliente
import HomeScreen from '../screen/client/HomeScreen';
import SearchScreen from '../screen/client/SearchScreen';
import AppointmentsScreen from '../screen/client/AppointmentsScreen';
import ProfileScreen from '../screen/client/ProfileScreen';
import BookingScreen from '../screen/client/BookingScreen';
import HairdresserProfileScreen from '../screen/client/HairdresserProfileScreen';

// Telas do Cabeleireiro
import HairdresserHomeScreen from '../screen/hairdresser/HairdresserHomeScreen';
import ServicesScreen from '../screen/hairdresser/ServicesScreen';
import ScheduleScreen from '../screen/hairdresser/ScheduleScreen';
import FinancesScreen from '../screen/hairdresser/FinancesScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Navigator para Cliente
function ClientTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#6750A4',
        tabBarInactiveTintColor: '#666',
        tabBarLabelStyle: { fontSize: 12, marginBottom: 4 },
        tabBarStyle: { height: 60, paddingBottom: 8 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Buscar"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="magnify" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Agendamentos"
        component={AppointmentsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="account" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Navigator para Cabeleireiro
function HairdresserTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#6750A4',
        tabBarInactiveTintColor: '#666',
        tabBarLabelStyle: { fontSize: 12, marginBottom: 4 },
        tabBarStyle: { height: 60, paddingBottom: 8 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HairdresserHomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Serviços"
        component={ServicesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="content-cut" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Agenda"
        component={ScheduleScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Finanças"
        component={FinancesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="cash" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      {/* Telas de Auth */}
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen}
        options={{ title: 'Cadastro' }}
      />

      {/* Telas do Cliente */}
      <Stack.Screen
        name="ClientTabs"
        component={ClientTabNavigator}
        options={{ headerShown: false }}
      />

      {/* Telas do Cabeleireiro */}
      <Stack.Screen
        name="HairdresserTabs"
        component={HairdresserTabNavigator}
        options={{ headerShown: false }}
      />

      {/* Telas Extras */}
      <Stack.Screen
        name="HairdresserProfile"
        component={HairdresserProfileScreen}
        options={{ title: 'Perfil do Profissional' }}
      />
      <Stack.Screen
        name="Booking"
        component={BookingScreen}
        options={{ title: 'Agendar Serviço' }}
      />
    </Stack.Navigator>
  );
}