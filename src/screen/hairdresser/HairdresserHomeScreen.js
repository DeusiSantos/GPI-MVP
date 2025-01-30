// src/screens/hairdresser/HairdresserHomeScreen.js
import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  Text,
  Card,
  Avatar,
  Button,
  Surface,
  Badge,
  ProgressBar,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

export default function HairdresserHomeScreen({ navigation }) {
  const [statistics] = useState({
    totalAppointments: 25,
    completedToday: 4,
    pendingToday: 3,
    earnings: '6000 kzs',
    rating: 4.8,
  });

  const todayAppointments = [
    {
      id: 1,
      clientName: 'Ana Paula',
      service: 'Corte',
      time: '14:30',
      status: 'pending',
      price: '80000kzs',
    },
    {
      id: 2,
      clientName: 'Carolina Silva',
      service: 'Tranças',
      time: '16:00',    
      status: 'confirmed',
      price: '15000kzs',
    },
  ];

  const renderQuickAction = ({ icon, label, onPress, color = '#6750A4' }) => (
    <TouchableOpacity style={styles.quickAction} onPress={onPress}>
      <Surface style={[styles.quickActionIcon, { backgroundColor: color + '20' }]}>
        <Icon name={icon} size={24} color={color} />
      </Surface>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header Stats */}
      <Surface style={styles.headerStats}>
        <View style={styles.welcomeSection}>
          <View>
            <Text style={styles.welcomeText}>Bem-vindo(a) de volta!</Text>
            <Text style={styles.dateText}>Segunda-feira, 28 Jan</Text>
          </View>
          <Badge size={24} style={styles.notificationBadge}>3</Badge>
        </View>

        <View style={styles.statsGrid}>
          <Surface style={styles.statCard}>
            <Text style={styles.statValue}>{statistics.earnings}</Text>
            <Text style={styles.statLabel}>Hoje</Text>
          </Surface>
          <Surface style={styles.statCard}>
            <Text style={styles.statValue}>{statistics.completedToday}</Text>
            <Text style={styles.statLabel}>Realizados</Text>
          </Surface>
          <Surface style={styles.statCard}>
            <Text style={styles.statValue}>{statistics.pendingToday}</Text>
            <Text style={styles.statLabel}>Pendentes</Text>
          </Surface>
        </View>
      </Surface>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        {renderQuickAction({
          icon: 'calendar-plus',
          label: 'Novo Agendamento',
          onPress: () => navigation.navigate('NewAppointment'),
          color: '#4CAF50',
        })}
        {renderQuickAction({
          icon: 'clock-outline',
          label: 'Horários',
          onPress: () => navigation.navigate('Schedule'),
          color: '#2196F3',
        })}
        {renderQuickAction({
          icon: 'cash',
          label: 'Finanças',
          onPress: () => navigation.navigate('Finances'),
          color: '#FFC107',
        })}
        {renderQuickAction({
          icon: 'cog',
          label: 'Serviços',
          onPress: () => navigation.navigate('Services'),
          color: '#9C27B0',
        })}
      </View>

      {/* Today's Schedule */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Agenda de Hoje</Text>
        <Surface style={styles.scheduleProgress}>
          <Text style={styles.progressText}>
            {statistics.completedToday} de {statistics.completedToday + statistics.pendingToday} agendamentos
          </Text>
          <ProgressBar 
            progress={statistics.completedToday / (statistics.completedToday + statistics.pendingToday)} 
            color="#6750A4"
            style={styles.progressBar}
          />
        </Surface>
        {todayAppointments.map((appointment) => (
          <Card key={appointment.id} style={styles.appointmentCard}>
            <Card.Content>
              <View style={styles.appointmentHeader}>
                <View>
                  <Text variant="titleMedium">{appointment.clientName}</Text>
                  <Text variant="bodyMedium" style={styles.serviceText}>
                    {appointment.service}
                  </Text>
                </View>
                <View style={styles.timeContainer}>
                  <Icon name="clock-outline" size={20} color="#666" />
                  <Text style={styles.timeText}>{appointment.time}</Text>
                </View>
              </View>
              <View style={styles.appointmentFooter}>
                <Text style={styles.priceText}>{appointment.price}</Text>
                <View style={styles.appointmentActions}>
                  <Button
                    mode="contained-tonal"
                    onPress={() => {}}
                    icon="phone"
                    compact
                  >
                    Ligar
                  </Button>
                  <Button
                    mode="contained"
                    onPress={() => {}}
                    icon="check"
                    compact
                  >
                    Confirmar
                  </Button>
                </View>
              </View>
            </Card.Content>
          </Card>
        ))}
      </View>

      {/* Performance Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Desempenho</Text>
        <Surface style={styles.performanceCard}>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingValue}>{statistics.rating}</Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Icon
                  key={star}
                  name="star"
                  size={20}
                  color={star <= statistics.rating ? '#FFD700' : '#e0e0e0'}
                />
              ))}
            </View>
          </View>
          <Text style={styles.ratingText}>Avaliação Média</Text>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('Reviews')}
            style={styles.reviewsButton}
          >
            Ver Avaliações
          </Button>
        </Surface>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerStats: {
    backgroundColor: 'white',
    padding: 20,
    elevation: 2,
  },
  welcomeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  dateText: {
    color: '#666',
    marginTop: 4,
  },
  notificationBadge: {
    backgroundColor: '#6750A4',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: 'white',
    elevation: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6750A4',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 16,
  },
  quickAction: {
    width: (width - 48) / 2,
    alignItems: 'center',
  },
  quickActionIcon: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  quickActionLabel: {
    color: '#666',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  scheduleProgress: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  progressText: {
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  appointmentCard: {
    marginBottom: 12,
    borderRadius: 12,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  serviceText: {
    color: '#666',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    marginLeft: 4,
    color: '#666',
  },
  appointmentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6750A4',
  },
  appointmentActions: {
    flexDirection: 'row',
    gap: 8,
  },
  performanceCard: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  ratingContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6750A4',
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  ratingText: {
    color: '#666',
    marginBottom: 16,
  },
  reviewsButton: {
    width: '100%',
  },
});