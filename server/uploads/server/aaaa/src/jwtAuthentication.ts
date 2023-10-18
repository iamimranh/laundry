const jwt = require("jsonwebtoken");

const SUPER_SECRET_KEY = "you-shall-not-pass";
const blokcedList: string[] = []; // <-- not stateless

export const createSession = (userPhone: string) => {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 1);

  const newSession = {
    // no sessionId needed as session data is stored in token

    expiresAt: expiry.valueOf(),
    userPhone: userPhone,
  };

  return jwt.sign(newSession, SUPER_SECRET_KEY);
};

export const getSession = (token: string) => {
  if (blokcedList.includes(token)) return undefined; //comment out to make it stateless

  const sessionData = jwt.verify(token, SUPER_SECRET_KEY);

  if (sessionData.expiresAt < Date.now()) return undefined;

  return sessionData;
};

export const destroySession = (token: string) => {
  //comment out to make it stateless
  blokcedList.push(token);

  return true;
};
