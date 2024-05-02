<script lang="ts">
  import s from "./app.module.scss";
  import Auth from "./pages/Auth/Auth.svelte";
  import Profile from "./pages/Profile/Profile.svelte";
  import RestorePass from "./pages/RestorePass/RestorePass.svelte";
  import Route from "./utils/Router/Route.svelte";
  import Router from "./utils/Router/Router.svelte";
</script>

<main class={s.app}>
  <Router></Router>
  <Route path="/register" element={Auth} />
  <Route path="/login" element={Auth} />
  <Route path="/restorepass" element={RestorePass} />
  <Route path="/profile" element={Profile} />
</main>
