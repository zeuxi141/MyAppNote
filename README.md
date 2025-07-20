# MyNoteApp

A simple note-taking application built with React Native and Expo.

## Features

- ✅ Create new note
- ✅ Edit note
- ✅ Delete note
- ✅ add tags
- ✅ Save data with AsyncStorage
- .... in development

## Structures

```
src/
├── components/        
│   ├── NoteCard.tsx
│   ├── FloatingActionButton.tsx
│   └── index.ts
├── screens/          
│   ├── HomeScreen.tsx
│   ├── AddNoteScreen.tsx
│   ├── EditNoteScreen.tsx
│   └── index.ts
├── navigation/        
│   ├── AppNavigator.tsx
│   └── index.ts
├── services/         
│   ├── NoteService.ts
│   └── index.ts
├── types/           
│   ├── Note.ts
│   └── index.ts
├── utils/            
│   ├── dateUtils.ts
│   └── index.ts
├── hooks/            
│   ├── useNotes.ts
│   └── index.ts
└── constants/
    ├── Colors.ts
    └── index.ts
```

## Install

1. Dependencies:
   `yarn install`

2. Run app:
   `yarn start`

## Scripts
- `yarn start` - Run

## Thư viện sử dụng

- **React Native** - Framework
- **Expo** - Development platform
- **React Navigation** - Navigation
- **AsyncStorage** - Local storage
- **TypeScript** - Type safety