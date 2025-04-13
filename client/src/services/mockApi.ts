// client/src/services/mockApi.ts

const mockExpenses = [
  {
    id: '1',
    description: 'Groceries',
    amount: 50,
    date: '2024-01-01',
  },
  {
    id: '2',
    description: 'Restaurant',
    amount: 100,
    date: '2024-01-02',
  },
];

export const getExpenses = async () => {
  return mockExpenses;
};

export const addExpense = async (expense: any) => {
  mockExpenses.push(expense);
  return expense;
};
