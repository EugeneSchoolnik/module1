type user = {
  fullName: { value: string; error: string };
  gender: { value: "male" | "female"; error: string };
  age: { value: null | number; error: string };
  phone: { value: string; error: string };
  email: { value: string; error: string };
  country: { value: string; error: string };
  employed: { value: boolean; error: string };
  password: { value: string; error: string };
};

export const validateForm = (data: user, isAuth: boolean, ignorePassword = false): boolean => {
  let valid = true;
  for (const k of Object.keys(data) as (keyof user)[]) {
    if (isAuth && k !== "email" && k !== "password") continue;
    const field = data[k];
    let error = "";
    switch (k) {
      case "fullName":
        if (!field.value) error = "The field can't be empty";
        break;
      case "age":
        if (!field.value) {
          error = "The field can't be empty";
          break;
        }
        if ((field.value as number) <= 0) error = "Invalid value";
        break;
      case "phone":
        if ((field.value as string).length !== 12) error = "Invalid length";
        break;
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value as string) || (field.value as string).indexOf("+") > -1)
          error = "Invalid value";
        break;
      case "country":
        if (!field.value) error = "The field can't be empty";
        break;
      case "password":
        if (ignorePassword) break;
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
