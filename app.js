var express = require('express');
var app = express();

const dotenv = require('dotenv');
dotenv.config();

var port = process.env.PORT || 3000;

var bodyParser = require('body-parser');

var mysql = require('mysql');
// connection configurations
var dbConn = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
});
// connect to database
dbConn.connect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', function (req, res) {
    return res.send({ message: 'hi user' })
});

// Retrieve all users 
app.get('/vocabulary', function (req, res) {
    dbConn.query('SELECT * from SelectVocabularyAndDetail', function (error, results, fields) {
        if (error) throw error;
        return res.send(toMapVocabulary(results));
    });
});

// Retrieve all users 
app.get('/version', function (req, res) {
    dbConn.query('SELECT * from version', function (error, results, fields) {
        if (error) throw error;
        return res.send(toMapVersion(results));
    });
});

function toMapVocabulary(result) {
    let list = []
    result.map(r => {
        list.push({
            'id': r.id, 
            'type': r.type,
            'article': r.article,
            'word': r.word,
            'favorite': r.favorite,
            'isOkt': "1",
            'shown': r.shown,
            'group': r.vgroup,
            'photoUrl': r.photoUrl,
            'mineAdded': r.mineAdded,
            'priorty': r.priorty,
            'vocabularyDetail':
            [{
                'id': r.vdid,
                'sentence': r.description,
                'sentenceMeaning': r.meaning
            }]
        })
    })
    return list;
}

function toMapVersion(result) {
    let list = []
    result.map(r => {
        list.push({
            'id': r.id, 
            'versionname': r.versionname,
        })
    })
    return list;
}

var server = app.listen(port, function () {
    console.log('Server running at http://127.0.0.1:' + port + '/');
});