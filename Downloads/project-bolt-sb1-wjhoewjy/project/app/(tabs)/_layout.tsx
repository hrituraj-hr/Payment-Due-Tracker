import { Tabs } from 'expo-router';
import { Chrome as Home, PlusCircle as PlusCircle, Settings } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#1f2937', // Dark Grayish Blue
          borderTopWidth: 1,
          borderTopColor: '#374151', // Slightly lighter gray
          paddingBottom: 5,
        },
        tabBarActiveTintColor: '#facc15', // Bright Yellow
        tabBarInactiveTintColor: '#9ca3af', // Light Gray
        headerStyle: {
          backgroundColor: '#6366f1', // Indigo
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
          color: '#fff', // White
        },
        headerTitleAlign: 'center', // Center the title
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '📌 Due Payments',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: '➕ Add New',
          tabBarIcon: ({ color, size }) => <PlusCircle size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: '⚙️ Settings',
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
