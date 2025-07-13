import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { NeonCard } from '../components/NeonCard';
import { NeonButton } from '../components/NeonButton';
import { theme } from '../styles/theme';
import { Group, Expense } from '../types';
import { RootStackParamList } from '../types/navigation';
import { storage } from '../utils/storage';
import { calculateGroupBalance, getParticipantName, formatCurrency, getTotalExpenses, calculateNetBalances, calculateExactBalances } from '../utils/balanceCalculator';
// Remove import Icon from 'react-native-vector-icons/Feather';

type GroupDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'GroupDetails'>;
type GroupDetailsScreenRouteProp = RouteProp<RootStackParamList, 'GroupDetails'>;

export const GroupDetailsScreen: React.FC = () => {
  const navigation = useNavigation<GroupDetailsScreenNavigationProp>();
  const route = useRoute<GroupDetailsScreenRouteProp>();
  const [group, setGroup] = useState<Group>(route.params.group);
  const [balances, setBalances] = useState<ReturnType<typeof calculateExactBalances>>([]);
  // Remove netBalances state
  const [expanded, setExpanded] = useState<{ [fromId: string]: boolean }>({});

  // Group balances by 'from' person
  const balancesByFrom: { [fromId: string]: { fromName: string; total: number; details: { toName: string; amount: number }[] } } = {};
  balances.forEach(bal => {
    const fromName = getParticipantName(bal.from, group);
    const toName = getParticipantName(bal.to, group);
    if (!balancesByFrom[bal.from]) {
      balancesByFrom[bal.from] = { fromName, total: 0, details: [] };
    }
    balancesByFrom[bal.from].total += bal.amount;
    balancesByFrom[bal.from].details.push({ toName, amount: bal.amount });
  });

  // Refetch group from storage every time screen is focused
  useFocusEffect(
    useCallback(() => {
      const fetchGroup = async () => {
        const groups = await storage.getGroups();
        const updated = groups.find(g => g.id === group.id);
        if (updated) setGroup(updated);
      };
      fetchGroup();
    }, [group.id])
  );

  useEffect(() => {
    setBalances(calculateExactBalances(group));
  }, [group]);

  const calculateBalances = () => {
    const calculatedBalances = calculateGroupBalance(group);
    setBalances(calculatedBalances);
  };

  const handleAddExpense = () => {
    navigation.navigate('AddExpense', { group });
  };

  const handleExpensePress = (expense: Expense) => {
    // For now, just show expense details
    Alert.alert(
      'Expense Details',
      `${getParticipantName(expense.paidBy, group)} paid ${formatCurrency(expense.amount)} for ${expense.description}`,
      [{ text: 'OK' }]
    );
  };

  const renderExpenseItem = ({ item }: { item: Expense }) => {
    const paidBy = getParticipantName(item.paidBy, group);
    const date = new Date(item.createdAt).toLocaleDateString();

    return (
      <NeonCard
        title={item.description}
        subtitle={`${paidBy} • ${date}`}
        onPress={() => handleExpensePress(item)}
        variant="secondary">
        <View style={styles.expenseInfo}>
          <Text style={styles.expenseAmount}>
            {formatCurrency(item.amount)}
          </Text>
          <Text style={styles.expensePaidBy}>
            Paid by {paidBy}
          </Text>
        </View>
      </NeonCard>
    );
  };

  const renderEmptyExpenses = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>No Expenses Yet</Text>
      <Text style={styles.emptySubtitle}>
        Add your first expense to get started
      </Text>
    </View>
  );

  // Restore renderBalanceItem for actionable breakdown
  const renderAccordion = (fromId: string, data: typeof balancesByFrom[string]) => (
    <View key={fromId} style={[styles.accordionContainer, expanded[fromId] && styles.accordionContainerExpanded]}>
      <TouchableOpacity
        onPress={() => setExpanded(prev => ({ ...prev, [fromId]: !prev[fromId] }))}
        activeOpacity={0.8}
        style={[styles.accordionHeader, expanded[fromId] && styles.accordionHeaderExpanded]}
      >
        <Text style={styles.balanceText}>
          <Text style={styles.balanceFrom}>{data.fromName}</Text>
          {` owes `}
          <Text style={styles.balanceAmountNeon}>{formatCurrency(data.total)}</Text>
        </Text>
        <Text style={styles.chevron}>{expanded[fromId] ? '' : ''}</Text>
      </TouchableOpacity>
      {expanded[fromId] && (
        <View style={styles.accordionContentWrap}>
          <View style={styles.accordionContent}>
            {data.details.map((d, idx) => (
              <Text key={idx} style={styles.breakdownText}>
                owes <Text style={styles.balanceTo}>{d.toName}</Text> <Text style={styles.balanceAmountNeon}>{formatCurrency(d.amount)}</Text>
              </Text>
            ))}
          </View>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <View>
          <View style={[styles.header, styles.horizontalPad]}>
            <Text style={styles.title}>{group.name}</Text>
            <Text style={styles.subtitle}>
              {group.participants.length} members • {group.expenses.length} expenses
            </Text>
          </View>
          <View style={[styles.statsContainer, styles.horizontalPad]}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Total Expenses</Text>
              <Text style={styles.statValue}>{formatCurrency(getTotalExpenses(group))}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Per Person</Text>
              <Text style={styles.statValue}>{formatCurrency(getTotalExpenses(group) / group.participants.length)}</Text>
            </View>
          </View>
        </View>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent}>
          {/* Add Expense button as a regular component in scroll area */}
          <View style={[styles.horizontalPad, { marginBottom: theme.spacing.lg }]}> 
            <NeonButton
              title="Add Expense"
              onPress={handleAddExpense}
              variant="primary"
              size="large"
              style={styles.fab}
            />
          </View>
          <View style={[styles.section, styles.horizontalPad]}>
            <Text style={styles.sectionTitle}>Expenses</Text>
            {group.expenses.length === 0 ? (
              renderEmptyExpenses()
            ) : (
              group.expenses.map((item) => renderExpenseItem({ item }))
            )}
          </View>
          <View style={[styles.section, styles.horizontalPad]}>
            <Text style={styles.sectionTitle}>Balances</Text>
            <View style={styles.balancesContainer}>
              {Object.keys(balancesByFrom).length === 0 ? (
                <Text style={styles.emptySubtitle}>All settled up!</Text>
              ) : (
                Object.entries(balancesByFrom).map(([fromId, data]) => renderAccordion(fromId, data))
              )}
            </View>
          </View>
        </ScrollView>
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
  statsContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.lg,
  },
  statItem: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginHorizontal: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  expensesList: {
    maxHeight: 300,
  },
  expenseInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.secondary,
  },
  expensePaidBy: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  balancesContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  // Accordion styles
  accordionContainer: {
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  accordionContainerExpanded: {
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.secondary,
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
  },
  accordionHeaderExpanded: {
    backgroundColor: theme.colors.background,
  },
  chevron: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    marginLeft: 8,
  },
  accordionContentWrap: {
    backgroundColor: theme.colors.background,
    paddingBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  accordionContent: {
    flex: 1,
    paddingTop: theme.spacing.sm,
  },
  breakdownText: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    marginLeft: 2,
  },
  balanceAmountNeon: {
    color: theme.colors.warning,
    fontWeight: 'bold',
    fontSize: 18,
  },
  balanceItem: {
    paddingVertical: theme.spacing.sm,
    // borderWidth: 1,
    // borderBottomColor: theme.colors.border,
  },
  balanceText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  balanceFrom: {
    color: theme.colors.error,
    fontWeight: 'bold',
  },
  balanceTo: {
    color: theme.colors.secondary,
    fontWeight: 'bold',
  },
  balanceAmount: {
    color: theme.colors.warning,
    fontWeight: 'bold',
  },
  emptyState: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  emptySubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  fab: {
    width: '100%',
  },
  horizontalPad: {
    paddingHorizontal: theme.spacing.horizontal,
  },
  scrollContent: {
    flexGrow: 1,
  },
}); 