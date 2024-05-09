import { Router } from "express";
import { auth, getMe, login, register, getCountries, restorePass, logout } from "../controllers/user";

const user = Router();

user.post("/register", register);

user.post("/login", login);

user.get("/me", auth, getMe);

user.get("/countries", getCountries);

user.post("/restorepass", restorePass);

user.post("/logout", auth, logout);

export default user;
