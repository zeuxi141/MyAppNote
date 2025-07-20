import { useState, useEffect } from 'react';
import { Note, CreateNoteRequest, UpdateNoteRequest } from '../types';
import { NoteService } from '../services';

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

  const refreshNotes = async () => {
    setRefreshing(true);
    await loadNotes();
    setRefreshing(false);
  };

  const createNote = async (noteData: CreateNoteRequest): Promise<Note> => {
    try {
      const newNote = await NoteService.createNote(noteData);
      await loadNotes(); // Reload to update the list
      return newNote;
    } catch (error) {
      console.error('Error creating note:', error);
      throw error;
    }
  };

  const updateNote = async (noteData: UpdateNoteRequest): Promise<Note> => {
    try {
      const updatedNote = await NoteService.updateNote(noteData);
      await loadNotes(); // Reload to update the list
      return updatedNote;
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  };

  const deleteNote = async (id: string): Promise<void> => {
    try {
      await NoteService.deleteNote(id);
      await loadNotes(); // Reload to update the list
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  };

  const getNoteById = async (id: string): Promise<Note | null> => {
    try {
      return await NoteService.getNoteById(id);
    } catch (error) {
      console.error('Error getting note by id:', error);
      return null;
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  return {
    notes,
    loading,
    refreshing,
    loadNotes,
    refreshNotes,
    createNote,
    updateNote,
    deleteNote,
    getNoteById,
  };
}; 