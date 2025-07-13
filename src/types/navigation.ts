import { Group } from './index';

export type RootStackParamList = {
  Groups: undefined;
  Summary: undefined;
  CreateGroup: undefined;
  GroupDetails: { group: Group };
  AddExpense: { group: Group };
};

export type TabParamList = {
  Groups: undefined;
  Summary: undefined;
}; 