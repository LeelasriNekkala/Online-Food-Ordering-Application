🍔 Online Food Ordering Application
📌 Project Overview

The Online Food Ordering Application is a simple web-based application that allows users to browse food items and view product details such as name, category, price, and image.

The application is built using vanilla JavaScript and follows the IIFE (Immediately Invoked Function Expression) pattern to avoid global variables and keep the code modular.

This project demonstrates modern JavaScript concepts, DOM manipulation, and structured frontend development.

🚀 Features

🍕 Display food items dynamically

🖼 Food images with product details

📂 Category-based product organization

💰 Price display for each item

⚡ Fast rendering using JavaScript

🧠 Modular code using IIFE pattern

🎨 Clean UI using CSS

🛠 Tech Stack
Frontend

🟨 JavaScript

🌐 HTML5

🎨 CSS3

Concepts Used

IIFE (Immediately Invoked Function Expression)

DOM Manipulation

Array Data Handling

Dynamic UI Rendering

📂 Project Structure
Online-Food-Ordering-Application
│
├── assets
│   ├── chicken.png
│   ├── pizza2.png
│   ├── pasta1.png
│   ├── drink1.png
│   └── logo.png
│
├── css
│   └── styles.css
│
├── js
│   └── app.js
│
├── index.html
└── package-lock.json
📊 Product Data Example

The application uses a JavaScript array to store product data.

const products = [
  {
    id: "p1",
    title: "Margherita Pizza",
    category: "Pizza",
    price: 299,
    img: "assets/pizza2.png"
  },
  {
    id: "p2",
    title: "Pepperoni Pizza",
    category: "Pizza",
    price: 349,
    img: "assets/pizza3.png"
  }
];
⚡ IIFE Pattern Used

The application uses Immediately Invoked Function Expression (IIFE) to prevent global scope pollution.

Example:

(() => {

  const products = [
    {
      id: "p1",
      title: "Margherita Pizza",
      category: "Pizza",
      price: 299
    }
  ];

  console.log(products);

})();

Benefits:

Avoids global variables

Encapsulates logic

Improves code structure

Makes code more maintainable

▶️ How to Run the Project

1️⃣ Clone the repository

https://github.com/LeelasriNekkala/Online-Food-Ordering-Application.git

2️⃣ Open project folder

3️⃣ Run the project by opening:

index.html

in a browser.
🎯 Future Improvements

Add shopping cart functionality

Add user authentication

Add checkout system

Integrate backend APIs

Add payment gateway

👩‍💻 Author

Leela Sri
MERN Stack Developer

⭐ Conclusion

This project demonstrates:

Strong understanding of JavaScript fundamentals

Usage of IIFE pattern for modular code

Ability to build dynamic UI using DOM manipulation

Clean project structure for frontend applications

✅ Commit message for this README

docs: added professional README for Online Food Ordering Application

💡 Very important tip for your GitHub portfolio

Your 4 projects should look like this:

1️⃣ HR Portal → React + React Query
2️⃣ Online Food Ordering → JavaScript (IIFE)
3️⃣ Stock Backend → Node + Express + API
4️⃣ Packers & Movers → MERN Full Stack

This combination shows recruiters that you know:

JavaScript fundamentals

Frontend frameworks

Backend development

Full-stack architecture
