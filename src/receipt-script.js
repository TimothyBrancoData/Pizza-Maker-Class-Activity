const orderData = [];

function generateReferNumber() {
    let referNum = Math.floor(Math.random()* 100_000);
    if (orderData.length >= 0 && referNum > 10_000) {
        orderData.push({id: referNum})
        // console.log('Why')
    }
    console.log(referNum)
}

generateReferNumber();
generateReferNumber();
console.log(orderData);

function generateReceipt() {
    const shoppingBasketData = sessionStorage.getItem('shoppingBasketData');
    const customerData = sessionStorage.getItem('customerData');

    const recieptDetails = new Array();

    recieptDetails.concat([...shoppingBasketData]).concat([...customerData]);

    // NOTE Debug Tool for clearing current sessionStorage or localStorage
    sessionStorage.clear()
}

// TODO Add a function to generate a reciept for the user upon submit.  [Arrays, Objects]

// TODO Add a waiting timer for the user to wait for thier pizza to be ready. [Async, Await, SetTimeout]