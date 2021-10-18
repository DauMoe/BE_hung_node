const db_info       = require('./DB_INFO');
const Utils         = require('./../Utils/ExceptionResponse');
const mysql         = require('mysql');

const connection    = mysql.createConnection(db_info.db_config);

module.exports = {
    GetOneUser: GetOneUser,
    CreateNewUser: CreateNewUser,
    Rating: Rating
}

function GetOneUser(email) {
    let sql = "SELECT * FROM users WHERE email = ?";

    return new Promise(((resolve, reject) => {
        connection.query(sql, [email], (err, res) => Utils.HandQuery(err, res, resolve, reject));
    }));
}

function CreateNewUser(email, code, password, roles) {
    let sql = "INSERT INTO users (email, code, password, roles) VALUES (?, ?, ?, ?)";

    return new Promise((resolve, reject) => {
        connection.query(sql, [email, code, password, roles], (err, res) => Utils.HandQuery(err, res, resolve, reject));
    });
}

function Rating(userID, stars) {
    let sql = "UPDATE users ";
    switch (stars) {
        case 1:
            sql += "one = one + 1"
            break;
        case 2:
            sql += "two = two + 1"
            break;
        case 3:
            sql += "three = three + 1"
            break;
        case 4:
            sql += "four = four + 1"
            break;
        case 5:
            sql += "five = five + 1"
            break;
        default:
            sql += "one = one";
    }
    sql += " WHERE userID = ?";

    return new Promise((resolve, reject) => {
        connection.query(sql, [userID], (err, res) => Utils.HandQuery(err, res, resolve, reject));
    });
}