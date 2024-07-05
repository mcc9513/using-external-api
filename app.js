const express = require('express'); // Import the Express module
const axios = require('axios'); // Import the Axios module
const dotenv = require('dotenv'); // Import the dotenv module
const path = require('path'); // Import the path module

dotenv.config(); // Load environment variables from a .env file
console.log('Shazam API Key:', process.env.SHAZAM_API_KEY); // Debug: Log the API key to ensure it's loaded

const app = express(); // Create an instance of an Express application
const PORT = process.env.PORT || 3000; // Define the port number to listen on

// Middleware to parse URL-encoded data from the form
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Middleware to parse JSON data

// Serve static files (e.g., HTML, CSS)
app.use(express.static(path.join(__dirname, 'public')));

// Handle form submissions and fetch data from the Shazam API
app.post('/search', async (req, res) => {
  const keyword = req.body.keyword; // Get the keyword from the form input

  const options = {
    method: 'GET',
    url: 'https://shazam.p.rapidapi.com/search',
    params: {
      term: keyword, // Use the keyword for the search term
      locale: 'en-US', // Default locale to 'en-US'
      offset: '0',
      limit: '10'
    },
    headers: {
      'x-rapidapi-key': process.env.SHAZAM_API_KEY,
      'x-rapidapi-host': 'shazam.p.rapidapi.com'
    }
  };

  try {
    console.log('Making request to Shazam API with options:', options); // Debug: Log request options
    const response = await axios.request(options); // Make a request to the Shazam API
    console.log('API response:', response.data); // Debug: Log the API response
    const tracks = response.data.tracks.hits.map(hit => hit.track); // Extract tracks data from the API response

    if (tracks.length === 0) {
      console.log('No tracks found for keyword:', keyword); // Debug: Log if no tracks are found
    }

    res.json(tracks); // Send the tracks data back to the client
  } catch (error) {
    console.error('Error fetching tracks:', error); // Log the error to the console for debugging
    res.status(500).json({ error: 'Unable to fetch tracks data. Please try again later.' });
  }
});

app.listen(PORT, () => { // Start the server and listen on the specified port
  console.log(`Server running at http://localhost:${PORT}/`); // Log a message when the server starts successfully
});
