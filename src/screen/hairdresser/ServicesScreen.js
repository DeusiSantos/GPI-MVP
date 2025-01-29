// src/screens/hairdresser/ServicesScreen.js
import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  FAB,
  Card,
  Button,
  Portal,
  Modal,
  TextInput,
  Switch,
  Chip,
  Divider,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ServicesScreen() {
  const [services, setServices] = useState([
    {
      id: 1,
      name: 'Corte Feminino',
      description: 'Corte, finalização e escova',
      price: 80.00,
      duration: 60,
      category: 'Cortes',
      available: true,
    },
    {
      id: 2,
      name: 'Tranças Box Braids',
      description: 'Tranças completas, diversos tamanhos',
      price: 150.00,
      duration: 180,
      category: 'Tranças',
      available: true,
    },
  ]);

  const [visible, setVisible] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    category: '',
    available: true,
  });

  const categories = ['Cortes', 'Tranças', 'Química', 'Penteados', 'Coloração'];

  const showModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setFormData({
        name: service.name,
        description: service.description,
        price: service.price.toString(),
        duration: service.duration.toString(),
        category: service.category,
        available: service.available,
      });
    } else {
      setEditingService(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        duration: '',
        category: '',
        available: true,
      });
    }
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
    setEditingService(null);
  };

  const handleSave = () => {
    const newService = {
      id: editingService ? editingService.id : Date.now(),
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      duration: parseInt(formData.duration),
      category: formData.category,
      available: formData.available,
    };

    if (editingService) {
      setServices(services.map(s => s.id === editingService.id ? newService : s));
    } else {
      setServices([...services, newService]);
    }
    hideModal();
  };

  const renderServiceCard = (service) => (
    <Card key={service.id} style={styles.serviceCard}>
      <Card.Content>
        <View style={styles.serviceHeader}>
          <View>
            <Text variant="titleMedium" style={styles.serviceName}>
              {service.name}
            </Text>
            <Chip 
              style={styles.categoryChip}
              textStyle={{ color: '#6750A4' }}
            >
              {service.category}
            </Chip>
          </View>
          <Switch
            value={service.available}
            onValueChange={(value) => {
              setServices(services.map(s =>
                s.id === service.id ? { ...s, available: value } : s
              ));
            }}
          />
        </View>
        
        <Text style={styles.description}>{service.description}</Text>
        
        <Divider style={styles.divider} />
        
        <View style={styles.serviceDetails}>
          <View style={styles.detailItem}>
            <Icon name="cash" size={20} color="#666" />
            <Text style={styles.detailText}>
            kzs {service.price.toFixed(2)}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="clock-outline" size={20} color="#666" />
            <Text style={styles.detailText}>
              {service.duration} min
            </Text>
          </View>
        </View>

        <View style={styles.cardActions}>
          <Button
            mode="outlined"
            onPress={() => showModal(service)}
            style={styles.editButton}
          >
            Editar
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text variant="titleLarge" style={styles.title}>
            Meus Serviços
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Gerencie seus serviços e preços
          </Text>
        </View>

        {services.map(renderServiceCard)}
      </ScrollView>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modalContent}
        >
          <Text variant="titleLarge" style={styles.modalTitle}>
            {editingService ? 'Editar Serviço' : 'Novo Serviço'}
          </Text>
          
          <TextInput
            label="Nome do Serviço"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            style={styles.input}
          />
          
          <TextInput
            label="Descrição"
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            style={styles.input}
            multiline
          />
          
          <TextInput
            label="Preço (kzs)"
            value={formData.price}
            onChangeText={(text) => setFormData({ ...formData, price: text })}
            style={styles.input}
            keyboardType="numeric"
          />
          
          <TextInput
            label="Duração (minutos)"
            value={formData.duration}
            onChangeText={(text) => setFormData({ ...formData, duration: text })}
            style={styles.input}
            keyboardType="numeric"
          />

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScroll}
          >
            {categories.map((category) => (
              <Chip
                key={category}
                selected={formData.category === category}
                onPress={() => setFormData({ ...formData, category })}
                style={styles.categoryChipSelect}
                selectedColor="#6750A4"
              >
                {category}
              </Chip>
            ))}
          </ScrollView>

          <View style={styles.modalActions}>
            <Button onPress={hideModal} style={styles.modalButton}>
              Cancelar
            </Button>
            <Button 
              mode="contained" 
              onPress={handleSave}
              style={styles.modalButton}
            >
              Salvar
            </Button>
          </View>
        </Modal>
      </Portal>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => showModal()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  title: {
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#666',
    marginTop: 4,
  },
  serviceCard: {
    margin: 16,
    marginTop: 8,
    borderRadius: 12,
    elevation: 2,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  serviceName: {
    fontWeight: '600',
    marginBottom: 4,
  },
  categoryChip: {
    backgroundColor: '#6750A420',
    marginTop: 4,
  },
  description: {
    color: '#666',
    marginBottom: 8,
  },
  divider: {
    marginVertical: 12,
  },
  serviceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    color: '#666',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  editButton: {
    borderColor: '#6750A4',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#6750A4',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 12,
  },
  modalTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 12,
    backgroundColor: 'white',
  },
  categoriesScroll: {
    marginVertical: 12,
  },
  categoryChipSelect: {
    marginRight: 8,
    backgroundColor: 'white',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 16,
  },
  modalButton: {
    minWidth: 100,
  },
});