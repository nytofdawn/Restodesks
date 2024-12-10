const { app, BrowserWindow, ipcMain } = require("electron");
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const bcrypt = require('bcrypt');
const Item = require('./models/item');
const path = require('path');

// MongoDB connection setup
mongoose.connect('mongodb+srv://ernan123:ernan123@restores.5sz4u.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB connected');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

// MongoDB schema and model for admins
const Admin = require('./models/Admin');

// Express app setup
const expressApp = express(); // Renamed to avoid conflict
expressApp.use(bodyParser.urlencoded({ extended: true }));
expressApp.use(bodyParser.json());

// Serve static files from the uploads directory
expressApp.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory to save uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
    }
});
const upload = multer({ storage });

// Add-Item API Route
expressApp.post('/api/add-item', upload.single('image'), async (req, res) => {
    try {
        const { name, category, price, description, table_number } = req.body;

        // Create a new item document
        const newItem = new Item({
            name,
            image: req.file ? req.file.filename : null,
            category,
            price,
            description,
            table_number,
        });

        // Save to the database
        const savedItem = await newItem.save();

        res.status(201).json(savedItem); // Respond with the saved item
    } catch (error) {
        console.error('Error adding item:', error);
        res.status(500).json({ message: 'Failed to add item. Please try again.' });
    }
});

// Start the Express server
const PORT = 3000;
expressApp.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Electron app setup
function createWindow() {
    const win = new BrowserWindow({
        width: 768,
        height: 560,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });
    win.loadFile('src/index.html');
}

// IPC Event: Register admin
ipcMain.on('register-user', async (event, adminData) => {
    const { name, email, password } = adminData;

    console.log('Received admin data for registration:', adminData);

    try {
        // Check if the email already exists in the database
        const existingAdmin = await Admin.findOne({ email });

        if (existingAdmin) {
            console.log('Email already exists:', email);
            event.reply('registration-response', { success: false, message: 'Email already exists' });
            return;
        }

        // Create a new admin
        const newAdmin = new Admin({ name, email, password });

        // Save the new admin to the database
        await newAdmin.save();
        console.log('Admin saved successfully:', newAdmin);

        // Send success response to the renderer process
        event.reply('registration-response', { success: true, message: 'Registration successful!' });
    } catch (err) {
        console.error('Error during registration:', err);
        event.reply('registration-response', { success: false, message: err.message });
    }
});

// IPC Event: Handle login for admins
ipcMain.on('login-user', async (event, loginData) => {
    const { email, password } = loginData;

    try {
        const admin = await Admin.findOne({ email });
        if (admin) {
            // Compare hashed password
            const isPasswordCorrect = await bcrypt.compare(password, admin.password);
            if (isPasswordCorrect) {
                event.reply('login-response', { success: true });
            } else {
                event.reply('login-response', { success: false, message: 'Wrong email or password' });
            }
        } else {
            event.reply('login-response', { success: false, message: 'Wrong email or password' });
        }
    } catch (error) {
        event.reply('login-response', { success: false, message: error.message });
    }
});

// Create Electron window
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
