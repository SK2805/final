document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("loginForm")?.addEventListener("submit", function (event) {
        event.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        const adminUsername = "admin";
        const adminPassword = "admin123";

        if (username === adminUsername && password === adminPassword) {
            window.location.href = "admin.html";
        } else {
            const storedPassword = localStorage.getItem(username);

            if (storedPassword && storedPassword === password) {
                window.location.href = "student.html";
            } else {
                alert("Invalid username or password.");
            }
        }
    });
});
