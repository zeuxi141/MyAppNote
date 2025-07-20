import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen, AddNoteScreen, EditNoteScreen } from '../screens';

export type RootStackParamList = {
  Home: undefined;
  AddNote: undefined;
  EditNote: { noteId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#007AFF',
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Ghi chú của tôi',
            headerLargeTitle: true,
          }}
        />
        <Stack.Screen
          name="AddNote"
          component={AddNoteScreen}
          options={{
            title: 'Ghi chú mới',
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="EditNote"
          component={EditNoteScreen}
          options={{
            title: 'Chỉnh sửa',
            presentation: 'modal',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}; 