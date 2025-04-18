import { create } from 'zustand';
import { Project, ClassData, ClassImage } from '../types/project';
import { openDB } from 'idb';

interface ProjectStore {
  projects: Project[];
  loading: boolean;
  loadProjects: () => Promise<void>;
  createProject: (name: string) => Promise<{ success: boolean; error?: string }>;
  deleteProject: (id: string) => Promise<void>;
  renameProject: (id: string, newName: string) => Promise<{ success: boolean; error?: string }>;
  addClass: (projectId: string, className: string) => Promise<{ success: boolean; error?: string }>;
  deleteClass: (projectId: string, classId: string) => Promise<void>;
  renameClass: (projectId: string, classId: string, newName: string) => Promise<{ success: boolean; error?: string }>;
  addImageToClass: (projectId: string, classId: string, dataUrls: string[]) => Promise<void>;
  deleteImageFromClass: (projectId: string, classId: string, imageId: string) => Promise<void>;
}

const DB_NAME = 'teachable-machine-db';
const STORE_NAME = 'projects';

const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
};

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  loading: true,

  loadProjects: async () => {
    const db = await initDB();
    const projects = await db.getAll(STORE_NAME);
    const validatedProjects = projects.map(project => ({
      ...project,
      classes: Array.isArray(project.classes) ? project.classes : []
    }));
    set({ projects: validatedProjects, loading: false });
  },

  createProject: async (name: string) => {
    // Check if project name already exists
    const existingProject = get().projects.find(
      p => p.name.toLowerCase() === name.toLowerCase()
    );
    
    if (existingProject) {
      return { success: false, error: 'A project with this name already exists' };
    }

    const newProject: Project = {
      id: crypto.randomUUID(),
      name,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      classes: [],
    };

    const db = await initDB();
    await db.add(STORE_NAME, newProject);
    set({ projects: [...get().projects, newProject] });
    return { success: true };
  },

  deleteProject: async (id: string) => {
    const db = await initDB();
    await db.delete(STORE_NAME, id);
    set({ projects: get().projects.filter(p => p.id !== id) });
  },

  renameProject: async (id: string, newName: string) => {
    // Check if new name already exists in other projects
    const existingProject = get().projects.find(
      p => p.id !== id && p.name.toLowerCase() === newName.toLowerCase()
    );
    
    if (existingProject) {
      return { success: false, error: 'A project with this name already exists' };
    }

    const db = await initDB();
    const project = get().projects.find(p => p.id === id);
    if (!project) return { success: false, error: 'Project not found' };

    const updatedProject = {
      ...project,
      name: newName,
      updatedAt: Date.now(),
    };

    await db.put(STORE_NAME, updatedProject);
    set({
      projects: get().projects.map(p => 
        p.id === id ? updatedProject : p
      ),
    });

    return { success: true };
  },

  addClass: async (projectId: string, className: string) => {
    const db = await initDB();
    const project = get().projects.find(p => p.id === projectId);
    if (!project) return { success: false, error: 'Project not found' };

    // Check if class name already exists
    if (project.classes.some(c => c.name.toLowerCase() === className.toLowerCase())) {
      return { success: false, error: 'A group with this name already exists' };
    }

    const newClass: ClassData = {
      id: crypto.randomUUID(),
      name: className,
      createdAt: Date.now(),
      images: [],
    };

    const updatedProject = {
      ...project,
      classes: [...project.classes, newClass],
      updatedAt: Date.now(),
    };

    await db.put(STORE_NAME, updatedProject);
    set({
      projects: get().projects.map(p => 
        p.id === projectId ? updatedProject : p
      ),
    });

    return { success: true };
  },

  deleteClass: async (projectId: string, classId: string) => {
    const db = await initDB();
    const project = get().projects.find(p => p.id === projectId);
    if (!project) return;

    const updatedProject = {
      ...project,
      classes: project.classes.filter(c => c.id !== classId),
      updatedAt: Date.now(),
    };

    await db.put(STORE_NAME, updatedProject);
    set({
      projects: get().projects.map(p => 
        p.id === projectId ? updatedProject : p
      ),
    });
  },

  renameClass: async (projectId: string, classId: string, newName: string) => {
    const db = await initDB();
    const project = get().projects.find(p => p.id === projectId);
    if (!project) return { success: false, error: 'Project not found' };

    // Check if new name already exists in other classes
    if (project.classes.some(c => c.id !== classId && c.name.toLowerCase() === newName.toLowerCase())) {
      return { success: false, error: 'A group with this name already exists' };
    }

    const updatedProject = {
      ...project,
      classes: project.classes.map(c => 
        c.id === classId ? { ...c, name: newName } : c
      ),
      updatedAt: Date.now(),
    };

    await db.put(STORE_NAME, updatedProject);
    set({
      projects: get().projects.map(p => 
        p.id === projectId ? updatedProject : p
      ),
    });

    return { success: true };
  },

  addImageToClass: async (projectId: string, classId: string, dataUrls: string[]) => {
    const db = await initDB();
    const project = get().projects.find(p => p.id === projectId);
    if (!project) return;

    const newImages: ClassImage[] = dataUrls.map(dataUrl => ({
      id: crypto.randomUUID(),
      dataUrl,
      createdAt: Date.now(),
    }));

    const updatedProject = {
      ...project,
      classes: project.classes.map(c => 
        c.id === classId 
          ? { ...c, images: [...c.images, ...newImages] }
          : c
      ),
      updatedAt: Date.now(),
    };

    await db.put(STORE_NAME, updatedProject);
    set({
      projects: get().projects.map(p => 
        p.id === projectId ? updatedProject : p
      ),
    });
  },

  deleteImageFromClass: async (projectId: string, classId: string, imageId: string) => {
    const db = await initDB();
    const project = get().projects.find(p => p.id === projectId);
    if (!project) return;

    const updatedProject = {
      ...project,
      classes: project.classes.map(c => 
        c.id === classId 
          ? { ...c, images: c.images.filter(img => img.id !== imageId) }
          : c
      ),
      updatedAt: Date.now(),
    };

    await db.put(STORE_NAME, updatedProject);
    set({
      projects: get().projects.map(p => 
        p.id === projectId ? updatedProject : p
      ),
    });
  },
}));