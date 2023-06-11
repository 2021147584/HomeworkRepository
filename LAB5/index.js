const express = require("express");
const app = express();
const sqlite3 = require("sqlite3");
const sqlite = require("sqlite");
const fs = require("fs").promises;

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));


app.get("/", async (req, res) => {
    let db = await getDBConnection();
    let items = await db.all(`SELECT * FROM products`);
    console.log(items);
    await db.close();

    let item_list = ``;

    for (const item of items) {
        const imgURL = image = `/images/${item['product_image']}`

        item_list += `
            <div class="itemlistclass">
                <img src=${imgURL} alt=${item['product_title']} width="100" height="150" />
                <p>Title: ${item['product_title']}</p>
                <p>Category: ${item['product_category']}</p>
                <p><a href="/product/${item['product_id']}" class="details_red">Details-></a></p>
            </div>`;
    }
    
    let template = `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8">
            <title>mainpage</title>
            <link rel="stylesheet" type="text/css" href="main.css">
        </head>
    
        <body>
    
            <header>
                <h1><span class="title">Welcome to Ahn's Shop</span></h1>
            </header>
    
            <nav>
                <a href="/">Home</a>
                <a href="/login">Sign In</a>
                <a href="/signup">Sign Up</a>
            </nav>
            <hr>
    
            <main>
            <div>
                <form action="/search" method="GET">
                    <input name="keyword" id="keyword" type="text" placeholder="Keyword" class="searchInput" />
                    <input name="category" id="category" type="text" list="categories" placeholder="Categories" class="searchInput" />
                    <datalist id="categories">
                        <option value="PL">
                        <option value="CA">
                        <option value="ALGO">
                        <option value="AI">
                        <option value="DS">
                        <option value="WEB">
                        <option value="MATH">
                        <option value="OS">
                        <option value="CODE">
                        <option value="SECURITY">
                        <option value="GRAPHICS">
                        <option value="COMPILERS">
                    </datalist>
                    <input id="search" type="submit" value="Search" class="searchButton" />
                </form>
                <h2>Books</h2>
                <div>
                    ${item_list}
                </div>
            </div>
    
                
            </main>
    
            <hr>
            <footer>
                <span>Contact</span>
                <span>Tel: 010-5332-0721</span>
                <span>E-Mail: jungwoo010721@gmail.com</span>
            </footer>
            
        </body>
    </html>
        `

    res.send(template)
});

app.get("/search", async (req, res) => {
    let db = await getDBConnection();
    let items = await db.all(`SELECT * FROM products Where product_title Like '${req.query.keyword}%' And product_category Like '${req.query.category}%'`);
    await db.close();

    let item_list = ``;

    for (const item of items) {
        const imgURL = image = `/images/${item['product_image']}`

        item_list += `
            <div class="itemlistclass">
                <img src=${imgURL} alt=${item['product_title']} width="100" height="150" />
                <p>Title: ${item['product_title']}</p>
                <p>Category: ${item['product_category']}</p>
                <p><a href="/product/${item['product_id']}" class="details_red">Details-></a></p>
            </div>`;
    }
    
    let template = `
        <!DOCTYPE html>
        <html>
            <head>
                <title>Search</title>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <link rel="stylesheet" type="text/css" href="main.css">
            </head>
            <body>
                <header>
                    <h1><span class="title">Welcome to Ahn's Shop</span></h1>                </header>
                <nav>
                    <a href="/">Home</a>
                    <a href="/login">Sign In</a>
                    <a href="/signup">Sign Up</a>
                </nav>
                <hr>

                <div>
                    <div>
                        <p><h2>Search Results</h2></p>
                        <div id="main">
                            ${item_list}
                        </div>
                    </div>

                </div>

                </div>
    
                
            </main>
    
            <hr>
            <footer>
                <span>Contact</span>
                <span>Tel: 010-5332-0721</span>
                <span>E-Mail: jungwoo010721@gmail.com</span>
            </footer>
            </body>
        </html>`

    res.send(template)
});

