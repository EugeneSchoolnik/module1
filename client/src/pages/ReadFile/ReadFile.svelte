<script lang="ts">
  import s from "./readFile.module.scss";

  const documentExt = ["pdf", "doc", "docx"];

  let file: File | null = null;
  let extName = "";
  let fileURL = "";

  const onChange: any = (e: { target: HTMLInputElement }) => {
    if (!e.target.files?.length) return;
    file = e.target.files[0];
  };

  $: {
    if (file) {
      extName = file.name.split(".").slice(-1)[0];
      createFileURL(file).then((res) => {
        fileURL = res;
        if (extName == "doc" || extName == "docx")
          fileURL = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(fileURL)}`;
      });
    }
  }

  const createFileURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => {
        reject(reader.error);
      };
      reader.readAsDataURL(file);
    });
  };
</script>

<div class={s.readFile}>
  <label>
    Select file:
    <input type="file" on:change={onChange} accept=".pdf,.doc,.docx,.jpeg,.jpg,.png" />
  </label>
  {#if documentExt.includes(extName)}
    <iframe src={fileURL} width="100%" height="100%"></iframe>
  {:else}
    <img width="720px" src={fileURL} />
  {/if}
</div>
