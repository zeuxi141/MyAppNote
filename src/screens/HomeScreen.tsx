import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Note } from '../types';
import { NoteService } from '../services';
import { NoteCard, FloatingActionButton } from '../components';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadNotes = async () => {
    try {
      const allNotes = await NoteService.getAllNotes();
      setNotes(allNotes.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()));
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotes();
    setRefreshing(false);
  };

  const handleNotePress = (note: Note) => {
    navigation.navigate('EditNote', { noteId: note.id });
  };

  const handleNoteLongPress = (note: Note) => {
    Alert.alert(
      'Xóa ghi chú',
      'Bạn có chắc muốn xóa ghi chú này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              await NoteService.deleteNote(note.id);
              await loadNotes();
            } catch (error) {
              console.error('Error deleting note:', error);
            }
          },
        },
      ]
    );
  };

  const handleAddNote = () => {
    navigation.navigate('AddNote');
  };

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Đang tải...</Text>
      </View>
    );
  }

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>Chưa có ghi chú nào</Text>
      <Text style={styles.emptySubtitle}>
        Nhấn nút + để tạo ghi chú đầu tiên
      </Text>
    </View>
  );

  const renderNoteItem = ({ item }: { item: Note }) => (
    <NoteCard
      note={item}
      onPress={() => handleNotePress(item)}
      onLongPress={() => handleNoteLongPress(item)}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notes}
        renderItem={renderNoteItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={notes.length === 0 ? styles.emptyListContainer : undefined}
      />
      <FloatingActionButton onPress={handleAddNote} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyListContainer: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
}); 