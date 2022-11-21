# Shopping-Cart
It is a vanilla Javascript Shopping Cart for the Coderhouse JavaScript course.

Check the certificate on the [Coderhouse page](https://www.coderhouse.com/certificados/6284515bbf8957001a580f11)

# What things I made use of:

* HTML5/CSS3
* Javascript
* Font Awesome Icons
* Google Fonts
* Libraries (SweetAlert, Toastify)
* Contentful API
* Local Storage
* SEO (as it has a score of 92 on PageSpeed Insights by Google).

# How I made it:

* Made a Contentful API to get the items from there (the advantage of doing this is that anyone can update the products even without programming knowledge, and without getting their hands on the code).
* A 'Product' class gets the products from the contentful-API and maps them into an array of products.
* The 'UI' class handles the display of the products and the cart logic (adding, removing and deleting items from the cart).
* A storage class that handles the local storage (save products and cart items).
* Defined all the variables for the DOM event handlers, and create the 'EventListeners'.

# You can:

* Filter by brand and price, also use the search bar.
* Choose items.
* Add, delete items and clear the cart.
* Since the data is stored in local storage, once you return to the site, the cart will show the items from last time.
* View your cart showing the total amount as well.
* Fill out the checkout page (For this demo it is just a simple login form).

## You can watch it live here:
https://rediberry.github.io/Coderhouse-Javascript-final-project-Shopping-cart/

# PS: 
Changas was a real espadrille manufacturing project that 3 friends and I ran from 2010 to 2013.
