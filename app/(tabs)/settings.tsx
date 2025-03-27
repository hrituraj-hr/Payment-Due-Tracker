import { View, Text, StyleSheet, TouchableOpacity, Switch, Modal, Image } from 'react-native';
import { Bell, Moon, Shield, Info } from 'lucide-react-native';
import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);
  const [aboutModalVisible, setAboutModalVisible] = useState(false);
  const { isDark, toggleTheme, colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 20,
    },
    section: {
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      opacity: 0.7,
      marginBottom: 16,
      textTransform: 'uppercase',
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 12,
      marginBottom: 8,
    },
    settingLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    settingText: {
      marginLeft: 12,
      fontSize: 16,
      color: colors.text,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: colors.card,
      padding: 20,
      borderRadius: 10,
      width: '80%',
      alignItems: 'flex-start', // ✅ Left-align everything inside the modal
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 10,
    },
    modalText: {
      fontSize: 14,
      color: colors.text,
      textAlign: 'left', // ✅ Left-align text
      marginBottom: 20,
    },
    closeButton: {
      backgroundColor: colors.primary,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignSelf: 'center', // ✅ Keeps the button centered
    },
    closeButtonText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: 'bold',
    },
    version: {
      textAlign: 'center',
      color: colors.text,
      opacity: 0.5,
      marginTop: 'auto',
    },
    developerList: {
      width: '100%', // ✅ Ensures full width
      paddingLeft: 10, // ✅ Adds space from left for a neat look
    },
    developerContainer: {
      flexDirection: 'row', // ✅ Keep image & name in a single row
      alignItems: 'center', // ✅ Align image & text in the center
      marginBottom: 10, // ✅ Space between developers
    },
    developerImage: {
      width: 40,
      height: 40,
      borderRadius: 20, // ✅ Circular Image
      marginRight: 10, // ✅ Space between image & name
    },
    developerName: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
    },
  });

  return (
    <View style={styles.container}>
      {/* Preferences Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Bell size={20} color={colors.primary} />
            <Text style={styles.settingText}>Notifications</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={notifications ? colors.card : colors.text}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Moon size={20} color={colors.primary} />
            <Text style={styles.settingText}>Dark Mode</Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={isDark ? colors.card : colors.text}
          />
        </View>
      </View>

      {/* Security Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security</Text>

        {/* Privacy Policy */}
        <TouchableOpacity style={styles.settingItem} onPress={() => setPrivacyModalVisible(true)}>
          <View style={styles.settingLeft}>
            <Shield size={20} color={colors.primary} />
            <Text style={styles.settingText}>Privacy Policy</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* About Us Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About Us</Text>

        {/* About Us */}
        <TouchableOpacity style={styles.settingItem} onPress={() => setAboutModalVisible(true)}>
          <View style={styles.settingLeft}>
            <Info size={20} color={colors.primary} />
            <Text style={styles.settingText}>About TamsaDev</Text>
          </View>
        </TouchableOpacity>
      </View>

      <Text style={styles.version}>Version 1.0.0</Text>

      {/* Privacy Policy Modal */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={privacyModalVisible}
        onRequestClose={() => setPrivacyModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Privacy Policy</Text>
            <Text style={styles.modalText}>
              TamsaDev does not collect any user data. All user data is securely stored on the
              user's device only.
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setPrivacyModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* About Us Modal */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={aboutModalVisible}
        onRequestClose={() => setAboutModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>About TamsaDev</Text>
            <Text style={styles.modalText}>
              TamsaDev is a company dedicated to creating apps that make people's lives easier.
            </Text>
            <Text style={styles.modalTitle}>Developers</Text>

            {/* ✅ Developer List with Proper Left Alignment */}
            <View style={styles.developerList}>
              <View style={styles.developerContainer}>
                <Image source={require('../images/hritu.png')} style={styles.developerImage} />
                <Text style={styles.developerName}>Hritu Raj</Text>
              </View>

              <View style={styles.developerContainer}>
                <Image source={require('../images/abhi.png')} style={styles.developerImage} />
                <Text style={styles.developerName}>Abhishek Gaur</Text>
              </View>

              <View style={styles.developerContainer}>
                <Image source={require('../images/birju.png')} style={styles.developerImage} />
                <Text style={styles.developerName}>Braj Mohan</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.closeButton} onPress={() => setAboutModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
