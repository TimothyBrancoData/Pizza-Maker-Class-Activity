import { CalculationHelper } from "./helpers/calculation.helper.js";
import { DomHelper } from "./helpers/dom.helper.js";
import { BY_CIRCLE, BY_COUNTRYCODE, BY_PLACE, BY_PROXIMITY, BY_RECT } from "./helpers/constants.js";
import { Callbacks } from "./helpers/callbacks.js";

export class GeocoderAutocomplete {
    container;
    apiKey;
    inputElement;
    inputClearButton;
    autocompleteItemsElement = null;
    /* Focused item in the autocomplete list. This variable is used to navigate with buttons */
    focusedItemIndex;
    /* Current autocomplete items data (GeoJSON.Feature) */
    currentItems;
    /* Active request promise reject function. To be able to cancel the promise when a new request comes */
    currentPromiseReject;
    /* Active place details request promise reject function */
    currentPlaceDetailsPromiseReject;
    /* We set timeout before sending a request to avoid unnecessary calls */
    currentTimeout;
    callbacks = new Callbacks();
    preprocessHook;
    postprocessHook;
    suggestionsFilter;
    sendGeocoderRequestAlt;
    sendPlaceDetailsRequestAlt;
    geocoderUrl = "https://api.geoapify.com/v1/geocode/autocomplete";
    placeDetailsUrl = "https://api.geoapify.com/v2/place-details";
    options = {
        limit: 5,
        debounceDelay: 100
    };
    constructor(container, apiKey, options) {
        this.container = container;
        this.apiKey = apiKey;
        this.constructOptions(options);
        this.inputElement = document.createElement("input");
        DomHelper.createInputElement(this.inputElement, this.options, this.container);
        this.addClearButton();
        this.addEventListeners();
    }
    setGeocoderUrl(geocoderUrl) {
        this.geocoderUrl = geocoderUrl;
    }
    setPlaceDetailsUrl(placeDetailsUrl) {
        this.placeDetailsUrl = placeDetailsUrl;
    }
    setType(type) {
        this.options.type = type;
    }
    setLang(lang) {
        this.options.lang = lang;
    }
    setAddDetails(addDetails) {
        this.options.addDetails = addDetails;
    }
    setSkipIcons(skipIcons) {
        this.options.skipIcons = skipIcons;
    }
    setAllowNonVerifiedHouseNumber(allowNonVerifiedHouseNumber) {
        this.options.allowNonVerifiedHouseNumber = allowNonVerifiedHouseNumber;
    }
    setAllowNonVerifiedStreet(allowNonVerifiedStreet) {
        this.options.allowNonVerifiedStreet = allowNonVerifiedStreet;
    }
    setCountryCodes(codes) {
        console.warn("WARNING! Obsolete function called. Function setCountryCodes() has been deprecated, please use the new addFilterByCountry() function instead!");
        this.options.countryCodes = codes;
    }
    setPosition(position) {
        console.warn("WARNING! Obsolete function called. Function setPosition() has been deprecated, please use the new addBiasByProximity() function instead!");
        this.options.position = position;
    }
    setLimit(limit) {
        this.options.limit = limit;
    }
    setValue(value) {
        if (!value) {
            this.inputClearButton.classList.remove("visible");
        }
        else {
            this.inputClearButton.classList.add("visible");
        }
        this.inputElement.value = value;
    }
    getValue() {
        return this.inputElement.value;
    }
    addFilterByCountry(codes) {
        this.options.filter[BY_COUNTRYCODE] = codes;
    }
    addFilterByCircle(filterByCircle) {
        this.options.filter[BY_CIRCLE] = filterByCircle;
    }
    addFilterByRect(filterByRect) {
        this.options.filter[BY_RECT] = filterByRect;
    }
    addFilterByPlace(filterByPlace) {
        this.options.filter[BY_PLACE] = filterByPlace;
    }
    clearFilters() {
        this.options.filter = {};
    }
    addBiasByCountry(codes) {
        this.options.bias[BY_COUNTRYCODE] = codes;
    }
    addBiasByCircle(biasByCircle) {
        this.options.bias[BY_CIRCLE] = biasByCircle;
    }
    addBiasByRect(biasByRect) {
        this.options.bias[BY_RECT] = biasByRect;
    }
    addBiasByProximity(biasByProximity) {
        this.options.bias[BY_PROXIMITY] = biasByProximity;
    }
    clearBias() {
        this.options.bias = {};
    }
    on(operation, callback) {
        this.callbacks.addCallback(operation, callback);
    }
    off(operation, callback) {
        this.callbacks.removeCallback(operation, callback);
    }
    once(operation, callback) {
        this.on(operation, callback);
        const current = this;
        const currentListener = () => {
            current.off(operation, callback);
            current.off(operation, currentListener);
        };
        this.on(operation, currentListener);
    }
    setSuggestionsFilter(suggestionsFilterFunc) {
        this.suggestionsFilter = CalculationHelper.returnIfFunction(suggestionsFilterFunc);
    }
    setPreprocessHook(preprocessHookFunc) {
        this.preprocessHook = CalculationHelper.returnIfFunction(preprocessHookFunc);
    }
    setPostprocessHook(postprocessHookFunc) {
        this.postprocessHook = CalculationHelper.returnIfFunction(postprocessHookFunc);
    }
    setSendGeocoderRequestFunc(sendGeocoderRequestFunc) {
        this.sendGeocoderRequestAlt = CalculationHelper.returnIfFunction(sendGeocoderRequestFunc);
    }
    setSendPlaceDetailsRequestFunc(sendPlaceDetailsRequestFunc) {
        this.sendPlaceDetailsRequestAlt = CalculationHelper.returnIfFunction(sendPlaceDetailsRequestFunc);
    }
    isOpen() {
        return !!this.autocompleteItemsElement;
    }
    close() {
        this.closeDropDownList();
    }
    open() {
        if (!this.isOpen()) {
            this.openDropdownAgain();
        }
    }
    sendGeocoderRequestOrAlt(currentValue) {
        if (this.sendGeocoderRequestAlt) {
            return this.sendGeocoderRequestAlt(currentValue, this);
        }
        else {
            return this.sendGeocoderRequest(currentValue);
        }
    }
    sendGeocoderRequest(value) {
        return new Promise((resolve, reject) => {
            this.currentPromiseReject = reject;
            let url = CalculationHelper.generateUrl(value, this.geocoderUrl, this.apiKey, this.options);
            fetch(url)
                .then((response) => {
                if (response.ok) {
                    response.json().then(data => resolve(data));
                }
                else {
                    response.json().then(data => reject(data));
                }
            });
        });
    }
    sendPlaceDetailsRequest(feature) {
        return new Promise((resolve, reject) => {
            if (CalculationHelper.isNotOpenStreetMapData(feature)) {
                // only OSM data has detailed information; return the original object if the source is different from OSM
                resolve(feature);
                return;
            }
            this.currentPlaceDetailsPromiseReject = reject;
            let url = CalculationHelper.generatePlacesUrl(this.placeDetailsUrl, feature.properties.place_id, this.apiKey, this.options);
            fetch(url)
                .then((response) => {
                if (response.ok) {
                    response.json().then(data => {
                        if (!data.features.length) {
                            resolve(feature);
                        }
                        resolve(data.features[0]);
                    });
                }
                else {
                    response.json().then(data => reject(data));
                }
            });
        });
    }
    /* Execute a function when someone writes in the text field: */
    onUserInput(event) {
        let currentValue = this.inputElement.value;
        let userEnteredValue = this.inputElement.value;
        this.callbacks.notifyInputChange(currentValue);
        /* Close any already open dropdown list */
        this.closeDropDownList();
        this.focusedItemIndex = -1;
        this.cancelPreviousRequest();
        this.cancelPreviousTimeout();
        if (!currentValue) {
            this.removeClearButton();
            return false;
        }
        this.showClearButton();
        this.currentTimeout = window.setTimeout(() => {
            /* Create a new promise and send geocoding request */
            if (CalculationHelper.returnIfFunction(this.preprocessHook)) {
                currentValue = this.preprocessHook(currentValue);
            }
            let promise = this.sendGeocoderRequestOrAlt(currentValue);
            promise.then((data) => {
                this.onDropdownDataLoad(data, userEnteredValue, event);
            }, (err) => {
                if (!err.canceled) {
                    console.log(err);
                }
            });
        }, this.options.debounceDelay);
    }
    onDropdownDataLoad(data, userEnteredValue, event) {
        if (CalculationHelper.needToCalculateExtendByNonVerifiedValues(data, this.options)) {
            CalculationHelper.extendByNonVerifiedValues(this.options, data.features, data?.query?.parsed);
        }
        this.currentItems = data.features;
        if (CalculationHelper.needToFilterDataBySuggestionsFilter(this.currentItems, this.suggestionsFilter)) {
            this.currentItems = this.suggestionsFilter(this.currentItems);
        }
        this.callbacks.notifySuggestions(this.currentItems);
        if (!this.currentItems.length) {
            return;
        }
        this.createDropdown();
        this.currentItems.forEach((feature, index) => {
            this.populateDropdownItem(feature, userEnteredValue, event, index);
        });
    }
    populateDropdownItem(feature, userEnteredValue, event, index) {
        /* Create a DIV element for each element: */
        const itemElement = DomHelper.createDropdownItem();
        if (!this.options.skipIcons) {
            DomHelper.addDropdownIcon(feature, itemElement);
        }
        const textElement = DomHelper.createDropdownItemText();
        if (CalculationHelper.returnIfFunction(this.postprocessHook)) {
            const value = this.postprocessHook(feature);
            textElement.innerHTML = DomHelper.getStyledAddressSingleValue(value, userEnteredValue);
        }
        else {
            textElement.innerHTML = DomHelper.getStyledAddress(feature.properties, userEnteredValue);
        }
        itemElement.appendChild(textElement);
        this.addEventListenerOnDropdownClick(itemElement, event, index);
        this.autocompleteItemsElement.appendChild(itemElement);
    }
    addEventListenerOnDropdownClick(itemElement, event, index) {
        itemElement.addEventListener("click", (e) => {
            event.stopPropagation();
            this.setValueAndNotify(this.currentItems[index]);
        });
    }
    createDropdown() {
        /*create a DIV element that will contain the items (values):*/
        this.autocompleteItemsElement = document.createElement("div");
        this.autocompleteItemsElement.setAttribute("class", "geoapify-autocomplete-items");
        this.callbacks.notifyOpened();
        /* Append the DIV element as a child of the autocomplete container:*/
        this.container.appendChild(this.autocompleteItemsElement);
    }
    cancelPreviousTimeout() {
        if (this.currentTimeout) {
            window.clearTimeout(this.currentTimeout);
            this.currentTimeout = null;
        }
    }
    cancelPreviousRequest() {
        if (this.currentPromiseReject) {
            this.currentPromiseReject({
                canceled: true
            });
            this.currentPromiseReject = null;
        }
    }
    addEventListeners() {
        this.inputElement.addEventListener('input', this.onUserInput.bind(this), false);
        this.inputElement.addEventListener('keydown', this.onUserKeyPress.bind(this), false);
        document.addEventListener("click", (event) => {
            if (event.target !== this.inputElement) {
                this.closeDropDownList();
            }
            else if (!this.autocompleteItemsElement) {
                // open dropdown list again
                this.openDropdownAgain();
            }
        });
    }
    showClearButton() {
        this.inputClearButton.classList.add("visible");
    }
    removeClearButton() {
        this.inputClearButton.classList.remove("visible");
    }
    onUserKeyPress(event) {
        if (this.autocompleteItemsElement) {
            const itemElements = this.autocompleteItemsElement.getElementsByTagName("div");
            if (event.code === 'ArrowDown') {
                this.handleArrowDownEvent(event, itemElements);
            }
            else if (event.code === 'ArrowUp') {
                this.handleArrowUpEvent(event, itemElements);
            }
            else if (event.code === "Enter") {
                this.handleEnterEvent(event);
            }
            else if (event.code === "Escape") {
                /* If the ESC key is presses, close the list */
                this.closeDropDownList();
            }
        }
        else {
            if (event.code == 'ArrowDown') {
                /* Open dropdown list again */
                this.openDropdownAgain();
            }
        }
    }
    handleEnterEvent(event) {
        /* If the ENTER key is pressed and value as selected, close the list*/
        event.preventDefault();
        if (this.focusedItemIndex > -1) {
            if (this.options.skipSelectionOnArrowKey) {
                // select the location if it wasn't selected by navigation
                this.setValueAndNotify(this.currentItems[this.focusedItemIndex]);
            }
            else {
                this.closeDropDownList();
            }
        }
    }
    handleArrowUpEvent(event, itemElements) {
        event.preventDefault();
        /*If the arrow UP key is pressed, decrease the focusedItemIndex variable:*/
        this.focusedItemIndex--;
        if (this.focusedItemIndex < 0)
            this.focusedItemIndex = (itemElements.length - 1);
        /*and and make the current item more visible:*/
        this.setActive(itemElements, this.focusedItemIndex);
    }
    handleArrowDownEvent(event, itemElements) {
        event.preventDefault();
        /*If the arrow DOWN key is pressed, increase the focusedItemIndex variable:*/
        this.focusedItemIndex++;
        if (this.focusedItemIndex >= itemElements.length)
            this.focusedItemIndex = 0;
        /*and and make the current item more visible:*/
        this.setActive(itemElements, this.focusedItemIndex);
    }
    setActive(items, index) {
        if (!items || !items.length)
            return false;
        DomHelper.addActiveClassToDropdownItem(items, index);
        if (!this.options.skipSelectionOnArrowKey) {
            // Change input value and notify
            if (CalculationHelper.returnIfFunction(this.postprocessHook)) {
                this.inputElement.value = this.postprocessHook(this.currentItems[index]);
            }
            else {
                this.inputElement.value = this.currentItems[index].properties.formatted;
            }
            this.notifyValueSelected(this.currentItems[index]);
        }
    }
    setValueAndNotify(feature) {
        if (CalculationHelper.returnIfFunction(this.postprocessHook)) {
            this.inputElement.value = this.postprocessHook(feature);
        }
        else {
            this.inputElement.value = feature.properties.formatted;
        }
        this.notifyValueSelected(feature);
        /* Close the list of autocompleted values: */
        this.closeDropDownList();
    }
    clearFieldAndNotify(event) {
        event.stopPropagation();
        this.inputElement.value = '';
        this.removeClearButton();
        this.cancelPreviousRequest();
        this.cancelPreviousTimeout();
        this.closeDropDownList();
        // notify here
        this.notifyValueSelected(null);
    }
    closeDropDownList() {
        if (this.autocompleteItemsElement) {
            this.container.removeChild(this.autocompleteItemsElement);
            this.autocompleteItemsElement = null;
            this.callbacks.notifyClosed();
        }
    }
    notifyValueSelected(feature) {
        this.cancelPreviousPlaceDetailsRequest();
        if (this.noNeedToRequestPlaceDetails(feature)) {
            this.callbacks.notifyChange(feature);
        }
        else {
            let promise = this.sendPlaceDetailsRequestOrAlt(feature);
            promise.then((detailesFeature) => {
                this.callbacks.notifyChange(detailesFeature);
                this.currentPlaceDetailsPromiseReject = null;
            }, (err) => {
                if (!err.canceled) {
                    console.log(err);
                    this.callbacks.notifyChange(feature);
                    this.currentPlaceDetailsPromiseReject = null;
                }
            });
        }
    }
    sendPlaceDetailsRequestOrAlt(feature) {
        if (this.sendPlaceDetailsRequestAlt) {
            return this.sendPlaceDetailsRequestAlt(feature, this);
        }
        else {
            return this.sendPlaceDetailsRequest(feature);
        }
    }
    noNeedToRequestPlaceDetails(feature) {
        return !this.options.addDetails || !feature || feature.properties.nonVerifiedParts?.length;
    }
    cancelPreviousPlaceDetailsRequest() {
        if (this.currentPlaceDetailsPromiseReject) {
            this.currentPlaceDetailsPromiseReject({
                canceled: true
            });
            this.currentPlaceDetailsPromiseReject = null;
        }
    }
    openDropdownAgain() {
        const event = document.createEvent('Event');
        event.initEvent('input', true, true);
        this.inputElement.dispatchEvent(event);
    }
    constructOptions(options) {
        this.options = options ? { ...this.options, ...options } : this.options;
        this.options.filter = this.options.filter || {};
        this.options.bias = this.options.bias || {};
        if (this.options.countryCodes) {
            this.addFilterByCountry(this.options.countryCodes);
        }
        if (this.options.position) {
            this.addBiasByProximity(this.options.position);
        }
    }
    addClearButton() {
        this.inputClearButton = document.createElement("div");
        this.inputClearButton.classList.add("geoapify-close-button");
        DomHelper.addIcon(this.inputClearButton, 'close');
        this.inputClearButton.addEventListener("click", this.clearFieldAndNotify.bind(this), false);
        this.container.appendChild(this.inputClearButton);
    }
}