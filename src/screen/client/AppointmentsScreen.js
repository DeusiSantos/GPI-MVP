// src/screens/client/AppointmentsScreen.js
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  Text,
  Card,
  Avatar,
  Button,
  Chip,
  Divider,
  Surface,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

export default function AppointmentsScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('upcoming');

  const upcomingAppointments = [
    {
      id: 1,
      hairdresser: 'Ana Silva',
      service: 'Corte',
      date: '28 Jan 2024',
      time: '15:30',
      status: 'confirmed',
      price: 'R$ 80,00',
      location: 'Rua das Flores, 123',
      avatar: require('../../assets/logo.png'),
    },
    {
      id: 2,
      hairdresser: 'João Santos',
      service: 'Tranças',
      date: '30 Jan 2024',
      time: '10:00',
      status: 'pending',
      price: 'R$ 150,00',
      location: 'Av. Principal, 456',
      avatar: require('../../assets/logo.png'),
    },
  ];

  const pastAppointments = [
    {
      id: 3,
      hairdresser: 'Maria Oliveira',
      service: 'Corte e Química',
      date: '20 Jan 2024',
      time: '14:00',
      status: 'completed',
      price: 'R$ 200,00',
      rating: 5,
      avatar: require('../../assets/logo.png'),
    },
    // Adicione mais agendamentos passados aqui
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return '#4CAF50';
      case 'pending':
        return '#FFC107';
      case 'completed':
        return '#2196F3';
      case 'cancelled':
        return '#F44336';
      default:
        return '#666';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmado';
      case 'pending':
        return 'Pendente';
      case 'completed':
        return 'Concluído';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const renderUpcomingAppointment = (appointment) => (
    <Card key={appointment.id} style={styles.appointmentCard}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={styles.hairdresserInfo}>
            <Avatar.Image source={appointment.avatar} size={50} />
            <View style={styles.hairdresserDetails}>
              <Text variant="titleMedium" style={styles.hairdresserName}>
                {appointment.hairdresser}
              </Text>
              <Text variant="bodyMedium" style={styles.serviceText}>
                {appointment.service}
              </Text>
            </View>
          </View>
          <Chip
            style={[
              styles.statusChip,
              { backgroundColor: getStatusColor(appointment.status) + '20' },
            ]}
            textStyle={{ color: getStatusColor(appointment.status) }}
          >
            {getStatusText(appointment.status)}
          </Chip>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.appointmentDetails}>
          <View style={styles.detailRow}>
            <Icon name="calendar" size={20} color="#666" />
            <Text style={styles.detailText}>{appointment.date}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="clock-outline" size={20} color="#666" />
            <Text style={styles.detailText}>{appointment.time}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="map-marker" size={20} color="#666" />
            <Text style={styles.detailText}>{appointment.location}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="cash" size={20} color="#666" />
            <Text style={styles.detailText}>{appointment.price}</Text>
          </View>
        </View>

        <View style={styles.cardActions}>
          <Button
            mode="contained-tonal"
            onPress={() => {}}
            style={styles.actionButton}
            icon="chat"
          >
            Chat
          </Button>
          <Button
            mode="contained"
            onPress={() => {}}
            style={styles.actionButton}
          >
            Ver Detalhes
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  const renderPastAppointment = (appointment) => (
    <Card key={appointment.id} style={styles.appointmentCard}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={styles.hairdresserInfo}>
            <Avatar.Image source={appointment.avatar} size={50} />
            <View style={styles.hairdresserDetails}>
              <Text variant="titleMedium" style={styles.hairdresserName}>
                {appointment.hairdresser}
              </Text>
              <Text variant="bodyMedium" style={styles.serviceText}>
                {appointment.service}
              </Text>
            </View>
          </View>
          <View style={styles.ratingContainer}>
            {[...Array(5)].map((_, index) => (
              <Icon
                key={index}
                name="star"
                size={16}
                color={index < appointment.rating ? '#FFD700' : '#e0e0e0'}
              />
            ))}
          </View>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.appointmentDetails}>
          <View style={styles.detailRow}>
            <Icon name="calendar" size={20} color="#666" />
            <Text style={styles.detailText}>{appointment.date}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="clock-outline" size={20} color="#666" />
            <Text style={styles.detailText}>{appointment.time}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="cash" size={20} color="#666" />
            <Text style={styles.detailText}>{appointment.price}</Text>
          </View>
        </View>

        <Button
          mode="contained-tonal"
          onPress={() => {}}
          style={styles.rebookButton}
        >
          Agendar Novamente
        </Button>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <Surface style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'upcoming' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'upcoming' && styles.activeTabText,
            ]}
          >
            Próximos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'past' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('past')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'past' && styles.activeTabText,
            ]}
          >
            Histórico
          </Text>
        </TouchableOpacity>
      </Surface>

      {/* Appointments List */}
      <ScrollView style={styles.scrollView}>
        {activeTab === 'upcoming'
          ? upcomingAppointments.map(renderUpcomingAppointment)
          : pastAppointments.map(renderPastAppointment)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
    backgroundColor: 'white',
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#6750A4',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#6750A4',
    fontWeight: '600',
  },
  scrollView: {
    padding: 16,
  },
  appointmentCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hairdresserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hairdresserDetails: {
    marginLeft: 12,
  },
  hairdresserName: {
    fontWeight: '600',
  },
  serviceText: {
    color: '#666',
  },
  statusChip: {
    borderRadius: 16,
  },
  divider: {
    marginVertical: 16,
  },
  appointmentDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    color: '#666',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 16,
  },
  actionButton: {
    borderRadius: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  rebookButton: {
    marginTop: 16,
    borderRadius: 8,
  },
});