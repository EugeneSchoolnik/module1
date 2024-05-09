import { Router } from "express";
import { update } from "../controllers/profile";
import { upload } from "../utils/upload";
import { auth } from "../controllers/user";

const profile = Router();

profile.post("/update", auth, upload.single("avatar"), update);

export default profile;
