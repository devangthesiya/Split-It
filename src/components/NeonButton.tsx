import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Animated,
} from 'react-native';
import { theme, createGlowStyle } from '../styles/theme';

interface NeonButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'warning' | 'error';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const NeonButton: React.FC<NeonButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style,
  textStyle,
}) => {
  const animatedValue = React.useRef(new Animated.Value(1)).current;

  const getVariantColors = () => {
    switch (variant) {
      case 'secondary':
        return { bg: theme.colors.secondary, glow: theme.colors.secondaryGlow };
      case 'accent':
        return { bg: theme.colors.accent, glow: theme.colors.accentGlow };
      case 'warning':
        return { bg: theme.colors.warning, glow: theme.colors.warningGlow };
      case 'error':
        return { bg: theme.colors.error, glow: theme.colors.errorGlow };
      default:
        return { bg: theme.colors.primary, glow: theme.colors.primaryGlow };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { padding: theme.spacing.sm, fontSize: 14 };
      case 'large':
        return { padding: theme.spacing.lg, fontSize: 18 };
      default:
        return { padding: theme.spacing.md, fontSize: 16 };
    }
  };

  const colors = getVariantColors();
  const sizeStyles = getSizeStyles();

  const handlePressIn = () => {
    Animated.timing(animatedValue, {
      toValue: 0.95,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: animatedValue }],
        },
      ]}>
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: disabled ? theme.colors.surfaceSecondary : colors.bg,
            padding: sizeStyles.padding,
            ...createGlowStyle(colors.glow, disabled ? 0 : 0.3),
          },
          style,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.8}>
        <Text
          style={[
            styles.text,
            {
              fontSize: sizeStyles.fontSize,
              color: disabled ? theme.colors.textMuted : theme.colors.text,
            },
            textStyle,
          ]}>
          {title}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  button: {
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  text: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
}); 