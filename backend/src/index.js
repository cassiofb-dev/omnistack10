const express = require('express');

const mogoose = require('mongoose');

const routes = require('./routes');

const cors = require('cors');

const app = express();

mogoose.connect('mongodb+srv://gyaryu:gyaryu@omnistack10-v70kz.mongodb.net/10?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(3333)