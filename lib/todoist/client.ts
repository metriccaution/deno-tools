// deno-lint-ignore-file camelcase

import { Color } from "./color.ts";
import { FilterComponent, toFilter } from "./filter-builder.ts";

export interface TodoistClient {
  // Projects
  listProjects: () => Promise<Project[]>;
  createProject: (request: CreateProject) => Promise<Project>;
  getProject: (id: string) => Promise<Project | undefined>;
  updateProject: (id: string, request: UpdateProject) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  projectCollaborators: (id: string) => Promise<Collaborator[]>;
  // Sections
  listSections: (projectId: string) => Promise<Section[]>;
  createSection: (request: CreateSecion) => Promise<Section>;
  getSection: (id: string) => Promise<Section | undefined>;
  updateSection: (id: string, request: { name: string }) => Promise<void>;
  deleteSection: (id: string) => Promise<void>;
  // Tasks
  listActiveTasks: (query?: Partial<TaskQuery>) => Promise<Task[]>;
  createTask: (request: CreateTask) => Promise<Task>;
  getTask: (id: string) => Promise<Task | undefined>;
  updateTask: (id: string, request: Partial<UpdateTask>) => Promise<void>;
  closeTask: (id: string) => Promise<void>;
  reopenTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  // Comments
  listComments: (query: CommentQuery) => Promise<Comment[]>;
  createComment: (
    request: CreateTaskComment | CreateProjectComment
  ) => Promise<Comment>;
  getComment: (id: string) => Promise<Comment>;
  updateComment: (id: string, request: { content: string }) => Promise<void>;
  deleteComment: (id: string) => Promise<void>;
  // Labels
  listLabels: () => Promise<Label[]>;
  createLabel: (request: CreateLabel) => Promise<Label>;
  getLabel: (id: string) => Promise<Label | undefined>;
  updateLabel: (id: string, request: Partial<UpdateLabel>) => Promise<void>;
  deleteLabel: (id: string) => Promise<void>;
}

/**
 * https://developer.todoist.com/rest/v2/?shell#projects
 */
export interface Project {
  id: string;
  parent_id?: string;
  order: number;
  color: Color;
  name: string;
  is_shared: boolean;
  is_favorite: boolean;
  url: string;
  comment_count: number;
  sync_id: string;
  is_inbox_project?: boolean;
  is_team_inbox?: boolean;
  // TODO - view_style
}

/**
 * https://developer.todoist.com/rest/v2/?shell#update-a-project
 */
export interface UpdateProject {
  name?: string;
  color?: Color;
  is_favorite?: boolean;
}

/**
 * https://developer.todoist.com/rest/v2/?shell#create-a-new-project
 */
export interface CreateProject extends UpdateProject {
  name: string;
  parent_id?: string;
}

/**
 * https://developer.todoist.com/rest/v2/?shell#get-all-collaborators
 */
export interface Collaborator {
  id: string;
  name: string;
  email: string;
}

/**
 * https://developer.todoist.com/rest/v2/?shell#sections
 */
export interface Section {
  id: string;
  project_id: string;
  order: number;
  name: string;
}

/**
 * https://developer.todoist.com/rest/v2/?shell#create-a-new-section
 */
export interface CreateSecion {
  name: string;
  project_id: string;
  order?: number;
}

export type Priority = 1 | 2 | 3 | 4;

/**
 * https://developer.todoist.com/rest/v2/?shell#tasks
 */
export interface Task {
  id: string;
  project_id: string;
  section_id: string | null;
  content: string;
  description: string;
  is_completed: boolean;
  labels: string[];
  parent_id?: string;
  order: number;
  priority: Priority;
  due: {
    string: string;
    date: string;
    recurring: boolean;
    datetime?: string;
    timezone?: string;
  } | null;
  url: string;
  comment_count: number;
  assignee_id: string | null;
  assigner_id: string | null;
  created_at: string;
}

/**
 * https://developer.todoist.com/rest/v2/?shell#get-active-tasks
 */
export interface TaskQuery {
  project_id: string;
  section_id: string;
  label_id: string;
  filter: string | FilterComponent;
  lang: string;
  ids: string; // TODO - Maybe a list we concat ourselves
}

