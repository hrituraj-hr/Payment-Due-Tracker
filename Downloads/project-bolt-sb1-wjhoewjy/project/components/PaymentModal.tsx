import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { PaymentDue, deletePaymentDue, updatePaymentDue } from '@/utils/storage';
import { useTheme } from '@/context/ThemeContext';
import { IndianRupee, Pencil, Trash } from 'lucide-react-native';
import CustomAlert from '@/components/CustomAlert'; // Import custom alert component

interface PaymentModalProps {
  payment: PaymentDue;
  visible: boolean;
  onClose: () => void;
  onUpdate: () => Promise<void>; // Function to refresh the list after updating/deleting
}

export default function PaymentModal({ payment, visible, onClose, onUpdate }: PaymentModalProps) {
  const { colors } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(payment.title);
  const [amount, setAmount] = useState(payment.amount.toString());
  const [dueDate, setDueDate] = useState(payment.dueDate);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false); // Alert visibility

  // ✅ Update Payment Function
  const handleUpdate = async () => {
    try {
      await updatePaymentDue(payment.id, {
        title,
        amount: Number(amount),
        dueDate,
        category: payment.category,
      });

      await onUpdate(); // Refresh list after update
      setIsEditing(false);
      onClose();
      console.warn('✅ Payment updated successfully');
    } catch (error) {
      console.error('❌ Failed to update payment', error);
    }
  };

  // ✅ Delete Payment Confirmation Trigger
  const confirmDelete = () => {
    setShowDeleteAlert(true);
  };

  // ✅ Delete Payment Function
  const handleDelete = async () => {
    try {
      setShowDeleteAlert(false); // Close alert
      await deletePaymentDue(payment.id);
      await onUpdate(); // Refresh list
      onClose();
      console.warn('✅ Payment deleted successfully');
    } catch (error) {
      console.error('❌ Failed to delete payment', error);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.content}>
          <Text style={styles.title}>{isEditing ? 'Edit Payment' : 'Payment Details'}</Text>

          {isEditing ? (
            <>
              <TextInput style={styles.input} value={title} onChangeText={setTitle} />
              <TextInput style={styles.input} value={amount} onChangeText={setAmount} keyboardType="decimal-pad" />
              <TextInput style={styles.input} value={dueDate} onChangeText={setDueDate} />
            </>
          ) : (
            <>
              <Text style={styles.detailText}>Title: {payment.title}</Text>
              <Text style={styles.detailText}>Amount: ₹{payment.amount.toFixed(2)}</Text>
              <Text style={styles.detailText}>Due Date: {payment.dueDate}</Text>
              <Text style={styles.detailText}>Category: {payment.category}</Text>
            </>
          )}

          <View style={styles.buttonContainer}>
            {isEditing ? (
              <>
                <TouchableOpacity onPress={() => setIsEditing(false)} style={styles.cancelButton}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleUpdate} style={styles.editButton}>
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity onPress={confirmDelete} style={styles.deleteButton}>
                  <Trash size={18} color="white" />
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.editButton}>
                  <Pencil size={18} color="white" />
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>

      {/* Custom Alert for Delete Confirmation */}
      <CustomAlert
        visible={showDeleteAlert}
        title="Confirm Delete"
        message="Are you sure you want to delete this payment?"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteAlert(false)}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </Modal>
  );
}

// ✅ Styles for PaymentModal.tsx
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderColor: '#ccc',
  },
  detailText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  editButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#e63946',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: '#555',
    padding: 10,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: '#777',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 5,
  },
});
