import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { SceneObject, EditorMode, ActiveTool, Wall } from './types';

interface AppState {
  sceneObjects: SceneObject[];
  currentMode: EditorMode;
  selectedObjectId: string | null;
  activeTool: ActiveTool;
  history: { past: SceneObject[][]; future: SceneObject[][] };
}

interface AppActions {
  setMode: (mode: EditorMode) => void;
  setTool: (tool: ActiveTool) => void;
  setSelectedObject: (id: string | null) => void;
  addObject: (object: Omit<SceneObject, 'id'>) => void;
  updateObject: (id: string, updates: Partial<SceneObject>) => void;
  removeObject: (id: string) => void;
  saveState: () => void;
  loadState: () => void;
  undo: () => void;
  redo: () => void;
}

const useStore = create<AppState & AppActions>()(subscribeWithSelector((set, get) => ({
  sceneObjects: [],
  currentMode: '2D',
  selectedObjectId: null,
  activeTool: 'select',
  history: { past: [], future: [] },

  setMode: (mode) => set({ currentMode: mode }),
  setTool: (tool) => set({ activeTool: tool, selectedObjectId: null }),
  setSelectedObject: (id) => set({ selectedObjectId: id }),

  addObject: (object) => {
    const newObject = { ...object, id: uuidv4() } as SceneObject;
    set((state) => {
      const newSceneObjects = [...state.sceneObjects, newObject];
      const newPast = [...state.history.past, state.sceneObjects];
      return { sceneObjects: newSceneObjects, history: { past: newPast, future: [] } };
    });
  },

  updateObject: (id, updates) => {
    set((state) => {
      const newSceneObjects = state.sceneObjects.map((obj) =>
        obj.id === id ? { ...obj, ...updates } : obj
      );
      const newPast = [...state.history.past, state.sceneObjects];
      return { sceneObjects: newSceneObjects, history: { past: newPast, future: [] } };
    });
  },

  removeObject: (id) => {
    set((state) => {
      const newSceneObjects = state.sceneObjects.filter((obj) => obj.id !== id);
      const newPast = [...state.history.past, state.sceneObjects];
      return { sceneObjects: newSceneObjects, history: { past: newPast, future: [] } };
    });
  },

  undo: () => {
    set((state) => {
      const { past, future } = state.history;
      if (past.length === 0) return {};
      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);
      return {
        sceneObjects: previous,
        history: { past: newPast, future: [state.sceneObjects, ...future] },
      };
    });
  },

  redo: () => {
    set((state) => {
      const { past, future } = state.history;
      if (future.length === 0) return {};
      const next = future[0];
      const newFuture = future.slice(1);
      return {
        sceneObjects: next,
        history: { past: [...past, state.sceneObjects], future: newFuture },
      };
    });
  },

  saveState: () => {
    const state = get();
    localStorage.setItem('spacio-design', JSON.stringify(state.sceneObjects));
    alert('Design saved!');
  },

  loadState: () => {
    const savedState = localStorage.getItem('spacio-design');
    if (savedState) {
      try {
        const sceneObjects = JSON.parse(savedState) as SceneObject[];
        set({ sceneObjects, history: { past: [], future: [] } });
        alert('Design loaded!');
      } catch (e) {
        console.error('Failed to load design:', e);
        alert('Failed to load design.');
      }
    }
  },
})));

export default useStore;
