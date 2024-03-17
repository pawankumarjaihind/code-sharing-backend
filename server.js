const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const Message = require("./model")
const dotenv = require('dotenv')
dotenv.config()

const app = express()
app.use(cors())
app.use(cookieParser());

app.use(express.json()) 
app.use(express.urlencoded({ extended: true }));

dbConnectionString = process.env.UIDAI

mongoose.connect(dbConnectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


app.get('/', (req, res) => {
    const htmlContent = `
    <html>
    <head>
        <title>Hello World</title>
        <style>
            /* Define CSS styles */
            .blue-text {
                color: blue;
            }
        </style>
    </head>
    <body>
        <h1>Hello World, Welcome !!!</h1>
        <footer>
            <marquee behavior="scroll" direction="left" class="blue-text">Developed by Pawan Kumar</marquee>
        </footer>
    </body>
    </html>
    `;
    res.send(htmlContent);
});

// app.get('/deviceId', (req, res) => {
//     let deviceId = req.cookies.deviceId;

//     // If deviceId cookie doesn't exist, generate a new one
//     if (!deviceId) {
//         deviceId = generateDeviceId();
//         res.cookie('deviceId', deviceId, { maxAge: 365 * 24 * 60 * 60 * 1000 }); // Set cookie to expire in 1 year
//     }

//     res.send(`Device ID: ${deviceId}`);
//   });

// function generateDeviceId() {
//     // Generate a random alphanumeric string
//     return Math.random().toString(36).substr(2, 10);
// }

app.get('/recent-message', async (req, res) => {
    try {
        const recentMessage = await Message.findOne({})
            .sort({ updatedAt: -1, createdAt: -1 })
            .limit(1);

        if (!recentMessage) {
            return res.status(404).json({ success: false, message: 'No recent message found' });
        }

        const { message, updatedAt } = recentMessage;

        res.status(200).json({ success: true, message, updatedAt });
    } catch (error) {
        console.error('Error retrieving recent message:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});


// Endpoint to add or update a message
app.post('/add-message', async (req, res) => {
    try {
      const { deviceId, message } = req.body;

      if (!deviceId || !message ){
        return res.status(400).json({success:false ,message :"All fields are Required"})
      }
  
      // Check if device ID already exists
      let existingMessage = await Message.findOne({ deviceId });
  
      if (existingMessage) {
        // If device ID exists, update the message
        existingMessage.message = message;
        existingMessage.updatedAt = Date.now();
        await existingMessage.save();
        res.status(200).json({ success: true, message: 'Message updated successfully' });
      } else {
        // If device ID doesn't exist, create a new message
        const newMessage = new Message({ deviceId, message });
        await newMessage.save();
        res.status(201).json({ success: true, message: 'Message added successfully' });
      }
    } catch (error) {
      console.error('Error adding/updating message:', error);
      res.status(500).json({ success: false, error: 'Server error' });
    }
  });
  

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
    const host = server.address().address;
    const port = server.address().port;
    console.log(`Server running at http://${host}:${port}`);
});
