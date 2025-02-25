import { GeocoderAutocomplete } from './autocomplete.js';

const isAutoCompleteEnabled = false;

const customerName = document.getElementById('');
const emailName = document.getElementById('');
const addressName = document.getElementById('');


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

function finaliseOrder() {
    sessionStorage.setItem(
        'customerData', JSON.stringify(
            {customer: customerName, email: emailName, address: addressName    
        }))
    
    // NOTE Debug Tool for clearing current sessionStorage or localStorage
    sessionStorage.clear()
}

// NOTE See https://www.npmjs.com/package/@geoapify/geocoder-autocomplete documentation.