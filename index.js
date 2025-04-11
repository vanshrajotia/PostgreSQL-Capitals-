import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const db = new pg.Client({
    user : "postgres",
    host : "localhost",
    database : "world",
    password: "[Your Password]",
    port : "[Your Server]",
});

const app = express();
const port = 3000;

db.connect();

let quiz = [];

db.query("SELECT * FROM capitals",(err,res)=>{
    if(err){
        console.error("Error executing query", err.stack);
    }else{
        quiz = res.rows;
    }
    db.end();
})

let score = 0;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentQuestion = {};

app.get("/",async(req,res)=>{
    score = 0;
    await nextQuestion();
    console.log(currentQuestion);
    res.render("index.ejs",{question : currentQuestion});
});

app.post("/submit",(req,res)=>{
    let answer = req.body.answer.trim();
    let isCorrect = false;
    if(currentQuestion.capital.toLowerCase() === answer.toLowerCase()){
        score++;
        console.log(score);
        isCorrect = true;
    }

    nextQuestion();
    res.render("index.ejs",{
        question : currentQuestion,
        wasCorrect : isCorrect,
        totalScore : score,
    });
});

async function nextQuestion(){
    const randomCountry = quiz[Math.floor(Math.random()*quiz.length)];
    currentQuestion = randomCountry;
}

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
  