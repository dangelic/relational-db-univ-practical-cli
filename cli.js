const Table = require('cli-table3');
const readlineSync = require('readline-sync');

const BASE_URL = 'http://localhost:8080/api/v1/products/top';

async function fetchTopProducts(k) {
    try {
      const response = await fetch(`${BASE_URL}?k=${k}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching top products:', error.message);
      return [];
    }
  }

function displayProductsTable(products) {
  const table = new Table({
    head: ['ASIN', 'Product Title', 'Product Group', 'EAN', 'Sales Rank', 'Average Rating'],
  });

  products.forEach((product) => {
    table.push([
      product.asin,
      product.productTitle,
      product.productGroup,
      product.ean || 'N/A',
      product.salesrank,
      product.averageRating || 'N/A',
    ]);
  });

  console.log(table.toString());
}

function main() {
  console.log('Welcome to the Top Product Viewer!');
  console.log('---------------------------------');

  const options = ['List top K products', 'Exit'];
  const selectedOption = readlineSync.keyInSelect(options, 'Choose an option:', {
    cancel: 'Exit',
  });

  if (selectedOption === -1) {
    console.log('Goodbye!');
    process.exit(0);
  }

  if (selectedOption === 0) {
    const k = parseInt(readlineSync.question('Enter the value of K: '));

    if (isNaN(k) || k <= 0) {
      console.error('Invalid input. Please enter a positive integer for K.');
      return main();
    }

    fetchTopProducts(k)
      .then((products) => {
        if (products.length === 0) {
          console.log('No products found.');
        } else {
          console.log('Top Products:');
          displayProductsTable(products);
        }
        main();
      })
      .catch((error) => {
        console.error('Error:', error.message);
        main();
      });
  }
}

main();
