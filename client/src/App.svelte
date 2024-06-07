<script lang="ts">
  import { onMount } from "svelte";
  import s from "./app.module.scss";
  import Auth from "./pages/Auth/Auth.svelte";
  import Profile from "./pages/Profile/Profile.svelte";
  import RestorePass from "./pages/RestorePass/RestorePass.svelte";
  import Route from "./utils/Router/Route.svelte";
  import Router from "./utils/Router/Router.svelte";
  import server from "./utils/axiosInstance";
  import USER from "./store/user";
  import ReadFile from "./pages/ReadFile/ReadFile.svelte";
  import Data from "./pages/Data/Data.svelte";
  import MapElement from "./pages/Map/Map.svelte";

  onMount(() => {
    server.get("/user/me").then((res) => {
      USER.set(res.data.data.user);
    });
  });
</script>

<main class={s.app}>
  <Router></Router>
  <Route path="/register" element={Auth} />
  <Route path="/login" element={Auth} />
  <Route path="/restorepass" element={RestorePass} />
  <Route path="/profile" element={Profile} />
  <Route path="/file" element={ReadFile} />
  <Route path="/data" element={Data} />
  <Route path="/map" element={MapElement} />
</main>
