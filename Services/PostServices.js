const PostDAO = require('./../DAO/PostDAO');
const Utils = require('./../Utils/ExceptionResponse');
const JWT_Utils = require('./../Utils/Autho');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;
const fs = require('fs');
/*
* NOTE:
*   bcrypt: https://www.npmjs.com/package/bcrypt
* */

module.exports = {
    NewPost: NewPost,
    GetPost: GetPost
}

async function NewPost(req, resp) {
    req = req.body;

    if (!req.hasOwnProperty("title")) Utils.ThrowMissingFields(resp, "title");
    if (!req.hasOwnProperty("content")) Utils.ThrowMissingFields(resp, "content");
    if (!req.hasOwnProperty("thum")) Utils.ThrowMissingFields(resp, "thum");

    try {
        let FilePath = "picture/" + Date.now();
        fs.writeFile(FilePath, req.thum, 'base64', function (err) {
            if (err) {
                Utils.CustomMsg(resp, 201, [Utils.Convert2String4Java("Write to file err!")]);
            }
            PostDAO.NewPost(req.title, req.content, FilePath)
                .then(res1 => {
                    Utils.SuccessResp(resp, Utils.Convert2String4Java("Create post ok"));
                })
                .catch(err1 => {
                    Utils.ResponseDAOFail(resp, err1);
                });

        });
    } catch(e) {
        Utils.ResponseDAOFail(resp, e);
    }
}

async function GetPost(req, resp) {
    try {
        let res = await PostDAO.GetPost();
        for (let i of res.msg) {
            let path = __dirname + "/../" + i.post_thum;
            console.log(path);
            let base64Thum;
            try {
                base64Thum = fs.readFileSync(path, {encoding: 'base64'});
            } catch(e) {
                base64Thum = "";
            }
            i.post_title = Utils.Convert2String4Java(i.post_title);
            i.post_content = Utils.Convert2String4Java(i.post_content);
            i.post_thum = Utils.Convert2String4Java(base64Thum);
            i.create_time = Utils.Convert2String4Java(i.create_time);
        }
        Utils.SuccessResp(resp, res.msg);
    } catch(e) {
        Utils.ResponseDAOFail(resp, e);
    }
}
