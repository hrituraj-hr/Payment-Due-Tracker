import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Calendar, IndianRupee } from 'lucide-react-native';
import { useState, useCallback } from 'react';
import { PaymentDue, getPaymentDues } from '@/utils/storage';
import { useFocusEffect } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import PaymentModal from '@/components/PaymentModal';

export default function HomePage() {
  const { colors, isDark } = useTheme();
  const [payments, setPayments] = useState<PaymentDue[]>([]);
  const [totalDue, setTotalDue] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState<PaymentDue | null>(null);

  // ✅ Function to load payments
  const loadPayments = useCallback(async () => {
    const dues = await getPaymentDues();
    console.log('Updated Payment List:', dues); // Debugging
    setPayments(dues);
    const total = dues.reduce((sum, payment) => sum + payment.amount, 0);
    setTotalDue(total);
  }, []);

  // ✅ Automatically refresh payments list
  useFocusEffect(
    useCallback(() => {
      loadPayments();
    }, [loadPayments])
  );

  // ✅ Function to format date to DD/MM/YYYY
  const formatDate = (dateString: string) => {
    if (!dateString) return ''; // Handle empty dates
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 20,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    totalText: {
      fontSize: 16,
      color: colors.text,
      opacity: 0.7, // ✅ Softens the text color instead of `colors.subtext`
      marginBottom: 4,
    },
    amountText: {
      fontSize: 32,
      fontWeight: 'bold',
      color: colors.text,
    },
    scrollView: {
      padding: 16,
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 40,
    },
    emptyStateText: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    emptyStateSubtext: {
      fontSize: 14,
      color: isDark ? '#A3A3A3' : '#666', // ✅ Replaces `colors.subtext`
      textAlign: 'center',
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: isDark ? '#000' : '#aaa',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: isDark ? 1 : 2,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    cardCategory: {
      fontSize: 12,
      color: colors.primary,
      backgroundColor: isDark ? '#2d1f1f' : '#e7f1ff',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    cardBody: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      flex: 1,
    },
    amountContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    cardAmount: {
      marginLeft: 4,
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    dateContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    cardDate: {
      marginLeft: 4,
      fontSize: 14,
      color: isDark ? '#A3A3A3' : '#666', // ✅ Replaces `colors.subtext`
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.totalText}>Total Due</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <IndianRupee size={28} color={colors.text} />
          <Text style={styles.amountText}>{totalDue.toFixed(2)}</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {payments.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No payment dues yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Add your first payment due from the Add New tab
            </Text>
          </View>
        ) : (
          payments.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() => setSelectedPayment(item)}
            >
              <View style={{ flex: 1 }}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardCategory}>{item.category}</Text>
                </View>

                <View style={styles.cardBody}>
                  <View style={styles.amountContainer}>
                    <IndianRupee size={16} color={colors.primary} />
                    <Text style={styles.cardAmount}>{item.amount.toFixed(2)}</Text>
                  </View>

                  <View style={styles.dateContainer}>
                    <Calendar size={16} color={colors.primary} />
                    <Text style={styles.cardDate}>{formatDate(item.dueDate)}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {selectedPayment && (
        <PaymentModal
          payment={selectedPayment}
          visible={!!selectedPayment}
          onClose={() => setSelectedPayment(null)}
          onUpdate={loadPayments} // ✅ Refresh UI after editing
        />
      )}
    </View>
  );
}
