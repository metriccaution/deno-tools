// deno-lint-ignore-file camelcase

import { Color } from "./color.ts";
import { FilterComponent, toFilter } from "./filter-builder.ts";

export interface TodoistClient {
  // Projects
  listProjects: () => Promise<Project[]>;
  createProject: (request: CreateProject) => Promise<Project>;
  getProject: (id: number) => Promise<Project | undefined>;
  updateProject: (id: number, request: UpdateProject) => Promise<void>;
  deleteProject: (id: number) => Promise<void>;
  projectCollaborators: (id: number) => Promise<Collaborator[]>;
  // Sections
  listSections: (projectId: number) => Promise<Section[]>;
  createSection: (request: CreateSecion) => Promise<Section>;
  getSection: (id: number) => Promise<Section | undefined>;
  updateSection: (id: number, request: { name: string }) => Promise<void>;
  deleteSection: (id: number) => Promise<void>;
  // Tasks
  listActiveTasks: (query?: Partial<TaskQuery>) => Promise<Task[]>;
  createTask: (request: CreateTask) => Promise<Task>;
  getTask: (id: number) => Promise<Task | undefined>;
  updateTask: (id: number, request: Partial<UpdateTask>) => Promise<void>;
  closeTask: (id: number) => Promise<void>;
  reopenTask: (id: number) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  // Comments
  listComments: (query: CommentQuery) => Promise<Comment[]>;
  createComment: (
    request: CreateTaskComment | CreateProjectComment,
  ) => Promise<Comment>;
  getComment: (id: number) => Promise<Comment>;
  updateComment: (id: number, request: { content: string }) => Promise<void>;
  deleteComment: (id: number) => Promise<void>;
  // Labels
  listLabels: () => Promise<Label[]>;
  createLabel: (request: CreateLabel) => Promise<Label>;
  getLabel: (id: number) => Promise<Label | undefined>;
  updateLabel: (id: number, request: Partial<UpdateLabel>) => Promise<void>;
  deleteLabel: (id: number) => Promise<void>;
}

/**
 * https://developer.todoist.com/rest/v1/?shell#projects
 */
export interface Project {
  id: number;
  parent_id?: number;
  order: number;
  color: Color;
  name: string;
  shared: boolean;
  favorite: boolean;
  url: string;
  comment_count: number;
  sync_id: number;
  inbox_project?: boolean;
  team_inbox?: boolean;
}

/**
 * https://developer.todoist.com/rest/v1/?shell#update-a-project
 */
export interface UpdateProject {
  name?: string;
  color?: Color;
  favorite?: boolean;
}

/**
 * https://developer.todoist.com/rest/v1/?shell#create-a-new-project
 */
export interface CreateProject extends UpdateProject {
  name: string;
  parent_id?: number;
}

/**
 * https://developer.todoist.com/rest/v1/?shell#get-all-collaborators
 */
export interface Collaborator {
  id: number;
  name: string;
  email: string;
}

/**
 * https://developer.todoist.com/rest/v1/?shell#sections
 */
export interface Section {
  id: number;
  project_id: number;
  order: number;
  name: string;
}

/**
 * https://developer.todoist.com/rest/v1/?shell#create-a-new-section
 */
export interface CreateSecion {
  name: string;
  project_id: number;
  order?: number;
}

export type Priority = 1 | 2 | 3 | 4;

/**
 * https://developer.todoist.com/rest/v1/?shell#tasks
 */
export interface Task {
  id: number;
  project_id: number;
  section_id: number;
  content: string;
  description: string;
  completed: boolean;
  label_ids: number[];
  parent_id?: number;
  order: number;
  priority: Priority;
  due?: {
    string: string;
    date: string;
    recurring: boolean;
    datetime?: string;
    timezone?: string;
  };
  url: string;
  comment_count: number;
  assignee?: number;
  assigner: number;
  created: string;
}

/**
 * https://developer.todoist.com/rest/v1/?shell#get-active-tasks
 */
export interface TaskQuery {
  project_id: number;
  section_id: number;
  label_id: number;
  filter: string | FilterComponent;
  lang: string;
  ids: string; // TODO - Maybe a list we concat ourselves
}

/**
 * https://developer.todoist.com/rest/v1/?shell#update-a-task
 */
export interface UpdateTask {
  content: string;
  description: string;
  label_ids: number[];
  priority: Priority;
  due_string: string;
  due_date: string;
  due_datetime: string;
  due_lang: string;
  assignee: number;
}

/**
 * https://developer.todoist.com/rest/v1/?shell#create-a-new-task
 */
export interface CreateTask {
  content: string;
  description?: string;
  project_id?: number;
  section_id?: number;
  parent_id?: number;
  order?: number;
  label_ids?: number[];
  priority?: Priority;
  due_string?: string;
  due_date?: string;
  due_datetime?: string;
  due_lang?: string;
  assignee?: number;
}

/**
 * https://developer.todoist.com/rest/v1/?shell#comments
 */
export interface Comment {
  id: number;
  task_id: number;
  project_id: number;
  posted: string;
  content: string;
  attachment?: {
    file_name: string;
    file_type: string;
    file_url: string;
    resource_type: string;
  };
}

/**
 * https://developer.todoist.com/rest/v1/?shell#get-all-comments
 */
export type CommentQuery = { project_id: number } | { task_id: number };

/**
 * https://developer.todoist.com/rest/v1/?shell#create-a-new-comment
 */
