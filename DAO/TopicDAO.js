const db_info       = require('./DB_INFO');
const Utils         = require('./../Utils/ExceptionResponse');
const mysql         = require('mysql');

const connection    = mysql.createConnection(db_info.db_config);

module.exports = {
    NewTopic: NewTopic,
    GetPendingTopic: GetPendingTopic,
    ApproveTopic: ApproveTopic,
    GetAllTopic: GetAllTopic,
    GetDetailTopicByID: GetDetailTopicByID
}

function GetDetailTopicByID(topicID, studentID) {
    let sql = "select case when (SELECT f1.managerID FROM manager_topic f1 WHERE f1.topicID = ? AND f1.studentID = ?) IS NULL THEN 'false' ELSE 'true' END AS 'state', h1.authorID AS 'teacherID', h1.topicID, h2.managerID, h1.topic_name, h1.topic_desc, h1.topic_images, h1.create_time, h2.doc_link, h2.deadline FROM topics h1 left join manager_topic h2 on h1.topicID = h2.topicID where h1.topicID = ?";

    return new Promise((resolve, reject) => {
        connection.query(sql, [topicID, studentID, topicID], (err, res) => Utils.HandQuery(err, res, resolve, reject));
    });
}

function GetAllTopic() {
    let sql = "Select h1.*, h2.email as 'teacher_email', h2.code as 'teacher_code' from topics h1 left join users h2 on h1.authorID = h2.userID";
    console.log("???")
    return new Promise((resolve, reject) => {
        connection.query(sql,  (err, res) => Utils.HandQuery(err, res, resolve, reject));
    });
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
