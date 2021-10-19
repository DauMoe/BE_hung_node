const db_info       = require('./DB_INFO');
const Utils         = require('./../Utils/ExceptionResponse');
const mysql         = require('mysql');

const connection    = mysql.createConnection(db_info.db_config);

module.exports = {
    NewPost: NewPost,
    GetPost: GetPost,

}

function NewPost(post_title, post_content, post_thum) {
    let sql = "INSERT INTO posts (post_title, post_content, post_thum) VALUES (?, ?, ?)";

    return new Promise((resolve, reject) => {
        connection.query(sql, [post_title, post_content, post_thum], (err, res) => Utils.HandQuery(err, res, resolve, reject));
    });
}

function GetPost() {
    let sql = "SELECT * FROM posts";

    return new Promise((resolve, reject) => {
        connection.query(sql,  (err, res) => Utils.HandQuery(err, res, resolve, reject));
    });
}