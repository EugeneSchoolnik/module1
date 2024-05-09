import { Router } from "express";
import { check, send } from "../controllers/email";

const email = Router();

email.post("/send", send);

email.post("/check", check);

export default email;
