import express from "express";
import cookieParser from "cookie-parser";
import user from "./src/routes/user";

const app = express();
const PORT = Bun.env.PORT || 3000;

app
  // middlewares
  .use(express.json())
  .use(cookieParser())
  // routes
  .use("/user", user);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
