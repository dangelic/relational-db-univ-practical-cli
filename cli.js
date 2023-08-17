const Table = require('cli-table3');
const readlineSync = require('readline-sync');


const BASE_URL = 'http://localhost:8079/api/v1';

const fetchTopProducts = async (k) => {
  try {
    const response = await fetch(`${BASE_URL}/products/top?k=${k}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching top products:', error.message);
    return [];
  }
};

const fetchCategoryTree = async () => {
  try {
    const response = await fetch(`${BASE_URL}/categories/tree`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching category tree:', error.message);
    return [];
  }
};



const fetchProductsByCategoryPath = async (categoryPath) => {
  try {
    const response = await fetch(`${BASE_URL}/categories/products?categoryPath=${encodeURIComponent(categoryPath)}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products by category path:', error.message);
    return [];
  }
};

const displayProductsTable = (products) => {
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
};

function displayCategoryTree(categories, depth = 0) {
  categories.forEach((category, index, array) => {
    const isLast = index === array.length - 1;
    const prefix = depth > 0 ? (isLast ? '└── ' : '├── ') : '';

    const indent = '    '.repeat(depth); // Four spaces for each level of depth

    console.log(`${indent}${prefix}${category.name}`);
    
    if (category.subcategories.length > 0) {
      displayCategoryTree(category.subcategories, depth + 1);
    }
  });
}


const main = async () => {
  console.log('Welcome to the Product Viewer CLI!');
  console.log('----------------------------------');

  while (true) {
    const options = ['List top K products', 'Display category tree', 'Fetch products by category path', 'Exit'];
    const selectedOptionIndex = readlineSync.keyInSelect(options, 'Choose an option:', {
      cancel: 'Exit',
    });

    if (selectedOptionIndex === -1) {
      console.log('Goodbye!');
      break;
    }

    switch (selectedOptionIndex) {
      case 0: {
        const k = parseInt(readlineSync.question('Enter the value of K: '));

        if (isNaN(k) || k <= 0) {
          console.error('Invalid input. Please enter a positive integer for K.');
          continue;
        }

        const products = await fetchTopProducts(k);
        if (products.length === 0) {
          console.log('No products found.');
        } else {
          console.log('Top Products:');
          displayProductsTable(products);
        }
        break;
      }

      case 1: {
        const categories = await fetchCategoryTree();
        console.log('Category Tree:');
        displayCategoryTree(categories);
        break;
      }

      case 2: {
        const categoryPath = readlineSync.question('Enter the category path: ');
        const products = await fetchProductsByCategoryPath(categoryPath);
        if (products.length === 0) {
          console.log('No products found.');
        } else {
          console.log('Products for Category Path:');
          displayProductsTable(products);
        }
        break;
      }

      default:
        console.log('Invalid option.');
        break;
    }
  }
};

main().catch((error) => {
  console.error('Error:', error.message);
});
