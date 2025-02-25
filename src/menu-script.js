// NOTE Used to determine if product on client-side is loaded otherwise there will be a skeleton loader in it's place.
const [isProductDataLoaded, setIsProductDataLoaded] = [false, false];

const isSubmitOrderEnabled = document.querySelector('.disabled-no-order');

const isPizzaMenuEnabled = false;

function addDefaultProps() {
    return pizzaProducts.forEach((item) => {
        item.properties = {...item.properties, base: "Classic Base", gluten: false, vegan: false}
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
        template.querySelector('.card-button').setAttribute('onclick', `addProductToBasket('${title}')`) 
        document.querySelector('#premium-range-pizza-section').appendChild(template);       
    }

    if(catergory === 'Signature Range'){
        template.querySelector('.card-title').innerText = title;
        template.querySelector('.card-text').innerText = descript;
        template.querySelector('.pizza-card-img').src = content['src'];
        template.querySelector('.pizza-card-img').alt = content['alt'];
        template.querySelector('.card-button').setAttribute('onclick', `addProductToBasket('${title}')`); 
        document.querySelector('#signature-range-pizza-section').appendChild(template);
    }

    if(catergory === 'Classic Range'){
        template.querySelector('.card-title').innerText = title;
        template.querySelector('.card-text').innerText = descript;
        template.querySelector('.pizza-card-img').src = content['src'];
        template.querySelector('.pizza-card-img').alt = content['alt'];
        template.querySelector('.card-button').setAttribute('onclick', `addProductToBasket('${title}')`); 
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

// NOTE Transform existing array of pizza products before populating them on the page.
addDefaultProps();
truncateContent(40);

pizzaProducts.filter(name => name.catergory === 'Premium Range').forEach(prod => 
    addPizzaCard(prod.pizza, prod.image, prod.content, prod.catergory))

pizzaProducts.filter(name => name.catergory === 'Signature Range').forEach(prod => 
    addPizzaCard(prod.pizza, prod.image, prod.content, prod.catergory))

pizzaProducts.filter(name => name.catergory === 'Classic Range').forEach(prod => 
    addPizzaCard(prod.pizza, prod.image, prod.content, prod.catergory))

console.log('Filter Pizza Products:', pizzaProducts)

// NOTE New list of pizza products for shopping basket
const shoppingBasketData = [];
const displayBasket = document.getElementById('shopping-basket-detail');
const displayEmptyBasket = document.getElementById('no-selected-products');

function addProductToBasket(productName) {
    if (shoppingBasketData.length >= 0) {
        displayBasket.style.display = 'block';
        displayEmptyBasket.style.display = 'none';
    }

    console.log('Adding:', productName);

    const index = shoppingBasketData.findIndex((item) => item.pizza === productName);
    
    // if (index === -1) {
    //     shoppingBasketData.push({
    //         pizza: 'Vegan Delight',
    //         base: 'no',
    //         sauce: 'please',
    //         price: 'why',
    //         qty: 1
    //     })
    //     console.log('pushed');
    // } else {
    //     // console.log('second:', index);
    //     shoppingBasketData[index].qty++;
    // }
    
    pizzaProducts.find(item => {
        if (productName === item.pizza) {
            if (index === -1) {
                shoppingBasketData.push({
                    pizza: item.pizza,
                    base: item.properties['base'],
                    sauce: item.properties['sauce'],
                    price: item.price,
                    qty: 1
                })
            } else {
                console.log(index);
                shoppingBasketData[index].qty++;
            }
        }
        // console.log(`Could not find ${productName} on the pizza menu! ${item.pizza}`)
    })

    shoppingBasketData.find(item => {
        if (productName === item.pizza) {
            let qty = 1;
            const template = document.getElementById('product-item-template').content.cloneNode(true);
            template.querySelector('.checkout-content').innerText = `${item.qty}x ${item.pizza} `;
            template.querySelector('.product-price').innerText = `- $${item.price}`;
            template.querySelector('.product-item-button').setAttribute('onclick', `removeProductFromBasket('${item.pizza}')`);
            return document.querySelector('#test').appendChild(template);
        }
    })
    calculateCost(shoppingBasketData);
    console.log('Shopping Basket Items:', shoppingBasketData);
}

function removeProductFromBasket(productName) {
    console.log('Removing:', productName);

    if (shoppingBasketData.length > -1) {
        displayBasket.style.display = 'none';
        displayEmptyBasket.style.display = 'block';
    }
    
    shoppingBasketData.find(item => {
        const index = shoppingBasketData.indexOf(item.pizza)
        if (productName === item.pizza) {
            shoppingBasketData.splice(index, 1);
        }
    })
    console.log('Shopping Basket Items:', shoppingBasketData);
}

const disabledSubmitButton = document.getElementsByClassName('disabled-item-button');
const enabledSubmitButton = document.getElementsByClassName('disabled-item-button');

function calculateCost(productList) {
    const costTotalSection = document.getElementById('cost-total');
    let costSum = 0;

    productList.forEach(item => {
        costSum += item.price;
    })
    costTotalSection.innerHTML = `Total: $${costSum.toFixed(2)}`; 
}

function submitOrder() {
    sessionStorage.setItem('shoppingBasketData', JSON.stringify(shoppingBasketData))
    
    const passedData = sessionStorage.getItem('shoppingBasketData');
    const newData = JSON.parse(passedData)
    
    newData.forEach(item => console.log(item.pizza))
    
    // NOTE Debug Tool for clearing current sessionStorage or localStorage
    sessionStorage.clear()
}

// TODO Add a function for adding items to shopping list for the pizza. [Arrays, Objects]

// TODO Add a function for the useer to remove or add additional items to thier shopping basket. [Arrays, Objects]

// function addProductToBasket(productName) {
//     if (shoppingBasketData.length >= 0) {
//         displayBasket.style.display = 'block';
//         displayEmptyBasket.style.display = 'none';
//     }

//     console.log('Adding:', productName);

//     const index = shoppingBasketData.findIndex((item) => item.pizza === productName);
    
//     if (index === -1) {
//         shoppingBasketData.push({
//             pizza: 'Vegan Delight',
//             base: 'no',
//             sauce: 'please',
//             price: 'why',
//             qty: 1
//         })
//         console.log('pushed');
//     } else {
//         shoppingBasketData[index].qty++;
//     }
    
//     pizzaProducts.find(item => {
//         if (productName === item.pizza) {
//             if (index === -1) {
//                 shoppingBasketData.push({
//                     pizza: item.pizza,
//                     base: item.properties['base'],
//                     sauce: item.properties['sauce'],
//                     price: item.price,
//                     qty: 1
//                 })
//             } else {
//                 console.log(index);
//                 shoppingBasketData[index].qty++;
//             }
//         }
//         // console.log(`Could not find ${productName} on the pizza menu! ${item.pizza}`)
//     })

//     shoppingBasketData.find(item => {
//         if (productName === item.pizza) {
//             let qty = 1;
//             const template = document.getElementById('product-item-template').content.cloneNode(true);
//             template.querySelector('.checkout-content').innerText = `${qty}x ${item.pizza} `;
//             template.querySelector('.product-price').innerText = `- $${item.price}`;
//             template.querySelector('.product-item-button').setAttribute('onclick', `removeProductFromBasket('${item.pizza}')`);
//             return document.querySelector('#test').appendChild(template);
//         }
//     })
//     calculateCost(shoppingBasketData);
//     console.log('Shopping Basket Items:', shoppingBasketData);
// }