app.get("/product/:product_id", async (req, res) => {
    
    let db = await getDBConnection();
    let item = await db.get(`SELECT * FROM products WHERE product_id = ${req.params.product_id}`);
    await db.close()

    image = `/images/${item['product_image']}`

    let commentFile = await fs.readFile('comment.json', 'utf8');
    let data = JSON.parse(commentFile);
    let comments = data[req.params.product_id];

    let comment_list = ``;

    for (const comment of comments) {
        comment_list += `<div class="comment_div">-> ${comment}</div>`;
    }

    let template = `
        <!DOCTYPE html>
        <html>
            <head>
                <title>${item['product_title']}</title>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <link rel="stylesheet" type="text/css" href="/main.css">
            </head>
            <body>
                <header>
                    <h1><span class="title">Welcome to Ahn's Shop</span></h1>
                </header>
                <nav>
                    <a href="/">Home</a>
                    <a href="/login">Sign In</a>
                    <a href="/signup">Sign Up</a>
                </nav>
                <hr>
                <h2>Details: ${item['product_title']}</h2>
                <img src=${image} alt=${item['product_title']} />
                <div>
                    <h3>Title: ${item['product_title']}</h3>
                    <h3>Product id: ${item['product_id']}</h3>
                    <h3>Category: ${item['product_category']}</h3>
                    <h3>Price: ${item['product_price']}</h3>
                    <hr>
                    <h2>Comments</h2>
                    ${comment_list}
                    <form action="/product/${item['product_id']}/write_comment" method="POST">
                        <input type="text" name="comment" />
                        <button type="submit">Add Comment</button>
                    </form>
                </div>

                </div>
    
               
            </main>
    
            <hr>
            <footer>
                <span>Contact</span>
                <span>Tel: 010-5332-0721</span>
                <span>E-Mail: jungwoo010721@gmail.com</span>
            </footer>
            </body>
        </html>
    `;

    res.send(template);
});

app.post("/product/:product_id/write_comment", async (req, res) => {
    let comments = await fs.readFile('comment.json', 'utf8');
    let data = JSON.parse(comments);
    data[req.params.product_id].push(req.body.comment);
    fs.writeFile("comment.json", JSON.stringify(data));
    res.redirect(`/product/${req.params.product_id}`)
})

app.get("/login", (req, res) => {
    let template = `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8">
            <title>Sign In</title>
            <link rel="stylesheet" type="text/css" href="main.css">
        </head>
    
        <body>
    
            <header>
                <h1><span class="title">Welcome to Ahn's Shop</span></h1>
            </header>
    
            <nav>
                <a href="/">Home</a>
                <a href="/login">Sign In</a>
                <a href="/signup">Sign Up</a>
            </nav>
            <hr>
    
            <main>
                <p>
    
                <form method="get" action="">
                    <P>ID: <input type="email" name="email" placeholder="Enter E-Mail" autofocus required></P>
                    <P>PW: <input type="password" name="password" placeholder="Enter Passward" required></P>
                    <p>
                        <input id="reset_button" class="button" type="reset" value="Reset">
                        <input id="signin_button" class="button" type="submit" value="Sign In">
                    </p>
                </form>
            </main>
    
            <hr>
            <footer>
                <span>Contact</span>
                <span>Tel: 010-5332-0721</span>
                <span>E-Mail: jungwoo010721@gmail.com</span>
            </footer>
        </body>
    </html>
    `
    
    res.send(template);
});


app.get("/signup", (req, res) => {
    let template = `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8">
            <title>SignUp</title>
            <link rel="stylesheet" type="text/css" href="main.css">
        </head>
    
        <body>
    
            <header>
                <h1><span class="title">Welcome to Ahn's Shop</span></h1>
            </header>
    
            <nav>
                <a href="/">Home</a>
                <a href="/login">Sign In</a>
                <a href="/signup">Sign Up</a>
            </nav>
    
            <hr>
    
            <main>
            <form method="get" action="">
                <p>Name: <input type="text" name="name" placeholder="Enter Name" autofocus required></p>
                <p>
                    Choose Gender: 
                    <label><input type="radio" name="gender">Male</label>
                    <label><input type="radio" name="gender">Female</label>
                </p>
                <p>
                    Choose Interests: 
                <label><input type="checkbox" name="interests" value="fe"> Frontend</label>
                <label><input type="checkbox" name="interests" value="be"> Backend</label>
                <label><input type="checkbox" name="interests" value="uiux"> UI/UX</label>
                
    
                </p>
                <p>Birth Date: <input type="date" name="date" ></p>
                <p>Phone Number: <input type="tel" name="num" pattern="\d{3}-\d{4}-\d{4}" placeholder="010-xxxx-xxxx"></p>
                <p>Grade: <input type="number" name="grade" min="1" max="4" step="1" value="2" required></p>
                <P>ID: <input class="text" type="email" name="id" placeholder="Enter E-Mail" required></P>
                <P>Password: <input type="password" name="password" placeholder="Enter Password" required></P>
                <P>Confirm Password: <input type="password" name="password" placeholder="Confirm your Password" required></P>
                <p>
                    <input id="reset_button" class="button" type="reset" value="Reset">
                    <input id="signin_button" class="button" type="submit" value="Sign Up">
                </p>
            </form>
            </main>
    
            <hr>
            <footer>
                <span>Contact</span>
                <span>Tel: 010-5332-0721</span>
                <span>E-Mail: jungwoo010721@gmail.com</span>
            </footer>
        </body>
    </html>
    `

    res.send(template);
});


async function getDBConnection() {
    const db = await sqlite.open({
        filename: 'product.db',
        driver: sqlite3.Database
    });

    return db;
}

app.listen(3000, () => console.log("Server ready"))