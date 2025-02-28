import { GeocoderAutocomplete } from './autocomplete.js';

const isAutoCompleteEnabled = true;

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

// NOTE See https://www.npmjs.com/package/@geoapify/geocoder-autocomplete documentation.