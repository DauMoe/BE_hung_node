const TopicDAO = require('./../DAO/TopicDAO');
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
    ApproveTopic: ApproveTopic
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
        Utils.ResponseDAOFail(resp, e.message);
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