export interface CreateTaskComment {
  task_id: number;
  content: string;
  attachment?: {
    file_name: string;
    file_type: string;
    file_url: string;
    resource_type: string;
  };
}

/**
 * https://developer.todoist.com/rest/v1/?shell#create-a-new-comment
 */
export interface CreateProjectComment {
  project_id: number;
  content: string;
  attachment?: {
    file_name: string;
    file_type: string;
    file_url: string;
    resource_type: string;
  };
}

/**
 * https://developer.todoist.com/rest/v1/?shell#labels
 */
export interface Label {
  id: number;
  name: string;
  color: Color;
  order: number;
  favorite: boolean;
}

/**
 * https://developer.todoist.com/rest/v1/?shell#create-a-new-label
 */
export interface CreateLabel {
  name: string;
  order?: number;
  color?: Color;
  favorite?: boolean;
}

/**
 * https://developer.todoist.com/rest/v1/?shell#update-a-label
 */
export interface UpdateLabel {
  name: string;
  order: number;
  color: Color;
  favorite: boolean;
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
    allowMissing = false,
  ): Promise<Response> {
    const url = new URL(path, "https://api.todoist.com/rest/v1/");
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
        `Error requesting from Todoist (${path}): ${res.status} - ${res.statusText}`,
      );
    }
    return res;
  }

  private async post(path: string, body: unknown) {
    // TODO - Retries
    const res = await fetch(new URL(path, "https://api.todoist.com/rest/v1/"), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      throw new Error(
        `Error requesting from Todoist (${path}): ${res.status} - ${res.statusText}`,
      );
    }

    return res;
  }

  private async delete(path: string): Promise<void> {
    // TODO - Retries
    const res = await fetch(new URL(path, "https://api.todoist.com/rest/v1/"), {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(
        `Error listing projects: ${res.status} - ${res.statusText}`,
      );
    }
  }

  public async getProject(id: number): Promise<Project | undefined> {
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
    id: number,
    request: UpdateProject,
  ): Promise<void> {
    await this.post(`projects/${id}`, request);
  }

  public async deleteProject(id: number): Promise<void> {
    await this.delete(`projects/${id}`);
  }

  public async projectCollaborators(id: number): Promise<Collaborator[]> {
    const res = await this.get(
      `projects/${id}/collaborators`,
      new URLSearchParams(),
      true,
    );
    return res.json();
  }

  public async listSections(projectId: number): Promise<Section[]> {
    const res = await this.get(
      `sections`,
      new URLSearchParams({
        project_id: `${projectId}`,
      }),
      true,
    );
    return res.json();
  }

  public async createSection(request: CreateSecion): Promise<Section> {
    const res = await this.post("sections", request);
    return res.json();
  }

  public async getSection(id: number): Promise<Section | undefined> {
    const res = await this.get(`sections/${id}`, new URLSearchParams(), true);
    return res.status !== 404 ? res.json() : undefined;
  }

  public async updateSection(
    id: number,
    request: { name: string },
  ): Promise<void> {
    await this.post(`sections/${id}`, request);
  }

  public async deleteSection(id: number): Promise<void> {
    await this.delete(`sections/${id}`);
  }

  public async listActiveTasks(query?: Partial<TaskQuery>): Promise<Task[]> {
    const res = await this.get(
      "tasks",
      query
        ? new URLSearchParams(
          Object.entries(query).reduce(
            (obj, [k, v]) => {
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
            },
            {} as Record<string, string>,
          ),
        )
        : undefined,
    );
    return res.json();
  }

  public async createTask(request: CreateTask): Promise<Task> {
    const res = await this.post("tasks", request);
    return res.json();
  }

  public async getTask(id: number): Promise<Task | undefined> {
    const res = await this.get(`tasks/${id}`, new URLSearchParams(), true);
    return res.status !== 404 ? res.json() : undefined;
  }

  public async updateTask(
    id: number,
    request: Partial<UpdateTask>,
  ): Promise<void> {
    await this.post(`tasks/${id}`, request);
  }

  public async closeTask(id: number): Promise<void> {
    await this.post(`tasks/${id}/close`, undefined);
  }

  public async reopenTask(id: number): Promise<void> {
    await this.post(`tasks/${id}/reopen`, undefined);
  }

  public async deleteTask(id: number): Promise<void> {
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
            {} as Record<string, string>,
          ),
        )
        : undefined,
    );
    return res.json();
  }

  public async createComment(
    request: CreateTaskComment | CreateProjectComment,
  ): Promise<Comment> {
    const res = await this.post("comments", request);
    return res.json();
  }

  public async getComment(id: number): Promise<Comment> {
    const res = await this.get(`comments/${id}`);
    return res.json();
  }

  public async updateComment(
    id: number,
    request: { content: string },
  ): Promise<void> {
    await this.post(`comments/${id}`, request);
  }

  public async deleteComment(id: number): Promise<void> {
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

  public async getLabel(id: number): Promise<Label | undefined> {
    const res = await this.get(`labels/${id}`, new URLSearchParams(), true);
    return res.status !== 404 ? res.json() : undefined;
  }

  public async updateLabel(
    id: number,
    request: Partial<UpdateLabel>,
  ): Promise<void> {
    await this.post(`labels/${id}`, request);
  }

  public async deleteLabel(id: number): Promise<void> {
    await this.delete(`labels/${id}`);
  }
}
