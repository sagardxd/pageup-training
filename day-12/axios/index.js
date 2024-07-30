const express = require('express');
const axios = require('axios');
// Initialize the app
const app = express();
const port = 3000;

app.use(express.json());

// Define a route for the home page
app.get('/', async (req, res) => {
    try {
        const data = await axios.get('https://192.168.1.11:8081/api/employee')
        console.log(data);
    }
    catch (error) {
        console.log(error)
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
