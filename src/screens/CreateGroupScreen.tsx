import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { NeonInput } from '../components/NeonInput';
import { NeonButton } from '../components/NeonButton';
import { theme } from '../styles/theme';
import { Group, Participant } from '../types';
import { RootStackParamList } from '../types/navigation';
import { storage } from '../utils/storage';

type CreateGroupScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CreateGroup'>;

export const CreateGroupScreen: React.FC = () => {
  const navigation = useNavigation<CreateGroupScreenNavigationProp>();
  const [groupName, setGroupName] = useState('');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [newParticipantName, setNewParticipantName] = useState('');
  const [loading, setLoading] = useState(false);

  const addParticipant = () => {
    const trimmedName = newParticipantName.trim();
    if (!trimmedName) {
      Alert.alert('Error', 'Please enter a participant name');
      return;
    }

    if (participants.some(p => p.name.toLowerCase() === trimmedName.toLowerCase())) {
      Alert.alert('Error', 'This participant already exists');
      return;
    }

    const newParticipant: Participant = {
      id: Date.now().toString(),
      name: trimmedName,
    };

    setParticipants([...participants, newParticipant]);
    setNewParticipantName('');
  };

  const removeParticipant = (participantId: string) => {
    setParticipants(participants.filter(p => p.id !== participantId));
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      Alert.alert('Error', 'Please enter a group name');
      return;
    }

    if (participants.length < 2) {
      Alert.alert('Error', 'Please add at least 2 participants');
      return;
    }

    setLoading(true);

    try {
      const newGroup: Group = {
        id: Date.now().toString(),
        name: groupName.trim(),
        participants,
        expenses: [],
        createdAt: new Date(),
      };

      await storage.addGroup(newGroup);
      navigation.navigate('GroupDetails', { group: newGroup });
    } catch (error) {
      console.error('Error creating group:', error);
      Alert.alert('Error', 'Failed to create group. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, styles.horizontalPad]}>
        <Text style={styles.title}>Create Group</Text>
        <Text style={styles.subtitle}>Set up a new expense group</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.horizontalPad}>
          <NeonInput
            label="Group Name"
            value={groupName}
            onChangeText={setGroupName}
            placeholder="Enter group name"
            variant="primary"
          />
        </View>

        <View style={[styles.section, styles.horizontalPad]}>
          <Text style={styles.sectionTitle}>Participants</Text>
          <Text style={styles.sectionSubtitle}>
            Add at least 2 participants to your group
          </Text>

          <View style={styles.addParticipantContainer}>
            <View style={styles.inputWithButton}>
              <TextInput
                style={styles.participantInput}
                value={newParticipantName}
                onChangeText={setNewParticipantName}
                placeholder="Enter participant name"
                placeholderTextColor={theme.colors.textMuted}
                returnKeyType="done"
                onSubmitEditing={addParticipant}
              />
              <TouchableOpacity
                style={styles.addButtonModern}
                onPress={addParticipant}
                activeOpacity={0.85}
              >
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>

          {participants.map((participant) => (
            <View key={participant.id} style={styles.participantItem}>
              <Text style={styles.participantName}>{participant.name}</Text>
              <TouchableOpacity
                onPress={() => removeParticipant(participant.id)}
                style={styles.removeButton}>
                <Text style={styles.removeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <NeonButton
          title="Create Group"
          onPress={handleCreateGroup}
          variant="primary"
          size="large"
          disabled={loading || !groupName.trim() || participants.length < 2}
          style={styles.createButton}
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
  addParticipantContainer: {
    marginBottom: theme.spacing.md,
  },
  inputWithButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  participantInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    color: theme.colors.text,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  addButtonModern: {
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    marginLeft: theme.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: theme.colors.background,
    fontWeight: 'bold',
    fontSize: 16,
  },
  participantItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  participantName: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '500',
  },
  removeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    paddingTop: theme.spacing.md,
  },
  createButton: {
    width: '100%',
  },
  horizontalPad: {
    paddingHorizontal: theme.spacing.horizontal,
  },
}); 