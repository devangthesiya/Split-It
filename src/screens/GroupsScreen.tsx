import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { NeonCard } from '../components/NeonCard';
import { NeonButton } from '../components/NeonButton';
import { theme } from '../styles/theme';
import { Group } from '../types';
import { RootStackParamList } from '../types/navigation';
import { storage } from '../utils/storage';
import { getTotalExpenses, formatCurrency } from '../utils/balanceCalculator';

type GroupsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Groups'>;

export const GroupsScreen: React.FC = () => {
  const navigation = useNavigation<GroupsScreenNavigationProp>();
  const [groups, setGroups] = useState<Group[]>([]);
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
    } catch (error) {
      console.error('Error loading groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = () => {
    navigation.navigate('CreateGroup');
  };

  const handleGroupPress = (group: Group) => {
    navigation.navigate('GroupDetails', { group });
  };

  const renderGroupItem = ({ item }: { item: Group }) => {
    const totalExpenses = getTotalExpenses(item);
    const participantCount = item.participants.length;
    const expenseCount = item.expenses.length;

    return (
      <NeonCard
        title={item.name}
        subtitle={`${participantCount} members • ${expenseCount} expenses`}
        onPress={() => handleGroupPress(item)}
        variant="primary"
        style={{ marginHorizontal: theme.spacing.horizontal / 2 }}
      >
        <View style={styles.groupInfo}>
          <Text style={styles.totalAmount}>
            Total: {formatCurrency(totalExpenses)}
          </Text>
          <Text style={styles.participantCount}>
            {participantCount} {participantCount === 1 ? 'person' : 'people'}
          </Text>
        </View>
      </NeonCard>
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
      <Text style={styles.emptyTitle}>No Groups Yet</Text>
      <Text style={styles.emptySubtitle}>
        Create your first expense group to get started
      </Text>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Groups</Text>
        <Text style={styles.subtitle}>Manage your expense groups</Text>
      </View>

      <FlatList
        data={groups}
        renderItem={renderGroupItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContainer, { paddingHorizontal: theme.spacing.horizontal / 2 }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />

      <View style={styles.fabContainer}>
        <NeonButton
          title="Create Group"
          onPress={handleCreateGroup}
          variant="primary"
          size="large"
          style={styles.fab}
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
  listContainer: {
    flexGrow: 1,
  },
  groupInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  participantCount: {
    fontSize: 14,
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
  fabContainer: {
    position: 'absolute',
    bottom: theme.spacing.lg,
    left: theme.spacing.lg,
    right: theme.spacing.lg,
  },
  fab: {
    width: '100%',
  },
}); 