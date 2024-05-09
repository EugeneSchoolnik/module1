import { clientError, errorHandler } from "../utils/error";
import { Handler } from "../utils/express";
import transporter from "../nodemail";

export const send: Handler = async (req, res) => {
  try {
    const { email, subject } = req.body;

    const code = Array.from({ length: 6 })
      .map(() => Math.floor(Math.random() * 10))
      .join("");

    const hash = await Bun.password.hash(code, "bcrypt");

    await new Promise((resolve, reject) => {
      transporter.sendMail(
        {
          from: {
            name: "Module 1",
            address: Bun.env.NODE_MAIL_USER,
          },
          to: email,
          subject,
          html: `<p>Your code: <b>${code}</b></p>`,
        },
        (err) => {
          if (err) return reject(err);
          resolve(1);
        }
      );
    });

    res.status(200).json({ data: hash });
  } catch (e) {
    errorHandler(e, res);
  }
};

export const check: Handler = async (req, res) => {
  try {
    const { code, hash } = req.body;

    const verify = await Bun.password.verify(code, hash);
    if (!verify) throw clientError(409, "Invalid email code");

    res.status(200).send();
  } catch (e) {
    errorHandler(e, res);
  }
};
