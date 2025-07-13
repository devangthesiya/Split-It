import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Animated,
  SafeAreaView,
} from 'react-native';
import { theme } from '../styles/theme';
import { Group, Balance } from '../types';
import { storage } from '../utils/storage';
import { calculateGroupBalance, getParticipantName, formatCurrency } from '../utils/balanceCalculator';

interface SummaryItem {
  id: string;
  from: string;
  to: string;
  amount: number;
  groupName: string;
}

export const SummaryScreen: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [summaryItems, setSummaryItems] = useState<SummaryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadGroups();
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const loadGroups = async () => {
    try {
      const storedGroups = await storage.getGroups();
      setGroups(storedGroups);
      calculateSummary(storedGroups);
    } catch (error) {
      console.error('Error loading groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSummary = (groupsData: Group[]) => {
    const allBalances: SummaryItem[] = [];

    groupsData.forEach(group => {
      const balances = calculateGroupBalance(group);
      balances.forEach(balance => {
        allBalances.push({
          id: `${group.id}-${balance.from}-${balance.to}`,
          from: getParticipantName(balance.from, group),
          to: getParticipantName(balance.to, group),
          amount: balance.amount,
          groupName: group.name,
        });
      });
    });

    setSummaryItems(allBalances);
  };

  const renderSummaryItem = ({ item }: { item: SummaryItem }) => {
    return (
      <Animated.View
        style={[
          styles.summaryItem,
          {
            opacity: animatedValue,
            transform: [
              {
                translateX: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          },
        ]}>
        <View style={styles.summaryContent}>
          <Text style={styles.summaryText}>
            <Text style={styles.summaryFrom}>{item.from}</Text>
            {' owes '}
            <Text style={styles.summaryTo}>{item.to}</Text>
            {' '}
            <Text style={styles.summaryAmount}>{formatCurrency(item.amount)}</Text>
          </Text>
          <Text style={styles.groupName}>{item.groupName}</Text>
        </View>
      </Animated.View>
    );
  };

  const renderEmptyState = () => (
    <Animated.View
      style={[
        styles.emptyState,
        {
          opacity: animatedValue,
          transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        },
      ]}>
      <Text style={styles.emptyTitle}>No Balances</Text>
      <Text style={styles.emptySubtitle}>
        All expenses are settled up! 🎉
      </Text>
    </Animated.View>
  );

  const getTotalOwed = () => {
    return summaryItems.reduce((total, item) => total + item.amount, 0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Summary</Text>
        <Text style={styles.subtitle}>Your overall expense balances</Text>
      </View>

      {summaryItems.length > 0 && (
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Outstanding</Text>
            <Text style={styles.statValue}>
              {formatCurrency(getTotalOwed())}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Active Groups</Text>
            <Text style={styles.statValue}>
              {groups.length}
            </Text>
          </View>
        </View>
      )}

      <FlatList
        data={summaryItems}
        renderItem={renderSummaryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
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
    paddingHorizontal: theme.spacing.horizontal,
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
  listContainer: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.horizontal,
  },
  summaryItem: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  summaryContent: {
    flex: 1,
  },
  summaryText: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  summaryFrom: {
    color: theme.colors.error,
    fontWeight: 'bold',
  },
  summaryTo: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  summaryAmount: {
    color: theme.colors.warning,
    fontWeight: 'bold',
  },
  groupName: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  emptySubtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
}); 