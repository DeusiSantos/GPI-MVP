// src/screens/client/SearchScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Text, Searchbar, Chip, Card, Avatar, Button } from 'react-native-paper';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Location from 'expo-location';

const { width } = Dimensions.get('window');

export default function SearchScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [location, setLocation] = useState(null);
  const [showList, setShowList] = useState(true);

  const filters = [
    { id: 'all', label: 'Todos' },
    { id: 'cortes', label: 'Cortes' },
    { id: 'trancas', label: 'Tranças' },
    { id: 'quimica', label: 'Química' },
    { id: 'penteados', label: 'Penteados' },
  ];

  const professionals = [
    {
      id: 1,
      name: 'Ana Silva',
      specialty: 'Especialista em Tranças',
      rating: 4.8,
      distance: '1.2km',
      price: 'R$ 50 - R$ 150',
      coordinate: {
        latitude: -23.550520,
        longitude: -46.633308,
      },
    },
    {
      id: 2,
      name: 'João Santos',
      specialty: 'Cortes Masculinos',
      rating: 4.6,
      distance: '0.8km',
      price: 'R$ 30 - R$ 80',
      coordinate: {
        latitude: -23.551520,
        longitude: -46.634308,
      },
    },
    // Adicione mais profissionais aqui
  ];

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permissão de localização necessária');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  const renderProfessionalCard = (professional) => (
    <Card key={professional.id} style={styles.professionalCard}>
      <Card.Content style={styles.cardContent}>
        <Avatar.Image
          size={60}
          source={require('../../assets/logo.png')}
        />
        <View style={styles.professionalInfo}>
          <Text variant="titleMedium" style={styles.professionalName}>
            {professional.name}
          </Text>
          <Text variant="bodyMedium" style={styles.specialtyText}>
            {professional.specialty}
          </Text>
          <View style={styles.detailsRow}>
            <View style={styles.ratingContainer}>
              <Icon name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>{professional.rating}</Text>
            </View>
            <View style={styles.distanceContainer}>
              <Icon name="map-marker" size={16} color="#666" />
              <Text style={styles.distanceText}>{professional.distance}</Text>
            </View>
          </View>
          <Text style={styles.priceText}>{professional.price}</Text>
        </View>
      </Card.Content>
      <Card.Actions style={styles.cardActions}>
        <Button 
          mode="outlined" 
          onPress={() => navigation.navigate('HairdresserProfile', { id: professional.id })}
        >
          Ver Perfil
        </Button>
        <Button 
          mode="contained"
          onPress={() => navigation.navigate('Booking', { id: professional.id })}
        >
          Agendar
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* Search and Filter Section */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Buscar profissionais..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
        >
          {filters.map((filter) => (
            <Chip
              key={filter.id}
              selected={selectedFilter === filter.id}
              onPress={() => setSelectedFilter(filter.id)}
              style={styles.filterChip}
              selectedColor="#6750A4"
            >
              {filter.label}
            </Chip>
          ))}
        </ScrollView>
      </View>

      {/* Map View */}
      {location && (
        <View style={styles.mapContainer}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={location}
          >
            {professionals.map((professional) => (
              <Marker
                key={professional.id}
                coordinate={professional.coordinate}
                title={professional.name}
                description={professional.specialty}
              />
            ))}
          </MapView>
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => setShowList(!showList)}
          >
            <Icon 
              name={showList ? "chevron-down" : "chevron-up"} 
              size={24} 
              color="#6750A4" 
            />
          </TouchableOpacity>
        </View>
      )}

      {/* Professionals List */}
      {showList && (
        <ScrollView style={styles.listContainer}>
          {professionals.map(renderProfessionalCard)}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchBar: {
    elevation: 0,
    backgroundColor: '#f5f5f5',
  },
  filterScroll: {
    marginTop: 12,
  },
  filterChip: {
    marginRight: 8,
    backgroundColor: 'white',
    borderColor: '#6750A4',
  },
  mapContainer: {
    height: 200,
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  toggleButton: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 20,
    elevation: 3,
  },
  listContainer: {
    flex: 1,
    padding: 16,
  },
  professionalCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  professionalInfo: {
    marginLeft: 12,
    flex: 1,
  },
  professionalName: {
    fontWeight: 'bold',
  },
  specialtyText: {
    color: '#666',
    marginTop: 2,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  ratingText: {
    marginLeft: 4,
    fontWeight: '500',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    marginLeft: 4,
    color: '#666',
  },
  priceText: {
    marginTop: 4,
    color: '#6750A4',
    fontWeight: '500',
  },
  cardActions: {
    justifyContent: 'flex-end',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
});