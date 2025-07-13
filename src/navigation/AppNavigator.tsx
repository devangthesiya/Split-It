import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { GroupsScreen } from '../screens/GroupsScreen';
import { SummaryScreen } from '../screens/SummaryScreen';
import { CreateGroupScreen } from '../screens/CreateGroupScreen';
import { GroupDetailsScreen } from '../screens/GroupDetailsScreen';
import { AddExpenseScreen } from '../screens/AddExpenseScreen';
import { theme } from '../styles/theme';
import { TabParamList, RootStackParamList } from '../types/navigation';
import { TouchableOpacity, Text, Platform } from 'react-native';

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 50 : 60,           
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
         
        },
      }}>
      <Tab.Screen
        name="Groups"
        component={GroupsScreen}
        options={{
          tabBarLabel: 'Groups',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 18 }}>👥</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Summary"
        component={SummaryScreen}
        options={{
          tabBarLabel: 'Summary',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 18 }}>📊</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const BackButton = ({ navigation }: { navigation: any }) => (
  <TouchableOpacity
    style={{ marginLeft: 12, padding: 4 }}
    onPress={() => navigation.navigate('MainTabs')}
  >
    <Text style={{ fontSize: 18, color: theme.colors.primary }}>{'← Back'}</Text>
  </TouchableOpacity>
);

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: theme.colors.background },
        }}>
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen name="Summary" component={TabNavigator} />
        <Stack.Screen
          name="CreateGroup"
          component={CreateGroupScreen}
          options={({ navigation }) => ({
            headerShown: true,
            headerTitle: '',
            headerLeft: () => <BackButton navigation={navigation} />,
            headerStyle: { backgroundColor: theme.colors.background, elevation: 0, shadowOpacity: 0 },
          })}
        />
        <Stack.Screen
          name="GroupDetails"
          component={GroupDetailsScreen}
          options={({ navigation }) => ({
            headerShown: true,
            headerTitle: '',
            headerLeft: () => <BackButton navigation={navigation} />,
            headerStyle: { backgroundColor: theme.colors.background, elevation: 0, shadowOpacity: 0 },
          })}
        />
        <Stack.Screen
          name="AddExpense"
          component={AddExpenseScreen}
          options={({ navigation }) => ({
            headerShown: true,
            headerTitle: '',
            headerLeft: () => <BackButton navigation={navigation} />,
            headerStyle: { backgroundColor: theme.colors.background, elevation: 0, shadowOpacity: 0 },
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}; 