import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Card,
  Avatar,
  Button,
  Chip,
  Divider,
  Surface,
  ActivityIndicator,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import api from '../../services/api';

export default function AppointmentsScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
    const unsubscribe = navigation.addListener('focus', () => {
      loadAppointments();
    });
    return unsubscribe;
  }, [navigation]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const userData = await AsyncStorage.getItem('userData');
      const user = JSON.parse(userData);

      if (!user) {
        console.error('Usuário não encontrado');
        return;
      }

      const response = await api.get(`/appointments`);
      const allAppointments = response.data;

      const userAppointments = allAppointments
        .filter(appointment => appointment.client_id === user.id)
        .map(appointment => ({
          ...appointment,
          date: new Date(appointment.appointment_date).toLocaleDateString(),
          time: new Date(`2000-01-01T${appointment.appointment_time}`).toLocaleTimeString().slice(0, 5),
        }));

      setAppointments(userAppointments);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleCancelAppointment = async (appointmentId) => {
    try {
      await api.patch(`/appointments/${appointmentId}/status`, { status: 'cancelled' });
      alert('Agendamento cancelado com sucesso');
      loadAppointments();
    } catch (error) {
      console.error('Erro ao cancelar agendamento:', error);
      alert('Erro ao cancelar agendamento. Tente novamente.');
    }
  };

  // Mostrar apenas agendamentos pendentes em "Próximos"
  const getUpcomingAppointments = () => {
    return appointments
      .filter(appointment => appointment.status === 'pending')
      .sort((a, b) => new Date(a.appointment_date) - new Date(b.appointment_date));
  };

  // Mostrar todos os agendamentos não pendentes em "Histórico"
  const getPastAppointments = () => {
    return appointments
      .filter(appointment => appointment.status !== 'pending')
      .sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date));
  };

  const renderUpcomingAppointment = (appointment) => (
    <Card key={appointment.id} style={styles.appointmentCard}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={styles.hairdresserInfo}>
            <Avatar.Image source={require('../../assets/logo.png')} size={50} />
            <View style={styles.hairdresserDetails}>
              <Text variant="titleMedium" style={styles.hairdresserName}>
                {appointment.hairdresser_name}
              </Text>
              <Text variant="bodyMedium" style={styles.serviceText}>
                {appointment.service_name}
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
            <Icon name="cash" size={20} color="#666" />
            <Text style={styles.detailText}>kzs {appointment.total_price}</Text>
          </View>
        </View>

        <View style={styles.cardActions}>
          <Button
            mode="contained-tonal"
            onPress={() => handleCancelAppointment(appointment.id)}
            style={[styles.actionButton, { backgroundColor: '#ffebee' }]}
            textColor="#d32f2f"
          >
            Cancelar
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
            <Avatar.Image source={require('../../assets/logo.png')} size={50} />
            <View style={styles.hairdresserDetails}>
              <Text variant="titleMedium" style={styles.hairdresserName}>
                {appointment.hairdresser_name}
              </Text>
              <Text variant="bodyMedium" style={styles.serviceText}>
                {appointment.service_name}
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
            <Icon name="cash" size={20} color="#666" />
            <Text style={styles.detailText}>kzs {appointment.total_price}</Text>
          </View>
        </View>

        {/* Removido o botão "Agendar Novamente" do histórico */}
        <Button
          mode="contained"
          onPress={() => {}}
          style={styles.actionButton}
        >
          Ver Detalhes
        </Button>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#6750A4" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Surface style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text
            style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}
          >
            Próximos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'past' && styles.activeTab]}
          onPress={() => setActiveTab('past')}
        >
          <Text
            style={[styles.tabText, activeTab === 'past' && styles.activeTabText]}
          >
            Histórico
          </Text>
        </TouchableOpacity>
      </Surface>

      <ScrollView style={styles.scrollView}>
        {activeTab === 'upcoming'
          ? getUpcomingAppointments().map(renderUpcomingAppointment)
          : getPastAppointments().map(renderPastAppointment)}
        {appointments.length === 0 && (
          <Text style={styles.noAppointments}>
            Nenhum agendamento encontrado
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
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
  noAppointments: {
    textAlign: 'center',
    color: '#666',
    marginTop: 32,
    fontSize: 16,
  },
});