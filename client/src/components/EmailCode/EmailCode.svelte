<script lang="ts">
  import { onMount } from "svelte";
  import s from "./emailcode.module.scss";
  import server from "../../utils/axiosInstance";
  import { emailStatus } from "../../store/email";

  export let email = "";
  export let subject = "";

  let hash = "";
  let code = "";
  let error = "";

  const onInput = (e: Event) => {
    const input = e.currentTarget as HTMLInputElement;
    input.value = code = input.value.replace(/[^\d]/g, "");

    if (code.length == 6) {
      server
        .post("/email/check", { code, hash })
        .then(() => {
          error = "";
          emailStatus.set("success");
        })
        .catch((e) => (error = e.response.data.message));
    }
  };

  onMount(() => {
    server.post("/email/send", { email, subject }).then((res) => (hash = res.data.data));
  });
</script>

<div class={s.emailcode}>
  <div class={s.popup}>
    <i class="fa-solid fa-circle-left" on:click={() => emailStatus.set("failed")}></i>
    <h3>Enter the code from your e-mail</h3>
    <input type="text" on:input={onInput} />
    {#if error}
      <span>{error}</span>
    {/if}
  </div>
</div>
