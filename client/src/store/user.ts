import { writable } from "svelte/store";

export interface IUser {
  id: string;
  fullName: string;
  gender: "male" | "female";
  age: number;
  phone: string;
  email: string;
  country: string;
  employed: boolean;
  avatar: string;
}

const USER = writable<IUser | null>(null);

export default USER;
