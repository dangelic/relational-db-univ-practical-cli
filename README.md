# Produkt-Shop Frontend (Simple Terminal-GUI) - Readme

Dieses Repository enthält das Frontend für ein Universitätsprojekt, das die Implementierung eines Produkt-Shops zum Thema hat. Die Benutzerschnittstelle wurde als Terminal-GUI gestaltet und ist über eine Middleware (Hibernate) mit der zugrunde liegenden Datenbank verbunden.

## Projektübersicht
Dieses Projekt zielt darauf ab, die Erfahrung des Online-Shops in einer Terminalumgebung zu möglichst einfach simulieren. 
Dabei geht es nicht um UX-Aspekte, sondern die Anwendung zielt mehr auf die Demonstration der zugrunde liegenden Datenbanklogik ab, die in einer separaten Schicht realisiert wurde. Die Implementierung erfolgt in einer einzelnen JavaScript-Datei unter Verwendung des Node.js-Frameworks und der Terminal-Bibliothek - es soll so simpel wie möglich die gesamte API der Middleware grafisch präsentieren.

## Funktionen und Test für Uni-Testat:

### getProduct: Erhalte Informationen zu einem spezifischen Produkt', 

### getProducts: Erhalte eine Liste an Produkten, die zu einem Suchmuster passen', 

### getCategoryTree: Zeige alle Kategorien in einem Tree',

### getProductsByCategoryPath: Erhalte eine Liste an Produkten unter einem Pfad der Kategorie',

### getTopProducts: Erhalte eine Liste der am besten bewerteten Produkte von Nutzern und Gästen', 

### getSimilarCheaperProduct: Erhalte eine Liste an ähnlichen - aber preiswerteren Produkten',

### addNewReview: Füge eine Bewertung als Gast (annonym) oder als angemeldeter Nutzer hinzu',

### viewUserReviews: chaue Nutzerbewertungen zu einem spezifischen Produkt an',

### getTrolls: Zeige alle oft-bewertenden Nutzer an, die auffällig oft ein schlechtes Rating vergeben',

### getOffers: Erhalte eine Liste aller Angebote für ein spezifisches Produkt',
