// src/screens/hairdresser/ScheduleScreen.js
import React, { useState } from 'react';
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
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ScheduleScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);

  const appointments = [
    {
      id: 1,
      clientName: 'Maria Silva',
      service: 'Corte Feminino',
      time: '09:00',
      duration: 60,
      price: '8000kzs',
      status: 'confirmed',
    },
    {
      id: 2,
      clientName: 'Ana Oliveira',
      service: 'Tranças',
      time: '11:00',
      duration: 180,
      price: '15000 kzs',
      status: 'pending',
    },
  ];

  const workingHours = [
    { day: 'Segunda', start: '09:00', end: '18:00', active: true },
    { day: 'Terça', start: '09:00', end: '18:00', active: true },
    { day: 'Quarta', start: '09:00', end: '18:00', active: true },
    { day: 'Quinta', start: '09:00', end: '18:00', active: true },
    { day: 'Sexta', start: '09:00', end: '18:00', active: true },
    { day: 'Sábado', start: '09:00', end: '14:00', active: true },
    { day: 'Domingo', start: '09:00', end: '18:00', active: false },
  ];

  // Gera últimos 7 dias e próximos 7 dias
  const generateDates = () => {
    const dates = [];
    for (let i = -7; i <= 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const dates = generateDates();

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

  const renderAppointment = (appointment) => (
    <Card key={appointment.id} style={styles.appointmentCard}>
      <Card.Content>
        <View style={styles.appointmentHeader}>
          <View style={styles.timeContainer}>
            <Icon name="clock-outline" size={20} color="#666" />
            <Text style={styles.timeText}>{appointment.time}</Text>
            <Text style={styles.durationText}>
              ({appointment.duration} min)
            </Text>
          </View>
          <Chip 
            style={[
              styles.statusChip,
              { 
                backgroundColor: appointment.status === 'confirmed' 
                  ? '#4CAF5020' 
                  : '#FFC10720' 
              }
            ]}
            textStyle={{ 
              color: appointment.status === 'confirmed' 
                ? '#4CAF50' 
                : '#FFC107'
            }}
          >
            {appointment.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
          </Chip>
        </View>

        <View style={styles.clientInfo}>
          <Text style={styles.clientName}>{appointment.clientName}</Text>
          <Text style={styles.serviceText}>{appointment.service}</Text>
          <Text style={styles.priceText}>{appointment.price}</Text>
        </View>

        <View style={styles.actionButtons}>
          <Button 
            mode="contained-tonal" 
            icon="phone"
            onPress={() => {}}
            style={styles.actionButton}
          >
            Ligar
          </Button>
          <Button 
            mode="contained-tonal"
            icon="chat"
            onPress={() => {}}
            style={styles.actionButton}
          >
            Chat
          </Button>
          <Button 
            mode="contained"
            icon="check"
            onPress={() => {}}
            style={styles.actionButton}
          >
            Confirmar
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Surface style={styles.calendarContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.dateScroll}
        >
          {dates.map(renderDateButton)}
        </ScrollView>
      </Surface>

      <ScrollView style={styles.content}>
        {/* Time Blocks */}
        <View style={styles.timeBlocks}>
          {appointments.map(renderAppointment)}
        </View>
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
});