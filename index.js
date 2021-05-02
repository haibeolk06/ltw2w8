const express = require("express");

const app = express();

const cookieSession = require("cookie-session");

const authMiddlewares = require("./middlewares/auth");

const db = require("./models/db");

const expressLayouts = require('express-ejs-layouts');

const bodyParser = require("body-parser");

const News = require('./models/News');

const fetch = require('node-fetch');

const nodemailer = require('nodemailer');

//express ejs-layouts
app.use(expressLayouts);

app.use(express.json());

//session
app.use(cookieSession({
    name: 'session',
    keys: [process.env.COOKIE_KEY || 'secret'],
    maxAge: 24*60*60*1000
}));

//use authMiddlewares
app.use(authMiddlewares);

//use ejs
app.set("view engine", "ejs");

app.set("views", "./views");

//use body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/public', express.static('public'));

//use router
app.use(require('./routes/index'));
app.use(require('./routes/todo'));
app.use(require('./routes/auth'));
app.use(require('./routes/home'));
app.use(require('./routes/profile'));
app.use(require('./routes/admin'));
app.use(require('./routes/news'));

//connect to postgres
db.sync().then(function(){
    app.listen(process.env.PORT || 3000, function(){
        console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
      });
}).catch(console.error);


//get news covid-19
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL || 'ducnodemailer@gmail.com',
      pass: process.env.EMAIL_PASSWORD || 'ducnodemailer030'
    }
});

async function checkNews() {
    const Parser = require('rss-parser');
    const parser = new Parser();

    const feed = await parser.parseURL('https://siftrss.com/f/MALLlQnojP');
    for(const item in feed.items)
    {
        const newInfo = await News.findOne({ where: { link: feed.items[item].link } });
        if(newInfo === null)
        {
            const data = await News.create({ title: feed.items[item].title, link: feed.items[item].link, contentSnippet: feed.items[item].contentSnippet });
            if(data!=undefined)
            {
                console.log("insert successfully");
            }
            else 
            {
                console.log("insert failed");
            }
        }
        else 
        {
            console.log("new exists database");
        }
    }
};

const sendEmail = () => {
    const msg = {
        to: 'vlduyenlang02@gmail.com',
        from: process.env.EMAIL || 'ducnodemailer@gmail.com',              
        subject: 'notification',
        text: `
            Hello, you have been a news about covid-19
            Please click the link below to check the news
            http://ltw2w8.herokuapp.com/news
        `,
        html: `
            <h1>Hello, you have been a news about covid-19</h1>
            <p>Please click the link below to check the news</p>
            <a href="http://ltw2w8.herokuapp.com/news">News about Covid-19</a>
        `
    };
    try{
        transporter.sendMail(msg, (error, info) => {
            if(error)
            {
                console.log(error);
            }
            else
            {
                console.log("email send" + info.response);
            }
        })
    }
    catch(error){
        console.log(error);                
        res.redirect("/");
    }
}

setInterval(function () {
    checkNews().catch(console.error);
    sendEmail();
}, 10 * 60 * 1000);



