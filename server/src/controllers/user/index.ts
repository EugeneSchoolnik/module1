import jwt from "jsonwebtoken";
import uniqid from "uniqid";
import db from "../../db";
import { clientError, errorHandler } from "../../utils/error";
import { Handler } from "../../utils/express";
import { IUser } from "./types";
import { Response } from "express";
import countries from "./countries.json";

export const setToken = (res: Response, token: string, maxAge: number) => {
  res.cookie("authorization", token, { httpOnly: true, maxAge });
};

export const register: Handler = async (req, res) => {
  try {
    const { fullName, gender, age, phone, email, country, employed, password } = req.body as IUser & {
      password: string;
    };

    const exist = (await db.execute("SELECT id FROM users WHERE email = ? OR phone = ?", [email, phone]))[0][0];
    if (exist) throw clientError(409, "User with this data already exists");

    const id = uniqid.time();
    const hash = await Bun.password.hash(password, "bcrypt");

    const [result]: any = await db.execute(
      "INSERT INTO users (id, fullName, gender, age, phone, email, country, employed, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [id, fullName, gender, age, phone, email, country, employed, hash]
    );
    if (result && result.affectedRows !== 1) throw clientError(500, "Registration error");

    const user: IUser = { id, fullName, gender, age, phone, email, country, employed, avatar: null };
    const token = jwt.sign(user, Bun.env.JWT_SECRET, { expiresIn: "5d" });

    setToken(res, token, 5 * 24 * 60 * 60 * 1000);
    res.status(201).json({ data: { user } });
  } catch (e) {
    errorHandler(e, res);
  }
};

export const login: Handler = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = (await db.execute("SELECT * FROM users WHERE email = ?", [email]))[0][0];

    if (!result) throw clientError(404, "User not found");
    if (!(await Bun.password.verify(password, result.password))) throw clientError(401, "Invalid password");

    delete result.password;
    const user: IUser = result;
    const token = jwt.sign(user, Bun.env.JWT_SECRET, { expiresIn: "5d" });

    setToken(res, token, 5 * 24 * 60 * 60 * 1000);
    res.status(200).json({ data: { user } });
  } catch (e) {
    errorHandler(e, res);
  }
};

export const getMe: Handler = async (req, res) => {
  try {
    res.status(200).json({ data: { user: req.user } });
  } catch (e: any) {
    errorHandler(e, res);
  }
};

export const auth: Handler = async (req, res, next) => {
  try {
    const token = req.cookies.authorization;
    if (!token) throw clientError(401, "Token expired");

    try {
      const user = jwt.verify(token, Bun.env.JWT_SECRET) as IUser;
      req.user = user;

      next();
    } catch {
      throw clientError(401, "Token expired");
    }
  } catch (e: any) {
    errorHandler(e, res);
  }
};

export const logout: Handler = async (req, res, next) => {
  setToken(res, "", 0);
  res.send();
};

export const getCountries: Handler = async (req, res) => {
  try {
    res.status(200).json({ data: countries });
  } catch (e) {
    errorHandler(e, res);
  }
};

export const restorePass: Handler = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = (await db.execute("SELECT * FROM users WHERE email = ?", [email]))[0][0];
    if (!user) throw clientError(404, "User not found");

    const hash = await Bun.password.hash(password, "bcrypt");

    const result: any = await db.execute("UPDATE users SET password = ? WHERE email = ?", [hash, email]);
    if (result[0] && result[0].affectedRows == 0) throw clientError(500, "Error update password");

    res.status(200).send();
  } catch (e) {
    errorHandler(e, res);
  }
};
