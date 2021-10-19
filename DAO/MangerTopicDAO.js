const db_info       = require('./DB_INFO');
const Utils         = require('./../Utils/ExceptionResponse');
const mysql         = require('mysql');

const connection    = mysql.createConnection(db_info.db_config);

module.exports = {
    RegisterTopic: RegisterTopic,
    DeleteTopic: DeleteTopic,
    EditDocLink: EditDocLink
}

function RegisterTopic(studentID, topicID, teacherID, docLink) {
    let sql = "INSERT INTO manager_topic (studentID, topicID, teacherID, doc_link) VALUES (?, ?, ?, ?)";

    return new Promise(((resolve, reject) => {
        connection.query(sql, [studentID, topicID, teacherID, docLink], (err, res) => Utils.HandQueryWithCode(err, res, resolve, reject));
    }));
}

function DeleteTopic(managerTopicID) {
    let sql = "DELETE FROM manager_topic WHERE managerID = ?";

    return new Promise(((resolve, reject) => {
        connection.query(sql, [managerTopicID], (err, res) => Utils.HandQuery(err, res, resolve, reject));
    }));
}

function EditDocLink(managerTopicID, docLink) {
    let sql = "UPDATE manager_topic SET doc_link = ? WHERE managerID = ?";

    return new Promise(((resolve, reject) => {
        connection.query(sql, [docLink, managerTopicID], (err, res) => Utils.HandQuery(err, res, resolve, reject));
    }));
}