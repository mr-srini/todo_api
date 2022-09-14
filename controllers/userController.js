import databaseConnection from "../connection.js";
import {
  validateUser,
  decodeAuthorization,
} from "../middleware/auth/userAuth.js";
import { userValidator } from "../middleware/validater.js";
import { genSaltSync, hashSync, compareSync } from "bcrypt";
import jsonWebToken from "jsonwebtoken";
import dotenvConfigOptions from "dotenv";
import e from "express";

dotenvConfigOptions.config();

export const register = (req, response) => {
  const user = req.body;
  if (userValidator(user).errors.length > 0) {
    response
      .status(400)
      .send({ error: [userValidator(user).errors], status: "failed" });
  } else {
    //Password hashing
    user.password = hashSync(user.password, genSaltSync());
    databaseConnection.query(
      `INSERT INTO user (username, email, password) VALUES ('${user.username}', '${user.email}', '${user.password}')`,
      (err, res) => {
        if (err) response.status(400).send({ status: "failed", error: err });
        else {
          databaseConnection.query(
            `SELECT user.id,user.email, user.username  FROM user where user.email='${user.email}'`,
            (error, result) => {
              if (error)
                response.status(400).send({ status: "failed", error: error });
              else {
                response
                  .status(200)
                  .send({ status: "success", result: result });
              }
            }
          );
        }
      }
    );
  }
};

export const login = (req, res) => {
  const decodedEmailPassword = decodeAuthorization(req);
  databaseConnection.query(
    `Select * from user where user.email = '${decodedEmailPassword[0]}'`,
    (error, result) => {
      if (error) res.status(400).send({ status: "failed", error: error });
      else {
        if (result.length == 0) {
          res.status(404).send({
            status: "failed",
            error: `User with email ${decodedEmailPassword[0]} not found`,
          });
        } else {
          if (
            validateUser({
              password: decodedEmailPassword[1],
              hashPassword: result[0].password,
            })
          ) {
            const token = jsonWebToken.sign(
              { userid: result[0].id },
              process.env.JWT_TOKEN,
              {
                expiresIn: "1h",
              }
            );
            res.status(200).send({ status: "success", data: { token: token } });
          } else {
            res.status(401).send({
              status: "failed",
              error: `Incorrect email or password`,
            });
          }
        }
      }
    }
  );
};
