<script lang="ts">
  import EmailCode from "../../components/EmailCode/EmailCode.svelte";
  import { emailStatus } from "../../store/email";
  import { goTo } from "../../utils/Router/router";
  import server from "../../utils/axiosInstance";
  import s from "./restorepass.module.scss";
  import { validate } from "./validate";

  let showPass = false;
  let form = {
    email: { value: "", error: "" },
    password: { value: "", error: "" },
  };
  let serverError = "";

  const onSubmit = async () => {
    serverError = "";
    if (!validate(form)) return (form = form);
    form = form;

    emailStatus.set("pending");
    const checkEmail: "success" | "failed" = await new Promise((res) => {
      const interval = setInterval(() => {
        if ($emailStatus !== "pending") {
          res($emailStatus);
          clearInterval(interval);
        }
      }, 500);
    });
    if (checkEmail == "failed") return;

    server
      .post("/user/restorepass", { email: form.email.value, password: form.password.value })
      .then(() => {
        goTo("/login");
      })
      .catch((e) => (serverError = e.response.data.message));
  };
</script>

<div class={s.restorepass}>
  <form on:submit|preventDefault={onSubmit}>
    <h2>Restore password</h2>
    <label>
      Email
      <input type="email" bind:value={form.email.value} />
      <span class={s.error}>{form.email.error}</span>
    </label>
    <label>
      New password
      <input type={showPass ? "text" : "password"} on:input={(e) => (form.password.value = e.currentTarget.value)} />
      <i on:click={() => (showPass = !showPass)} class={`${s.eye} fa-solid fa-eye${showPass ? "" : "-slash"}`}></i>
      <span class={s.error}>{form.password.error}</span>
    </label>
    {#if serverError}
      <span class={s.serverError}>{serverError}</span>
    {/if}
    <button>Confirm</button>
  </form>
  {#if $emailStatus == "pending"}
    <EmailCode email={form.email.value} subject="Registration" />
  {/if}
</div>
