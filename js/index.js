document.addEventListener("DOMContentLoaded", () => {
/* Deliverable 1: Get a list of books & render them */
    const baseUrl = "http://localhost:3000/books/"
    const currentUser = {"id": 1, "username": "pouros" }

    const getBooks = () => {
        fetch(baseUrl)
            .then(response => response.json())
            .then(books => renderBooks(books))
    }

    const renderBooks = books => {
        for (const book of books){
            renderBook(book)
        }
    }

    const renderBook = book => {
        const listPanel = document.querySelector("#list-panel")
        const bookLi = document.createElement("li")

        bookLi.textContent = `${book.title}`
        bookLi.classList.add("book-class");
        bookLi.dataset.id = book.id

        listPanel.append(bookLi)
    }

/* Deliverable 2: Be able to click on a book, you should see the book's thumbnail and description and a list of users who have liked the book. */
    const renderBookInfo = clickedBook => {
        const showPanel = document.querySelector("#show-panel")
        showPanel.dataset.id = clickedBook.id
        let bookUsers = clickedBook.users

        const alreadyLiked = bookUsers.find(user => user.username === currentUser.username)

        showPanel.innerHTML = `
            <img src = ${clickedBook.img_url}>
            <h2>${clickedBook.title}</h2>
            <h3>${clickedBook.subtitle}</h3>
            <h3>${clickedBook.author}</h3>
            <p>${clickedBook.description}</p>
            <h4>Likes</h4>
        `

        bookUsers.forEach(user => {
            const bookUsersList = document.createElement("ul")
            const bookUsersLi = document.createElement("li")
            bookUsersLi.textContent = user.username

            const showPanel = document.querySelector("#show-panel")
            bookUsersList.append(bookUsersLi)
            showPanel.append(bookUsersList)
        })

        const likeBtn = document.createElement("button")
        likeBtn.id = "like-btn"
        showPanel.append(likeBtn)

        if (!alreadyLiked){
            likeBtn.textContent = "LIKE"
        } else {
            likeBtn.textContent = "UNLIKE"
        }

    }

    const clickHandler = () => {
        document.addEventListener("click", (e) => {
            if (e.target.matches(".book-class")){
                const clickedBook = e.target
                const clickedBookId = clickedBook.dataset.id


                fetch(baseUrl + clickedBookId)
                    .then(response => response.json())
                    .then(clickedBook => renderBookInfo(clickedBook))
            }
        })
    }

/* Deliverable 3: You can like a book by clicking on a button. */
    const getLikes = bookId => {
        fetch(baseUrl + bookId)
        .then(response => response.json())
        .then(book => {
            let usersLiked = book.users
            
            let alreadyLiked = usersLiked.find(user => user.username === currentUser.username)
            
            if (!alreadyLiked){
                usersLiked.push(currentUser)
                addLikes(usersLiked, book.id)
            } else {
                usersLiked.pop(currentUser)
                addLikes(usersLiked, book.id)
            }
        })
    }

    const addLikes = (usersLiked, book) => {
        const options = {
            method: "PATCH",
            headers: {
                "content-type": "application/json",
                "accept": "application/json"
            },
            body: JSON.stringify({users: usersLiked})
        }

        fetch(baseUrl + book, options)
            .then(response => response.json())
            .then(clickedBook => renderBookInfo(clickedBook))
    }

    const likeHandler = () => {
        document.addEventListener("click", (e) => {
            if (e.target.matches("#like-btn")){
                const likeBtn = e.target
                const bookId = likeBtn.parentElement.dataset.id

                getLikes(bookId)
            }
        })
    }





    getBooks()
    clickHandler()
    likeHandler()
})