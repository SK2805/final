let books = JSON.parse(localStorage.getItem('books')) || [
    { title: "The Great Gatsby", author: "F. Scott Fitzgerald", available: true },
    { title: "1984", author: "George Orwell", available: true },
    { title: "To Kill a Mockingbird", author: "Harper Lee", available: false },
    { title: "Moby Dick", author: "Herman Melville", available: true }
];

const loggedInUsername = "student";
const userInventory = JSON.parse(localStorage.getItem('userInventory')) || {};
const notifications = [];

function displayNotifications() {
    const notificationsList = document.getElementById("notificationsList");
    notificationsList.innerHTML = notifications.map(notification => `<li>${notification}</li>`).join('');
}

function showInventory(username) {
    const inventoryList = document.getElementById("inventoryList");
    const inventory = userInventory[username] || [];
    inventoryList.innerHTML = inventory.map(item => `
        <li>
            ${item.title} - Status: ${item.status} - 
            Date: ${new Date(item.reservedOn || item.borrowedOn).toLocaleDateString()} - 
            ${item.returnDate ? `Return Date: ${new Date(item.returnDate).toLocaleDateString()}` : ''}
        </li>
    `).join('');
}

function reserveBook(title, username) {
    const book = books.find(b => b.title === title && !b.available);
    if (book) {
        if (!userInventory[username]) {
            userInventory[username] = [];
        }
        const alreadyReserved = userInventory[username].some(item => item.title === title && item.status === 'Reserved');
        if (alreadyReserved) {
            alert(`You have already reserved "${title}".`);
            return;
        }
        userInventory[username].push({
            title,
            reservedOn: new Date(),
            status: 'Reserved'
        });
        localStorage.setItem('userInventory', JSON.stringify(userInventory));
        notifications.push(`You have reserved "${title}".`);
        displayNotifications();  // Ensure notifications are displayed immediately
        showInventory(username);
    } else {
        alert(`"${title}" is available. You can borrow it.`);
    }
}

function borrowBook(title, username) {
    const book = books.find(b => b.title === title && b.available);
    if (book) {
        book.available = false;
        const returnDate = new Date();
        returnDate.setDate(returnDate.getDate() + 7);
        if (!userInventory[username]) {
            userInventory[username] = [];
        }
        userInventory[username].push({
            title,
            borrowedOn: new Date(),
            returnDate,
            status: 'Borrowed'
        });
        localStorage.setItem('userInventory', JSON.stringify(userInventory));
        notifications.push(`You have borrowed "${title}".`);
        displayNotifications();  // Ensure notifications are displayed immediately
        showInventory(username);
    } else {
        alert(`"${title}" is currently unavailable.`);
    }
}

function displaySearchResults(results) {
    const resultsList = document.getElementById("searchResults");
    resultsList.innerHTML = results.map(book => `
        <li>
            ${book.title} by ${book.author} - ${book.available ? 'Available' : 'Unavailable'}
            ${book.available 
                ? `<button onclick="borrowBook('${book.title}', '${loggedInUsername}')">Borrow</button>` 
                : ''}
        </li>
    `).join('');
}

function showUnavailableBooks() {
    const reserveResultsList = document.getElementById("reserveResults");
    const unavailableBooks = books.filter(book => !book.available);
    reserveResultsList.innerHTML = unavailableBooks.map(book => `
        <li>
            ${book.title} by ${book.author} - Unavailable
            <button onclick="reserveBook('${book.title}', '${loggedInUsername}')">Reserve</button>
        </li>
    `).join('');
}

document.addEventListener("DOMContentLoaded", () => {
    showInventory(loggedInUsername);
    showUnavailableBooks();
});

document.getElementById("searchButton").addEventListener("click", () => {
    const query = document.getElementById("searchInput").value;
    const results = aStarSearch(query, books);
    displaySearchResults(results);
});

function aStarSearch(query, books) {
    const openSet = [];
    const closedSet = new Set();
    for (const book of books) {
        if (book.title.toLowerCase().includes(query.toLowerCase())) {
            openSet.push({
                title: book.title,
                cost: 1,
                heuristic: heuristic(book.title, query),
                book: book
            });
        }
    }
    while (openSet.length > 0) {
        openSet.sort((a, b) => (a.cost + a.heuristic) - (b.cost + b.heuristic));
        const currentNode = openSet.shift();
        if (currentNode.book) {
            return [currentNode.book];
        }
        closedSet.add(currentNode.title);
        for (const book of books) {
            if (!closedSet.has(book.title) && book.title.toLowerCase().includes(query.toLowerCase())) {
                openSet.push({
                    title: book.title,
                    cost: currentNode.cost + 1,
                    heuristic: heuristic(book.title, query),
                    book: book
                });
            }
        }
    }
    return [];
}

function heuristic(bookTitle, query) {
    return Math.abs(bookTitle.length - query.length);
}
