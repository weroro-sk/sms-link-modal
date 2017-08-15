class SmsLinkModal extends SmsLink {
    /**
     * @param {boolean} [debug]
     * @constructor SmsLinkModal
     */
    constructor(debug = false) {

        /**
         * @constructor SmsLink
         */
        super(debug, 'SmsLinkModal');

        /** @type {boolean} */
        this.separatorExist = false;

        /** @type {HTMLElement|null} */
        this.modal = null;

        /** @type {Number} */
        this.zIndex = this.getNextHighestZIndex();

        /** @type {{
                sms_config : {
                    sms_number: string,
                    sms_text: string,
                    sms_url: string,
                    }|object ,
                sms_button_label: string,
                sms_button_price: string,
                form_button_anchor: string,
                form_button_label: string,
                close_button_label: string
              }|object}*/
        this.modalTextData = {
            sms_config: {
                sms_number: '',
                sms_text: '',
                sms_url: ''
            },
            sms_button_label: 'Send via SMS',
            sms_button_price: 'Sms price is <b>0,50 €</b>',
            form_button_anchor: '#form',
            form_button_label: 'Send via form',
            close_button_label: 'Close'
        };

        /** @type {boolean} */
        this.modalWasShown = false;

        /** @type {boolean} */
        this.modalHasBeenRendered = false;

        /** @type {object} */
        this.externalCustomCallbacks = {}

    }

    /**
     * @returns {SmsLinkModal}
     */
    cleanUrl() {
        this.modalTextData.sms_config.sms_url = this.smsUrlNormalize(this.modalTextData.sms_config.sms_url);
        return this;
    }

    /**
     * @returns {SmsLinkModal}
     */
    createSmsLink() {
        /** @type {string} */
        let smsFullLink = `sms:${this.getSmsNumber()}${this.getDefaultSeparator()}body=${this.getSmsText()}`;
        this.setSmsUrl(smsFullLink);
        return this;
    }

    /**
     * @param {{
                number: string,
                text: string
              }|object} sms
     * @returns {SmsLinkModal}
     */
    setSms(sms) {
        if (!this.empty(sms)) {
            /** @type {boolean} */
            let wasChanged = false;
            if (!this.empty(sms.number)) {
                this.setSmsNumber(sms.number);
                wasChanged = true;
            }
            if (!this.empty(sms.text)) {
                this.setSmsText(sms.text);
                wasChanged = true;
            }
            if (wasChanged) {
                this.createSmsLink();
                if (!this.empty(this.getModal())) {
                    this.render();
                }
            }
        }
        return this;
    }

    /**
     * @param {string} value
     * @returns {SmsLinkModal}
     */
    setSmsNumber(value) {
        if (!this.empty(value)) {
            if (typeof value !== 'string') {
                value = '' + value;
                if (this.empty(this.rTrim(value, true))) {
                    return this;
                }
            }
            this.modalTextData.sms_config.sms_number = value;
            if (!this.empty(this.getModal())) {
                this
                    .createSmsLink()
                    .render();
            }
        }
        return this;
    }

    /**
     * @param {string} value
     * @returns {SmsLinkModal}
     */
    setSmsText(value) {
        if (!this.empty(value)) {
            this.modalTextData.sms_config.sms_text = value;
            if (!this.empty(this.getModal())) {
                this
                    .createSmsLink()
                    .render();
            }
        }
        return this;
    }

    /**
     * @param {string} value
     * @returns {SmsLinkModal}
     */
    setSmsUrl(value) {
        if (!this.empty(value)) {
            this.modalTextData.sms_config.sms_url = value;
            this.cleanUrl();
        }
        return this;
    }

    /**
     * @param {string} value
     * @returns {SmsLinkModal}
     */
    setSmsButonLabel(value) {
        if (!this.empty(value)) {
            this.modalTextData.sms_button_label = value;
            this.reDraw();
        }
        return this;
    }

    /**
     * @param {string} value
     * @returns {SmsLinkModal}
     */
    setSmsButtonPrice(value) {
        if (!this.empty(value)) {
            this.modalTextData.sms_button_price = value;
            this.reDraw();
        }
        return this;
    }

    /**
     * @param {string} value
     * @returns {SmsLinkModal}
     */
    setFormID(value) {
        if (!this.empty(value)) {
            this.setFormButtonAnchor(value);
        }
        return this;
    }

    /**
     * @param {string} value
     * @returns {SmsLinkModal}
     */
    setFormButtonAnchor(value) {
        if (!this.empty(value)) {
            this.modalTextData.form_button_anchor = '#' + value;
            this.reDraw();
        }
        return this;
    }

    /**
     * @param {string} value
     * @returns {SmsLinkModal}
     */
    setFormButtonLabel(value) {
        if (!this.empty(value)) {
            this.modalTextData.form_button_label = value;
            this.reDraw();
        }
        return this;
    }

    /**
     * @param {string} value
     * @returns {SmsLinkModal}
     */
    setCloseButtonLabel(value) {
        if (!this.empty(value)) {
            this.modalTextData.close_button_label = value;
            this.reDraw();
        }
        return this;
    }

    /**
     * @param {{
                sms_button_label: string,
                sms_button_price: string,
                form_button_anchor: string,
                form_button_label: string,
                close_button_label: string
              }|object} values
     * @returns {SmsLinkModal}
     */
    setModalTextData(values) {
        /** @type {string} */
        let i;
        for (i in values) {
            if (values.hasOwnProperty(i) && this.modalTextData.hasOwnProperty(i)) {
                if (i.toLowerCase() === 'sms_config') {
                    continue;
                }
                this.modalTextData[i] = values[i];
            }
        }
        this.cleanUrl();
        return this.reDraw();
    }

    /**
     * @param {HTMLElement} modalElement
     * @returns {SmsLinkModal}
     */
    setModal(modalElement) {
        this.modal = modalElement;
        return this;
    }

    /**
     * @returns {HTMLElement|null}
     */
    getModal() {
        return this.modal;
    }

    /**
     * @returns {SmsLinkModal}
     */
    findModal() {
        /** @type {Element} */
        let modal = document.querySelector('.rs-sms-modal-overlay');
        if (this.empty(modal)) {
            return this.logger('%s - Modal element not found.', 3, [this.APP_NAME]);
        }
        this.setModal(modal);
        return this;
    }

    /**
     * @returns {string}
     */
    getSmsNumber() {
        return this.modalTextData.sms_config.sms_number;
    }

    /**
     * @returns {string}
     */
    getSmsText() {
        return this.modalTextData.sms_config.sms_text;
    }

    /**
     * @param {string} [htmlTagName]
     * @returns {{index: Number, element: HTMLElement|null}}
     */
    getHighestZIndex(htmlTagName) {
        if (typeof htmlTagName !== 'string' ||
            this.empty(htmlTagName) ||
            htmlTagName.toLowerCase() === 'all') {
            htmlTagName = '*';
        }
        /** @type {NodeList} */
        let elements = document.querySelectorAll(htmlTagName);
        /** @type {Number} */
        let highest = 0;
        /** @type {HTMLElement|null} */
        let highestElement = null;
        /** @type {Number} */
        let zetIndex;
        Array.from(elements).map((element) => {
            zetIndex = parseInt(document.defaultView.getComputedStyle(element, null).getPropertyValue('z-index'));
            if (!isNaN(zetIndex) && (zetIndex > highest)) {
                highest = zetIndex;
                highestElement = element;
            }
        });
        return {index: highest, element: highestElement};
    }

    /**
     * @returns {Number}
     */
    getNextHighestZIndex() {
        return this.getHighestZIndex().index + 1;
    }

    /**
     * @returns {Number}
     */
    getZIndex() {
        return this.zIndex;
    }

    /**
     * @param {string} htmlData
     * @param {HTMLElement} [parentElement]
     * @returns {SmsLinkModal}
     */
    appendHtml(htmlData, parentElement) {
        /** @type {HTMLDocument} */
        let d = document;
        if (this.empty(parentElement)) {
            parentElement = d.body;
        }
        if (this.empty(htmlData)) {
            return this;
        }
        /** @type {Element} */
        let container = d.createElement('div');
        container.innerHTML = htmlData;
        while (container.firstChild) {
            parentElement.appendChild(container.firstChild);
        }
        return this;
    }

    /**
     * @returns {SmsLinkModal}
     */
    reDraw() {
        if (this.modalHasBeenRendered) {
            this.render();
        }
        return this;
    }

    /**
     * @returns {SmsLinkModal}
     */
    render() {
        if (!this.separatorExist) {
            this.separatorExist = this.setDefaultSeparatorByOs();
            if (!this.separatorExist) {
                return this.logger('%s - Unsupported operating system.', 2, [this.APP_NAME]);
            }
        }
        /** @type {boolean} */
        let modalWasShown = this.modalWasShown;
        if (!this.empty(this.getModal())) {
            this.destroy();
        }
        this.appendHtml(
            this.modalTemplate()
        )
            .findModal()
            .bindEvents();
        if (modalWasShown) {
            this.show();
        }
        if (!this.modalHasBeenRendered) {
            this.modalHasBeenRendered = true;
        }
        return this;
    }

    /**
     * @param {boolean} [everything]
     * @returns {SmsLinkModal}
     */
    destroy(everything) {
        /** @type {HTMLElement|null} */
        let modal = this.getModal();
        if (this.empty(modal)) {
            return this;
        }
        this.hide();
        modal.parentNode.removeChild(modal);
        this.modal = null;
        this.modalHasBeenRendered = false;
        if (everything === true) {
            this.externalCustomCallbacks = {};
        }
        return this;
    }

    /**
     * @returns {SmsLinkModal}
     */
    show() {
        if (!this.modalWasShown) {
            /** @type {HTMLElement|null} */
            let modal = this.getModal();
            if (!this.empty(modal)) {
                this.addClass(modal, 'rs-sms-modal-show');
                this.modalWasShown = true;
            }
        }
        return this;
    }

    /**
     * @returns {SmsLinkModal}
     */
    hide() {
        if (this.modalWasShown) {
            /** @type {HTMLElement|null} */
            let modal = this.getModal();
            if (!this.empty(modal)) {
                this.removeClass(modal, 'rs-sms-modal-show');
                this.modalWasShown = false;
            }
        }
        return this;
    }

    /**
     * @param {HTMLElement} element
     * @param {string} dataSelector
     * @returns {string}
     */
    getData(element, dataSelector) {
        if (this.empty(element) || typeof dataSelector !== 'string') {
            return '';
        }
        dataSelector = this.rTrim(dataSelector);
        /** @type {string} */
        let shortDataSelector = dataSelector;
        if (shortDataSelector.indexOf('-') > 0) {
            /** @type {string} */
            let newSelector = '';
            shortDataSelector.split('-').filter((a) => {
                return a;
            }).map((item) => {
                newSelector += this.capitalize(item);
            });
            shortDataSelector = newSelector.charAt(0).toLowerCase() + newSelector.slice(1);
        }
        return (this.empty(element.dataset)) ? element.getAttribute('data-' + dataSelector) : element.dataset[shortDataSelector];
    };

    /**
     * @param {string} inputString
     * @param {boolean} [removeAllSpaces]
     * @returns {string}
     */
    rTrim(inputString, removeAllSpaces) {
        /** @type {Array} */
        let outputArray = inputString.replace('\xa0', ' ').split(' ').filter((a) => {
            return a;
        });
        return (removeAllSpaces === true) ? outputArray.join('') : outputArray.join(' ');
    };

    /**
     * @param {string} txt
     * @returns {string}
     */
    capitalize(txt) {
        if (!this.empty(txt)) {
            return txt.charAt(0).toUpperCase() + txt.slice(1);
        }
        return '';
    }

    /**
     * @param {string} inputString
     * @returns {string}
     */
    underscoreCreator(inputString) {
        if (this.empty(this.rTrim(inputString, true))) {
            return this.rTrim(inputString, true);
        }
        inputString = this.rTrim(inputString, true);
        /** @type {string} */
        let outputString = '';
        /** @type {string} */
        let singleChar = '';
        /** @type {Number} */
        let charIndex;
        for (charIndex = 0; charIndex < inputString.length; charIndex++) {
            /** @type {string} */
            singleChar = inputString.charAt(charIndex);
            if (singleChar.match(/[A-Z]/) !== null && !this.empty(outputString)) {
                outputString += '_';
            }
            outputString += singleChar;
        }
        return outputString.toLowerCase();
    }

    /**
     * @param {HTMLElement} element
     * @param {string} nameOfClass
     * @returns {void}
     */
    addClass(element, nameOfClass) {
        /** @type {string} */
        let fullClass = element.className;
        if (fullClass.indexOf(nameOfClass) < 0) {
            if (fullClass.length > 0) {
                fullClass += ' ';
            }
            fullClass += nameOfClass;
            element.className = this.rTrim(fullClass);
        }
    };

    /**
     * @param {HTMLElement} element
     * @param {string} nameOfClass
     * @returns {void}
     */
    removeClass(element, nameOfClass) {
        /** @type {string} */
        let fullClass = element.className;
        /** @type {string} */
        let newClass = '';
        if (fullClass.indexOf(nameOfClass) > -1) {
            fullClass.split(' ').map((value) => {
                if (value !== nameOfClass && value.length > 0) {
                    newClass += ' ' + value;
                }
            });
            element.className = this.rTrim(newClass);
        }
    };

    /**
     * @param {Element} element
     * @returns {SmsLinkModal}
     */
    scrollTo(element) {
        if (this.empty(element)) {
            return this;
        }
        /** @type {Number} */
        let position = element.getBoundingClientRect().top;
        /** @type {Number} */
        let shift = Math.round(Math.abs(position) > 1 ? position / 5 : position);
        window.scrollBy(0, shift);
        if (position - element.getBoundingClientRect().top) {
            setTimeout(() => {
                this.scrollTo(element);
            }, 30);
        }
        return this;
    };

    /**
     * @param {{
                hash: string
              }|HTMLElement|EventTarget} anchor
     * @returns {boolean}
     */
    scrollThrough(anchor) {
        /** @type {string} */
        let anchorHash = anchor.hash;
        if (this.empty(anchorHash)
            || this.rTrim(anchorHash, true).length < 2
            || this.rTrim(anchorHash, true).indexOf('#') !== 0) {
            return true;
        }
        /** @type {Element} */
        let element = document.querySelector(anchorHash);
        if (this.empty(element)) {
            return true;
        }
        this.scrollTo(element);
        return false;

    };

    /**
     * @param {boolean} [listOnly]
     * @returns {Array|object}
     */
    getCallbackIDList(listOnly) {
        if (listOnly) {
            return Object.keys(this.externalCustomCallbacks);
        }
        return this.externalCustomCallbacks;
    }

    /**
     * @param {string} callbackID
     * @returns {SmsLinkModal}
     */
    setCallbackID(callbackID) {
        if (this.empty(callbackID)) {
            return this.logger('%s - Missing callback ID.', 2, [this.APP_NAME]);
        }
        callbackID = this.underscoreCreator(callbackID).toLowerCase();
        if (!this.getCallbackIDList().hasOwnProperty(callbackID)) {
            this.getCallbackIDList()[callbackID] = null;
        }
        return this;
    }

    /**
     * @param {string} callbackID
     * @param {function} callbackMethod
     * @returns {SmsLinkModal}
     */
    customCallback(callbackID, callbackMethod) {
        if (this.empty(callbackID)) {
            return this.logger('%s - Missing callback ID.', 2, [this.APP_NAME]);
        }
        callbackID = callbackID.toLowerCase();
        if (this.getCallbackIDList().hasOwnProperty(callbackID) && typeof callbackMethod === 'function') {
            if (!this.empty(this.getCallbackIDList()[callbackID])) {
                this.logger('%s - Callback method with ID "%s" was overwritten.', 1, [this.APP_NAME, callbackID]);
            }
            this.getCallbackIDList()[callbackID] = callbackMethod;
        }
        return this;
    }

    /**
     * @param {string} callbackID
     * @returns {SmsLinkModal}
     */
    execCallback(callbackID) {
        if (this.empty(callbackID)) {
            return this.logger('%s - Missing callback ID.', 2, [this.APP_NAME]);
        }
        // callbackID = this.underscoreCreator(callbackID);
        callbackID = callbackID.toLowerCase();
        if (this.getCallbackIDList().hasOwnProperty(callbackID)) {
            if (typeof this.getCallbackIDList()[callbackID] === 'function') {
                this.getCallbackIDList()[callbackID]();
                return this;
            }
            return this.logger('%s - Callback with ID "%s" not found. Set new callback using %s.customCallback("%s", ()=>{})', 2, [this.APP_NAME, callbackID, this.underscoreCreator(this.APP_NAME), callbackID]);
        }
        return this.logger('%s - Callback ID "%s" not exist.', 2, [this.APP_NAME, callbackID]);
    }

    /**
     * @returns {SmsLinkModal}
     */
    globalEvents() {
        /** @type {HTMLElement|null} */
        let modal = this.getModal();
        if (!this.empty(modal)) {
            this.setCallbackID('escapeKey');
            document.addEventListener('keydown', (event) => {
                /** @type {Number} */
                let code = event.keyCode ? event.keyCode : event.which;
                if (code === 27) {
                    this.execCallback('escape_key').hide();
                }
            }, false);
            this.setCallbackID('outerClick');
            modal.addEventListener('click', (event) => {
                if (event.target === event.currentTarget) {
                    this.execCallback('outer_click').hide();
                }
            }, false);
        }
        return this;
    }

    /**
     * @param {HTMLElement} element
     * @returns {SmsLinkModal}
     */
    setEventByData(element) {
        if (!this.empty(element) && !this.empty(this.getData(element, 'action-type'))) {
            /** @type {Array} */
            let dataArray = this.rTrim(this.getData(element, 'action-type'), true).split('-');
            if (dataArray.length < 2) {
                return this;
            }
            /** @type {string} */
            let elementEvent = dataArray[0];
            /** @type {string} */
            let elementAction = dataArray[1];
            /** @type {string} */
            let actionName = 'action' + this.capitalize(elementAction);
            /** @type {string} */
            let actionID = elementAction.toLowerCase();
            if (typeof this[actionName] === 'function') {
                this.setCallbackID(actionID);
                element.addEventListener(elementEvent, (event) => {
                    this.execCallback(actionID)[actionName](event);
                }, false);
            } else {
                this.logger('%s - Method "%s()" not found.', 2, [this.APP_NAME, actionName]);
            }
        }
        return this;
    }

    /**
     * @returns {SmsLinkModal}
     */
    bindEvents() {
        /** @type {HTMLElement|null} */
        let modal = this.getModal();
        if (!this.empty(modal)) {
            this.globalEvents();
            /** @type {NodeList} */
            let elements = modal.querySelectorAll('[class$="-button"]');
            Array.from(elements).map((element) => {
                this.setEventByData(element);
            });
        }
        return this;
    }

    /**
     * @returns {string}
     */
    modalTemplate() {
        if (this.empty(this.modalTextData)) {
            return '';
        }
        /**
         * data-action-type
         * click-send / click = eventName & send = actionName
         */
        return `<div class="rs-sms-modal-overlay" style="z-index:${this.getZIndex()}">
                    <div class="rs-sms-modal-box">
                        <a href="${this.modalTextData.sms_config.sms_url}" data-action-type="click-send" class="rs-sms-modal-sms-button">${this.modalTextData.sms_button_label}</a>
                        <span class="rs-sms-modal-price">${this.modalTextData.sms_button_price}</span>
                        <a href="${this.modalTextData.form_button_anchor}" data-action-type="click-form" class="rs-sms-modal-form-button">${this.modalTextData.form_button_label}</a>
                        <span data-action-type="click-close" class="rs-sms-modal-close-button">${this.modalTextData.close_button_label}</span>
                    </div>
                </div>`;
    }

    /***** ACTIONS *****/

    /**
     * @param {object} [event]
     * @returns {void}
     */
    actionSend(event) {
        this.hide();
    }

    /**
     * @param {object} [event]
     * @returns {void}
     */
    actionForm(event) {
        this.scrollThrough(event.currentTarget);
        this.hide();
        event.preventDefault();
    }

    /**
     * @param {object} [event]
     * @returns {void}
     */
    actionClose(event) {
        this.hide();
        event.preventDefault();
    }
}

