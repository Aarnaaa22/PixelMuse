import { StudioProject, RenderConfig } from '../types';
import { getSupabase } from './supabaseClient';
import { DEFAULT_CONFIG } from '../stores/studioStore';

const STORAGE_KEY = 'pixelmuse_projects';

// Helper to read all local projects
export const getLocalProjects = (): StudioProject[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

// Helper to write local projects
export const saveLocalProjects = (projects: StudioProject[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (err) {
    console.error('[PixelMuse] Failed to save projects to localStorage:', err);
  }
};

export class ProjectService {
  /**
   * List all projects (Local first, merged with Supabase if online)
   */
  static async listProjects(userId?: string | null): Promise<StudioProject[]> {
    const local = getLocalProjects();

    const supabase = getSupabase();
    if (!supabase || !userId) {
      return local;
    }

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error || !data) return local;

      // Map Supabase rows to StudioProject
      const cloudProjects: StudioProject[] = data.map((row: {
        id: string;
        title: string;
        config: RenderConfig;
        created_at: string;
        updated_at: string;
        user_id: string;
      }) => ({
        id: row.id,
        title: row.title,
        config: row.config,
        createdAt: new Date(row.created_at).getTime(),
        updatedAt: new Date(row.updated_at).getTime(),
        userId: row.user_id,
        syncedWithSupabase: true,
      }));

      // Merge local and cloud without duplicates (local with same ID gets updated)
      const mergedMap = new Map<string, StudioProject>();
      local.forEach((p) => mergedMap.set(p.id, p));
      cloudProjects.forEach((p) => mergedMap.set(p.id, p));

      const merged = Array.from(mergedMap.values()).sort((a, b) => b.updatedAt - a.updatedAt);
      saveLocalProjects(merged);
      return merged;
    } catch {
      return local;
    }
  }

  /**
   * Create a new blank studio project
   */
  static async createProject(title: string, config?: RenderConfig, userId?: string | null): Promise<StudioProject> {
    const now = Date.now();
    const newProject: StudioProject = {
      id: `proj_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      title: title.trim() || 'UNTITLED_STUDIO_01',
      config: config || JSON.parse(JSON.stringify(DEFAULT_CONFIG)),
      createdAt: now,
      updatedAt: now,
      userId: userId || null,
      syncedWithSupabase: false,
    };

    const projects = [newProject, ...getLocalProjects()];
    saveLocalProjects(projects);

    // Sync to Supabase if authenticated
    const supabase = getSupabase();
    if (supabase && userId) {
      try {
        await supabase.from('projects').insert({
          id: newProject.id,
          user_id: userId,
          title: newProject.title,
          config: newProject.config,
          created_at: new Date(newProject.createdAt).toISOString(),
          updated_at: new Date(newProject.updatedAt).toISOString(),
        });
        newProject.syncedWithSupabase = true;
      } catch {
        // Local persistence succeeded, cloud sync queued
      }
    }

    return newProject;
  }

  /**
   * Save / Update an existing project
   */
  static async saveProject(
    projectId: string,
    title: string,
    config: RenderConfig,
    thumbnail?: string,
    userId?: string | null
  ): Promise<StudioProject> {
    const projects = getLocalProjects();
    const existingIndex = projects.findIndex((p) => p.id === projectId);
    const now = Date.now();

    let updatedProject: StudioProject;

    if (existingIndex >= 0) {
      updatedProject = {
        ...projects[existingIndex],
        title: title.trim(),
        config: JSON.parse(JSON.stringify(config)),
        thumbnail: thumbnail || projects[existingIndex].thumbnail,
        updatedAt: now,
        userId: userId || projects[existingIndex].userId,
      };
      projects[existingIndex] = updatedProject;
    } else {
      updatedProject = {
        id: projectId,
        title: title.trim(),
        config: JSON.parse(JSON.stringify(config)),
        thumbnail,
        createdAt: now,
        updatedAt: now,
        userId: userId || null,
        syncedWithSupabase: false,
      };
      projects.unshift(updatedProject);
    }

    saveLocalProjects(projects);

    // Sync to Supabase if authenticated (Do not upload original images!)
    const supabase = getSupabase();
    if (supabase && userId) {
      try {
        await supabase.from('projects').upsert({
          id: updatedProject.id,
          user_id: userId,
          title: updatedProject.title,
          config: updatedProject.config,
          created_at: new Date(updatedProject.createdAt).toISOString(),
          updated_at: new Date(updatedProject.updatedAt).toISOString(),
        });
        updatedProject.syncedWithSupabase = true;
      } catch {
        // Cloud upsert failed or table not present; local is safe
      }
    }

    return updatedProject;
  }

  /**
   * Rename an existing project
   */
  static async renameProject(projectId: string, newTitle: string, userId?: string | null): Promise<StudioProject | null> {
    const projects = getLocalProjects();
    const target = projects.find((p) => p.id === projectId);
    if (!target) return null;

    target.title = newTitle.trim();
    target.updatedAt = Date.now();
    saveLocalProjects(projects);

    const supabase = getSupabase();
    if (supabase && userId) {
      try {
        await supabase.from('projects').update({
          title: target.title,
          updated_at: new Date(target.updatedAt).toISOString(),
        }).eq('id', projectId);
      } catch {
        // Fallback
      }
    }

    return target;
  }

  /**
   * Duplicate a project
   */
  static async duplicateProject(projectId: string, userId?: string | null): Promise<StudioProject | null> {
    const projects = getLocalProjects();
    const source = projects.find((p) => p.id === projectId);
    if (!source) return null;

    const now = Date.now();
    const duplicated: StudioProject = {
      id: `proj_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      title: `${source.title} (Copy)`,
      config: JSON.parse(JSON.stringify(source.config)),
      thumbnail: source.thumbnail,
      createdAt: now,
      updatedAt: now,
      userId: userId || null,
      syncedWithSupabase: false,
    };

    saveLocalProjects([duplicated, ...projects]);

    const supabase = getSupabase();
    if (supabase && userId) {
      try {
        await supabase.from('projects').insert({
          id: duplicated.id,
          user_id: userId,
          title: duplicated.title,
          config: duplicated.config,
          created_at: new Date(duplicated.createdAt).toISOString(),
          updated_at: new Date(duplicated.updatedAt).toISOString(),
        });
        duplicated.syncedWithSupabase = true;
      } catch {
        // Fallback
      }
    }

    return duplicated;
  }

  /**
   * Delete a project
   */
  static async deleteProject(projectId: string, userId?: string | null): Promise<boolean> {
    const projects = getLocalProjects();
    const filtered = projects.filter((p) => p.id !== projectId);
    saveLocalProjects(filtered);

    const supabase = getSupabase();
    if (supabase && userId) {
      try {
        await supabase.from('projects').delete().eq('id', projectId);
      } catch {
        // Fallback
      }
    }

    return true;
  }
}

