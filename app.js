const express = require('express');
require("dotenv").config();

const authRouter = require('./routes/auth');
const postRouter = require('./routes/posts');
const commentRouter = require('./routes/comments');
const { sequelize } = require('./models');

const app = express();


/* router */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



app.get('/upload', (req, res) => {
    res.sendFile(__dirname + "/views/test.html");
})

app.use(authRouter);
app.use('/posts', postRouter);
app.use('/comments', commentRouter);

app.listen(3000, async () => {
    console.log('server started');
    await sequelize.authenticate();
    console.log('db authenticate');
});