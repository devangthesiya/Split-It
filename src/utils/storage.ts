import AsyncStorage from '@react-native-async-storage/async-storage';
import { Group, Expense, AppState } from '../types';

const STORAGE_KEYS = {
  GROUPS: 'split_it_groups',
  EXPENSES: 'split_it_expenses',
  APP_STATE: 'split_it_app_state',
};

export const storage = {
  // Groups
  async getGroups(): Promise<Group[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.GROUPS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting groups:', error);
      return [];
    }
  },

  async saveGroups(groups: Group[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(groups));
    } catch (error) {
      console.error('Error saving groups:', error);
    }
  },

  async addGroup(group: Group): Promise<void> {
    const groups = await this.getGroups();
    groups.push(group);
    await this.saveGroups(groups);
  },

  async updateGroup(updatedGroup: Group): Promise<void> {
    const groups = await this.getGroups();
    const index = groups.findIndex(g => g.id === updatedGroup.id);
    if (index !== -1) {
      groups[index] = updatedGroup;
      await this.saveGroups(groups);
    }
  },

  async deleteGroup(groupId: string): Promise<void> {
    const groups = await this.getGroups();
    const filteredGroups = groups.filter(g => g.id !== groupId);
    await this.saveGroups(filteredGroups);
  },

  // Expenses
  async getExpenses(): Promise<Expense[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.EXPENSES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting expenses:', error);
      return [];
    }
  },

  async saveExpenses(expenses: Expense[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    } catch (error) {
      console.error('Error saving expenses:', error);
    }
  },

  async addExpense(expense: Expense): Promise<void> {
    const expenses = await this.getExpenses();
    expenses.push(expense);
    await this.saveExpenses(expenses);
  },

  async updateExpense(updatedExpense: Expense): Promise<void> {
    const expenses = await this.getExpenses();
    const index = expenses.findIndex(e => e.id === updatedExpense.id);
    if (index !== -1) {
      expenses[index] = updatedExpense;
      await this.saveExpenses(expenses);
    }
  },

  async deleteExpense(expenseId: string): Promise<void> {
    const expenses = await this.getExpenses();
    const filteredExpenses = expenses.filter(e => e.id !== expenseId);
    await this.saveExpenses(filteredExpenses);
  },

  // App State
  async getAppState(): Promise<AppState> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.APP_STATE);
      return data ? JSON.parse(data) : { groups: [], currentUser: 'You' };
    } catch (error) {
      console.error('Error getting app state:', error);
      return { groups: [], currentUser: 'You' };
    }
  },

  async saveAppState(appState: AppState): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.APP_STATE, JSON.stringify(appState));
    } catch (error) {
      console.error('Error saving app state:', error);
    }
  },

  // Clear all data
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.GROUPS,
        STORAGE_KEYS.EXPENSES,
        STORAGE_KEYS.APP_STATE,
      ]);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  },
}; 