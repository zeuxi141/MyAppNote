import React, { useState } from 'react';
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
import { NoteService } from '../services';

interface AddNoteScreenProps {
  navigation: any;
}

export const AddNoteScreen: React.FC<AddNoteScreenProps> = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [saving, setSaving] = useState(false);

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

      await NoteService.createNote({
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

  const handleCancel = () => {
    if (title.trim() || content.trim()) {
      Alert.alert(
        'Hủy bỏ',
        'Bạn có muốn hủy bỏ ghi chú này không?',
        [
          { text: 'Tiếp tục viết', style: 'cancel' },
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
        <TouchableOpacity 
          onPress={handleSave} 
          style={[styles.headerButton, saving && styles.disabledButton]}
          disabled={saving}
        >
          <Text style={[styles.headerButtonText, styles.saveButtonText]}>
            {saving ? 'Đang lưu...' : 'Lưu'}
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, title, content, saving]);

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
  headerButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  saveButtonText: {
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
}); 