export interface Participant {
  id: string;
  name: string;
}

export interface Expense {
  id: string;
  groupId: string;
  paidBy: string; // participant id
  amount: number;
  description: string;
  splitEqually: boolean;
  createdAt: Date;
}

export interface Group {
  id: string;
  name: string;
  participants: Participant[];
  expenses: Expense[];
  createdAt: Date;
}

export interface Balance {
  from: string; // participant id
  to: string; // participant id
  amount: number;
}

export interface GroupBalance {
  groupId: string;
  balances: Balance[];
}

export interface AppState {
  groups: Group[];
  currentUser: string;
} 