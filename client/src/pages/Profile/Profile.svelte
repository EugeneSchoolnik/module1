<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import FormatInput from "../../utils/input/format";
  import s from "./profile.module.scss";
  import server from "../../utils/axiosInstance";
  import { validateForm } from "../Auth/validateForm";
  import USER from "../../store/user";
  import { goTo } from "../../utils/Router/router";

  const unsub = USER.subscribe((i) => {
    if (!i) goTo("/login");
  });

  let showPass = false;
  let countries: string[] = [];

  let user = {
    fullName: { value: $USER?.fullName, error: "" },
    gender: { value: $USER?.gender, error: "" },
    age: { value: $USER?.age, error: "" },
    phone: { value: $USER?.phone, error: "" },
    email: { value: $USER?.email, error: "" },
    country: { value: $USER?.country, error: "" },
    employed: { value: Boolean($USER?.employed), error: "" },
    password: { value: "", error: "" },
    avatar: { value: [] as any, error: "" },
  };
  let serverError = "";

  const onSubmit = async () => {
    serverError = "";
    const file = user.avatar.value[0];
    user.avatar.error = "";
    if (file) {
      const validExtensions = ["jpg", "jpeg", "svg", "png"];
      if (!validExtensions.includes(file.name.split(".").slice(-1)[0])) user.avatar.error = "Invalid extension";
      else if (file.size > 5242880) user.avatar.error = "File weight should be up to 5 MB";
    }
    const avatarError = user.avatar.error;

    if (validateForm(user as any, false, true) && !avatarError) {
      user = user;
      try {
        const data = new FormData();
        Object.entries(user).forEach((i) => {
          data.append(i[0], i[0] == "avatar" ? i[1].value[0] : i[1].value);
        });

        const res = await server.post(`/profile/update`, data);
        USER.set(res.data.data);
        alert("Successful saved");
      } catch (e: any) {
        try {
          serverError = e.response.data.message;
        } catch {}
      }
    }
    user = user;
    user.avatar.error = avatarError;
  };

  const logout = async () => {
    try {
      await server.post("/user/logout");
      USER.set(null);
    } catch (e) {
      console.log(e);
    }
  };

  onMount(() => {
    server.get("/user/countries").then((res) => (countries = res.data.data));
  });
  onDestroy(unsub);
</script>

<div class={s.profile}>
  <button class={s.logout} on:click={logout}>LOGOUT</button>
  <img class={s.avatar} src={$USER?.avatar} alt="avatar" />
  <form on:submit|preventDefault={onSubmit}>
    <h2>Profile</h2>
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
    <div class={s.formGroup}>
      <label>
        Avatar
        <input type="file" bind:files={user.avatar.value} />
      </label>
      <span class={s.error}>{user.avatar.error}</span>
    </div>
    {#if serverError}
      <span class={s.serverError}>{serverError}</span>
    {/if}
    <button>Save</button>
  </form>
</div>
