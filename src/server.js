const express = require('express');
const multer = require('multer');
const dotenv = require('dotenv');
const User = require('./models/UserModel');
const Track = require('./models/TrackModel');
const {default : mongoose } = require('mongoose');
const routes = require('./routes/api/api');
const cors = require('cors');
const bcrypt = require('bcrypt');
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
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }); 

app.post('/api/user/sign-up', upload.single('image'), async (req, res) => {
    try {
      const image = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
      const { name, email, password, confirmPassword } = req.body;
      if(password !== confirmPassword) {
        return res.status(200).json({
            status: 'ERR',
            message: 'The password and confirmPassword is not match'
        })
        }
      const hashPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        name: name,
        email: email,
        password: hashPassword,
        image: image
      });
  
      // Save the user to the database
      await newUser.save();
  
      // Send a response
      res.status(200).json({ status: 'success', message: 'Sign up successfully' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
  });

  app.post('/api/music/create', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'music', maxCount: 1 }]), async (req, res) => {
    try {
        console.log('files', req.files);

        const image = req.files && req.files['image'] && req.files['image'][0]
            ? { data: req.files['image'][0].buffer, contentType: req.files['image'][0].mimetype }
            : null;

        const music = req.files && req.files['music'] && req.files['music'][0]
            ? { data: req.files['music'][0].buffer, contentType: req.files['music'][0].mimetype }
            : null;

        console.log('image', image);
        console.log('music', music);

        if (!image || !music) {
            console.log('Missing files');
            return res.status(400).json({ status: 'error', message: 'Invalid request. Missing files.' });
        }
        console.log('body',req.body)
        const { user,name, genres, singer, description } = req.body;

        const newUser = new Track({
            name: name,
            user: user,
            genres: genres,
            singer: singer,
            description: description,
            image: image,
            music: music
        });

        await newUser.save();

        // Send a response
        res.status(200).json({ status: 'success', message: 'Create music successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});



  app.post('/api/user/update-user/:id', upload.single('image'), async (req, res) => {
    console.log(req.body)
    try {
      const image = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
      const { name} = req.body;
      
      const checkUser = await User.findById(req.params.id)
      if(!checkUser) {
        return res.status(200).json({
            status: 'ERR',
            message: 'User not found'
        })
        }
      const updateUser = await User.findByIdAndUpdate(req.params.id, {name: name, image: image})
      // Save the user to the database
      await updateUser.save();
  
      // Send a response
      res.status(200).json({ status: 'success', message: 'Update successfully' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
  });
 
app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});      