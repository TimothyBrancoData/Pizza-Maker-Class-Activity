const apiKey = '13d4ed292f4c4a8794247725d03a765b';

// const customerName = document.getElementById('customer-name').value;

function getUserDetails() {
    // NOTE Retrieve the pizza products from the API neccessary for the user reciept / order.
    const locationAddress = document.getElementById('search-address').value;
    
    if (locationAddress) {
        console.log('User Location:', locationAddress);
        var requestOptions = {
            method: 'GET',
        };
        
        fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${locationAddress}&apiKey=${apiKey}&country=Australia`, requestOptions)
        .then(response => response.json())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    }
}

// function vaildateFormInputs() {
// const customerName = document.getElementById('customer-name').value;
//     // mobileNumber = document.getElementById('order-mobile-number').value;
//     let numbPattern = new RegExp(/^\d+$/);

//     if (numbPattern.test(mobileNumber)) {
//         return console.log(mobileNumber, number++);
//     }
//     console.log('Invaild mobile number format! Try not using strings or letter characters')
//     return mobileNumber = ' ';
// }

function vaildateFormInputs() {
    let customerName = document.getElementById('customer-name').value = '';
    let mobileNumber;
    let numbPattern = new RegExp(/^\d+$/);

    if (numbPattern.test(mobileNumber)) {
        return console.log(mobileNumber);
    } 
    // else {
    //     mobileNumber = document.getElementById('order-mobile-number').value = '';
    // }
}

function finaliseOrder() {
    console.log('User Name:', customerName);
    console.log('User Mobile Number:', mobileNumber);
    sessionStorage.setItem(
        'customerData', JSON.stringify(
            {customer: 'Hello', email: emailName, address: addressName    
        }))
    
    // NOTE Debug Tool for clearing current sessionStorage or localStorage
    // sessionStorage.clear()
}