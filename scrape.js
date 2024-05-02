const express = require('express');
const axios = require('axios');
const { JSDOM } = require('jsdom');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Add middleware to enable CORS
app.use(cors());

// Route to retrive page data
app.get('/api/scrape', async (req, res) => {
    const keyword = req.query.keyword;
    const url = `https://www.amazon.com/s?k=${keyword}`;

    //  It was necessary to add headers to allow access to the site
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
                'Accept-Language': 'en-US,en;q=0.9'
            }
        });

        // Extract data from the page HTML
        const html = response.data;

        const dom = new JSDOM(html);
        const document = dom.window.document;

        const products = document.querySelectorAll('.s-result-item');

        const extractedData = [];

        //  Check each product
        products.forEach(product => {
            const titleElement = product.querySelector('h2');
            const ratingElement = product.querySelector('.a-icon-star-small');
            const numReviewsElement = product.querySelector('.a-size-small');
            const imageElement = product.querySelector('.s-image');

            //Check if all necessary elements were found
            if (titleElement && ratingElement && numReviewsElement && imageElement) {
                const title = titleElement.textContent.trim();
                const rating = ratingElement.textContent.trim();
                const numReviews = numReviewsElement ? numReviewsElement.textContent.trim() : '';
                const imageUrl = imageElement ? imageElement.getAttribute('src') : '';

                extractedData.push({
                    title,
                    rating,
                    numReviews,
                    imageUrl
                });
            }
        });

        res.json(extractedData);
    } catch (error) {
        console.error(`Error fetching data: ${error.message}`);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.listen(PORT, () => {
    console.log(`The server is running on port ${PORT}`);
});