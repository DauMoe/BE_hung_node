const MangerTopicDAO = require('./../DAO/MangerTopicDAO');
const Utils = require('./../Utils/ExceptionResponse');
const fs = require('fs');
const JWT_Utils = require('./../Utils/Autho');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;
/*
* NOTE:
*   bcrypt: https://www.npmjs.com/package/bcrypt
* */

module.exports = {
    setWsConn: setWsConn,
    RegisterTopic: RegisterTopic,
    DeleteTopic: DeleteTopic,
    EditDocLink: EditDocLink,
    PendingManaTopic: PendingManaTopic,
    ApproveManaTopic: ApproveManaTopic,
    CommentManaTopic: CommentManaTopic,
    GetAllCommentofTopic: GetAllCommentofTopic,
    SetDeadline: SetDeadline,
    GetTeacherManagerTopic: GetTeacherManagerTopic,
    DetailManaTopic: DetailManaTopic
}

let WsConnection = null;

function setWsConn(con) {
    WsConnection = con;
}

async function DetailManaTopic(req, resp) {
    req = req.body;

    if (!req.hasOwnProperty("teacherID")) Utils.ThrowMissingFields(resp, "teacherID");
    if (!req.hasOwnProperty("studentID")) Utils.ThrowMissingFields(resp, "studentID");

    try {
         let res = await MangerTopicDAO.GetManagerTopicDetail(req.teacherID, req.studentID);

         res.msg[0].doc_link = Utils.Convert2String4Java(res.msg[0].doc_link);
         res.msg[0].topic_name = Utils.Convert2String4Java(res.msg[0].topic_name);
         res.msg[0].topic_desc = Utils.Convert2String4Java(res.msg[0].topic_desc);
         res.msg[0].status = Utils.Convert2String4Java(res.msg[0].status);
         res.msg[0].create_time = Utils.Convert2String4Java(res.msg[0].create_time);
         res.msg[0].student_code = Utils.Convert2String4Java(res.msg[0].student_code);
         res.msg[0].student_email = Utils.Convert2String4Java(res.msg[0].student_email);
         res.msg[0].topic_state = Utils.Convert2String4Java(res.msg[0].topic_state);
         res.msg[0].deadline = Utils.Convert2String4Java(res.msg[0].deadline);
         try {
             res.msg[0].topic_images = Utils.Convert2String4Java(fs.readFileSync(__dirname + "/../" + res.msg[0].topic_images, {encoding: 'base64'}));
         } catch (e) {
             res.msg[0].topic_images = Utils.Convert2String4Java("");
         }
        Utils.SuccessResp(resp, [res.msg[0]]);
    } catch (e) {
        Utils.ResponseDAOFail(resp, e);
    }
}

async function GetTeacherManagerTopic(req, resp) {
    req = req.body;

    if (!req.hasOwnProperty("teacherID")) Utils.ThrowMissingFields(resp, "teacherID");

    try {
        let res = await MangerTopicDAO.GetTeacherManagerTopic(req.teacherID);
        for (let i of res.msg) {
            i.topic_name = Utils.Convert2String4Java(i.topic_name);
            i.topic_desc = Utils.Convert2String4Java(i.topic_desc);
            i.create_time = Utils.Convert2String4Java(i.create_time);
            i.student_code = Utils.Convert2String4Java(i.student_code);
            i.student_email = Utils.Convert2String4Java(i.student_email);
            i.doc_link = Utils.Convert2String4Java(i.doc_link);
            delete i.topic_images;
            delete i.status;
        }
        Utils.SuccessResp(resp, res.msg);
    } catch (e) {
        Utils.ResponseDAOFail(resp, e);
    }
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
        let res = await MangerTopicDAO.GetManagerTopicByManaID(req.managerID);
        setTimeout(() => {
            if (WsConnection != null) {
                console.log("Send noti to userID " + res.msg[0].studentID);
                WsConnection.sendUTF(`{"userID" : ${res.msg[0].studentID}, "msg": "Teacher comments on topic: '${req.comment}'"}`);
            }
        }, 1000);
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
        let res = await MangerTopicDAO.GetManagerTopicByManaID(req.managerID);
        setTimeout(() => {
            if (WsConnection != null) {
                console.log("Send noti to userID " + res.msg[0].studentID);
                WsConnection.sendUTF(`{"userID" : ${res.msg[0].studentID}, "msg": "${res.msg[0].topic_name} has approved!"}`);
            }
        }, 1000);
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
    console.log(req);

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
