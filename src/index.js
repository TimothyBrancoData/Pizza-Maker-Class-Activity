import { GeocoderAutocomplete } from './autocomplete.js';
import { pizzaProducts } from './products.js';

const isProductDataLoaded = false; // NOTE Used to determine if product on the server-side is loaded otherwise there will be a skeleton loader in it's place.

// const autocomplete = 
//     new GeocoderAutocomplete(document.getElementById("autocomplete"), '13d4ed292f4c4a8794247725d03a765b');

// autocomplete.on('select', (location) => {
//     // check selected location here 
// });

// autocomplete.on('suggestions', (suggestions) => {
//     // process suggestions here
// });

function addDefaultValues() {
    return pizzaProducts.forEach((item) => {
        item.properties = {...item.properties, base: "Classic Base", gluten: true, vegan: true}
        // console.log(item.properties)
    })
}

addDefaultValues();

function addPizzaCard(title, content, descript, catergory) {
    // clone the template
    const template = document.getElementById("pizza-card-template").content.cloneNode(true);

    if(catergory === 'Premium Range'){
        template.querySelector('.card-title').innerText = title;
        template.querySelector('.card-text').innerText = descript;
        template.querySelector('.pizza-card-img').src = content['src'];
        template.querySelector('.pizza-card-img').alt = content['alt']; 
        document.querySelector('#premium-range-pizza-section').appendChild(template);       
    }

    if(catergory === 'Signature Range'){
        template.querySelector('.card-title').innerText = title;
        template.querySelector('.card-text').innerText = descript;
        template.querySelector('.pizza-card-img').src = content['src'];
        template.querySelector('.pizza-card-img').alt = content['alt'];
        document.querySelector('#signature-range-pizza-section').appendChild(template);
    }

    if(catergory === 'Classic Range'){
        template.querySelector('.card-title').innerText = title;
        template.querySelector('.card-text').innerText = descript;
        template.querySelector('.pizza-card-img').src = content['src'];
        template.querySelector('.pizza-card-img').alt = content['alt'];
        document.querySelector('#classic-range-pizza-section').appendChild(template);
    }
}

pizzaProducts.filter(name => name.catergory === 'Premium Range').forEach(prod => 
    addPizzaCard(prod.pizza, prod.image, prod.content, prod.catergory))

pizzaProducts.filter(name => name.catergory === 'Signature Range').forEach(prod => 
    addPizzaCard(prod.pizza, prod.image, prod.content, prod.catergory))

pizzaProducts.filter(name => name.catergory === 'Classic Range').forEach(prod => 
    addPizzaCard(prod.pizza, prod.image, prod.content, prod.catergory))

// pizzaProducts.forEach(prod => 
//     addPizzaCard(prod.pizza, prod.image, prod.content, prod.catergory))
// pizzaProducts.forEach(prod => addPizzaCard(prod.pizza, prod.properties['toppings']))

// pizzaProducts.forEach(item => {
//     item.properties['toppings'].forEach(toppings => console.log(toppings))
// } )

// function truncateContent(max) {
//     for (let i = 0; i < pizzaProducts.length; i++) {
//         if (pizzaProducts[i].content.length > max) {
//             pizzaProducts[i].content = pizzaProducts[i].content.slice(0, max) + '...';
//         } else {
//             pizzaProducts[i].content;
//         };
//     }
// }

// truncateContent(20);
// console.log(pizzaProducts);

// TODO Add a class for the pizza and add appropreite methods to it. [Classes, Objects]

class Pizza {
    constructor(name, size, crust, sauce, base, vegan, glut, qty, price) {
        this.toppings = [],
        this.name = name,
        this.size = size,
        this.crust = crust,
        this.sauce = sauce,
        this.base = base,
        this.vegan = vegan,
        this.glut = glut,
        this.qty = qty,
        this.price = price
    }

    addProduct() {
        if (typeof this.name === 'string') {
            pizzaProducts.push(
                {name: this.name, size: this.size, crust: this.crust, sauce: this.sauce, base: this.base, 
                    qty: this.qty, price: this.price, vegan: this.vegan, glut: this.glut});
            this.toppings.push('Ingredients')
        }
        console.log("Please enter a valid product name.");
    }
    
    removeProduct(product) {
        this.products = this.products.filter((p) => p !== product);
    }
    
    addTopping(toppings) {
        this.toppings.push(toppings);
    }

    addToShoppingList(product) {
        this.shoppingList.push(product);
    }

    removeFromShoppingList(product) {
        this.shoppingList = this.shoppingList.filter((p) => p !== product);
    }

    generateReceipt() {
        return this.shoppingList;
    }

    async wait(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }
}

// const hawaainPizza = new Pizza();

// hawaainPizza.addProduct();

// TODO Add a function for adding items to shopping list for the pizza. [Arrays, Objects]

// TODO Add a function for the useer to remove or add additional items to thier shopping basket. [Arrays, Objects]

// TODO Add a function to generate a reciept for the user upon submit.  [Arrays, Objects]

// TODO Add a waiting timer for the user to wait for thier pizza to be ready. [Async, Await, SetTimeout]

const orderData = []

// function generateReferNumber() {
//     let referNum = Math.floor(Math.random()* 100_000);
//     if (orderData.length >= 0 && referNum > 10_000) {
//         orderData.push({id: referNum})
//         // console.log('Why')
//     }
//     console.log(referNum)
// }

// generateReferNumber();
// generateReferNumber();
// console.log(orderData)


// NOTE CODE GRAVEYARD ==============================================================================

// const newPizzaProducts = [...pizzaProducts, pizzaProducts[0].properties['gluten'] = true]

// console.log(newPizzaProducts)
// console.log(pizzaProducts)

// See https://www.npmjs.com/package/@geoapify/geocoder-autocomplete documentation.

// function addPizzaCard(toppings) {
//     // clone the template
//     const template = document.getElementById("artist-template").content.cloneNode(true);

//     // populate the template
//     template.querySelector('.card-title').innerText = name;

//     portfolio.forEach(item => {
//         const itemTemplate = document.getElementById("portfolio-template").content.cloneNode(true);
//         itemTemplate.querySelector('.portfolio-item-title').innerText = item.title;
//         itemTemplate.querySelector('.portfolio-item-image').src = item.url;
//         itemTemplate.querySelector('.portfolio-item-image').alt = item.title;
//         template.querySelector('.portfolio-items').appendChild(itemTemplate);
//     })

//     // include the populated template into the page
//     document.querySelector('#card-list').appendChild(template);
// }

// // Extension exercise - multiple artists
// pizzaProducts.forEach(prod => addPizzaCard(prod.properties['toppings']))