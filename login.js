document.querySelector(".form").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent page reload

    let username = document.getElementById("userId").value.trim();
    let password = document.getElementById("password").value.trim();
    let errorMessage = document.getElementById("error-message");

    const response = await fetch("http://127.0.0.1:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
        localStorage.setItem("authToken", data.token); // Store JWT Token
        alert("Login successful!");
        window.location.href = "dashboard.html";
    } else {
        errorMessage.textContent = data.error || "Invalid username or password.";
        errorMessage.style.display = "block";
    }
});

// Handle image upload in dashboard
async function uploadImage(file) {
    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("authToken");
    if (!token) {
        alert("Please login first.");
        return;
    }

    const response = await fetch("http://127.0.0.1:5000/api/upload", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData
    });

    const data = await response.json();
    if (response.ok) {
        alert("Image uploaded successfully!");
        fetchImages();
    } else {
        alert("Error: " + (data.error || "Failed to upload image."));
    }
}

// Fetch and display uploaded images
async function fetchImages() {
    const response = await fetch("http://127.0.0.1:5000/api/images");
    const data = await response.json();
   
    const imageContainer = document.getElementById("imageContainer");
    imageContainer.innerHTML = "";
    data.forEach(img => {
        const imgElement = document.createElement("img");
        imgElement.src = `http://127.0.0.1:5000/uploads/${img.filename}`;
        imgElement.alt = img.category;
        imgElement.width = 200;
        imageContainer.appendChild(imgElement);
    });
}

// Fetch stats for dashboard
async function fetchStats() {
    const response = await fetch("http://127.0.0.1:5000/api/stats");
    const data = await response.json();
    document.getElementById("totalImages").innerText = `Total Images: ${data.total}`;
}

// Logout function
function logout() {
    localStorage.removeItem("authToken");
    window.location.href = "index.html";
}

document.getElementById("logout")?.addEventListener("click", logout);
document.addEventListener("DOMContentLoaded", function() {
    fetchImages();
    fetchStats();
});
