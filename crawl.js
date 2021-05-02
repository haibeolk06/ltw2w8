const News = require('./models/News');
const fetch = require('node-fetch');
const nodemailer = require('nodemailer');

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
            http://localhost:3000/news
        `,
        html: `
            <h1>Hello, you have been a news about covid-19</h1>
            <p>Please click the link below to check the news</p>
            <a href="http://localhost:3000/news">News about Covid-19</a>
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
}, 60 * 1000 * 15);