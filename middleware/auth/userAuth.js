import { compareSync } from "bcrypt";
import jsonWebToken from "jsonwebtoken";
import dotenvConfigOptions from "dotenv";
import { request } from "express";

dotenvConfigOptions.config();

export const validateUser = (user) => {
  return compareSync(user.password, user.hashPassword);
};

export const decodeAuthorization = (request) => {
  const base64Credentials = request.headers.authorization.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString(
    "ascii"
  );
  return credentials.split(":");
};

export const validateToken = (request, response, next) => {
  try {
    const token = request.headers.authorization.split(" ")[1];
    jsonWebToken.verify(token, process.env.JWT_TOKEN, (error, decoded) => {
      if (error)
        response
          .status(401)
          .send({ status: "failed", message: "Unauthorization" });
      else return next();
    });
  } catch (error) {
    response.status(401).send({ status: "failed", message: "Unauthorized" });
  }
};

export const decodeToken = (request) => {
  const token = request.headers.authorization.split(" ")[1];
  const id = jsonWebToken.verify(
    token,
    process.env.JWT_TOKEN,
    (error, decoded) => {
      if (error) return null;
      else return decoded.userid;
    }
  );
  return id;
};
