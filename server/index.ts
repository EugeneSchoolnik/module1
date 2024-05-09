import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import user from "./src/routes/user";
import email from "./src/routes/email";
import profile from "./src/routes/profile";

const app = express();
const PORT = Bun.env.PORT || 3000;

app
  // middlewares
  .use(
    cors({
      origin: Bun.env.CLIENT_HOST,
      credentials: true,
    })
  )
  .use(express.json())
  .use(cookieParser())
  .use(express.static("uploads"))
  // routes
  .use("/user", user)
  .use("/email", email)
  .use("/profile", profile);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
