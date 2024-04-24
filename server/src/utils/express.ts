import { NextFunction, Request, Response } from "express";
import { IUser } from "../controllers/user/types";

export type Handler = (req: Request & { user: IUser }, res: Response, next: NextFunction) => void