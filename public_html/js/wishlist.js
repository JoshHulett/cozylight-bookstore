let notificationTimeout;

document.addEventListener("DOMContentLoaded", () => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    displayWishList();
    updateWishlistIcons();

    document.addEventListener("click", (event) => {
        const button = event.target.closest(".wishlist-heart");
        if (!button) return;
        const bookID = button.getAttribute("data-id");
        const img = button.querySelector("img");

        img.src = wishlist.includes(bookID) ? "/images/heart_fill.png" : "/images/heart_empty.png";

        toggleWishlist(bookID, img);
    });
});

function updateWishlistIcons() {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    document.querySelectorAll(".wishlist-heart").forEach(button => {
        const bookID = button.getAttribute("data-id");
        const img = button.querySelector("img");
        img.src = wishlist.includes(bookID) ? "/images/heart_fill.png" : "/images/heart_empty.png";
    });
}

function toggleWishlist(bookID, img) {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    if (wishlist.includes(bookID)) {
        wishlist = wishlist.filter(id => id !== bookID);
        img.src = "/images/heart_empty.png";
        showNotification("Removed book from wishlist");
    } else {
        wishlist.push(bookID);
        img.src = "/images/heart_fill.png";
        showNotification("Added book to your wishlist");
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    displayWishList();
    updateWishlistIcons();
};

function removeFromWishlist(bookID) {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    console.log("Before removal:", wishlist);
    console.log("here is bookID:", bookID);

    wishlist = wishlist.filter(id => id !== bookID);

    console.log("After removal:", wishlist);

    localStorage.setItem("wishlist", JSON.stringify(wishlist));

    showNotification("Removed book from wishlist");

    displayWishList();
};

function showNotification(message) {
    const notification = document.getElementById("wishlist-notification");
    notification.textContent = message;
    notification.classList.remove("hidden");
    notification.classList.add("show");

    clearTimeout(notificationTimeout);
    notificationTimeout = setTimeout(() => {
        notification.classList.remove("show");
    }, 2000);
};

function displayWishList() {
    const storedIds = localStorage.getItem('wishlist');

    if (!storedIds) return;

    let wishlistIds;
    try {
        wishlistIds = JSON.parse(storedIds);
        if (!Array.isArray(wishlistIds) || wishlistIds.length === 0) return;
    } catch (e) {
        console.warn('Invalid wishlist data in localStorage');
        return;
    }

    fetch('/wishlist', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ids: wishlistIds })
    })
        .then(response => response.json())
        .then(books => {
            const container = document.getElementById('wishlist-placeholder');

            container.innerHTML = "";

            if (!container || !Array.isArray(books) || books.length === 0) {
                container.innerHTML = "<p>Your wishlist is empty!</p>";
                return;
            }

            books.forEach(book => {
                const bookEl = document.createElement('div');
                bookEl.className = 'col-md-4 col-6 py-3';
                bookEl.innerHTML = `
                <div class="card hover">
                        <div class="product-image-container">
                            <img src="images/${book.card_image}" alt="book placeholder"
                                class="card-img-top img-fluid">
                            <button class="wishlist-heart hover" data-id="${book.id}">
                                <img src="/images/heart_fill.png" alt="wishlist" class="wishlist-icon">
                            </button>
                        </div>
                        <div class="card-body">
                            <div class="d-flex justify-content-between">
                                <p class="small text-muted">
                                    ${book.author}
                                </p>
                                <p class="small text-muted">
                                    ${book.genre}
                                </p>
                            </div>
                            <div class="d-flex justify-content-between">
                                <h5 class="card-title">
                                    ${book.title}
                                </h5>
                                <h5>${book.price}
                                </h5>
                            </div>
                            <a href="/product/${book.id}" class="stretched-link"></a>
                        </div>
                    </div>
                `;

                const img = bookEl.querySelector(".wishlist-heart img");
                if (wishlistIds.includes(book.id)) {
                    img.src = "/images/heart_fill.png";
                }

                container.appendChild(bookEl);
            });
        })
        .catch(err => console.error('Error loading wishlist books:', err));
};