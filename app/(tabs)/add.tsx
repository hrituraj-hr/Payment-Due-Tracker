import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { savePaymentDue } from '@/utils/storage';

const categories = ['Housing', 'Utilities', 'Transportation', 'Food', 'Healthcare', 'Other'];
const years = Array.from({ length: 21 }, (_, i) => (2020 + i).toString());
const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];
const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

export default function AddNewDue() {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { isDark, colors } = useTheme(); // Get theme colors

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    form: {
      padding: 20,
    },
    errorContainer: {
      backgroundColor: isDark ? '#2d1f1f' : '#fef2f2',
      borderRadius: 8,
      padding: 12,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: '#ef4444',
    },
    errorText: {
      color: '#ef4444',
      fontSize: 14,
    },
    inputGroup: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    input: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      borderWidth: 1,
      borderColor: colors.border,
      color: colors.text,
    },
    dueDateContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    picker: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      color: colors.text,
      marginHorizontal: 5,
    },
    categoryContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 10,
    },
    categoryButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: colors.card,
      marginRight: 10,
      marginBottom: 10,
    },
    selectedCategory: {
      backgroundColor: colors.primary,
    },
    categoryText: {
      color: colors.text,
      fontSize: 14,
    },
    selectedCategoryText: {
      color: '#fff',
    },
    submitButton: {
      backgroundColor: colors.primary,
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 20,
    },
    submitButtonDisabled: {
      backgroundColor: '#818cf8',
    },
    submitButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
  });

  const validateForm = () => {
    if (!title.trim()) return 'Title is required';
    if (!amount.trim()) return 'Amount is required';
    if (isNaN(Number(amount))) return 'Amount must be a valid number';
    if (!selectedCategory) return 'Category is required';
    if (!year || !month || !day) return 'Due date is required';
    return null;
  };

  const handleSubmit = async () => {
    try {
      const validationError = validateForm();
      if (validationError) {
        setError(validationError);
        return;
      }

      setError(null);
      setIsSubmitting(true);

      await savePaymentDue({
        title: title.trim(),
        amount: Number(amount),
        category: selectedCategory,
        dueDate: `${year}-${month}-${day}`,
      });

      setTitle('');
      setAmount('');
      setSelectedCategory('');
      setYear('');
      setMonth('');
      setDay('');

      router.push('/(tabs)');
    } catch (error) {
      setError('Failed to save payment due. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter payment title"
            placeholderTextColor={colors.text}
            onFocus={() => setError(null)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Amount (₹)</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            placeholder="Enter amount"
            placeholderTextColor={colors.text}
            keyboardType="decimal-pad"
            onFocus={() => setError(null)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Due Date</Text>
          <View style={styles.dueDateContainer}>
            <Picker
              selectedValue={year}
              style={styles.picker}
              onValueChange={(itemValue) => {
                setYear(itemValue);
                setError(null);
              }}>
              <Picker.Item label="Year" value="" />
              {years.map((y) => (
                <Picker.Item key={y} label={y} value={y} />
              ))}
            </Picker>
            <Picker
              selectedValue={month}
              style={styles.picker}
              onValueChange={(itemValue) => {
                setMonth(itemValue);
                setError(null);
              }}>
              <Picker.Item label="Month" value="" />
              {months.map((m) => (
                <Picker.Item key={m} label={m} value={m} />
              ))}
            </Picker>
            <Picker
              selectedValue={day}
              style={styles.picker}
              onValueChange={(itemValue) => {
                setDay(itemValue);
                setError(null);
              }}>
              <Picker.Item label="Day" value="" />
              {days.map((d) => (
                <Picker.Item key={d} label={d} value={d} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.categoryContainer}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.selectedCategory,
                ]}
                onPress={() => {
                  setSelectedCategory(category);
                  setError(null);
                }}>
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category && styles.selectedCategoryText,
                  ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}>
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Add Payment Due</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
