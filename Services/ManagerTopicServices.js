const MangerTopicDAO = require('./../DAO/MangerTopicDAO');
const Utils = require('./../Utils/ExceptionResponse');
const JWT_Utils = require('./../Utils/Autho');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;
/*
* NOTE:
*   bcrypt: https://www.npmjs.com/package/bcrypt
* */

module.exports = {
    RegisterTopic: RegisterTopic,
    DeleteTopic: DeleteTopic,
    EditDocLink: EditDocLink
}

async function RegisterTopic(req, resp) {
    req = req.body;

    if (!req.hasOwnProperty("studentID")) Utils.ThrowMissingFields(resp, "studentID");
    if (!req.hasOwnProperty("topicID")) Utils.ThrowMissingFields(resp, "topicID");
    if (!req.hasOwnProperty("teacherID")) Utils.ThrowMissingFields(resp, "teacherID");
    if (!req.hasOwnProperty("docLink")) Utils.ThrowMissingFields(resp, "docLink");

    try {
        await MangerTopicDAO.RegisterTopic(req.studentID, req.topicID, req.teacherID, req.docLink);
        Utils.SuccessResp(resp, Utils.Convert2String4Java("Register ok!"));
    } catch(e) {
        // console.log(e.errno);
        Utils.ResponseDAOFail(resp, e);
    }
}

async function DeleteTopic(req, resp) {
    req = req.body;
    if (!req.hasOwnProperty("managerTopicID")) Utils.ThrowMissingFields(resp, "managerTopicID");
    try {
        await MangerTopicDAO.DeleteTopic(req.managerTopicID);
        Utils.SuccessResp(resp, Utils.Convert2String4Java("Delete ok!"));
    } catch(e) {
        Utils.ResponseDAOFail(resp, e);
    }
}

async function EditDocLink(req, resp) {
    req = req.body;
    if (!req.hasOwnProperty("managerTopicID")) Utils.ThrowMissingFields(resp, "managerTopicID");
    if (!req.hasOwnProperty("docLink")) Utils.ThrowMissingFields(resp, "docLink");
    try {
        await MangerTopicDAO.EditDocLink(req.managerTopicID, req.docLink);
        Utils.SuccessResp(resp, Utils.Convert2String4Java("Saved!"));
    } catch(e) {
        Utils.ResponseDAOFail(resp, e);
    }
}