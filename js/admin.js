let books = JSON.parse(localStorage.getItem('books')) || [
    { title: "The Great Gatsby", author: "F. Scott Fitzgerald", available: true },
    { title: "1984", author: "George Orwell", available: true },
    { title: "To Kill a Mockingbird", author: "Harper Lee", available: false },
    { title: "Moby Dick", author: "Herman Melville", available: true }
];

const userInventory = JSON.parse(localStorage.getItem('userInventory')) || {};

function displayCatalog() {
    const catalogList = document.getElementById("catalogList");
    catalogList.innerHTML = '';
    books.forEach((book, index) => {
        catalogList.innerHTML += `
            <li>
                ${book.title} by ${book.author} - ${book.available ? 'Available' : 'Unavailable'}
                <button onclick="removeBook(${index})">Remove</button>
            </li>
        `;
    });
}

document.addEventListener("DOMContentLoaded", () => {
    displayCatalog();
    displayAllBorrowedBooks();
});

function removeBook(index) {
    const removedBook = books.splice(index, 1);
    localStorage.setItem('books', JSON.stringify(books));
    alert(`"${removedBook[0].title}" has been removed.`);
    displayCatalog();
}

document.getElementById("addBookForm").addEventListener("submit", addBook);
function addBook(event) {
    event.preventDefault();
    const titleInput = document.getElementById("bookTitle").value.trim();
    const authorInput = document.getElementById("bookAuthor").value.trim();
    if (!titleInput || !authorInput) {
        alert("Both title and author fields are required.");
        return;
    }
    books.push({ title: titleInput, author: authorInput, available: true });
    localStorage.setItem('books', JSON.stringify(books));
    document.getElementById("bookTitle").value = '';
    document.getElementById("bookAuthor").value = '';
    alert(`${titleInput} by ${authorInput} has been added.`);
    displayCatalog();
}

function displayAllBorrowedBooks() {
    const adminBorrowedList = document.getElementById("adminBorrowedList");
    adminBorrowedList.innerHTML = '';
    for (const [username, inventory] of Object.entries(userInventory)) {
        inventory.forEach(item => {
            if (item.status === 'Borrowed') {
                adminBorrowedList.innerHTML += `
                    <li>
                        ${item.title} - Borrowed by: ${username} - Borrowed on: ${new Date(item.borrowedOn).toLocaleDateString()} - 
                        Return Date: ${new Date(item.returnDate).toLocaleDateString()}
                    </li>
                `;
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    displayCatalog();
    displayAllBorrowedBooks();
});

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

document.getElementById("logoutButton").addEventListener("click", logout);
