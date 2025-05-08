const express = require('express');
const fetch = require('node-fetch');  
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 6969;


const API_KEY = 'yp1xVNN00cQT9gtwzF8WhNL2KNNrXSCN';


app.get('/', (req, res) => {

    res.sendFile(path.join(__dirname, '../src', 'index.html'));
});


let cachedListings = [];

app.get('/listings', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 1000;

    try {
        if (cachedListings.length === 0) {
            const response = await fetch('https://csfloat.com/api/v1/listings', {
                method: 'GET',
                headers: {
                    'Authorization': `${API_KEY}`,
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            if (data && Array.isArray(data.data)) {
                cachedListings = data.data;
            } else {
                return res.status(500).json({ error: 'Unexpected data structure from API' });
            }
        }

        const startIndex = (page - 1) * limit;
        const paginatedItems = cachedListings.slice(startIndex, startIndex + limit);

        res.json(paginatedItems);
    } catch (error) {
        console.error('Error fetching data from CSFloat API:', error);
        res.status(500).json({ error: 'Failed to fetch data from CSFloat API' });
    }
});




app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});