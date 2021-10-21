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
    SetDeadline: SetDeadline,
    GetTeacherManagerTopic: GetTeacherManagerTopic,
    GetManagerTopicDetail: GetManagerTopicDetail,
    GetManagerTopicByManaID: GetManagerTopicByManaID
}

function GetManagerTopicByManaID(managerID) {
    let sql = "SELECT h1.studentID, h2.topic_name from manager_topic h1 inner join topics h2 on h1.topicID = h2.topicID where h1.managerID = ?";

    return new Promise((resolve, reject) => {
        connection.query(sql, [managerID], (err, res) => Utils.HandQuery(err, res, resolve, reject));
    });
}

function GetManagerTopicDetail(teacherID, studentID) {
    let sql = "select DISTINCT h1.managerID, h1.doc_link, CAST(h1.deadline as DATE) as deadline, h2.topic_name, h2.create_time, h1.status, h2.topic_desc, h2.topic_images, h3.code as 'student_code', CASE WHEN h1.status = 'ON' THEN 'true' ELSE 'false' END AS 'topic_state', h3.email as 'student_email' from manager_topic h1 inner join topics h2 inner join users h3 on h1.topicID = h2.topicID and h1.studentID = h3.userID where h1.teacherID = ? and h1.studentID = ?";

    return new Promise((resolve, reject) => {
        connection.query(sql, [teacherID, studentID], (err, res) => Utils.HandQuery(err, res, resolve, reject));
    });
}

function GetTeacherManagerTopic(teacherID) {
    let sql = "select DISTINCT h1.managerID, h1.doc_link, h1.studentID, h2.*, h3.code as 'student_code', h3.email as 'student_email' from manager_topic h1 inner join topics h2 inner join users h3 on h1.topicID = h2.topicID and h1.studentID = h3.userID where h1.teacherID = ?";

    return new Promise((resolve, reject) => {
        connection.query(sql, [teacherID], (err, res) => Utils.HandQuery(err, res, resolve, reject));
    });
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
    let sql = "INSERT INTO manager_topic (studentID, topicID, teacherID, doc_link, status) VALUES (?, ?, ?, ?, 'PENDING')";

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
