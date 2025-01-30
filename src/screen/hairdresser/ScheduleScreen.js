import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  Surface,
  Portal,
  Modal,
  Chip,
  Divider,
  FAB,
  Switch,
  ActivityIndicator,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import api from '../../services/api';

export default function ScheduleScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const workingHours = [
    { day: 'Segunda', start: '09:00', end: '18:00', active: true },
    { day: 'Terça', start: '09:00', end: '18:00', active: true },
    { day: 'Quarta', start: '09:00', end: '18:00', active: true },
    { day: 'Quinta', start: '09:00', end: '18:00', active: true },
    { day: 'Sexta', start: '09:00', end: '18:00', active: true },
    { day: 'Sábado', start: '09:00', end: '14:00', active: true },
    { day: 'Domingo', start: '09:00', end: '18:00', active: false },
  ];

  const generateDates = () => {
    const dates = [];
    for (let i = -7; i <= 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

    const formatDate = (date) => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return {
      day: date.getDate(),
      weekDay: days[date.getDay()],
    };
  };

  const renderDateButton = (date) => {
    const formattedDate = formatDate(date);
    const isSelected = date.toDateString() === selectedDate.toDateString();
    
    return (
      <TouchableOpacity
        key={date.toISOString()}
        onPress={() => setSelectedDate(date)}
        style={[styles.dateButton, isSelected && styles.selectedDate]}
      >
        <Text style={[styles.weekDay, isSelected && styles.selectedText]}>
          {formattedDate.weekDay}
        </Text>
        <Text style={[styles.dateNumber, isSelected && styles.selectedText]}>
          {formattedDate.day}
        </Text>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const userData = await AsyncStorage.getItem('userData');
      const user = JSON.parse(userData);

      if (!user) {
        console.error('Usuário não encontrado');
        return;
      }

      const response = await api.get('/appointments');
      const allAppointments = response.data;

      // Filtrar apenas os agendamentos pendentes do profissional logado
      const hairdresserAppointments = allAppointments
        .filter(appointment => 
          appointment.hairdresser_id === user.id && 
          appointment.status === 'pending'
        )
        .map(appointment => ({
          ...appointment,
          time: new Date(appointment.appointment_time).toLocaleTimeString().slice(0, 5),
        }));

      setAppointments(hairdresserAppointments);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      await api.patch(`/appointments/${appointmentId}/status`, { status });
      alert(`Agendamento ${status === 'confirmed' ? 'confirmado' : 'cancelado'} com sucesso`);
      loadAppointments();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status do agendamento');
    }
  };

  const renderAppointment = (appointment) => (
    <Card key={appointment.id} style={styles.appointmentCard}>
      <Card.Content>
        <View style={styles.appointmentHeader}>
          <View style={styles.timeContainer}>
            <Icon name="clock-outline" size={20} color="#666" />
            <Text style={styles.timeText}>{appointment.time}</Text>
            <Text style={styles.durationText}>
              ({appointment.duration || 60} min)
            </Text>
          </View>
          <Chip 
            style={[styles.statusChip, { backgroundColor: '#FFC10720' }]}
            textStyle={{ color: '#FFC107' }}
          >
            Pendente
          </Chip>
        </View>

        <View style={styles.clientInfo}>
          <Text style={styles.clientName}>{appointment.client_name}</Text>
          <Text style={styles.serviceText}>{appointment.service_name}</Text>
          <Text style={styles.priceText}>kzs {appointment.total_price}</Text>
        </View>

        <View style={styles.actionButtons}>
          <Button 
            mode="contained-tonal"
            icon="close"
            onPress={() => handleUpdateStatus(appointment.id, 'cancelled')}
            style={[styles.actionButton, { backgroundColor: '#ffebee' }]}
            textColor="#d32f2f"
          >
            Cancelar
          </Button>
          <Button 
            mode="contained"
            icon="check"
            onPress={() => handleUpdateStatus(appointment.id, 'confirmed')}
            style={[styles.actionButton, { flex: 2 }]}
          >
            Confirmar
          </Button>
        </View>
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
      <Surface style={styles.calendarContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.dateScroll}
        >
          {generateDates().map(renderDateButton)}
        </ScrollView>
      </Surface>

      <ScrollView style={styles.content}>
        {appointments.length > 0 ? (
          appointments.map(renderAppointment)
        ) : (
          <Text style={styles.noAppointments}>
            Nenhum agendamento pendente
          </Text>
        )}
      </ScrollView>

      <FAB
        icon="clock"
        label="Horários"
        style={styles.fab}
        onPress={() => setShowModal(true)}
      />

      <Portal>
        <Modal
          visible={showModal}
          onDismiss={() => setShowModal(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Text variant="titleLarge" style={styles.modalTitle}>
            Horários de Trabalho
          </Text>
          
          {workingHours.map((day, index) => (
            <View key={day.day}>
              <View style={styles.workingHourRow}>
                <View style={styles.workingHourInfo}>
                  <Text style={styles.dayText}>{day.day}</Text>
                  {day.active && (
                    <Text style={styles.hoursText}>
                      {day.start} - {day.end}
                    </Text>
                  )}
                </View>
                <Switch value={day.active} />
              </View>
              {index < workingHours.length - 1 && <Divider />}
            </View>
          ))}

          <Button 
            mode="contained"
            onPress={() => setShowModal(false)}
            style={styles.modalButton}
          >
            Salvar Horários
          </Button>
        </Modal>
      </Portal>
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
  calendarContainer: {
    backgroundColor: 'white',
    elevation: 4,
  },
  dateScroll: {
    padding: 16,
  },
  dateButton: {
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 4,
    borderRadius: 12,
    width: 60,
  },
  selectedDate: {
    backgroundColor: '#6750A4',
  },
  weekDay: {
    fontSize: 12,
    color: '#666',
  },
  dateNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
    color: '#1a1a1a',
  },
  selectedText: {
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  appointmentCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    marginLeft: 4,
    fontSize: 16,
    fontWeight: '600',
  },
  durationText: {
    marginLeft: 4,
    color: '#666',
  },
  statusChip: {
    borderRadius: 12,
  },
  clientInfo: {
    marginBottom: 12,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  serviceText: {
    color: '#666',
    marginBottom: 4,
  },
  priceText: {
    color: '#6750A4',
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#6750A4',
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: {
    marginBottom: 20,
    fontWeight: 'bold',
  },
  workingHourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  workingHourInfo: {
    flex: 1,
  },
  dayText: {
    fontSize: 16,
    fontWeight: '500',
  },
  hoursText: {
    color: '#666',
    marginTop: 4,
  },
  modalButton: {
    marginTop: 20,
  },
  noAppointments: {
    textAlign: 'center',
    color: '#666',
    marginTop: 32,
    fontSize: 16,
  },
});