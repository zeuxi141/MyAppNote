import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note, CreateNoteRequest, UpdateNoteRequest } from '../types';

const NOTES_STORAGE_KEY = '@MyNoteApp:notes';

export class NoteService {
  static async getAllNotes(): Promise<Note[]> {
    try {
      const notesJson = await AsyncStorage.getItem(NOTES_STORAGE_KEY);
      if (!notesJson) return [];
      
      const notes = JSON.parse(notesJson);
      return notes.map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt),
      }));
    } catch (error) {
      console.error('Error getting notes:', error);
      return [];
    }
  }

  static async createNote(noteData: CreateNoteRequest): Promise<Note> {
    try {
      const notes = await this.getAllNotes();
      const newNote: Note = {
        id: Date.now().toString(),
        title: noteData.title,
        content: noteData.content,
        tags: noteData.tags || [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      notes.push(newNote);
      await AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
      return newNote;
    } catch (error) {
      console.error('Error creating note:', error);
      throw error;
    }
  }

  static async updateNote(noteData: UpdateNoteRequest): Promise<Note> {
    try {
      const notes = await this.getAllNotes();
      const noteIndex = notes.findIndex(note => note.id === noteData.id);
      
      if (noteIndex === -1) {
        throw new Error('Note not found');
      }

      const updatedNote: Note = {
        ...notes[noteIndex],
        ...noteData,
        updatedAt: new Date(),
      };

      notes[noteIndex] = updatedNote;
      await AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
      return updatedNote;
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  }

  static async deleteNote(id: string): Promise<void> {
    try {
      const notes = await this.getAllNotes();
      const filteredNotes = notes.filter(note => note.id !== id);
      await AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(filteredNotes));
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  }

  static async getNoteById(id: string): Promise<Note | null> {
    try {
      const notes = await this.getAllNotes();
      return notes.find(note => note.id === id) || null;
    } catch (error) {
      console.error('Error getting note by id:', error);
      return null;
    }
  }
} 