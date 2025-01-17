import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import express from 'express';

//import routes
import {topicRouter} from './routes/TopicRouter.js'

const app = express()
const port = process.env.PORT || 3000

const urlencodedParser = bodyParser.urlencoded({extended: false})

app.use(urlencodedParser);

app.get('/', async (req, res) => {
    res.send('Hello world');
})

const uri =`mongodb://db:27017/${process.env.MONGO_INITDB_DATABASE}`
try {
    mongoose.connect(`mongodb://db:27017/${process.env.MONGO_INITDB_DATABASE}`, {
        user: process.env.MONGO_USERNAME,
        pass: process.env.MONGO_PASSWORD,
        useNewUrlParser: true,
        useUnifiedTopology: true

    });
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    })
} catch (e) {
    console.error(e);
}
mongoose.connection.once('open',_=>{console.log(`Database is connected to: `, uri)})
mongoose.connection.on('error', err => {console.log(`Type error: ${err}`)})

//middleware of json
app.use(express.json());

//route
app.use('/topics',topicRouter);

//message for inexistent routes
app.use((req, res) => {
    res.status(404).send({error: -2, description: `route ${req.baseUrl}${req.url} method ${req.method} not implemented`});
});
