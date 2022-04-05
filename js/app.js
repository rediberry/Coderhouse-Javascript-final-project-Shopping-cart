const client = contentful.createClient({
    space: 'u7r20k5jit83',
    accessToken: 'NycafKU1CF37YyJ2j9gPOs0Ll9Litljh6Ow3yzOBRec'
  })
console.log(client);
// variables
    //document.querySelector: Document.querySelector(): Devuelve el primer elemento del documento (utilizando un recorrido primero en profundidad pre ordenado de los nodos del documento) que coincida con el grupo especificado de selectores.
    //DOM: El modelo de objeto de documento (DOM) es una interfaz de programación para los documentos HTML y XML. Facilita una representación estructurada del documento y define de qué manera los programas pueden acceder, al fin de modificar, tanto su estructura, estilo y contenido. El DOM da una representación del documento como un grupo de nodos y objetos estructurados que tienen propiedades y métodos. Esencialmente, conecta las páginas web a scripts o lenguajes de programación.
const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal= document.querySelector('.cart-total');
const cartContent= document.querySelector('.cart-content');
const productsDOM= document.querySelector('.products-center');
// cart
let cart = [];
let buttonsDOM = [];
// getting the products
    //async: Cuando se llama a una función async, esta devuelve un elemento Promise. Cuando la función async devuelve un valor, Promise se resolverá con el valor devuelto. Si la función async genera una excepción o algún valor, Promise se rechazará con el valor generado. Una función async puede contener una expresión await, la cual pausa la ejecución de la función asíncrona y espera la resolución de la Promise pasada y, a continuación, reanuda la ejecución de la función async y devuelve el valor resuelto.
    //await: La expresión await provoca que la ejecución de una función async sea pausada hasta que una Promise sea terminada o rechazada, y regresa a la ejecución de la función async después del término. Al regreso de la ejecución, el valor de la expresión await es la regresada por una promesa terminada. Si la Promise es rechazada, el valor de la expresión await tendrá el valor de rechazo. Si el valor de la expresión seguida del operador await  no es una promesa, será convertido a una resolved Promise.
    //map: El método map() crea un nuevo array con los resultados de la llamada a la función indicada aplicados a cada uno de sus elementos.
