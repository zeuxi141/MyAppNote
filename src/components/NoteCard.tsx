import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Note } from '../types';

interface NoteCardProps {
  note: Note;
  onPress: () => void;
  onLongPress?: () => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, onPress, onLongPress }) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <Text style={styles.title} numberOfLines={1}>
        {note.title || 'Không có tiêu đề'}
      </Text>
      <Text style={styles.content} numberOfLines={3}>
        {note.content}
      </Text>
      <View style={styles.footer}>
        <Text style={styles.date}>
          {formatDate(note.updatedAt)}
        </Text>
        {note.tags && note.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {note.tags.slice(0, 2).map((tag, index) => (
              <Text key={index} style={styles.tag}>
                #{tag}
              </Text>
            ))}
            {note.tags.length > 2 && (
              <Text style={styles.tag}>+{note.tags.length - 2}</Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  tagsContainer: {
    flexDirection: 'row',
  },
  tag: {
    fontSize: 12,
    color: '#007AFF',
    marginLeft: 8,
  },
}); 