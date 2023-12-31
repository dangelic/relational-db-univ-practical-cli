const Table = require("cli-table3");
const readlineSync = require("readline-sync");
const BASE_URL = "http://localhost:8076/api/v1";

function sleep(ms = 5) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const fetchData = async (endpoint, paramName = null, paramValue = null) => {
  try {
    let url = `${BASE_URL}/${endpoint}`;
    if (paramName && paramValue) url += `?${paramName}=${paramValue}`;
    
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return [];
  }
};

const postData = async (endpoint, varset) => {
  try {
    // Erstelle ein leeres Objekt, um die Parameter aufzunehmen
    const paramsObject = {};

    // Iteriere durch die übergebenen Parameter im varset und fülle das Objekt
    for (const variableName in varset) {
      const variableValue = varset[variableName];
      paramsObject[variableName] = variableValue;
    }

    // Konvertiere das Objekt in JSON-Format
    const body = JSON.stringify(paramsObject);

    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error('Error:', response.statusText);
      return null;
    }
  } catch (error) {
    console.error('Error:', error.message);
    return null;
  }
};

const displayProductsTable = (products) => {
  const table = new Table({
    head: ['ASIN', 'Titel', 'Kategorie', 'EAN', 'Verkaufsrang', 'Bewertung (Ø)'],
  });

  products.forEach((product) => {
    table.push([
      product.productId,
      product.productTitle ? product.productTitle.slice(0,50) : product.productTitle,
      product.productGroup,
      product.ean,
      product.salesrank,
      product.averageRating || 'not rated yet.',
    ]);
  });

  console.log(table.toString());
};

const displayOffersTable = (products) => {
  const table = new Table({
    head: ['ASIN', 'Titel', 'Kategorie', 'Verkaufsrang', 'Bewertung (Ø)', 'Filiale', 'Preis', 'Währung', 'Zustand'],
  });

  products.forEach((product) => {
    table.push([
      product.product.productId,
      product.product.productTitle ? product.product.productTitle.slice(0,50) : product.product.productTitle,
      product.product.productGroup,
      product.product.salesrank,
      product.product.averageRating || 'not rated yet.',
      product.shop.shopId,
      product.price ? product.price : "In dieser Filiale ausverkauft.", 
      product.shop.currency,
      product.shop.state,
    ]);
  });

  console.log(table.toString());
};

const displayUsersTable = (users) => {
  const table = new Table({
    head: ['USERNAME'],
  });

  users.forEach((user) => {
    table.push([
      user.username,
    ]);
  });

  console.log(table.toString());
};

const displayReviewsTable = (reviews) => {
  const table = new Table({
    head: ['USERNAME', 'Bewertung', 'Hilfreich-Vote', 'Zusammenfassung', 'Text'],
  });

  reviews.forEach((review) => {
    table.push([
      review.user.username,
      review.rating,
      review.helpfulVotes,
      review.summary ? review.summary.slice(0,30) : review.summary,
      review.content ? review.content.slice(0,65) : review.content
    ]);
  });

  console.log(table.toString());
};

// Diese Funktion zeigt den Kategorienbaum in einer hierarchischen Struktur an.
// Sie akzeptiert ein Array von Kategorien und kann optional mit einer Tiefe initialisiert werden.
const displayCategoryTree = (categories, depth = 0) => {
  categories.forEach((category, index, array) => {
    const isLast = index === array.length - 1; // Prüfen, ob die aktuelle Kategorie die letzte in der Liste ist
    const prefix = depth > 0 ? (isLast ? '└── ' : '├── ') : ''; // Verwendet verschiedene Präfixe für die Anzeige, um die Hierarchie darzustellen

    const indent = '    '.repeat(depth); // Erzeugt die Einrückung basierend auf der Tiefe; 4 Leerzeichen pro Tiefe

    // Zeigt den Kategorienamen an, eingerückt und mit dem geeigneten Präfix für die Hierarchie
    console.log(`${indent}${prefix}${category.name}`);
    
    if (category.subcategories.length > 0) {
      // Wenn die aktuelle Kategorie Unterkategorien hat, rufe die Funktion rekursiv für die Unterkategorien auf
      displayCategoryTree(category.subcategories, depth + 1);
    }
  });
}

