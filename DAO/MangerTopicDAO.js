const db_info       = require('./DB_INFO');
const Utils         = require('./../Utils/ExceptionResponse');
const mysql         = require('mysql');

const connection    = mysql.createConnection(db_info.db_config);

module.exports = {
    RegisterTopic: RegisterTopic,
    DeleteTopic: DeleteTopic,
    EditDocLink: EditDocLink,
    GetPendingManagerTopic: GetPendingManagerTopic,
    ApproveManaTopic: ApproveManaTopic,
    CommentManaTopic: CommentManaTopic,
    GetAllCommentofTopic: GetAllCommentofTopic,
    SetDeadline: SetDeadline
}

function SetDeadline(managerID, deadline) {
    let sql = "UPDATE manager_topic SET deadline = ? WHERE managerID = ?";

    return new Promise((resolve, reject) => {
        connection.query(sql, [deadline, managerID], (err, res) => Utils.HandQuery(err, res, resolve, reject));
    });
}

function GetAllCommentofTopic(managerID) {
    let sql = "SELECT * FROM events WHERE managerID = ? ORDER BY timestamp DESC";

    return new Promise((resolve, reject) => {
        connection.query(sql, [managerID], (err, res) => Utils.HandQuery(err, res, resolve, reject));
    });
}

function CommentManaTopic(comment, managerID) {
    let sql = "INSERT INTO events (comment, managerID) VALUES (? ,?)";

    return new Promise((resolve, reject) => {
        connection.query(sql, [comment, managerID], (err, res) => Utils.HandQuery(err, res, resolve, reject));
    });
}

function ApproveManaTopic(managerID) {
    let sql = "UPDATE manager_topic SET status = 'ON' WHERE managerID = ?";

    return new Promise((resolve, reject) => {
        connection.query(sql, [managerID], (err, res) => Utils.HandQuery(err, res, resolve, reject));
    });
}

function GetPendingManagerTopic(teacherID) {
    let sql = "select h1.*, h2.code as 'student_code', h2.email as 'student_name', h3.topic_name, h3.topic_desc from manager_topic h1 inner join users h2 inner join topics h3 on h1.studentID = h2.userID where h1.teacherID = ? and h1.status = 'PENDING' and h1.topicID = h3.topicID";

    return new Promise((resolve, reject) => {
        connection.query(sql, [teacherID], (err, res) => Utils.HandQuery(err, res, resolve, reject));
    });
}

function RegisterTopic(studentID, topicID, teacherID, docLink) {
    let sql = "INSERT INTO manager_topic (studentID, topicID, teacherID, doc_link, status) VALUES (?, ?, ?, ?, 'ON')";

    return new Promise((resolve, reject) => {
        connection.query(sql, [studentID, topicID, teacherID, docLink], (err, res) => Utils.HandQueryWithCode(err, res, resolve, reject));
    });
}

function DeleteTopic(managerTopicID) {
    let sql = "DELETE FROM manager_topic WHERE managerID = ?";

    return new Promise((resolve, reject) => {
        connection.query(sql, [managerTopicID], (err, res) => Utils.HandQuery(err, res, resolve, reject));
    });
}

function EditDocLink(managerTopicID, docLink) {
    let sql = "UPDATE manager_topic SET doc_link = ? WHERE managerID = ?";

    return new Promise((resolve, reject) => {
        connection.query(sql, [docLink, managerTopicID], (err, res) => Utils.HandQuery(err, res, resolve, reject));
    });
}
