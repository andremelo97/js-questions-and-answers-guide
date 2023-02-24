const express = require("express");
const app = express(); 
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Question = require("./database/Question");
const Answer = require("./database/Answer");

connection
    .authenticate()
    .then(() => {
        console.log("Connection established succesfully.")
    })
    .catch((err) => {
        console.log(err);
    });


app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    Question.findAll({ raw:true, order: 
        [['id', 'DESC']]})
            .then(questions => {
        res.render("index", {
            questions: questions
        });
    });

}).listen(3030, () => { console.log("App is running succesfully."); });

app.get("/questions", (req, res) => {
    res.render("questions");
});

app.post("/savequestion", (req, res) => {
    var title = req.body.title;
    var description = req.body.description;
    
    Question.create({
        title: title,
        description: description
    })
            .then(() => {
                res.redirect("/");
            })
            .catch((err) => {
                console.log(err);
            });
}); 

app.get("/question/:id", (req, res) => {
    var id = req.params.id;

    Question.findOne({
        where: {id: id}
    }).then(question => {
        if(question != undefined) {
            
            Answer.findAll({
                where: {question_id: question.id},
                order: [['id', 'DESC']]
            }).then(answers => {
                res.render("question", {
                    question: question,
                    answers: answers
                });
            });
        } else {
            res.redirect("/");
        }
    }).catch((err) => {
        console.log(err);
    });
});

app.post("/answer", (req, res) => {
    var body = req.body.body;
    var questionId = req.body.questionId;

    Answer.create({
        body: body,
        question_id: questionId
    }).then(() => {
        res.redirect("/question/" + questionId);
    }).catch((err) => {
        console.log(err);
    });
});