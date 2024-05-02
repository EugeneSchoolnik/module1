class FormatInput {
  static age(e: Event & { currentTarget: HTMLInputElement }) {
    e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "");
  }
  static phone(e: Event & { currentTarget: HTMLInputElement }) {
    e.currentTarget.value = "380" + e.currentTarget.value.replace(/\D/g, "").slice(3, 12);
  }
}

export default FormatInput;
