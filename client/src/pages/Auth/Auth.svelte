<script lang="ts">
  import s from "./auth.module.scss";
  import FormatInput from "../../utils/input/format";
  import { onMount } from "svelte";
  import server from "../../utils/axiosInstance";
  import { validateForm } from "./validateForm";
  import USER from "../../store/user";
  import Link from "../../utils/Router/Link.svelte";
  import { goTo } from "../../utils/Router/router";
  import EmailCode from "../../components/EmailCode/EmailCode.svelte";
  import { emailStatus } from "../../store/email";

  let isAuth = window.location.pathname.slice(1) == "login";
  let showPass = false;

  let countries: string[] = [];

  let user = {
    fullName: { value: "", error: "" },
    gender: { value: "male", error: "" },
    age: { value: null, error: "" },
    phone: { value: "380", error: "" },
    email: { value: "", error: "" },
    country: { value: "", error: "" },
    employed: { value: true, error: "" },
    password: { value: "", error: "" },
  };
  let serverError = "";

  const onSubmit = async () => {
    serverError = "";
    if (validateForm(user as any, isAuth)) {
      user = user;

      if (!isAuth) {
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
      }

      try {
        const res = await server.post(
          `/user/${isAuth ? "login" : "register"}`,
          Object.fromEntries(Object.entries(user).map(([key, value]) => [key, value.value]))
        );
        USER.set(res.data.data.user);
        goTo("/profile");
      } catch (e: any) {
        try {
          serverError = e.response.data.message;
        } catch {}
      }
    }
    user = user;
  };

  onMount(() => {
    server.get("/user/countries").then((res) => (countries = res.data.data));
  });
</script>

<div class={s.auth}>
  <form on:submit|preventDefault={onSubmit}>
    <h2>{isAuth ? "Authorization" : "Registration"}</h2>
    {#if !isAuth}
      <div class={s.formGroup}>
        <label>Full Name<input type="text" bind:value={user.fullName.value} /></label>
        <span class={s.error}>{user.fullName.error}</span>
      </div>
      <div class={s.formGroup}>
        Gender
        <div class={s.radioGroup}>
          <label>Male<input type="radio" name="gender" value="male" bind:group={user.gender.value} /></label>
          <label>Female<input type="radio" name="gender" value="female" bind:group={user.gender.value} /></label>
        </div>
        <span class={s.error}>{user.gender.error}</span>
      </div>
      <div class={s.formGroup}>
        <label>Age<input on:input={FormatInput.age} type="number" bind:value={user.age.value} /></label>
        <span class={s.error}>{user.age.error}</span>
      </div>
      <div class={s.formGroup}>
        <label>Phone<input on:input={FormatInput.phone} type="tel" bind:value={user.phone.value} /></label>
        <span class={s.error}>{user.phone.error}</span>
      </div>
      <div class={s.formGroup}>
        <label
          >country
          <select bind:value={user.country.value}>
            {#each countries as i}
              <option value={i}>{i}</option>
            {/each}
          </select>
        </label>
        <span class={s.error}>{user.country.error}</span>
      </div>
      <div class={s.formGroup}>
        Employed
        <div class={s.radioGroup}>
          <label>Yes<input type="radio" name="employed" value={true} bind:group={user.employed.value} /></label>
          <label>No<input type="radio" name="employed" value={false} bind:group={user.employed.value} /></label>
        </div>
        <span class={s.error}>{user.employed.error}</span>
      </div>
    {/if}
    <div class={s.formGroup}>
      <label>Email<input type="email" bind:value={user.email.value} /></label>
      <span class={s.error}>{user.email.error}</span>
    </div>
    <div class={s.formGroup}>
      <label
        >Password<input
          type={showPass ? "text" : "password"}
          on:input={(e) => (user.password.value = e.currentTarget.value)}
        /><i on:click={() => (showPass = !showPass)} class={`${s.eye} fa-solid fa-eye${showPass ? "" : "-slash"}`}
        ></i></label
      >
      <span class={s.error}>{user.password.error}</span>
    </div>
    {#if serverError}
      <span class={s.serverError}>{serverError}</span>
    {/if}
    <button>{isAuth ? "Login" : "Register"}</button>
    <div class={s.actions}>
      {#if !isAuth}
        <Link to="/login">Already have an account?</Link>
      {:else}
        <Link to="/register">Don't have an account yet?</Link>
        <Link to="/restorepass">Forgot password?</Link>
      {/if}
    </div>
  </form>
  {#if $emailStatus == "pending"}
    <EmailCode email={user.email.value} subject="Registration" />
  {/if}
</div>
