export interface IUser {
  id: string;
  fullName: string;
  gender: "male" | "female";
  age: number;
  phone: string;
  email: string;
  country: string;
  employed: boolean;
}
