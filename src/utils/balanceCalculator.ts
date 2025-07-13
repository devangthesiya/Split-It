import { Group, Expense, Balance, Participant } from '../types';

export const calculateGroupBalance = (group: Group): Balance[] => {
  const balances: Balance[] = [];
  const participantBalances = new Map<string, number>();

  // Initialize balances
  group.participants.forEach(participant => {
    participantBalances.set(participant.id, 0);
  });

  // Calculate what each person paid
  group.expenses.forEach(expense => {
    const currentBalance = participantBalances.get(expense.paidBy) || 0;
    participantBalances.set(expense.paidBy, currentBalance + expense.amount);
  });

  // Calculate what each person owes
  const totalExpenses = group.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const perPersonShare = totalExpenses / group.participants.length;

  group.participants.forEach(participant => {
    const currentBalance = participantBalances.get(participant.id) || 0;
    const newBalance = currentBalance - perPersonShare;
    participantBalances.set(participant.id, newBalance);
  });

  // Create balance transfers
  const positiveBalances: Array<{ id: string; amount: number }> = [];
  const negativeBalances: Array<{ id: string; amount: number }> = [];

  participantBalances.forEach((balance, participantId) => {
    if (balance > 0) {
      positiveBalances.push({ id: participantId, amount: balance });
    } else if (balance < 0) {
      negativeBalances.push({ id: participantId, amount: Math.abs(balance) });
    }
  });

  // Sort by amount (highest first)
  positiveBalances.sort((a, b) => b.amount - a.amount);
  negativeBalances.sort((a, b) => b.amount - a.amount);

  // Calculate transfers
  let positiveIndex = 0;
  let negativeIndex = 0;

  while (positiveIndex < positiveBalances.length && negativeIndex < negativeBalances.length) {
    const positive = positiveBalances[positiveIndex];
    const negative = negativeBalances[negativeIndex];

    const transferAmount = Math.min(positive.amount, negative.amount);

    if (transferAmount > 0) {
      balances.push({
        from: negative.id,
        to: positive.id,
        amount: transferAmount,
      });
    }

    positive.amount -= transferAmount;
    negative.amount -= transferAmount;

    if (positive.amount <= 0) positiveIndex++;
    if (negative.amount <= 0) negativeIndex++;
  }

  return balances;
};

export const getParticipantName = (participantId: string, group: Group): string => {
  const participant = group.participants.find(p => p.id === participantId);
  return participant?.name || 'Unknown';
};

export const formatCurrency = (amount: number): string => {
  return `₹${amount.toFixed(2)}`;
};

export const getTotalExpenses = (group: Group): number => {
  return group.expenses.reduce((sum, expense) => sum + expense.amount, 0);
};

export const getParticipantTotalPaid = (participantId: string, group: Group): number => {
  return group.expenses
    .filter(expense => expense.paidBy === participantId)
    .reduce((sum, expense) => sum + expense.amount, 0);
};

export const getParticipantShare = (group: Group): number => {
  const totalExpenses = getTotalExpenses(group);
  return totalExpenses / group.participants.length;
};

// Returns net balances for each participant: positive means they are owed, negative means they owe
export const calculateNetBalances = (group: Group): Array<{ id: string; name: string; net: number }> => {
  const participantBalances = new Map<string, number>();
  group.participants.forEach(participant => {
    participantBalances.set(participant.id, 0);
  });
  group.expenses.forEach(expense => {
    const currentBalance = participantBalances.get(expense.paidBy) || 0;
    participantBalances.set(expense.paidBy, currentBalance + expense.amount);
  });
  const totalExpenses = group.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const perPersonShare = totalExpenses / group.participants.length;
  group.participants.forEach(participant => {
    const currentBalance = participantBalances.get(participant.id) || 0;
    const newBalance = currentBalance - perPersonShare;
    participantBalances.set(participant.id, newBalance);
  });
  return group.participants.map(participant => ({
    id: participant.id,
    name: participant.name,
    net: +(participantBalances.get(participant.id) || 0)
  }));
};

// Calculate exact balances by splitting each expense, summing debts, and netting between pairs
export const calculateExactBalances = (group: Group): Balance[] => {
  const pairDebts = new Map<string, number>(); // key: from-to, value: amount

  group.expenses.forEach(expense => {
    const splitAmount = expense.amount / group.participants.length;
    group.participants.forEach(participant => {
      if (participant.id !== expense.paidBy) {
        // participant owes splitAmount to expense.paidBy
        const key = `${participant.id}->${expense.paidBy}`;
        pairDebts.set(key, (pairDebts.get(key) || 0) + splitAmount);
      }
    });
  });

  // Net debts between each pair
  const netDebts = new Map<string, number>();
  group.participants.forEach(a => {
    group.participants.forEach(b => {
      if (a.id !== b.id) {
        const keyAB = `${a.id}->${b.id}`;
        const keyBA = `${b.id}->${a.id}`;
        const ab = pairDebts.get(keyAB) || 0;
        const ba = pairDebts.get(keyBA) || 0;
        if (ab > ba) {
          netDebts.set(keyAB, ab - ba);
        }
        // else handled in the other direction
      }
    });
  });

  // Only keep positive debts (A owes B)
  const balances: Balance[] = [];
  netDebts.forEach((amount, key) => {
    if (amount > 0) {
      const [from, to] = key.split('->');
      balances.push({ from, to, amount: Math.round(amount) });
    }
  });

  return balances;
}; 