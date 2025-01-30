import React, { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import {
    View,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import {
    Text,
    Avatar,
    Card,
    Button,
    Portal,
    Modal,
    List,
    Divider,
} from 'react-native-paper';
import { hairdresserService, appointmentService } from '../../services/api';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function HairdresserProfileScreen({ route, navigation }) {
    const { id } = route.params;
    const [hairdresser, setHairdresser] = useState(null);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    useEffect(() => {
        loadHairdresserDetails();
    }, []);

    const loadHairdresserDetails = async () => {
        try {
            const details = await hairdresserService.getHairdresserDetails(id);
            setHairdresser(details);
            setServices(details.services || []);
        } catch (error) {
            console.error('Erro ao carregar detalhes:', error);
            alert('Erro ao carregar detalhes do profissional');
        } finally {
            setLoading(false);
        }
    };

    const handleBooking = async () => {
        try {
            const appointmentData = {
                hairdresser_id: hairdresser.id,
                service_id: selectedService.id,
                appointment_date: date.toISOString().split('T')[0],
                appointment_time: time.toTimeString().split(' ')[0],
            };

            await appointmentService.createAppointment(appointmentData);
            alert('Agendamento realizado com sucesso!');
            handleCloseModal();
            navigation.navigate('Appointments');
        } catch (error) {
            console.error('Erro ao realizar agendamento:', error);
            alert('Erro ao realizar agendamento. Tente novamente.');
        }
    };

    const handleCloseModal = () => {
        setVisible(false);
        setShowDatePicker(false);
        setShowTimePicker(false);
    };

    const onDateChange = (event, selectedDate) => {
        if (event.type === 'dismissed') {
            setShowDatePicker(false);
            return;
        }
        
        if (selectedDate) {
            setDate(selectedDate);
            setShowDatePicker(false);
        }
    };

    const onTimeChange = (event, selectedTime) => {
        if (event.type === 'dismissed') {
            setShowTimePicker(false);
            return;
        }
        
        if (selectedTime) {
            setTime(selectedTime);
            setShowTimePicker(false);
        }
    };

    const openDatePicker = () => {
        setShowTimePicker(false); // Fecha o time picker se estiver aberto
        setShowDatePicker(true);
    };

    const openTimePicker = () => {
        setShowDatePicker(false); // Fecha o date picker se estiver aberto
        setShowTimePicker(true);
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color="#6750A4" />
            </View>
        );
    }

    if (!hairdresser) {
        return (
            <View style={[styles.container, styles.centered]}>
                <Text>Nenhum dado encontrado</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <Avatar.Image
                        size={100}
                        source={require('../../assets/logo.png')}
                    />
                    <Text style={styles.name}>{hairdresser.name}</Text>
                    <Text style={styles.email}>{hairdresser.email}</Text>
                    <Text style={styles.phone}>{hairdresser.phone}</Text>
                </View>

                <Card style={styles.servicesCard}>
                    <Card.Title title="Serviços Disponíveis" />
                    <Card.Content>
                        {services.length > 0 ? (
                            services.map(service => (
                                <React.Fragment key={service.id}>
                                    <List.Item
                                        title={service.name}
                                        description={`${service.duration} min • kzs ${service.price}`}
                                        right={() => (
                                            <Button
                                                mode="contained"
                                                onPress={() => {
                                                    setSelectedService(service);
                                                    setVisible(true);
                                                }}
                                            >
                                                Agendar
                                            </Button>
                                        )}
                                    />
                                    <Divider />
                                </React.Fragment>
                            ))
                        ) : (
                            <Text style={styles.noServices}>Nenhum serviço disponível</Text>
                        )}
                    </Card.Content>
                </Card>

                <Portal>
                    <Modal
                        visible={visible}
                        onDismiss={handleCloseModal}
                        contentContainerStyle={styles.modal}
                    >
                        <Text style={styles.modalTitle}>Agendar Serviço</Text>
                        <Text style={styles.serviceDetails}>
                            {selectedService?.name} - kzs {selectedService?.price}
                        </Text>

                        <Button
                            mode="outlined"
                            onPress={openDatePicker}
                            style={styles.dateButton}
                        >
                            {`Data: ${date.toLocaleDateString()}`}
                        </Button>

                        <Button
                            mode="outlined"
                            onPress={openTimePicker}
                            style={styles.timeButton}
                        >
                            {`Horário: ${time.toLocaleTimeString().slice(0, 5)}`}
                        </Button>

                        {showDatePicker && (
                            <DateTimePicker
                                testID="datePicker"
                                value={date}
                                mode="date"
                                is24Hour={true}
                                display="default"
                                onChange={onDateChange}
                                minimumDate={new Date()}
                            />
                        )}

                        {showTimePicker && (
                            <DateTimePicker
                                testID="timePicker"
                                value={time}
                                mode="time"
                                is24Hour={true}
                                display="default"
                                onChange={onTimeChange}
                            />
                        )}

                        <View style={styles.modalActions}>
                            <Button 
                                onPress={handleCloseModal}
                                style={styles.actionButton}
                            >
                                Cancelar
                            </Button>
                            <Button
                                mode="contained"
                                onPress={handleBooking}
                                style={styles.actionButton}
                            >
                                Confirmar
                            </Button>
                        </View>
                    </Modal>
                </Portal>
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
    header: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'white',
        elevation: 2,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
        color: '#333',
    },
    email: {
        color: '#666',
        fontSize: 16,
        marginTop: 5,
    },
    phone: {
        color: '#666',
        marginTop: 4,
    },
    servicesCard: {
        margin: 16,
        elevation: 4,
        borderRadius: 12,
    },
    noServices: {
        textAlign: 'center',
        color: '#666',
        padding: 20,
    },
    modal: {
        backgroundColor: 'white',
        margin: 20,
        padding: 20,
        borderRadius: 12,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    serviceDetails: {
        marginBottom: 20,
        fontSize: 16,
        color: '#666',
    },
    dateButton: {
        marginBottom: 12,
    },
    timeButton: {
        marginBottom: 20,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
        marginTop: 16,
    },
    actionButton: {
        marginLeft: 8,
    },
});