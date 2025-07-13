# Split It - Futuristic Expense Sharing App

A React Native expense-sharing app with a futuristic, sci-fi inspired UI design. Built with TypeScript and featuring local storage for all data.

## 🚀 Features

- **Dark Theme**: Beautiful dark interface with neon accents
- **Group Management**: Create and manage expense groups
- **Expense Tracking**: Add expenses with equal splitting
- **Balance Calculation**: Automatic calculation of who owes whom
- **Local Storage**: All data stored locally using AsyncStorage
- **Futuristic UI**: Glowing effects, animations, and sci-fi styling

## 🎨 Design

The app features a futuristic "robo movie" aesthetic with:
- Dark background with neon green, blue, and pink accents
- Glowing effects on buttons and cards
- Smooth animations and transitions
- Modern typography and spacing

## 📱 Screens

### Groups Tab
- List of all expense groups
- Floating "Create Group" button
- Group details with total expenses and member count

### Create Group Screen
- Group name input
- Add/remove participants
- Validation for minimum 2 participants

### Group Details Screen
- List of all expenses in the group
- Running balance showing who owes whom
- "Add Expense" button
- Statistics (total expenses, per person share)

### Add Expense Screen
- Expense description and amount
- Participant selection (who paid)
- Equal split option
- Form validation

### Summary Tab
- Overall balance across all groups
- Total outstanding amounts
- Active group count

## 🛠 Tech Stack

- **React Native** 0.76.9
- **TypeScript**
- **React Navigation** (Stack + Bottom Tabs)
- **AsyncStorage** for local data persistence
- **Custom Components** with futuristic styling

## 📦 Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the app:
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   ```

## 🏗 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── NeonButton.tsx  # Futuristic button component
│   ├── NeonInput.tsx   # Styled input component
│   └── NeonCard.tsx    # Card component with glow effects
├── screens/            # App screens
│   ├── GroupsScreen.tsx
│   ├── SummaryScreen.tsx
│   ├── CreateGroupScreen.tsx
│   ├── GroupDetailsScreen.tsx
│   └── AddExpenseScreen.tsx
├── navigation/         # Navigation setup
│   └── AppNavigator.tsx
├── types/             # TypeScript type definitions
│   ├── index.ts
│   └── navigation.ts
├── styles/            # Theme and styling
│   └── theme.ts
└── utils/             # Utility functions
    ├── storage.ts     # AsyncStorage wrapper
    └── balanceCalculator.ts
```

## 🎯 Key Features

### Data Management
- All data stored locally using AsyncStorage
- No authentication required
- Automatic balance calculations
- Real-time updates

### UI/UX
- Smooth animations and transitions
- Glowing neon effects
- Responsive design
- Intuitive navigation

### Expense Logic
- Equal splitting among all group members
- Automatic balance calculation
- Clear display of who owes whom
- Support for multiple groups

## 🔮 Future Enhancements

- Custom split percentages
- Expense categories
- Export functionality
- Cloud sync
- Receipt photo capture
- Payment integration

## 📄 License

This project is open source and available under the MIT License.
