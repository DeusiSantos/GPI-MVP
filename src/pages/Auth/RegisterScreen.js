// src/screens/auth/RegisterScreen.js
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { TextInput, Button, Text, Surface, Switch } from 'react-native-paper';

const { width } = Dimensions.get('window');

export default function RegisterScreen({ navigation }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    isHairdresser: false,
  });
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const handleRegister = async () => {
    setLoading(true);
    // TODO: Implementar lógica de registro
    setTimeout(() => setLoading(false), 2000);
  };

  const updateFormData = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.welcomeContainer}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text variant="headlineLarge" style={styles.welcomeTitle}>
            Karapinha
          </Text>
          <Text variant="titleMedium" style={styles.welcomeSubtitle}>
            Crie sua conta gratuita
          </Text>
        </View>

        <Surface style={styles.surface}>
          <TextInput
            label="Nome completo"
            value={formData.name}
            onChangeText={(text) => updateFormData('name', text)}
            mode="outlined"
            style={styles.input}
            autoCapitalize="words"
          />

          <TextInput
            label="Email"
            value={formData.email}
            onChangeText={(text) => updateFormData('email', text)}
            mode="outlined"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            label="Telefone"
            value={formData.phone}
            onChangeText={(text) => updateFormData('phone', text)}
            mode="outlined"
            style={styles.input}
            keyboardType="phone-pad"
          />

          <TextInput
            label="Senha"
            value={formData.password}
            onChangeText={(text) => updateFormData('password', text)}
            mode="outlined"
            style={styles.input}
            secureTextEntry={secureTextEntry}
            right={
              <TextInput.Icon
                icon={secureTextEntry ? 'eye-off' : 'eye'}
                onPress={() => setSecureTextEntry(!secureTextEntry)}
              />
            }
          />

          <TextInput
            label="Confirmar Senha"
            value={formData.confirmPassword}
            onChangeText={(text) => updateFormData('confirmPassword', text)}
            mode="outlined"
            style={styles.input}
            secureTextEntry={secureTextEntry}
          />

          <View style={styles.userTypeContainer}>
            <Text variant="bodyMedium">Sou cabeleireiro(a)</Text>
            <Switch
              value={formData.isHairdresser}
              onValueChange={(value) => updateFormData('isHairdresser', value)}
            />
          </View>

          <Button
            mode="contained"
            onPress={handleRegister}
            style={styles.button}
            loading={loading}
          >
            Cadastrar
          </Button>

          <View style={styles.footer}>
            <Text variant="bodyMedium">Já tem uma conta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text variant="bodyMedium" style={styles.footerLink}>
                Entre aqui
              </Text>
            </TouchableOpacity>
          </View>
        </Surface>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  logo: {
    width: width * 0.3,
    height: width * 0.3,
    marginBottom: 16,
  },
  welcomeTitle: {
    color: '#6750A4',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  welcomeSubtitle: {
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  surface: {
    padding: 20,
    borderRadius: 15,
    elevation: 4,
    backgroundColor: 'white',
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  userTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    padding: 4,
    marginBottom: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerLink: {
    color: '#6750A4',
    fontWeight: 'bold',
  },
});