const main = async () => {
  console.log("╭────────────────────────────────────────────────────────────────────────────────  ");
  console.log("│       Welcome to the Tiny Web Shop          ");
  console.log("│            in form of a CLI!                ");
  console.log("│ ----------------------------------------    ");
  console.log("╰────────────────────────────────────────────────────────────────────────────────  ");

  while (loop=true) {
    const options = [
      '-- Get information about a specific product',
      '-- Get a list of products that match a search pattern',
      '-- Display all categories in a tree structure',
      '-- Get a list of products under a category path',
      '-- Get a list of the highest-rated products by users and guests',
      '-- Get a list of similar but cheaper products',
      '-- Add a new review as a guest (anonymous) or a registered user',
      '-- View user reviews for a specific product',
      '-- Show all users who frequently give poor ratings',
      '-- Get a list of all offers for a specific product',
    ]
    let selectedOptionIndex = readlineSync.keyInSelect(options, "MENU: Choose an option:", {
    });

    switch (selectedOptionIndex) {

      // getProduct
      case 0: {
        const productId = readlineSync.question("Eingabe - Product ID (ASIN): ");
        const product = await fetchData("products/get-product-by-id", "productId", productId)
        if (product.length !== 0) displayProductsTable([product]);
        else console.log("Kein Produkt entspricht der angegebenen Produkt ID (ASIN).");
        break
      }

      // getProducts
      case 1: {
        let productNamePattern = readlineSync.question("Eingabe - Produktname oder Teil des Namens: ");
        if(productNamePattern === "") productNamePattern =" "
        const products = await fetchData("products/get-products-by-pattern", "pattern", productNamePattern)
        if (products.length !== 0) displayProductsTable(products);
        else console.log("Kein Produkt entspricht dem angegebenen Produktname.");
        break
      }

      // getCategoryTree
      case 2: {
        const categories = await fetchData("categories/tree");
        console.log('Category Tree:');
        displayCategoryTree(categories);
        await sleep()
        break;
      }
      
      // getProductsByCategoryPath
      case 3: {
        const categoryPath = readlineSync.question("Eingabe des Kategorienpfades (mit '/' getrennt): ");
        const products = await fetchData("categories/products-by-path", "path", categoryPath);
        if (products.length !== 0) displayProductsTable(products);
        else console.log("Kein Produkt im Pfad gefunden oder ungültiger Kategoriepfad.");
        break;
      }

      // getTopProducts
      case 4: {
        const k = readlineSync.question("Eingabe, wie viele Top-Produkte gesehen werden möchten (z.B. 5): ");
        const products = await fetchData("reviews/top-products", "k", k);
        displayProductsTable(products);
        break;
      }

      // getSimilarCheaperProduct
      case 5: {
        const productId = readlineSync.question("Eingabe - Product ID (ASIN): ");
        const products = await fetchData("offers/get-similar-cheaper-product", "productId", productId)
        if (products.length !== 0) displayProductsTable(products);
        else console.log("Kein ähnliches und günstigeres Produkt gefunden.");
        break
      }

      case 6: {

        const varSet = {
            productId: readlineSync.question("Eingabe - Product ID (ASIN): "),
            username: readlineSync.question("Eingabe - Nutzername (leerer Nutzername = anonyme Gast-Bewertung): "),
            rating: parseInt(readlineSync.question("Eingabe - Bewertung (1-5): ")),
            helpfulVotes: 0,
            summary: readlineSync.question("Zusammenfassung der Bewertung: "),
            content: readlineSync.question("Freitext: "),
         }

        await postData("reviews/add-review", varSet);
      
        break
      }

      // viewUserReviews
      case 7: {
        const productId = readlineSync.question("Eingabe - Product ID (ASIN): ");
        const userReviews = await fetchData("reviews/view-user-reviews", "productId", productId);
        console.log(userReviews);
        if (userReviews.length !== 0) displayReviewsTable(userReviews);
        else console.log("Keine Nutzerbewertung zum angegebenen Produkt vorhanden.");
        break
      }

      // getTrolls
      case 8: {
        const trolls = await fetchData("reviews/get-trolls");
        displayUsersTable(trolls);
        break;
      }

      // getOffers
      case 9: {
        const productId = readlineSync.question("Eingabe - Product ID (ASIN): ");
        const products = await fetchData("offers/get-offers", "productId", productId);
        console.log(products);
        if (products.length !== 0) displayOffersTable(products);
        else console.log("Das angegebene Produkt wird in keinem Shop angeboten.");
        break
      }
      case 10: {
        break
      }
    }
  }
};

main().catch((error) => {
  console.error('Error:', error.message);
});
