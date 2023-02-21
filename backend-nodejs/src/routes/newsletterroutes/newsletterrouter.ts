import express from "express";
import { joinNewsletter } from "./joinnewsletter.js";
import { unsubNewsLetter } from "./unsubnewsletter.js";

const NewsletterRouter = express.Router();

NewsletterRouter.get('/join', joinNewsletter);
NewsletterRouter.get('/unsub', unsubNewsLetter);

export default NewsletterRouter;
