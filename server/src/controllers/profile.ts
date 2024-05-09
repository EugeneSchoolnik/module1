import db from "../db";
import jwt from "jsonwebtoken";
import { clientError, errorHandler } from "../utils/error";
import { Handler } from "../utils/express";
import { IUser } from "./user/types";
import { setToken } from "./user";

export const update: Handler = async (req, res) => {
  try {
    const { fullName, gender, age, phone, email, country, employed, password } = req.body;

    if (password) {
      const hash = await Bun.password.hash(password, "bcrypt");
      const result: any = await db.execute("UPDATE users SET password = ? WHERE id = ?", [hash, req.user.id]);
      if (result[0] && result[0].affectedRows == 0) throw clientError(500, "Error update password");
    }

    if (req.file) {
      const result: any = await db.execute("UPDATE users SET avatar = ? WHERE id = ?", [
        Bun.env.SERVER_HOST + "/" + req.file.filename,
        req.user.id,
      ]);
      if (result[0] && result[0].affectedRows == 0) throw clientError(500, "Error update avatar");
    }

    const result: any = await db.execute(
      "UPDATE users SET fullName = ?, gender = ?, age = ?, phone = ?, email = ?, country = ?, employed = ? WHERE id = ?",
      [fullName, gender, age, phone, email, country, Boolean(employed), req.user.id]
    );

    if (result[0] && result[0].affectedRows == 0) throw clientError(500, "Error update data");

    const user = (await db.execute("SELECT * FROM users WHERE id = ?", [req.user.id]))[0][0];
    if (!user) throw clientError(500, "Error geting updated data");

    const token = jwt.sign(user, Bun.env.JWT_SECRET, { expiresIn: "5d" });
    setToken(res, token, 5 * 24 * 60 * 60 * 1000);

    res.status(200).json({ data: user });
  } catch (e) {
    errorHandler(e, res);
  }
};
