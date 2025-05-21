window.saveViewedBook = function(bookID) {
    let recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewedBooks")) || [];

    recentlyViewed = recentlyViewed.filter(id => id !== window.bookID);
    recentlyViewed.unshift(bookID);
    recentlyViewed = recentlyViewed.slice(0, 4);

    localStorage.setItem("recentlyViewedBooks", JSON.stringify(recentlyViewed));
    console.log("Saved ID!");
};

document.addEventListener('DOMContentLoaded', () => {
    const storedIds = localStorage.getItem('recentlyViewedBooks');

    if (!storedIds) return;

    let recentlyViewedIds;
    try {
        recentlyViewedIds = JSON.parse(storedIds);
        if (!Array.isArray(recentlyViewedIds) || recentlyViewedIds.length === 0) return;
    } catch (e) {
        console.warn('invalid recentlyViewedBooks data in localStorage');
        return;
    }

    if (window.bookID) {
        recentlyViewedIds = recentlyViewedIds.filter(id => id !== window.bookID);
    }

    // Send validated IDs to the server
    fetch('/recentlyviewed', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ids: recentlyViewedIds })
    })
        .then(response => response.json())
        .then(books => {
            const container = document.getElementById('recently-viewed-placeholder');
            if (!container || !Array.isArray(books) || books.length === 0) return;

            books.slice(0, 3).forEach(book => {
                const bookEl = document.createElement('div');
                bookEl.className = 'col-md-4 col-6 py-3';
                bookEl.innerHTML = `
                    <div class="card hover">
                        <img src="/images/${book.card_image}" alt="book placeholder" class="card-img-top img-fluid">
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

                container.appendChild(bookEl);
            });
        })
        .catch(err => console.error('Error loading recently viewed books:', err));
});