import { Request, Response } from "express";
import handleSession from "../verifysession.js";

export const logoutUser = (req : Request, res : Response) => {
    handleSession(req, res, "VERIFY_LOGOUT");
};