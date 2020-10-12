document.addEventListener("DOMContentLoaded", function() {
    // set the base Url to a global variable
    const baseUrl = "http://localhost:3000/books/"
    const currentUser = {"id":1, "username": "pouros"}

    // 1. getBooks - fetch request
    const getBooks = () => {
        fetch(baseUrl)
        .then(response => response.json())
        .then(books => renderBooks(books))
    }
    
    // helper function creating a for loop to create element for each book
    const renderBooks = (books) => {
        for (const bookObj of books){
            renderBook(bookObj)
        }
    }
    
    // 2. renderBooks - display book title on list-panel
    const renderBook = (bookObj) => {
        const bookList = document.querySelector("#list");
        const bookLi = document.createElement("li");

        bookLi.classList.add("book-class");
        bookLi.dataset.id = bookObj.id;

        bookLi.textContent = bookObj.title
        bookList.appendChild(bookLi)
    }
    
    // in the show panel, it will render the book info
    const renderBookInfo = (clickedBook) => {
        const showPanel = document.querySelector("#show-panel");
        showPanel.dataset.id = clickedBook.id;
        let bookUsers = clickedBook.users //array of users

        const alreadyLiked = bookUsers.find(user => user.username === currentUser.username)
        
        showPanel.innerHTML = `
        <img src= ${clickedBook.img_url}>
        <h2>${clickedBook.title}</h2>
        <h2>${clickedBook.subtitle}</h2>
        <h2>${clickedBook.author}</h2>
        <h2>${clickedBook.description}</h2>
        <h4>Likes</h4>
        `
        
        // for each User in the bookUsers array, list them out and append it
        bookUsers.forEach(user => {
            const bookUsersList = document.createElement("ul");
            const li = document.createElement("li");
            li.textContent = user.username;

            let showPanel = document.querySelector("#show-panel");
            showPanel.appendChild(bookUsersList);
            bookUsersList.appendChild(li);
        })

        // creates a like button button to a constant
        const likeBtn = document.createElement("button");
        likeBtn.id = 'like-btn';
        showPanel.append(likeBtn);

        // if user has not liked it yet, the button will read like
        if(!alreadyLiked){
            likeBtn.textContent = "LIKE"
        }
        else {
            likeBtn.textContent = "UNLIKE"
        }
    }

    // in this function, will determine if user has liked
    const getLikes = (bookId) => {
        fetch(baseUrl + bookId)
        .then(response => response.json())
        .then(book => {
            // sets the array of users that have liked
            let usersLiked = book.users;
            // sets a constant to boolean of whether currentUser is in the array
            const alreadyLiked = usersLiked.find(user => user.username === currentUser.username)
            
            // if not, will push currentUser name to list
            if(!alreadyLiked){
                usersLiked.push(currentUser)
                addLikes(usersLiked, book.id)
            } else {
                // otherwise, will remove
                    usersLiked.pop(currentUser)
                    addLikes(usersLiked, book.id)
            }
            
        })
    }

    // this will patch the JSON to update the array of users that liked the book
    const addLikes = (usersLiked, book) => {
        const options = { 
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify({
                users: usersLiked
            })
        }

        fetch(baseUrl + bookId, options)
            .then(response => response.json())
            .then(clickedBook => renderBookInfo(clickedBook))
    }
            
            
    // 3. addEventListener
    const clickHandler = () => {
        document.addEventListener('click', (e) => {            
            if (e.target.matches(".book-class")){
                let clickedBook = e.target;
                let clickedBookId = clickedBook.dataset.id;

                // think of this as a link_to page 
                fetch(baseUrl + clickedBookId)
                    .then(response => response.json())
                    .then(clickedBook => renderBookInfo(clickedBook))
            }
        })
    }
            
    // handles likes - will invoke the getLikes function
    const likeHandler = () => {
        document.addEventListener('click', (e) => {            
            if (e.target.id === "like-btn"){
            const likeBtn = e.target;
            const bookId = likeBtn.parentElement.dataset.id;
            getLikes(bookId)
            }
        })
    }


    getBooks();
    clickHandler();
    likeHandler();
});
