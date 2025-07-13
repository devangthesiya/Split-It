import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { NeonInput } from '../components/NeonInput';
import { NeonButton } from '../components/NeonButton';
import { theme } from '../styles/theme';
import { Group, Expense } from '../types';
import { RootStackParamList } from '../types/navigation';
import { storage } from '../utils/storage';

type AddExpenseScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddExpense'>;
type AddExpenseScreenRouteProp = RouteProp<RootStackParamList, 'AddExpense'>;

export const AddExpenseScreen: React.FC = () => {
  const navigation = useNavigation<AddExpenseScreenNavigationProp>();
  const route = useRoute<AddExpenseScreenRouteProp>();
  const { group } = route.params;

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [splitEqually, setSplitEqually] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleAddExpense = async () => {
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (!paidBy) {
      Alert.alert('Error', 'Please select who paid');
      return;
    }

    setLoading(true);

    try {
      const newExpense: Expense = {
        id: Date.now().toString(),
        groupId: group.id,
        paidBy,
        amount: Number(amount),
        description: description.trim(),
        splitEqually,
        createdAt: new Date(),
      };

      // Add expense to storage
      await storage.addExpense(newExpense);

      // Update group with new expense
      const updatedGroup = {
        ...group,
        expenses: [...group.expenses, newExpense],
      };
      await storage.updateGroup(updatedGroup);

      Alert.alert('Success', 'Expense added successfully', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error('Error adding expense:', error);
      Alert.alert('Error', 'Failed to add expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleParticipantSelect = (participantId: string) => {
    setPaidBy(participantId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, styles.horizontalPad]}>
        <Text style={styles.title}>Add Expense</Text>
        <Text style={styles.subtitle}>Record a new expense for {group.name}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.horizontalPad}>
          <NeonInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="What was this expense for?"
            variant="primary"
          />
        </View>
        <View style={styles.horizontalPad}>
          <NeonInput
            label="Amount"
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            keyboardType="numeric"
            variant="secondary"
          />
        </View>
        <View style={[styles.section, styles.horizontalPad]}>
          <Text style={styles.sectionTitle}>Who Paid?</Text>
          <Text style={styles.sectionSubtitle}>
            Select the person who paid for this expense
          </Text>
          <View style={styles.participantsRow}>
            {group.participants.map((participant) => (
              <TouchableOpacity
                key={participant.id}
                style={[
                  styles.participantButton,
                  paidBy === participant.id && styles.participantButtonSelected,
                ]}
                onPress={() => handleParticipantSelect(participant.id)}>
                <Text
                  style={[
                    styles.participantButtonText,
                    paidBy === participant.id && styles.participantButtonTextSelected,
                  ]}>
                  {participant.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={[styles.section, styles.horizontalPad]}>
          <Text style={styles.sectionTitle}>Split Options</Text>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setSplitEqually(!splitEqually)}>
            <View
              style={[
                styles.checkbox,
                splitEqually && styles.checkboxSelected,
              ]}>
              {splitEqually && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>Split equally among all members</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={[styles.footer, styles.horizontalPad]}>
        <NeonButton
          title="Add Expense"
          onPress={handleAddExpense}
          variant="primary"
          size="large"
          disabled={loading || !description.trim() || !amount || !paidBy}
          style={styles.addButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.horizontal,
  },
  header: {
    marginBottom: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.horizontal,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  participantsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  participantButton: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minWidth: 100,
    alignItems: 'center',
  },
  participantButtonSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  participantButtonText: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '500',
  },
  participantButtonTextSelected: {
    color: theme.colors.background,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 2,
    borderColor: theme.colors.border,
    marginRight: theme.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  checkmark: {
    color: theme.colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 16,
    color: theme.colors.text,
    flex: 1,
  },
  footer: {
    paddingTop: theme.spacing.md,
  },
  addButton: {
    width: '100%',
  },
  horizontalPad: {
    paddingHorizontal: theme.spacing.horizontal,
  },
  participantsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
}); 