/**
 * https://developer.todoist.com/rest/v2/?shell#update-a-task
 */
export interface UpdateTask {
  content: string;
  description: string;
  label_ids: string[];
  priority: Priority;
  due_string: string;
  due_date: string;
  due_datetime: string;
  due_lang: string;
  assignee: string;
}

/**
 * https://developer.todoist.com/rest/v2/?shell#create-a-new-task
 */
export interface CreateTask {
  content: string;
  description?: string;
  project_id?: string;
  section_id?: string;
  parent_id?: string;
  order?: number;
  label_ids?: string[];
  priority?: Priority;
  due_string?: string;
  due_date?: string;
  due_datetime?: string;
  due_lang?: string;
  assignee?: string;
}

/**
 * https://developer.todoist.com/rest/v2/?shell#comments
 */
export interface Comment {
  id: string;
  task_id: string | null;
  project_id: string | null;
  posted_at: string;
  content: string;
  attachment: {
    file_name: string;
    file_type: string;
    file_url: string;
    resource_type: string;
  } | null;
}

/**
 * https://developer.todoist.com/rest/v2/?shell#get-all-comments
 */
export type CommentQuery = { project_id: string } | { task_id: string };

/**
 * https://developer.todoist.com/rest/v2/?shell#create-a-new-comment
 */
export interface CreateTaskComment {
  task_id: string;
  content: string;
  attachment?: {
    file_name: string;
    file_type: string;
    file_url: string;
    resource_type: string;
  };
}

/**
 * https://developer.todoist.com/rest/v2/?shell#create-a-new-comment
 */
export interface CreateProjectComment {
  project_id: string;
  content: string;
  attachment?: {
    file_name: string;
    file_type: string;
    file_url: string;
    resource_type: string;
  };
}

/**
 * https://developer.todoist.com/rest/v2/?shell#labels
 */
export interface Label {
  id: string;
  name: string;
  color: Color;
  order: number;
  is_favorite: boolean;
}

/**
 * https://developer.todoist.com/rest/v2/?shell#create-a-new-label
 */
export interface CreateLabel {
  name: string;
  order?: number;
  color?: Color;
  is_favorite?: boolean;
}

/**
 * https://developer.todoist.com/rest/v2/?shell#update-a-label
 */
export interface UpdateLabel {
  name: string;
  order: number;
  color: Color;
  is_favorite: boolean;
}

/**
 * THe implementation of the Todoist client.
 */
export class Todoist implements TodoistClient {
  private readonly apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async get(
    path: string,
    params?: URLSearchParams,
    allowMissing = false
  ): Promise<Response> {
    const url = new URL(path, "https://api.todoist.com/rest/v2/");
    if (params) {
      url.search = params.toString();
    }
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (allowMissing && res.status === 404) {
      return res;
    }

    if (!res.ok) {
      throw new Error(
        `Error requesting from Todoist (${path}): ${res.status} - ${res.statusText}`
      );
    }
    return res;
  }

  private async post(path: string, body: unknown) {
    // TODO - Retries
    const res = await fetch(new URL(path, "https://api.todoist.com/rest/v2/"), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      throw new Error(
        `Error requesting from Todoist (${path}): ${res.status} - ${res.statusText}`
      );
    }

    return res;
  }

