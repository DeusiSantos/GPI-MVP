// src/screens/auth/LoginScreen.js
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
import { TextInput, Button, Text, Surface } from 'react-native-paper';

const { width } = Dimensions.get('window');

// Usuários de teste
const TEST_USERS = {
    client: {
        email: 'cliente@teste.com',
        password: '123456',
        role: 'client',
        name: 'Maria Cliente'
    },
    hairdresser: {
        email: 'cabeleireiro@teste.com',
        password: '123456',
        role: 'hairdresser',
        name: 'João Cabeleireiro'
    }
};

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [secureTextEntry, setSecureTextEntry] = useState(true);

    // No LoginScreen.js, atualize a função handleLogin:
const handleLogin = async () => {
    setLoading(true);
    try {
      if (!email || !password) {
        alert('Por favor, preencha todos os campos');
        return;
      }
      
      // Simulando verificação de login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verificar credenciais
      const clientUser = TEST_USERS.client;
      const hairdresserUser = TEST_USERS.hairdresser;
  
      if (email === clientUser.email && password === clientUser.password) {
        // Login como cliente
        navigation.replace('ClientTabs');
      } else if (email === hairdresserUser.email && password === hairdresserUser.password) {
        // Login como cabeleireiro
        navigation.replace('HairdresserTabs');
      } else {
        alert('Email ou senha inválidos!\n\nUsuários de teste:\n\nCliente:\nEmail: cliente@teste.com\nSenha: 123456\n\nCabeleireiro:\nEmail: cabeleireiro@teste.com\nSenha: 123456');
      }
      
    } catch (error) {
      alert('Erro ao fazer login');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

    // Função auxiliar para pré-preencher credenciais (desenvolvimento)
    const fillTestCredentials = (userType) => {
        const user = TEST_USERS[userType];
        setEmail(user.email);
        setPassword(user.password);
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
                        Seu app de beleza
                    </Text>
                </View>

                <Surface style={styles.surface}>
                    <View style={styles.header}>
                        <Text variant="headlineMedium" style={styles.title}>
                            Bem-vindo de volta!
                        </Text>
                        <Text variant="bodyMedium" style={styles.subtitle}>
                            Entre para continuar
                        </Text>
                    </View>

                    <TextInput
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        mode="outlined"
                        style={styles.input}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <TextInput
                        label="Senha"
                        value={password}
                        onChangeText={setPassword}
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

                    <TouchableOpacity
                        style={styles.forgotPassword}
                        onPress={() => navigation.navigate('ForgotPassword')}
                    >
                        <Text variant="bodyMedium">Esqueceu sua senha?</Text>
                    </TouchableOpacity>

                    <Button
                        mode="contained"
                        onPress={handleLogin}
                        style={styles.button}
                        loading={loading}
                    >
                        Entrar
                    </Button>

                    {/* Botões de teste - remover em produção */}
                    <View style={styles.testButtons}>
                        <Button
                            mode="outlined"
                            onPress={() => fillTestCredentials('client')}
                            style={styles.testButton}
                        >
                            Testar como Cliente
                        </Button>
                        <Button
                            mode="outlined"
                            onPress={() => fillTestCredentials('hairdresser')}
                            style={styles.testButton}
                        >
                            Testar como Cabeleireiro
                        </Button>
                    </View>

                    <View style={styles.footer}>
                        <Text variant="bodyMedium">Ainda não tem conta? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text variant="bodyMedium" style={styles.footerLink}>
                                Cadastre-se
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
        marginVertical: 40,
    },
    logo: {
        width: width * 0.4,
        height: width * 0.4,
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
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    title: {
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    subtitle: {
        color: '#666',
        marginTop: 5,
    },
    input: {
        marginBottom: 16,
        backgroundColor: 'white',
    },
    forgotPassword: {
        alignItems: 'flex-end',
        marginBottom: 20,
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
    testButtons: {
        marginBottom: 20,
        gap: 8,
    },
    testButton: {
        borderColor: '#6750A4',
    },
    // ... resto dos estilos ...
});