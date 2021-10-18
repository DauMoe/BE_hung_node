const UserDAO = require('./../DAO/UserDAO');
const Utils = require('./../Utils/ExceptionResponse');
const JWT_Utils = require('./../Utils/Autho');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;
/*
* NOTE:
*   bcrypt: https://www.npmjs.com/package/bcrypt
* */

module.exports = {
    Login: Login,
    NewUser: NewUser,
    Rating: Rating
}

async function Rating(req, resp) {
    req = req.body;

    if (!req.hasOwnProperty("userID")) Utils.ThrowMissingFields(resp, "userID");
    if (!req.hasOwnProperty("stars")) Utils.ThrowMissingFields(resp, "stars");

    try {
        await UserDAO.Rating(req.userID, req.stars);
        Utils.SuccessResp(resp, Utils.Convert2String4Java("Thanks for rating!"));
    } catch(e) {
        Utils.ResponseDAOFail(resp, e);
    }
}

async function NewUser(req, resp) {
    req = req.body;

    if (!req.hasOwnProperty("email")) Utils.ThrowMissingFields(resp, "email");
    if (!req.hasOwnProperty("code")) Utils.ThrowMissingFields(resp, "code");
    if (!req.hasOwnProperty("password")) Utils.ThrowMissingFields(resp, "password");
    if (!req.hasOwnProperty("roles")) Utils.ThrowMissingFields(resp, "roles");

    try {
        let result = await UserDAO.CreateNewUser(req.email, req.code, req.password, req.roles);
        Utils.SuccessResp(resp, Utils.Convert2String4Java("Create user ok"));
    } catch(e) {
        Utils.ResponseDAOFail(resp, e);
    }
}

async function Login(req, resp) {
    req = req.body;
    let finger = false;

    if (!req.hasOwnProperty("email")) Utils.ThrowMissingFields(resp, "email");
    if (req.hasOwnProperty("finger")) finger = req.finger;
    if (!req.hasOwnProperty("password") && !finger) Utils.ThrowMissingFields(resp, "password");

    try {
        let result = await UserDAO.GetOneUser(req.email);

        if (result.msg.length == 0) {
            Utils.SuccessResp(resp, Utils.Convert2String4Java("User not existed!"));
        } else {
            delete result.msg[0].password;
            for (let i in result.msg[0]) {
                if (result.msg[0][`${i}`] != null && isNaN(Number(result.msg[0][`${i}`]))) {
                    result.msg[0][`${i}`] = Utils.Convert2String4Java(result.msg[0][`${i}`]);
                }
                if (result.msg[0][`${i}`] == null) {
                    result.msg[0][`${i}`] = Utils.Convert2String4Java("");
                }
            }
            Utils.SuccessResp(resp, result.msg[0]);
        }
    } catch(e) {
        Utils.ResponseDAOFail(resp, e);
    }
}