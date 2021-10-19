const TopicDAO = require('./../DAO/TopicDAO');
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
    NewTopic: NewTopic,
    ApproveTopic: ApproveTopic,
    GetListTopic: GetListTopic,
    DetailTopic: DetailTopic
}

async function DetailTopic(req, resp) {
    req = req.body;

    if (!req.hasOwnProperty("topicID")) Utils.ThrowMissingFields(resp, "topicID");

    try {
        let res = await TopicDAO.GetDetailTopicByID(req.topicID);
        let comments = await MangerTopicDAO.GetAllCommentofTopic(res.msg[0].managerID);
        for (let j of comments.msg) {
            j.comment = Utils.Convert2String4Java(j.comment);
            j.timestamp = Utils.Convert2String4Java(j.timestamp);
        }
        res.msg[0].comments = comments.msg;
        res.msg[0].registed = Utils.Convert2String4Java(res.msg[0].registed);
        res.msg[0].topic_name = Utils.Convert2String4Java(res.msg[0].topic_name);
        res.msg[0].topic_desc = Utils.Convert2String4Java(res.msg[0].topic_desc);
        res.msg[0].create_time = Utils.Convert2String4Java(res.msg[0].create_time);

        let path = __dirname + "/../" + res.msg[0].topic_images;
        try {
            res.msg[0].topic_images = Utils.Convert2String4Java(fs.readFileSync(path, {encoding: 'base64'}));
        } catch(e) {
            res.msg[0].topic_images = Utils.Convert2String4Java("");
        }
        Utils.SuccessResp(resp, res.msg[0]);
    } catch (e) {
        Utils.ResponseDAOFail(resp, e);
    }
}

async function GetListTopic(req, resp) {
    try {
        let res = await TopicDAO.GetAllTopic();
        for (let i of res.msg) {
            i.topic_name = Utils.Convert2String4Java(i.topic_name);
            i.topic_desc = Utils.Convert2String4Java(i.topic_desc);
            i.teacher_email = Utils.Convert2String4Java(i.teacher_email);
            i.teacher_code = Utils.Convert2String4Java(i.teacher_code);
            i.status = Utils.Convert2String4Java(i.status);
            i.create_time = Utils.Convert2String4Java(i.create_time);
        }
        Utils.SuccessResp(resp, res.msg);
    } catch (e) {
        Utils.ResponseDAOFail(resp, e);
    }
}

async function NewTopic(req, resp) {
    req = req.body;

    if (!req.hasOwnProperty("topic_name")) Utils.ThrowMissingFields(resp, "topic_name");
    if (!req.hasOwnProperty("authorID")) Utils.ThrowMissingFields(resp, "authorID");
    if (!req.hasOwnProperty("topic_desc")) Utils.ThrowMissingFields(resp, "topic_desc");
    if (!req.hasOwnProperty("topic_images")) Utils.ThrowMissingFields(resp, "topic_images");

    try {
        let FilePath = "picture/" + Date.now();
        fs.writeFileSync(FilePath, req.topic_images, 'base64');
        await TopicDAO.NewTopic(req.authorID, req.topic_name, req.topic_desc, FilePath);
        Utils.SuccessResp(resp, [Utils.Convert2String4Java("Create topic ok")]);
    } catch(e) {
        console.log(e);
        Utils.ResponseDAOFail(resp, e);
    }
}

async function ApproveTopic(req, resp) {
    req = req.body;

    if (!req.hasOwnProperty("topicID")) Utils.ThrowMissingFields(resp, "topicID");

    try {
        await TopicDAO.ApproveTopic(req.topicID);
        Utils.SuccessResp(resp, [Utils.Convert2String4Java("Approve topic ok")]);
    } catch (e) {
        Utils.ResponseDAOFail(resp, e);
    }
}
