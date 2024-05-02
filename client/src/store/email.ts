import { writable } from "svelte/store";

export const emailStatus = writable<"success" | "failed" | "pending">("failed");
