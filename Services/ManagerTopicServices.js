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
    EditDocLink: EditDocLink,
    PendingManaTopic: PendingManaTopic,
    ApproveManaTopic: ApproveManaTopic,
    CommentManaTopic: CommentManaTopic,
    GetAllCommentofTopic: GetAllCommentofTopic,
    SetDeadline: SetDeadline
}

async function SetDeadline(req, resp) {
    req = req.body;

    if (!req.hasOwnProperty("deadline")) Utils.ThrowMissingFields(resp, "deadline");
    if (!req.hasOwnProperty("managerID")) Utils.ThrowMissingFields(resp, "managerID");

    try {
        await MangerTopicDAO.SetDeadline(req.managerID, req.deadline);
        Utils.SuccessResp(resp, [Utils.Convert2String4Java("Set deadline ok")]);
    } catch (e) {
        Utils.ResponseDAOFail(resp, e);
    }
}

async function CommentManaTopic(req, resp) {
    req = req.body;

    if (!req.hasOwnProperty("comment")) Utils.ThrowMissingFields(resp, "comment");
    if (!req.hasOwnProperty("managerID")) Utils.ThrowMissingFields(resp, "managerID");

    try {
        await MangerTopicDAO.CommentManaTopic(req.comment, req.managerID);
        Utils.SuccessResp(resp, [Utils.Convert2String4Java("Thanks for your comment!")]);
    } catch(e) {
        Utils.ResponseDAOFail(resp, e);
    }
}

async function GetAllCommentofTopic(req, resp) {
    req = req.body;

    if (!req.hasOwnProperty("managerID")) Utils.ThrowMissingFields(resp, "managerID");

    try {
        let res = await MangerTopicDAO.GetAllCommentofTopic(req.managerID);
        for (let i of res.msg) {
            i.comment = Utils.Convert2String4Java(i.comment);
            i.timestamp = Utils.Convert2String4Java(i.timestamp);
        }
        Utils.SuccessResp(resp, res.msg);
    } catch (e) {
        Utils.ResponseDAOFail(resp, e);
    }
}

async function ApproveManaTopic(req, resp) {
    req = req.body;

    if (!req.hasOwnProperty("managerID")) Utils.ThrowMissingFields(resp, "managerID");

    try {
        await MangerTopicDAO.ApproveManaTopic(req.managerID);
        Utils.SuccessResp(resp, [Utils.Convert2String4Java("Approve ok")]);
    } catch (e) {
        Utils.ResponseDAOFail(resp, e);
    }
}

async function PendingManaTopic(req, resp) {
    req = req.body;

    if (!req.hasOwnProperty("teacherID")) Utils.ThrowMissingFields(resp, "teacherID");

    try {
        let res = await MangerTopicDAO.GetPendingManagerTopic(req.teacherID);
        for (let i of res.msg) {
            i.timestamp = Utils.Convert2String4Java(i.timestamp);
            i.doc_link = Utils.Convert2String4Java(i.doc_link);
            i.student_code = Utils.Convert2String4Java(i.student_code);
            i.student_name = Utils.Convert2String4Java(i.student_name);
            i.status = Utils.Convert2String4Java(i.status);
            i.topic_name = Utils.Convert2String4Java(i.topic_name);
            i.topic_desc = Utils.Convert2String4Java(i.topic_desc);
        }
        Utils.SuccessResp(resp, res.msg);
    } catch (e) {
        Utils.ResponseDAOFail(resp, e);
    }
}

async function RegisterTopic(req, resp) {
    req = req.body;

    if (!req.hasOwnProperty("studentID")) Utils.ThrowMissingFields(resp, "studentID");
    if (!req.hasOwnProperty("topicID")) Utils.ThrowMissingFields(resp, "topicID");
    if (!req.hasOwnProperty("teacherID")) Utils.ThrowMissingFields(resp, "teacherID");
    if (!req.hasOwnProperty("docLink")) Utils.ThrowMissingFields(resp, "docLink");

    try {
        await MangerTopicDAO.RegisterTopic(req.studentID, req.topicID, req.teacherID, req.docLink);
        Utils.SuccessResp(resp, [Utils.Convert2String4Java("Register ok!")]);
    } catch(e) {
        if (e.msg.errno == 1062) {
            Utils.CustomMsg(resp, 201, [Utils.Convert2String4Java("This topic has been register by another student OR you registed a topic")]);
        } else {
            Utils.ResponseDAOFail(resp, e);
        }
    }
}

async function DeleteTopic(req, resp) {
    req = req.body;
    if (!req.hasOwnProperty("managerTopicID")) Utils.ThrowMissingFields(resp, "managerTopicID");
    try {
        await MangerTopicDAO.DeleteTopic(req.managerTopicID);
        Utils.SuccessResp(resp, [Utils.Convert2String4Java("Delete ok!")]);
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
        Utils.SuccessResp(resp, [Utils.Convert2String4Java("Saved!")]);
    } catch(e) {
        Utils.ResponseDAOFail(resp, e);
    }
}
