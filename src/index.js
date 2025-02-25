import { GeocoderAutocomplete } from './autocomplete.js';
import { pizzaProducts } from './products.js';

// NOTE Used to determine if product on client-side is loaded otherwise there will be a skeleton loader in it's place.
const [isProductDataLoaded, setIsProductDataLoaded] = [false, false];

const isAutoCompleteEnabled = false;

if (isAutoCompleteEnabled) {
    const autocomplete = 
    new GeocoderAutocomplete(document.getElementById("autocomplete"), '13d4ed292f4c4a8794247725d03a765b');

    autocomplete.on('select', (location) => {
        // check selected location here 
    });

    autocomplete.on('suggestions', (suggestions) => {
        // process suggestions here
    });
}

const isPizzaMenuEnabled = false;

function addDefaultValues() {
    return pizzaProducts.forEach((item) => {
        item.properties = {...item.properties, base: "Classic Base", gluten: true, vegan: true}
        // console.log(item.properties)
    })
}

function addPizzaCard(title, content, descript, catergory) {
    const template = document.getElementById("pizza-card-template").content.cloneNode(true);

    if(catergory === 'Premium Range'){
        template.querySelector('.card-title').innerText = title;
        template.querySelector('.card-text').innerText = descript;
        template.querySelector('.pizza-card-img').src = content['src'];
        template.querySelector('.pizza-card-img').alt = content['alt'];
        template.querySelector('.card-button').value = title; 
        document.querySelector('#premium-range-pizza-section').appendChild(template);       
    }

    if(catergory === 'Signature Range'){
        template.querySelector('.card-title').innerText = title;
        template.querySelector('.card-text').innerText = descript;
        template.querySelector('.pizza-card-img').src = content['src'];
        template.querySelector('.pizza-card-img').alt = content['alt'];
        template.querySelector('.card-button').value = title;
        document.querySelector('#signature-range-pizza-section').appendChild(template);
    }

    if(catergory === 'Classic Range'){
        template.querySelector('.card-title').innerText = title;
        template.querySelector('.card-text').innerText = descript;
        template.querySelector('.pizza-card-img').src = content['src'];
        template.querySelector('.pizza-card-img').alt = content['alt'];
        template.querySelector('.card-button').value = title;
        document.querySelector('#classic-range-pizza-section').appendChild(template);
    }
}

function truncateContent(max) {
    for (let i = 0; i < pizzaProducts.length; i++) {
        if (pizzaProducts[i].content.length > max) {
            pizzaProducts[i].content = pizzaProducts[i].content.slice(0, max) + '...';
        } else {
            pizzaProducts[i].content;
        };
    }
}

addDefaultValues();
truncateContent(40);
// console.log(pizzaProducts)

pizzaProducts.filter(name => name.catergory === 'Premium Range').forEach(prod => 
    addPizzaCard(prod.pizza, prod.image, prod.content, prod.catergory))

pizzaProducts.filter(name => name.catergory === 'Signature Range').forEach(prod => 
    addPizzaCard(prod.pizza, prod.image, prod.content, prod.catergory))

pizzaProducts.filter(name => name.catergory === 'Classic Range').forEach(prod => 
    addPizzaCard(prod.pizza, prod.image, prod.content, prod.catergory))

truncateContent(20);
console.log(pizzaProducts)

// NOTE New list of pizza products 
const shoppingBasketData = [];

function addProductToBasket() {
    const displayBasket = document.getElementById('no-selected-products');
    const displayEmptyBasket = document.getElementById('shopping-basket-detail');

    displayBasket.display = 'none';
    displayEmptyBasket.display = 'block';

    pizzaProducts.find(item => {
        const productName = document.querySelector('.card-button').value;

        if (productName === item.pizza) {
            return shoppingBasketData.push({
                pizza: item.pizza,
                base: item.properties['base'],
                sauce: item.properties['sauce'],
                price: item.price
            })
        }
        return console.log(`Could not find ${productName} on the pizza menu! ${item.pizza}`)
    })
}

addProductToBasket();
console.log(shoppingBasketData)

const disabledSubmitButton = document.getElementsByClassName('disabled-item-button');
const enabledSubmitButton = document.getElementsByClassName('disabled-item-button');

// function calculateCost() {
//     const prices = [7.95, 2.95, 6.95];
//     const costTotalSection = document.getElementById('cost-total');
//     let costSum = 0;
//     let qty = 1;

//     prices.forEach(item => {
//         costSum += item * qty;
//     })
//     costTotalSection.innerHTML = `Total: $${costSum.toFixed(2)}`; 
// }

// calculateCost();

function submitOrder() {
    sessionStorage.setItem('shoppingBasketData', JSON.stringify(shoppingBasketData))
    
    const passedData = sessionStorage.getItem('shoppingBasketData');
    const newData = JSON.parse(passedData)
    
    newData.forEach(item => console.log(item.pizza))
    
    // NOTE Debug Tool for clearing current sessionStorage or localStorage
    sessionStorage.clear()
}

// TODO Add a class for the pizza and add appropreite methods to it. [Classes, Objects]

// NOTE See https://www.npmjs.com/package/@geoapify/geocoder-autocomplete documentation.

// function pizzaTracking(progress, delay) {
//     setTimeout(() => {
//         console.log(progress)
//     }, delay);
// }

// pizzaTracking('Starting Preparing Pizza...', 200);
// pizzaTracking('Made the base...', 400);
// pizzaTracking('Added the sauce and cheese...', 600);
// pizzaTracking('Added the pizza toppings...', 800);
// pizzaTracking('Pizza cooked...', 1000);
// pizzaTracking('Pizza is ready...', 1200);