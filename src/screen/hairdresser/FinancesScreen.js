// src/screens/hairdresser/FinancesScreen.js
import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  Surface,
  SegmentedButtons,
  List,
  Divider,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LineChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

export default function FinancesScreen() {
  const [timeRange, setTimeRange] = useState('week');
  const [selectedMonth, setSelectedMonth] = useState('Janeiro');

  const financialData = {
    totalEarnings: '2800 kzs',
    completedServices: 25,
    avgTicket: '11400kzs',
    monthlyGoal: {
      current: 2850,
      target: 4000,
    },
  };

  const transactions = [
    {
      id: 1,
      clientName: 'Ana Paula',
      service: 'Corte Feminino',
      date: '28 Jan 2024',
      value: '8000kzs',
      status: 'completed',
      paymentMethod: 'Cartão de Crédito',
    },
    {
      id: 2,
      clientName: 'Carolina Silva',
      service: 'Tranças',
      date: '28 Jan 2024',
      value: '15000 kzs',
      status: 'completed',
      paymentMethod: 'PIX',
    },
    // Adicione mais transações conforme necessário
  ];

  const chartData = {
    labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    datasets: [
      {
        data: [150, 280, 200, 350, 280, 450, 300],
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      {/* Resumo Financeiro */}
      <Surface style={styles.summaryContainer}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Resumo Financeiro
        </Text>
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Card.Content>
              <Text style={styles.statLabel}>Faturamento Total</Text>
              <Text style={styles.statValue}>{financialData.totalEarnings}</Text>
            </Card.Content>
          </Card>
          <Card style={styles.statCard}>
            <Card.Content>
              <Text style={styles.statLabel}>Atendimentos</Text>
              <Text style={styles.statValue}>{financialData.completedServices}</Text>
            </Card.Content>
          </Card>
          <Card style={styles.statCard}>
            <Card.Content>
              <Text style={styles.statLabel}>Ticket Médio</Text>
              <Text style={styles.statValue}>{financialData.avgTicket}</Text>
            </Card.Content>
          </Card>
        </View>
      </Surface>

      {/* Gráfico de Faturamento */}
      <Surface style={styles.chartContainer}>
        <View style={styles.chartHeader}>
          <Text variant="titleMedium">Faturamento</Text>
          <SegmentedButtons
            value={timeRange}
            onValueChange={setTimeRange}
            buttons={[
              { value: 'week', label: 'Semana' },
              { value: 'month', label: 'Mês' },
              { value: 'year', label: 'Ano' },
            ]}
            style={styles.segmentedButtons}
          />
        </View>
        <LineChart
          data={chartData}
          width={width - 32}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(103, 80, 164, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          bezier
          style={styles.chart}
        />
      </Surface>

      {/* Meta Mensal */}
      <Surface style={styles.goalContainer}>
        <Text variant="titleMedium" style={styles.goalTitle}>
          Meta Mensal - {selectedMonth}
        </Text>
        <View style={styles.goalProgress}>
          <View style={styles.goalBar}>
            <View 
              style={[
                styles.goalFill, 
                { width: `${(financialData.monthlyGoal.current / financialData.monthlyGoal.target) * 100}%` }
              ]} 
            />
          </View>
          <View style={styles.goalValues}>
            <Text style={styles.goalCurrent}>
              kzs {financialData.monthlyGoal.current.toFixed(2)}
            </Text>
            <Text style={styles.goalTarget}>
              Meta: kzs {financialData.monthlyGoal.target.toFixed(2)}
            </Text>
          </View>
        </View>
      </Surface>

      {/* Últimas Transações */}
      <Surface style={styles.transactionsContainer}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Últimas Transações
        </Text>
        {transactions.map((transaction, index) => (
          <React.Fragment key={transaction.id}>
            <List.Item
              title={transaction.clientName}
              description={`${transaction.service}\n${transaction.date}`}
              left={props => (
                <View style={styles.transactionIcon}>
                  <Icon 
                    name={transaction.paymentMethod === 'PIX' ? 'qrcode' : 'credit-card'} 
                    size={24} 
                    color="#6750A4" 
                  />
                </View>
              )}
              right={props => (
                <View style={styles.transactionAmount}>
                  <Text style={styles.transactionValue}>{transaction.value}</Text>
                  <Text style={styles.paymentMethod}>{transaction.paymentMethod}</Text>
                </View>
              )}
            />
            {index < transactions.length - 1 && <Divider />}
          </React.Fragment>
        ))}
        <Button
          mode="outlined"
          onPress={() => {}}
          style={styles.viewAllButton}
        >
          Ver Todas as Transações
        </Button>
      </Surface>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  summaryContainer: {
    padding: 16,
    margin: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    elevation: 2,
    borderRadius: 12,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6750A4',
  },
  chartContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  segmentedButtons: {
    scale: 0.8,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  goalContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  goalTitle: {
    marginBottom: 16,
    fontWeight: '600',
  },
  goalProgress: {
    gap: 8,
  },
  goalBar: {
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  goalFill: {
    height: '100%',
    backgroundColor: '#6750A4',
    borderRadius: 6,
  },
  goalValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalCurrent: {
    color: '#6750A4',
    fontWeight: '600',
  },
  goalTarget: {
    color: '#666',
  },
  transactionsContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  transactionIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6750A420',
  },
  transactionAmount: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  transactionValue: {
    fontWeight: '600',
    color: '#6750A4',
  },
  paymentMethod: {
    fontSize: 12,
    color: '#666',
  },
  viewAllButton: {
    marginTop: 16,
    borderColor: '#6750A4',
  },
});