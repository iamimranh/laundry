import {
  createSession,
  getSession,
  destroySession,
} from "../jwtAuthentication";
import bcrypt from "bcrypt";
const saltRounds = 10;
import { Request, Response } from "express";
import { UserModel } from "../models/user";

const userExists = async (phone: string) => {
  const user = await UserModel.findOne({ phone });
  if (!user) return false;
  return true;
};

const hashPassword = async (password: string) => {
  return bcrypt
    .hash(password, saltRounds)
    .then((hash: string) => hash)
    .catch((error: Error) => console.log(error));

  // Store hash in your password DB.
};
const checkCredential = async (phone: string, password: string) => {
  try {
    if (!userExists(phone)) return false;
    const user = await UserModel.findOne({ phone });

    return bcrypt
      .compare(password, user.password)
      .then((result) => result)
      .catch((error: Error) => console.log(error));
  } catch (error) {
    console.log(error);
  }
};

const create = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("Register is being hit!");
    let { fullName, phone, address, password, type } = req.body;
    phone = phone.toLowerCase();
    password = await hashPassword(password);
    if (await userExists(phone)) {
      res.status(401).send("Phone already exists! Try another phone.");
      return;
    }
    const user = await UserModel.create({
      fullName,
      phone,
      address,
      password,
      type,
    });
    res.status(201).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send("Failed to Register");
  }
};

const login = async (req: Request, res: Response) => {
  try {
    let { phone, password } = req.body;
    phone = phone.toLowerCase();
    if (!(await checkCredential(phone, password))) {
      return res.status(401).send("Credenitials dont match!");
    }

    const token = createSession(phone);
    res.cookie("accessToken", token, {
      httpOnly: false,
      secure: false,
      //   sameSite: "Strict",
    });

    res.status(201).send({ accessToken: token });
  } catch (error) {
    console.log(error);
    res.status(500).send("Failed to Login!");
  }
};

const profile = async (req: Request, res: Response) => {
  try {
    // req.headers.authorization.split(' ')[1];
    const token = req.cookies.accessToken || req.get('Authorization');
    const session = getSession(token);

    const userPhone = session.userPhone;
    const user = await UserModel.findOne({ phone: userPhone });
    res.status(200).json({
      ...user.toObject(),
      password: undefined
    })
  } catch (error) {
    console.log(error);
    res.status(500).send("Profile Unavailable");
  }
};

const logout = (req: Request, res: Response) => {
  try {
    const token = req.cookies.accessToken || req.get('Authorization');
    if (destroySession(token))
      return res.status(200).send("Successfully logged out!");
    res.status(500).send("ERROR while logging out !");
  } catch (error) {
    console.log(error);
    res.status(500).send("Logout failed!");
  }
};

export { create, login, profile, logout };
