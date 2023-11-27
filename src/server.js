const express = require('express');
const dotenv = require('dotenv');
const {default : mongoose } = require('mongoose');
const routes = require('./routes/api/api');
const cors = require('cors');
const bodyParser = require('body-parser');
dotenv.config();

const configViewEngine = require('./config/viewEngine');
const port = process.env.PORT || 3001;
const app = express();

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(express.static('public'))
configViewEngine(app); 

routes(app);

mongoose.connect(process.env.MONGODB_URI) 
.then(() => {  
    console.log('Connected to the database!'); 
}) 

.catch((err) => {
    console.log('Cannot connect to the database!', err);
    process.exit();
})


 
app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});      