import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar, SafeAreaView } from 'react-native';
import { AppNavigator } from './src/navigation/AppNavigator';
import { theme } from './src/styles/theme';

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.background}
      />
      <AppNavigator />
    </SafeAreaView>
  );
}

export default App;
