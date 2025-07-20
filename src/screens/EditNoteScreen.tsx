import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Note } from '../types';
import { NoteService } from '../services';

interface EditNoteScreenProps {
  navigation: any;
  route: {
    params: {
      noteId: string;
    };
  };
}

export const EditNoteScreen: React.FC<EditNoteScreenProps> = ({ navigation, route }) => {
  const { noteId } = route.params;
  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNote();
  }, [noteId]);

  const loadNote = async () => {
    try {
      const foundNote = await NoteService.getNoteById(noteId);
      if (foundNote) {
        setNote(foundNote);
        setTitle(foundNote.title);
        setContent(foundNote.content);
        setTags(foundNote.tags?.join(', ') || '');
      } else {
        Alert.alert('Lỗi', 'Không tìm thấy ghi chú');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error loading note:', error);
      Alert.alert('Lỗi', 'Không thể tải ghi chú');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tiêu đề hoặc nội dung');
      return;
    }

    setSaving(true);
    try {
      const tagsArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      await NoteService.updateNote({
        id: noteId,
        title: title.trim() || 'Không có tiêu đề',
        content: content.trim(),
        tags: tagsArray,
      });

      navigation.goBack();
    } catch (error) {
      console.error('Error saving note:', error);
      Alert.alert('Lỗi', 'Không thể lưu ghi chú');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
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
              await NoteService.deleteNote(noteId);
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting note:', error);
              Alert.alert('Lỗi', 'Không thể xóa ghi chú');
            }
          },
        },
      ]
    );
  };

  const handleCancel = () => {
    if (note && (title !== note.title || content !== note.content || tags !== (note.tags?.join(', ') || ''))) {
      Alert.alert(
        'Hủy bỏ thay đổi',
        'Bạn có muốn hủy bỏ các thay đổi không?',
        [
          { text: 'Tiếp tục chỉnh sửa', style: 'cancel' },
          { text: 'Hủy bỏ', style: 'destructive', onPress: () => navigation.goBack() },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>Hủy</Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View style={styles.headerRightContainer}>
          <TouchableOpacity onPress={handleDelete} style={styles.headerButton}>
            <Text style={[styles.headerButtonText, styles.deleteButtonText]}>Xóa</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleSave} 
            style={[styles.headerButton, saving && styles.disabledButton]}
            disabled={saving}
          >
            <Text style={[styles.headerButtonText, styles.saveButtonText]}>
              {saving ? 'Đang lưu...' : 'Lưu'}
            </Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, title, content, tags, note, saving]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Đang tải...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <TextInput
            style={styles.titleInput}
            placeholder="Tiêu đề ghi chú"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
            multiline
          />
          
          <TextInput
            style={styles.contentInput}
            placeholder="Viết ghi chú của bạn..."
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
          />

          <TextInput
            style={styles.tagsInput}
            placeholder="Tags (phân cách bằng dấu phẩy)"
            value={tags}
            onChangeText={setTags}
          />

          {note && (
            <View style={styles.metaInfo}>
              <Text style={styles.metaText}>
                Tạo: {note.createdAt.toLocaleDateString('vi-VN')} {note.createdAt.toLocaleTimeString('vi-VN')}
              </Text>
              <Text style={styles.metaText}>
                Sửa: {note.updatedAt.toLocaleDateString('vi-VN')} {note.updatedAt.toLocaleTimeString('vi-VN')}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlignVertical: 'top',
  },
  contentInput: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    flex: 1,
    minHeight: 200,
  },
  tagsInput: {
    fontSize: 14,
    color: '#666',
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  metaInfo: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  metaText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  headerButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  headerRightContainer: {
    flexDirection: 'row',
  },
  saveButtonText: {
    fontWeight: '600',
  },
  deleteButtonText: {
    color: '#FF3B30',
  },
  disabledButton: {
    opacity: 0.5,
  },
}); 