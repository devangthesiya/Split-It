import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { theme, createGlowStyle } from '../styles/theme';

interface NeonCardProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'accent';
  style?: ViewStyle;
}

export const NeonCard: React.FC<NeonCardProps> = ({
  title,
  subtitle,
  children,
  onPress,
  variant = 'primary',
  style,
}) => {
  const getVariantColors = () => {
    switch (variant) {
      case 'secondary':
        return { border: theme.colors.secondary, glow: theme.colors.secondaryGlow };
      case 'accent':
        return { border: theme.colors.accent, glow: theme.colors.accentGlow };
      default:
        return { border: theme.colors.primary, glow: theme.colors.primaryGlow };
    }
  };

  const colors = getVariantColors();

  const CardContainer = onPress ? TouchableOpacity : View;

  return (
    <CardContainer
      style={[
        styles.container,
        {
          borderColor: colors.border,
          ...createGlowStyle(colors.glow, 0.2),
        },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}>
      {(title || subtitle) && (
        <View style={styles.header}>
          {title && (
            <Text style={styles.title}>{title}</Text>
          )}
          {subtitle && (
            <Text style={styles.subtitle}>{subtitle}</Text>
          )}
        </View>
      )}
      {children && (
        <View style={styles.content}>
          {children}
        </View>
      )}
    </CardContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  header: {
    marginBottom: theme.spacing.sm,
  },
  title: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
}); 