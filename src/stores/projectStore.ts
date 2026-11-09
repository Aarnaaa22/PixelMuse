import { create } from 'zustand';
import { StudioProject, RenderConfig } from '../types';
import { ProjectService } from '../services/projectService';
import { useAuthStore } from './authStore';

interface ProjectState {
  projects: StudioProject[];
  activeProjectId: string | null;
  activeProjectTitle: string;
  isLoading: boolean;
  isProjectsModalOpen: boolean;

  // Actions
  loadProjects: () => Promise<void>;
  createProject: (title?: string, config?: RenderConfig) => Promise<StudioProject>;
  saveCurrentProject: (title: string, config: RenderConfig, thumbnail?: string) => Promise<StudioProject>;
  reopenProject: (id: string) => StudioProject | null;
  renameProject: (id: string, newTitle: string) => Promise<void>;
  duplicateProject: (id: string) => Promise<StudioProject | null>;
  deleteProject: (id: string) => Promise<void>;
  setActiveProjectId: (id: string | null, title?: string) => void;
  openProjectsModal: () => void;
  closeProjectsModal: () => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  activeProjectId: null,
  activeProjectTitle: 'UNTITLED_STUDIO_01',
  isLoading: false,
  isProjectsModalOpen: false,

  loadProjects: async () => {
    set({ isLoading: true });
    try {
      const user = useAuthStore.getState().user;
      const list = await ProjectService.listProjects(user?.id);
      set({ projects: list });
    } finally {
      set({ isLoading: false });
    }
  },

  createProject: async (title, config) => {
    const user = useAuthStore.getState().user;
    const projectTitle = title || `STUDIO_PROJ_${String(get().projects.length + 1).padStart(2, '0')}`;
    const newProj = await ProjectService.createProject(projectTitle, config, user?.id);

    set((state) => ({
      projects: [newProj, ...state.projects.filter((p) => p.id !== newProj.id)],
      activeProjectId: newProj.id,
      activeProjectTitle: newProj.title,
    }));

    return newProj;
  },

  saveCurrentProject: async (title, config, thumbnail) => {
    const user = useAuthStore.getState().user;
    const currentId = get().activeProjectId || `proj_${Date.now()}`;
    const projectTitle = title || get().activeProjectTitle || 'UNTITLED_STUDIO_01';

    const saved = await ProjectService.saveProject(currentId, projectTitle, config, thumbnail, user?.id);

    set((state) => ({
      projects: [saved, ...state.projects.filter((p) => p.id !== saved.id)],
      activeProjectId: saved.id,
      activeProjectTitle: saved.title,
    }));

    return saved;
  },

  reopenProject: (id: string) => {
    const project = get().projects.find((p) => p.id === id);
    if (project) {
      set({
        activeProjectId: project.id,
        activeProjectTitle: project.title,
      });
      return project;
    }
    return null;
  },

  renameProject: async (id: string, newTitle: string) => {
    const user = useAuthStore.getState().user;
    const updated = await ProjectService.renameProject(id, newTitle, user?.id);
    if (updated) {
      set((state) => ({
        projects: state.projects.map((p) => (p.id === id ? updated : p)),
        activeProjectTitle: state.activeProjectId === id ? updated.title : state.activeProjectTitle,
      }));
    }
  },

  duplicateProject: async (id: string) => {
    const user = useAuthStore.getState().user;
    const duplicated = await ProjectService.duplicateProject(id, user?.id);
    if (duplicated) {
      set((state) => ({
        projects: [duplicated, ...state.projects],
      }));
      return duplicated;
    }
    return null;
  },

  deleteProject: async (id: string) => {
    const user = useAuthStore.getState().user;
    await ProjectService.deleteProject(id, user?.id);
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      activeProjectId: state.activeProjectId === id ? null : state.activeProjectId,
    }));
  },

  setActiveProjectId: (id, title) =>
    set({
      activeProjectId: id,
      activeProjectTitle: title || 'UNTITLED_STUDIO_01',
    }),

  openProjectsModal: () => set({ isProjectsModalOpen: true }),
  closeProjectsModal: () => set({ isProjectsModalOpen: false }),
}));

