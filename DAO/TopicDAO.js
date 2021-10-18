const db_info       = require('./DB_INFO');
const Utils         = require('./../Utils/ExceptionResponse');
const mysql         = require('mysql');

const connection    = mysql.createConnection(db_info.db_config);

module.exports = {
    NewTopic: NewTopic,
    GetPendingTopic: GetPendingTopic,
    ApproveTopic: ApproveTopic
}

function NewTopic(authorID, topic_name, topic_desc, topic_images) {
    let sql = "INSERT INTO topics (authorID, topic_name, topic_desc, topic_images, status) VALUES (?, ?, ?, ?, 'PENDING')";

    return new Promise((resolve, reject) => {
        connection.query(sql, [authorID, topic_name, topic_desc, topic_images], (err, res) => Utils.HandQuery(err, res, resolve, reject));
    });
}

function GetPendingTopic() {
    let sql = "SELECT * FROM topics WHERE status = 'PENDING'";

    return new Promise((resolve, reject) => {
        connection.query(sql,  (err, res) => Utils.HandQuery(err, res, resolve, reject));
    });
}

function ApproveTopic(topicID) {
    let sql = "UPDATE topics SET status = 'ON' WHERE topicID = ?";

    return new Promise((resolve, reject) => {
        connection.query(sql,  [topicID],(err, res) => Utils.HandQuery(err, res, resolve, reject));
    });
}