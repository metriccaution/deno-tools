# Todoist Client (Deno)

A [Deno](https://deno.land/) API client for [Todoist](todoist.com/), the only
runtime dependencies are
[fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API), so this
should work (after compilation to JavaScript) from a browser, or node with a
fetch polyfil.

This implments all of the endpoints in the
[Todoist API](https://developer.todoist.com/rest/v1/?shell), with minimal
updates. The deprecated _parent_ field is not implemented.

## Examples

### Get Important Tasks for Tomorrow

```typescript
import { filters, Todoist, TodoistClient, toFilter } from "./mod.ts";
const { and, dueOn, priorityOne } = filters;

const client: TodoistClient = new Todoist("0123456789abcdef0123456789");

const filter = and(dueOn("tomorrow"), priorityOne());

for (const task of await client.listActiveTasks({ filter })) {
  console.log(task.content);
}
```

### Create a Project, Put Tasks In It

```typescript
import { Color, Todoist, TodoistClient } from "./mod.ts";

const client: TodoistClient = new Todoist("0123456789abcdef0123456789");

const project = await client.createProject({
  name: "Example project",
  color: Color.MAGENTA,
});

const section1 = await client.createSection({
  name: "Section 1",
  project_id: project.id,
});

const section2 = await client.createSection({
  name: "Section 2",
  project_id: project.id,
});

await client.createTask({
  content: "Task 1",
  section_id: section1.id,
});

await client.createTask({
  content: "Task 2",
  section_id: section2.id,
});
```
