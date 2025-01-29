// src/screens/client/HomeScreen.js
import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { Surface, Text, Card, Avatar, Button, Badge } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const services = [
    { id: 1, name: 'Cortes', icon: 'content-cut', color: '#FFB6C1' },
    { id: 2, name: 'Tranças', icon: 'hair-dryer', color: '#ADD8E6' },
    { id: 3, name: 'Química', icon: 'bottle-tonic', color: '#98FB98' },
    { id: 4, name: 'Penteados', icon: 'head', color: '#DDA0DD' },
  ];

  const renderServiceCard = (service) => (
    <TouchableOpacity
      key={service.id}
      onPress={() => navigation.navigate('FindHairdresser', { serviceType: service.name })}
    >
      <Surface style={[styles.serviceCard, { backgroundColor: service.color }]}>
        <View style={styles.serviceIconContainer}>
          <Icon name={service.icon} size={32} color="#FFF" />
        </View>
        <Text style={styles.serviceText}>{service.name}</Text>
      </Surface>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header com Gradiente */}
      <LinearGradient
        colors={['#6750A4', '#8b77b5']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <View>
            <Text variant="titleLarge" style={styles.headerTitle}>Olá, Maria 👋</Text>
            <Text variant="bodyLarge" style={styles.welcomeText}>
              Encontre seu estilo
            </Text>
          </View>
          <View style={styles.headerRight}>
            <Badge style={styles.notificationBadge}>3</Badge>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <Avatar.Image
                size={50}
                source={require('../../assets/logo.png')}
                style={styles.avatar}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <TouchableOpacity 
          style={styles.searchBar}
          onPress={() => navigation.navigate('Search')}
        >
          <Icon name="magnify" size={24} color="#666" />
          <Text style={styles.searchText}>O que você procura hoje?</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Services Grid */}
      <View style={styles.content}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Serviços Populares
        </Text>
        <View style={styles.servicesGrid}>
          {services.map(renderServiceCard)}
        </View>

        {/* Próximo Agendamento */}
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Seu Próximo Agendamento
        </Text>
        <Card style={styles.appointmentCard}>
          <Card.Content>
            <View style={styles.appointmentHeader}>
              <View style={styles.appointmentInfo}>
                <Text variant="titleMedium" style={styles.appointmentTitle}>
                  Corte com Ana Silva
                </Text>
                <View style={styles.appointmentDateContainer}>
                  <Icon name="clock-outline" size={16} color="#666" />
                  <Text variant="bodyMedium" style={styles.dateText}>
                    Hoje, 15:30
                  </Text>
                </View>
              </View>
              <Avatar.Image
                size={50}
                source={require('../../assets/logo.png')}
                style={styles.appointmentAvatar}
              />
            </View>
            <View style={styles.appointmentStatusContainer}>
              <Icon name="map-marker" size={16} color="#666" />
              <Text variant="bodySmall" style={styles.appointmentLocation}>
                Rua das Flores, 123
              </Text>
            </View>
            <View style={styles.appointmentActions}>
              <Button 
                mode="contained-tonal" 
                onPress={() => {}}
                style={[styles.actionButton, styles.detailsButton]}
                icon="information"
              >
                Detalhes
              </Button>
              <Button 
                mode="contained" 
                onPress={() => {}}
                style={[styles.actionButton, styles.chatButton]}
                icon="chat"
              >
                Chat
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Profissionais Populares */}
        <View style={styles.popularSection}>
          <View style={styles.sectionHeader}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Profissionais Populares
            </Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Ver todos</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.popularScrollContent}
          >
            {[1, 2, 3].map((item) => (
              <TouchableOpacity 
                key={item}
                onPress={() => navigation.navigate('HairdresserProfile', { id: item })}
              >
                <Surface style={styles.hairdresserCard}>
                  <Avatar.Image
                    size={80}
                    source={require('../../assets/logo.png')}
                  />
                  <Text style={styles.hairdresserName}>Ana Silva</Text>
                  <View style={styles.ratingContainer}>
                    <Icon name="star" size={16} color="#FFD700" />
                    <Text style={styles.ratingText}>4.8</Text>
                  </View>
                  <Text style={styles.specialtyText}>Especialista em Tranças</Text>
                </Surface>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcomeText: {
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  notificationBadge: {
    position: 'absolute',
    right: -4,
    top: -4,
    zIndex: 1,
  },
  avatar: {
    borderWidth: 2,
    borderColor: 'white',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 20,
    marginTop: 10,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchText: {
    marginLeft: 10,
    color: '#666',
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: 15,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  serviceCard: {
    width: (width - 60) / 2,
    padding: 15,
    marginBottom: 20,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 2,
  },
  serviceIconContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  serviceText: {
    color: 'white',
    fontWeight: '600',
    marginTop: 8,
  },
  appointmentCard: {
    borderRadius: 15,
    marginBottom: 20,
    elevation: 2,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentTitle: {
    fontWeight: '700',
  },
  appointmentDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  dateText: {
    color: '#666',
    marginLeft: 6,
  },
  appointmentStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  appointmentLocation: {
    color: '#666',
    marginLeft: 6,
  },
  appointmentActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 8,
  },
  detailsButton: {
    backgroundColor: '#f0f0f0',
  },
  chatButton: {
    backgroundColor: '#6750A4',
  },
  popularSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  seeAllText: {
    color: '#6750A4',
    fontWeight: '600',
  },
  popularScrollContent: {
    paddingRight: 20,
  },
  hairdresserCard: {
    padding: 16,
    marginRight: 15,
    borderRadius: 15,
    alignItems: 'center',
    backgroundColor: 'white',
    elevation: 2,
    width: 140,
  },
  hairdresserName: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  ratingText: {
    marginLeft: 4,
    fontWeight: '500',
  },
  specialtyText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
});