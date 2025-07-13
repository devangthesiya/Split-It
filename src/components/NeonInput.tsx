import React, { useState } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  Animated,
} from 'react-native';
import { theme, createGlowStyle } from '../styles/theme';

interface NeonInputProps extends TextInputProps {
  label?: string;
  error?: string;
  variant?: 'primary' | 'secondary' | 'accent';
}

export const NeonInput: React.FC<NeonInputProps> = ({
  label,
  error,
  variant = 'primary',
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const animatedValue = React.useRef(new Animated.Value(0)).current;

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

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const borderColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.border, colors.border],
  });

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>{label}</Text>
      )}
      <Animated.View
        style={[
          styles.inputContainer,
          {
            borderColor,
            ...createGlowStyle(colors.glow, isFocused ? 0.3 : 0),
          },
          style,
        ]}>
        <TextInput
          style={[
            styles.input,
            {
              color: theme.colors.text,
            },
          ]}
          placeholderTextColor={theme.colors.textMuted}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
      </Animated.View>
      {error && (
        <Text style={styles.error}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  label: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    marginBottom: theme.spacing.xs,
    fontWeight: '500',
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  input: {
    fontSize: 16,
    minHeight: 40,
  },
  error: {
    color: theme.colors.error,
    fontSize: 12,
    marginTop: theme.spacing.xs,
  },
}); 