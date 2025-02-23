const apiKey = '13d4ed292f4c4a8794247725d03a765b';

function getAddressLocation() {
    // NOTE Retrieve the pizza products from the API neccessary for the user reciept / order.

    const locationAddress = document.getElementById('search-address').value;
    if (locationAddress) {
        // console.log('User Location:', locationAddress);

    var requestOptions = {
        method: 'GET',
      };

    fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${locationAddress}&apiKey=${apiKey}&country=Australia`, requestOptions)
        .then(response => response.json())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    }
}