const scrapeButton = document.getElementById('scrape-button');
const keywordInput = document.getElementById('keyword');
const resultsContainer = document.getElementById('results-container');

// Add an event listener to the scrape button
scrapeButton.addEventListener('click', () => {
  const keyword = keywordInput.value;

  if (!keyword) {
    alert('Please enter a search keyword');
    return;
  }

  // Send a request to the server
fetch(`http://localhost:3000/api/scrape?keyword=${encodeURIComponent(keyword)}`)
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    return response.json();
    })
    .then(data => {
        if (Array.isArray(data)) {
            resultsContainer.innerHTML = '';

        data.forEach(product => {
  
        //Create a div element for the product
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');

        // Create a div element for the title
        const titleDiv = document.createElement('div');
        titleDiv.classList.add('title');
        titleDiv.textContent = product.title;
        
        // Create a div element for the rating
        const ratingDiv = document.createElement('div');
        ratingDiv.classList.add('rating');
        ratingDiv.textContent = `Rating: ${product.rating}`;
        
        // Create a div element for the reviews
        const reviewsDiv = document.createElement('div');
        reviewsDiv.classList.add('reviews');
        const numReviews = product.numReviews.split(' ')[5]; //Get only the number of reviews
        reviewsDiv.textContent = `Reviews: ${numReviews}`;

        // Create a div element for the image
        const imageDiv = document.createElement('div');
        imageDiv.classList.add('image');
        const image = document.createElement('img');
        image.src = product.imageUrl;

  imageDiv.appendChild(image);
  productDiv.appendChild(titleDiv);
  productDiv.appendChild(ratingDiv);
  productDiv.appendChild(reviewsDiv);
  productDiv.appendChild(imageDiv);

  resultsContainer.appendChild(productDiv);
});
//  Check if the data was fetched correctly
        } else {
            throw new Error('Data is not in the expected format');
        }
    })
    //  Handle errors and display an error message
    .catch(error => {
        console.error(error);
        alert('An error occurred while fetching data');
    });
 
});