class Products{
    async getProducts(){
        try{
            const contentful = await client.getEntries({content_type:'changasProducts'});
            console.log(contentful.items)
            // const result = await fetch('./Productos/products.json');
            // const data = await result.json();
            let products = contentful.items;
            products = products.map(item=>{
                const{title,price} = item.fields;
                const {id} = item.sys;
                const image = item.fields.image.fields.file.url;
                return {title,price,id,image};
            })
            return products;
        } catch (error){
            console.log(error);
        }
    }
}
// display products
class UI {
    displayProducts(products) {
        let result = '';
        products.forEach(product => { //añade productos al HTML de forma dinamica
            result +=`            
            <!-- single product-->
            <article class="product">
                <div class="img-container">
                    <img src=${product.image} alt="product" class="product-img"/>
                    <button class="bag-btn" data-id=${product.id}><i class="fas fa-shopping-cart"></i>
                    add to cart
                    </button>
                </div>
                <h3>${product.title}</h3>
                <h4>$${product.price}</h4>
            </article>
            <!-- end of single product-->`;
        });
        productsDOM.innerHTML = result;
    }
    getBagButtons(){
        const buttons = [...document.querySelectorAll(".bag-btn")];
        buttonsDOM = buttons;
        buttons.forEach(button => {
            let id = button.dataset.id;
            let inCart = cart.find(item => item.id === id);
            if (inCart) {
                button.innerText = "In Cart";
                button.disabled = true;
            } 
            button.addEventListener("click", event => {
                event.target.innerText = "In Cart";
                event.target.disabled = true;
                // get product from products
                let cartItem = {...Storage.getProduct(id), amount:1};
                // add product to the cart
                cart = [...cart, cartItem];
                // save cart in local storage
                Storage.saveCart(cart);
                // set cart values
                this.setCartValues(cart);
                // display cart item
                this.addCartItem(cartItem);
                // show the cart
                this.showCart();
            })
        })
    }
    setCartValues(cart){
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map(item => {
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount;
        });
        cartTotal.innerText = parseFloat (tempTotal.toFixed(2));
        cartItems.innerText = itemsTotal;
    }
    addCartItem(item){
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
        <img src=${item.image} alt="product"/>
        <div>
            <h4>${item.title}</h4>
            <h5>$${item.price}</h5>
            <span class="remove-item" data-id=${item.id}>remove</span>
        </div>
        <div>
            <i class="fas fa-chevron-up" data-id=${item.id}></i>
            <p class="item-amount">${item.amount}</p>
            <i class="fas fa-chevron-down" data-id=${item.id}></i>
        </div>`;
        cartContent.appendChild(div);
    }
    //función que permite mostrar el carrito, funciona exactamente de manera opuesta que hideCart()
    showCart(){
        cartOverlay.classList.add('transparentBcg');
        cartDOM.classList.add('showCart');
    }
    //función que permite cargar los items que están en local storage, en caso de que existan.
    setupAPP(){
        cart = Storage.getCart();
        this.setCartValues(cart);
        this.populateCart(cart);
        cartBtn.addEventListener('click', this.showCart);
        closeCartBtn.addEventListener('click', this.hideCart);
    }
    //función que permite llenar el carrito cuando ya había previamente datos guardados en local storage
    populateCart (cart){
        cart.forEach(item => this.addCartItem(item));
    }
    //función que permite ocultar el carrito, funciona exactamente de manera opuesta que showCart()
    hideCart(){
        cartOverlay.classList.remove('transparentBcg');
        cartDOM.classList.remove('showCart');
    }
    cartLogic(){ //OJO, si no lo referenciamos a un carrito, sólo hace referencia al botón
        // clear cart button
        clearCartBtn.addEventListener('click', () =>{
            this.clearCart();
        });
        // cart functionality
        cartContent.addEventListener('click', event =>{
            if (event.target.classList.contains("remove-item")){
                let removeItem = event.target;
                let id = removeItem.dataset.id;
                cartContent.removeChild(removeItem.parentElement.parentElement);
                this.removeItem(id);
            } else if (event.target.classList.contains("fa-chevron-up")){
                let addAmount = event.target;
                let id = addAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id); // acá se podría crear un método que busque en el carrito x id
                tempItem.amount = tempItem.amount + 1;
                Storage.saveCart(cart);
                this.setCartValues(cart);
                addAmount.nextElementSibling.innerText = tempItem.amount;
            } else if (event.target.classList.contains("fa-chevron-down")){
                let lowerAmount = event.target;
                let id = lowerAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id); // acá se podría crear un método que busque en el carrito x id
                tempItem.amount = tempItem.amount - 1;
                if(tempItem.amount > 0){
                    Storage.saveCart(cart);
                    this.setCartValues(cart);
                    lowerAmount.previousElementSibling.innerText = tempItem.amount;
                } else{
                    cartContent.removeChild(lowerAmount.parentElement.parentElement);
                    this.removeItem(id);
                }
            }
        })
    }
    clearCart(){//itera entre todos los productos del carrito y usa el metodo "remove items"
        let cartItems = cart.map(item => item.id);
        cartItems.forEach(id => this.removeItem(id));
        while(cartContent.children.length>0){
            cartContent.removeChild(cartContent.children[0]);
        };
        this.hideCart();
    }
    removeItem(id){
        cart = cart.filter(item => item.id !==id);
        this.setCartValues(cart);
        Storage.saveCart(cart);
        let button = this.getSingleButton(id);
        button.disabled = false;
        button.innerHTML = `<i class="fas fa-shopping-cart"></i>add to cart`;
    }
    getSingleButton(id){
        return buttonsDOM.find(button => button.dataset.id === id);
    }
}
// local storage
class Storage{
    static saveProducts(products){
        localStorage.setItem("products", JSON.stringify(products));
    }
    static getProduct(id){
        let products = JSON.parse(localStorage.getItem('products'));
        return products.find(product => product.id === id);
    }
    static saveCart(cart){
        localStorage.setItem("cart", JSON.stringify(cart));
    }
    //El operador condicional (ternario) es el único operador en JavaScript que tiene tres operandos. Este operador se usa con frecuencia como atajo para la instrucción if.
    //Sintaxis --> condición ? expr1 : expr2
    //Esta función sirve para traer el carrito de local storage si se cerró el navegador, caso contrario trae un array vacío
    static getCart(){
        return localStorage.getItem('cart')?JSON.parse(localStorage.getItem('cart')):[];
    }
}
// addEventListener() Registra un evento a un objeto en específico. El Objeto especifico puede ser un simple elemento en un archivo, el mismo  documento , una ventana o un  XMLHttpRequest. Para registrar más de un eventListener, puedes llamar addEventListener() para el mismo elemento pero con diferentes tipos de eventos o parámetros de captura.
//The DOMContentLoaded event fires when the initial HTML document has been completely loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading.
//then: El método then devuelve una Promise que permite encadenar métodos. Puedes pasar una lambda a then y si devuelve una promesa, una Promise equivalente será expuesta al then subsecuente en la cadena de métodos.
document.addEventListener("DOMContentLoaded", ()=>{
    const ui = new UI ()
    const products = new Products();
    // setup app
    ui.setupAPP();
    // get all products
    products.getProducts().then(products => {
        ui.displayProducts(products);
        Storage.saveProducts(products);
    }).then(()=>{
        ui.getBagButtons();
        ui.cartLogic();
    });
});