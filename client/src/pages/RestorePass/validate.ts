export const validate = (data: Record<string, { value: string; error: string }>) => {
  let valid = true;
  for (const k of Object.keys(data)) {
    const field = data[k];
    let error = "";
    switch (k) {
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value as string) || (field.value as string).indexOf("+") > -1)
          error = "Invalid value";
        break;
      case "password":
        if ((field.value as string).length < 8) {
          error = "Minimum length 8 characters";
          break;
        } else if (!/[a-z]/.test(field.value as string) || !/[A-Z]/.test(field.value as string)) {
          error = "Field must not be in the same register";
          break;
        } else if (!/[!@#$%^&*]/.test(field.value as string)) {
          error = "Field must contain specific characters";
          break;
        } else if (!/\d/.test(field.value as string)) {
          error = "Field must contain numbers";
        }
        break;
    }
    field.error = error;
    if (error) valid = false;
  }
  return valid;
};
