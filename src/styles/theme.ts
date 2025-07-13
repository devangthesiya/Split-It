import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const theme = {
  colors: {
    // Light theme with neon accents
    background: '#ffffff',
    surface: '#f8f9fa',
    surfaceSecondary: '#e9ecef',
    primary: '#0088ff', // Neon blue (was green)
    primaryGlow: '#0088ff',
    secondary: '#0088ff', // Neon blue
    secondaryGlow: '#0088ff',
    accent: '#ff0088', // Neon pink
    accentGlow: '#ff0088',
    warning: '#ff8800', // Neon orange
    warningGlow: '#ff8800',
    error: '#ff0044', // Neon red
    errorGlow: '#ff0044',
    text: '#212529',
    textSecondary: '#6c757d',
    textMuted: '#adb5bd',
    border: '#dee2e6',
    borderGlow: '#0088ff',
    shadow: 'rgba(0, 136, 255, 0.2)',
  },
  fonts: {
    primary: 'Orbitron',
    secondary: 'Share Tech Mono',
    regular: 'System',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    horizontal: 20,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
  shadows: {
    small: {
      shadowColor: '#0088ff',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 3.84,
      elevation: 5,
    },
    medium: {
      shadowColor: '#0088ff',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 4.65,
      elevation: 8,
    },
    large: {
      shadowColor: '#0088ff',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.25,
      shadowRadius: 6.27,
      elevation: 12,
    },
  },
  dimensions: {
    width,
    height,
  },
};

export const createGlowStyle = (color: string, intensity: number = 0.3) => ({
  shadowColor: color,
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: intensity,
  shadowRadius: 10,
  elevation: 8,
});

export const createNeonStyle = (color: string) => ({
  borderColor: color,
  borderWidth: 1,
  ...createGlowStyle(color, 0.5),
}); 