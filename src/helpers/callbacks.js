export class Callbacks {
    changeCallbacks = [];
    suggestionsChangeCallbacks = [];
    inputCallbacks = [];
    openCallbacks = [];
    closeCallbacks = [];
    addCallback(operation, callback) {
        let currentCallbacks = this.getCallbacksByOperation(operation);
        if (currentCallbacks) {
            if (currentCallbacks.indexOf(callback) < 0) {
                currentCallbacks.push(callback);
            }
        }
    }
    removeCallback(operation, callback) {
        let currentCallbacks = this.getCallbacksByOperation(operation);
        if (currentCallbacks) {
            if (currentCallbacks.indexOf(callback) >= 0) {
                currentCallbacks.splice(currentCallbacks.indexOf(callback), 1);
                this.setCallbacksByOperation(operation, currentCallbacks);
            }
            else if (!callback) {
                this.setCallbacksByOperation(operation, []);
            }
        }
    }
    notifyInputChange(currentValue) {
        this.inputCallbacks.forEach(callback => callback(currentValue));
    }
    notifyChange(feature) {
        this.changeCallbacks.forEach(callback => callback(feature));
    }
    notifySuggestions(features) {
        this.suggestionsChangeCallbacks.forEach(callback => callback(features));
    }
    notifyOpened() {
        this.openCallbacks.forEach(callback => callback(true));
    }
    notifyClosed() {
        this.closeCallbacks.forEach(callback => callback(false));
    }
    getCallbacksByOperation(operation) {
        let currentCallbacks = null;
        switch (operation) {
            case 'select': {
                currentCallbacks = this.changeCallbacks;
                break;
            }
            case 'suggestions': {
                currentCallbacks = this.suggestionsChangeCallbacks;
                break;
            }
            case 'input': {
                currentCallbacks = this.inputCallbacks;
                break;
            }
            case 'close': {
                currentCallbacks = this.closeCallbacks;
                break;
            }
            case 'open': {
                currentCallbacks = this.openCallbacks;
                break;
            }
        }
        return currentCallbacks;
    }
    setCallbacksByOperation(operation, callbacks) {
        switch (operation) {
            case 'select': {
                this.changeCallbacks = callbacks;
                break;
            }
            case 'suggestions': {
                this.suggestionsChangeCallbacks = callbacks;
                break;
            }
            case 'input': {
                this.inputCallbacks = callbacks;
                break;
            }
            case 'close': {
                this.closeCallbacks = callbacks;
                break;
            }
            case 'open': {
                this.openCallbacks = callbacks;
                break;
            }
        }
    }
}