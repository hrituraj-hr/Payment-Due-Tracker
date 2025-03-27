import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'payment_dues';
const THEME_KEY = 'theme_mode';

export interface PaymentDue {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  category: string;
  createdAt: string;
}


// ✅ Fetch all stored payment dues
export async function getPaymentDues(): Promise<PaymentDue[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading payment dues:', error);
    return [];
  }
}

// ✅ Save a new payment due
export async function savePaymentDue(payment: Omit<PaymentDue, 'id' | 'createdAt'>): Promise<PaymentDue> {
  try {
    const existingDues = await getPaymentDues();
    
    const newPayment: PaymentDue = {
      ...payment,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date().toISOString(),
    };
    
    const updatedDues = [...existingDues, newPayment];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDues));
    
    return newPayment;
  } catch (error) {
    console.error('Error saving payment due:', error);
    throw new Error('Failed to save payment due');
  }
}

// ✅ Update an existing payment due
export async function updatePaymentDue(id: string, payment: Omit<PaymentDue, 'id' | 'createdAt'>): Promise<PaymentDue> {
  try {
    const existingDues = await getPaymentDues();
    const index = existingDues.findIndex(due => due.id === id);
    
    if (index === -1) {
      throw new Error('Payment due not found');
    }
    
    const updatedPayment: PaymentDue = {
      ...payment,
      id,
      createdAt: existingDues[index].createdAt,
    };
    
    existingDues[index] = updatedPayment;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existingDues));
    
    return updatedPayment;
  } catch (error) {
    console.error('Error updating payment due:', error);
    throw new Error('Failed to update payment due');
  }
}

// ✅ Delete a payment due and return success/failure
export async function deletePaymentDue(id: string): Promise<void> {
  try {
    const existingDues = await getPaymentDues();

    console.log('Existing Dues before delete:', existingDues);

    const updatedDues = existingDues.filter(due => due.id !== id);

    console.log('Updated Dues after delete:', updatedDues);

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDues));
  } catch (error) {
    console.error('Error deleting payment due:', error);
    throw new Error('Failed to delete payment due');
  }
}


// ✅ Get current theme mode
export async function getThemeMode(): Promise<'light' | 'dark'> {
  try {
    const theme = await AsyncStorage.getItem(THEME_KEY);
    return (theme as 'light' | 'dark') || 'light';
  } catch {
    return 'light';
  }
}

// ✅ Set theme mode
export async function setThemeMode(mode: 'light' | 'dark'): Promise<void> {
  try {
    await AsyncStorage.setItem(THEME_KEY, mode);
  } catch (error) {
    console.error('Error saving theme mode:', error);
  }
}
