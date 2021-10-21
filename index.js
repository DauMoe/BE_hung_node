const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const API_URL = require('./URL_DEFINE');
const USER_SV = require('./Services/UserServices');
const TOPIC_SV = require('./Services/TopicServices');
const POST_SV = require('./Services/PostServices');
const MANA_SV = require('./Services/ManagerTopicServices');
const http = require('http');
const WebSocketServer = require('websocket').server;
const server = http.createServer();
server.listen(9898);
const wsServer = new WebSocketServer({
    httpServer: server
});
wsServer.on('request', function(request) {
    const connection = request.accept(null, request.origin);
    connection.on('message', function(message) {
        console.log('Received Message:', message.utf8Data);
        setInterval(() => {
            connection.sendUTF('Hi this is WebSocket server!');
        }, 3000);
    });
    connection.on('close', function(reasonCode, description) {
        console.log('Client has disconnected.');
    });
});
return;

//Config
app.use(cors()); //Pass CORS

//Setup BodyParser (MAX SIZE: 100MB)
app.use(bodyParser.urlencoded({
    extended: true,
    "limit": '100mb'
}));
app.use(bodyParser.text());
app.use(bodyParser.json({
    "limit": "100mb"
}));
app.use(bodyParser.raw());
app.get("/", function (req, resp) {
    resp.send("<h1>Hi there</h1>");
});

app.post(API_URL.LOGIN, USER_SV.Login);
app.post(API_URL.NEW_USER, USER_SV.NewUser);
app.post(API_URL.RATING, USER_SV.Rating);

app.post(API_URL.NEW_TOPIC, TOPIC_SV.NewTopic);
app.post(API_URL.APPROVE_TOPIC, TOPIC_SV.ApproveTopic);
app.post(API_URL.LIST_TOPIC, TOPIC_SV.GetListTopic);
app.post(API_URL.DETAIL_TOPIC, TOPIC_SV.DetailTopic);

app.post(API_URL.NEW_POST, POST_SV.NewPost);
app.post(API_URL.ALL_POST, POST_SV.GetPost);

app.post(API_URL.REGIS_TOPIC, MANA_SV.RegisterTopic);
app.post(API_URL.DEL_TOPIC, MANA_SV.DeleteTopic);
app.post(API_URL.EDIT_LINK, MANA_SV.EditDocLink);
app.post(API_URL.PENDING_MANA_TOPIC, MANA_SV.PendingManaTopic);
app.post(API_URL.APPROVE_MANA_TOPIC, MANA_SV.ApproveManaTopic);
app.post(API_URL.COMMENT_MANA_TOPIC, MANA_SV.CommentManaTopic);
app.post(API_URL.GET_ALL_COMMENT, MANA_SV.GetAllCommentofTopic);
app.post(API_URL.LIST_MANA_TOPIC, MANA_SV.GetTeacherManagerTopic);
app.post(API_URL.SET_DEADLINE, MANA_SV.SetDeadline);
app.post(API_URL.DETAIL_MANA_TOPIC, MANA_SV.DetailManaTopic);

app.listen(8080, function() {
    console.log("Listen at http://<your device's IP>:8080");
});
