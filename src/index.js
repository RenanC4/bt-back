const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const router = require('./router');
const config = require('../config/general');

const app = express();
mongoose.connect('mongodb+srv://buscatime:buscatime@btcluster-rwc9z.mongodb.net/buscatime?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(router);

// Deploying Rest Service
app.listen(config.app.PORT, (err) => {
  if (err) {
    return process.exit(1);
  }
  console.log(`listening on port: ${config.app.PORT}`);
});