  private async delete(path: string): Promise<void> {
    // TODO - Retries
    const res = await fetch(new URL(path, "https://api.todoist.com/rest/v2/"), {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(
        `Error listing projects: ${res.status} - ${res.statusText}`
      );
    }
  }

  public async getProject(id: string): Promise<Project | undefined> {
    const res = await this.get(`projects/${id}`, new URLSearchParams(), true);
    return res.status !== 404 ? res.json() : undefined;
  }

  public async listProjects(): Promise<Project[]> {
    const res = await this.get("projects");
    return res.json();
  }

  public async createProject(request: CreateProject): Promise<Project> {
    const res = await this.post("projects", request);
    return res.json();
  }

  public async updateProject(
    id: string,
    request: UpdateProject
  ): Promise<void> {
    await this.post(`projects/${id}`, request);
  }

  public async deleteProject(id: string): Promise<void> {
    await this.delete(`projects/${id}`);
  }

  public async projectCollaborators(id: string): Promise<Collaborator[]> {
    const res = await this.get(
      `projects/${id}/collaborators`,
      new URLSearchParams(),
      true
    );
    return res.json();
  }

  public async listSections(projectId: string): Promise<Section[]> {
    const res = await this.get(
      `sections`,
      new URLSearchParams({
        project_id: `${projectId}`,
      }),
      true
    );
    return res.json();
  }

  public async createSection(request: CreateSecion): Promise<Section> {
    const res = await this.post("sections", request);
    return res.json();
  }

  public async getSection(id: string): Promise<Section | undefined> {
    const res = await this.get(`sections/${id}`, new URLSearchParams(), true);
    return res.status !== 404 ? res.json() : undefined;
  }

  public async updateSection(
    id: string,
    request: { name: string }
  ): Promise<void> {
    await this.post(`sections/${id}`, request);
  }

  public async deleteSection(id: string): Promise<void> {
    await this.delete(`sections/${id}`);
  }

  public async listActiveTasks(query?: Partial<TaskQuery>): Promise<Task[]> {
    const res = await this.get(
      "tasks",
      query
        ? new URLSearchParams(
            Object.entries(query).reduce((obj, [k, v]) => {
              // Stringify non-string values
              let value = `${v}`;

              switch (k) {
                case "filter":
                  if (typeof v === "object") {
                    value = toFilter(v);
                  }
                  break;
              }

              obj[k] = value;
              return obj;
            }, {} as Record<string, string>)
          )
        : undefined
    );
    return res.json();
  }

  public async createTask(request: CreateTask): Promise<Task> {
    const res = await this.post("tasks", request);
    return res.json();
  }

  public async getTask(id: string): Promise<Task | undefined> {
    const res = await this.get(`tasks/${id}`, new URLSearchParams(), true);
    return res.status !== 404 ? res.json() : undefined;
  }

  public async updateTask(
    id: string,
    request: Partial<UpdateTask>
  ): Promise<void> {
    await this.post(`tasks/${id}`, request);
  }

  public async closeTask(id: string): Promise<void> {
    await this.post(`tasks/${id}/close`, undefined);
  }

  public async reopenTask(id: string): Promise<void> {
    await this.post(`tasks/${id}/reopen`, undefined);
  }

  public async deleteTask(id: string): Promise<void> {
    await this.delete(`tasks/${id}`);
  }

  public async listComments(query: CommentQuery): Promise<Comment[]> {
    const res = await this.get(
      "comments",
      query
        ? new URLSearchParams(
            Object.entries(query).reduce(
              (obj, [k, v]) => ({
                ...obj,
                [k]: `${v}`,
              }),
              {} as Record<string, string>
            )
          )
        : undefined
    );
    return res.json();
  }

  public async createComment(
    request: CreateTaskComment | CreateProjectComment
  ): Promise<Comment> {
    const res = await this.post("comments", request);
    return res.json();
  }

  public async getComment(id: string): Promise<Comment> {
    const res = await this.get(`comments/${id}`);
    return res.json();
  }

  public async updateComment(
    id: string,
    request: { content: string }
  ): Promise<void> {
    await this.post(`comments/${id}`, request);
  }

  public async deleteComment(id: string): Promise<void> {
    await this.delete(`comments/${id}`);
  }

  public async listLabels(): Promise<Label[]> {
    const res = await this.get("labels");
    return res.json();
  }

  public async createLabel(request: CreateLabel): Promise<Label> {
    const res = await this.post("labels", request);
    return res.json();
  }

  public async getLabel(id: string): Promise<Label | undefined> {
    const res = await this.get(`labels/${id}`, new URLSearchParams(), true);
    return res.status !== 404 ? res.json() : undefined;
  }

  public async updateLabel(
    id: string,
    request: Partial<UpdateLabel>
  ): Promise<void> {
    await this.post(`labels/${id}`, request);
  }

  public async deleteLabel(id: string): Promise<void> {
    await this.delete(`labels/${id}`);
  }
}
