<script lang="ts">
  import { onMount } from "svelte";
  import s from "./data.module.scss";
  import axios from "axios";

  type filters = "userId" | "id" | "title" | "completed";

  type todo = {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
  };

  let todos: {
    data: todo[];
    dataToShow: todo[];
    error: string;
    status: "pending" | "success" | "failed";
    sorts: (`:${filters}` | filters)[];
    filters: Record<string, boolean>;
  } = {
    data: [],
    dataToShow: [],
    error: "",
    status: "pending",
    sorts: [":id", ":userId", ":title", ":completed"],
    filters: {
      completed: false,
      notCompleted: false,
    },
  };

  let filters = {
    isShow: false,
    filters: {
      completed() {
        todos.dataToShow = todos.dataToShow.filter((i) => i.completed);
      },
      notCompleted() {
        todos.dataToShow = todos.dataToShow.filter((i) => !i.completed);
      },
    },
    on(key: keyof typeof todos.filters) {
      todos.filters[key] = !todos.filters[key];
      sort.run();
    },
  };

  const sort = {
    sorts: {
      userId() {
        todos.dataToShow = todos.dataToShow.sort((a, b) =>
          todos.sorts.includes("userId") ? b.userId - a.userId : a.userId - b.userId
        );
      },
      id() {
        todos.dataToShow = todos.dataToShow.sort((a, b) => (todos.sorts.includes("id") ? b.id - a.id : a.id - b.id));
      },
      title() {
        todos.dataToShow = todos.dataToShow.sort((a, b) =>
          todos.sorts.includes("title") ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
        );
      },
      completed() {
        todos.dataToShow = todos.dataToShow.sort((a, b) =>
          todos.sorts.includes("completed") ? +b.completed - +a.completed : +a.completed - +b.completed
        );
      },
    },
    run() {
      todos.dataToShow = todos.data;
      const todosSorts = new Set(todos.sorts);

      for (const i of ["userId", "id", "title", "completed"].filter((i: any) => !todosSorts.has(i)))
        sort.sorts[i as filters]();

      for (const i of todos.sorts) {
        if (i[0] == ":") sort.sorts[i.slice(1) as filters]();
        else sort.sorts[i as filters]();
      }

      for (const k of Object.keys(todos.filters))
        if (todos.filters[k]) filters.filters[k as keyof typeof filters.filters]();
    },
    on(type: filters) {
      if (todos.sorts.includes(type)) {
        todos.sorts = todos.sorts.filter((k) => k !== type);
        todos.sorts.push(`:${type}`);
      } else {
        todos.sorts = todos.sorts.filter((k) => k !== `:${type}`);
        todos.sorts.push(type);
      }
      sort.run();
    },
  };

  onMount(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/todos")
      .then((res) => {
        todos.data = res.data;
        todos.status = "success";
        sort.run();
      })
      .catch((e) => {
        todos.status = "failed";
        todos.error = e.message;
      });
  });
</script>

<div class={s.data}>
  {#if todos.status == "pending"}
    <p>Loading ...</p>
  {:else if todos.status == "failed"}
    <p>Failed to load data</p>
  {:else}
    <table>
      <caption>
        TODOS
        <div class={s.filters}>
          <i class="fa-solid fa-filter" on:click={() => (filters.isShow = !filters.isShow)}></i>
          {#if filters.isShow}
            <ul>
              {#each Object.keys(filters.filters) as k (k)}
                <li>
                  <input type="checkbox" on:click={() => filters.on(k)} />{k}
                </li>
              {/each}
            </ul>
          {/if}
        </div>
      </caption>
      <tr>
        <th
          >userId<i
            on:click={() => sort.on("userId")}
            class={`fa-solid fa-caret-${todos.sorts.includes("userId") ? "down" : "up"}`}
          ></i></th
        >
        <th
          >id<i on:click={() => sort.on("id")} class={`fa-solid fa-caret-${todos.sorts.includes("id") ? "down" : "up"}`}
          ></i></th
        >
        <th
          >title<i
            on:click={() => sort.on("title")}
            class={`fa-solid fa-caret-${todos.sorts.includes("title") ? "down" : "up"}`}
          ></i></th
        >
        <th
          >completed<i
            on:click={() => sort.on("completed")}
            class={`fa-solid fa-caret-${todos.sorts.includes("completed") ? "down" : "up"}`}
          ></i></th
        >
      </tr>
      {#each todos.dataToShow as i (i.id)}
        <tr>
          <td>{i.userId}</td>
          <td>{i.id}</td>
          <td>{i.title}</td>
          <td>{i.completed}</td>
        </tr>
      {/each}
    </table>
  {/if}
</div>
