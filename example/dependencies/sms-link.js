class SmsLink {
    /** @namespace navigator.vendor */

    /**
     * @param {boolean} [debug]
     * @param {string} [appName]
     */
    constructor(debug = false, appName = 'SmsLink') {

        /** @type {string} */
        this.APP_NAME = appName;

        /** @type {string} */
        // this.APP_NAME = this.constructor.name; // Many transpilers does't support constructor.name

        /** @type {boolean} */
        this.debug = debug;

        /** @type {string} */
        this.separator = '';

        /** @type {Number} */
        this.minIOSVersion = 7; // Because ios7 allegedly does't support sms: protocol

        /**
         * @type {{
                     tablet: boolean,
                     facebook: boolean
                 }}
         */
        this.ignoreList = {
            'tablet': false,
            'facebook': false
        };

    }

    /**
     * @param {string} [inputString]
     * @param {Number} [type]
     * @param {Array} [args]
     * @returns {SmsLink|*}
     */
    logger(inputString, type, args) {
        inputString = inputString || '';
        /** @type {boolean} */
        let bypass = type === true;
        type = (isNaN(type) || this.empty(type)) ? 5 : type;
        args = args || [];
        if (this.debug === true ||
            bypass === true) {
            switch (type) {
                case 1 :
                    console.info(inputString, ...args);
                    break;
                case 2 :
                    console.warn(inputString, ...args);
                    break;
                case 3 :
                    console.error(inputString, ...args);
                    break;
                case 4 :
                    console.debug(inputString, ...args);
                    break;
                default :
                    console.log(inputString, ...args);
                    break;
            }
        }
        return this;
    }

    /**
     * @description Finds and corrects all anchors with href SMS: protocol.
     * @notice  Info for extends: It's not necessary call this method,
     *          if you don't have any anchor tags with sms: protocol on your document.
     *
     * @param {function} [callback]
     * @returns {SmsLink}
     */
    linkFix(callback) {
        /** @type {boolean} */
        let status = false;
        if (this.setDefaultSeparatorByOs()) {
            status = this.replaceAnchorHrefSeparator();
        }
        if (typeof callback === 'function') {
            callback(status);
        }
        return this;
    }

    /**
     * @returns {Number}
     */
    getMinIOSVersion() {
        return this.minIOSVersion;
    }

    /**
     * @returns {string}
     */
    getUserAgent() {
        /** @type {string} */
        let userAgent = navigator.userAgent || navigator.vendor || window.opera;
        // userAgent = navigator.userAgent;
        if (this.empty(userAgent)) {
            return '';
        }
        return userAgent;
    }

    /**
     * @returns {SmsLink}
     */
    ignoreFacebookApp() {
        this.ignoreList.facebook = true;
        return this;
    }

    /**
     * @returns {SmsLink}
     */
    ignoreTablets() {
        this.ignoreList.tablet = true;
        return this;
    }

    /**
     * @description Returns true if detect Facebook APP web browser or false
     *
     * @returns {boolean}
     */
    isFacebookApp() {
        /** @type {string} */
        let ua = this.getUserAgent();
        return (!!ua.match(/fban/i) || !!ua.match(/fbav/i));
    }

    /**
     * @description Returns iOS version or false
     *
     * @param {boolean} [intOutput]
     * @returns {Number|boolean}
     */
    isIOS(intOutput) {
        /** @type {string} */
        let userAgent = this.getUserAgent();
        /** @type {string} */
        let version = ('' + (/CPU.*OS ([0-9_]{1,5})|(CPU like).*AppleWebKit.*Mobile/i.exec(userAgent) || [0, ''])[1])
            .replace('undefined', '3_2').replace('_', '.').replace('_', '');
        if (this.ignoreList.tablet === true &&
            !!userAgent.match(/iPad/i)) {
            return false;
        }
        if (intOutput === true) {
            return parseInt(version) || false;
        }
        return parseFloat(version) || false;
    }

    /**
     * @description Returns true if detect Android OS or false
     *
     * @param {boolean} [mobileOnly]
     * @returns {boolean}
     */
    isAndroid(mobileOnly) {
        /** @type {string} */
        let userAgent = this.getUserAgent();
        if (mobileOnly === true) {
            return !!userAgent.match(/android/i) && !!userAgent.match(/mobile/i);
        }
        if (this.ignoreList.tablet === true) {
            if (!!userAgent.match(/android/i) &&
                (!!userAgent.match(/mobile/i) === false)) {
                return false;
            }
        }
        return !!userAgent.match(/android/i);
    }

    /**
     * @param {*} mixedVar
     * @returns {boolean}
     */
    empty(mixedVar) {
        /** @type {string} */
        let key;
        /** @type {Number} */
        let i;
        /** @type {Array} */
        let emptyValues = [void 0, null, false, 0, '', '0'];
        for (i = 0; i < emptyValues.length; i++) {
            if (mixedVar === emptyValues[i]) {
                return true;
            }
        }
        if (typeof mixedVar === 'object') {
            /** @type {string} */
            let objectType = Object.prototype.toString.call(mixedVar).toLowerCase();
            if (objectType.indexOf('element') !== -1 ||
                objectType.indexOf('html') !== -1) {
                return false;
            }
            for (key in mixedVar) {
                if (mixedVar.hasOwnProperty(key)) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    /**
     * @param {string} smsFullText
     * @returns {string}
     */
    smsUrlNormalize(smsFullText) {
        if (this.empty(this.getDefaultSeparator()) ||
            this.empty(smsFullText)) {
            return smsFullText;
        }
        return smsFullText.replace(/&amp;/g, '&').replace(/.body=/, this.getDefaultSeparator() + 'body=');
    }

    /**
     * @description Matches and returns all anchor tags with sms: protocol.
     *
     * @returns {NodeList}
     */
    getSmsElements() {
        return document.querySelectorAll('[href^="sms:"]');
    }

    /**
     * @returns {boolean}
     */
    replaceAnchorHrefSeparator() {
        /** @type {NodeList} */
        let elements = this.getSmsElements();
        if (this.empty(elements)) {
            return false;
        }
        Array.from(elements).map(element => {
            /** @type {string} */
            let newURL = this.smsUrlNormalize(element.href);
            if (!this.empty(newURL)) {
                element.href = newURL;
            }
        });
        return !this.empty(elements);
    }

    /**
     * @notice  Call this method directly if you want to use your own mobile detection.
     *          Method { getMobileOperatingSystem() } will be fully ignored.
     *
     * @param {string} separator
     * @returns {boolean}
     */
    setDefaultSeparator(separator) {
        if (typeof separator === 'string' && !this.empty(separator)) {
            if (this.empty(arguments[1]) ||
                arguments[1] !== 1) {
                this.logger('%s - Default separator was defined manually. The separator is "%s"', 1, [this.APP_NAME, separator]);
            }
            this.separator = separator;
            return !this.empty(this.separator);
        }
        return false;
    }

    /**
     * @returns {string}
     */
    getDefaultSeparator() {
        return this.separator;
    }

    /**
     * @notice  If { setDefaultSeparator(separator) } method was called directly,
     *          then method { setDefaultSeparatorByOs() } always returns true.
     *
     * @returns {boolean}
     */
    setDefaultSeparatorByOs() {
        if (!this.empty(this.getDefaultSeparator())) {
            return true;
        }
        /** @type {Object} */
        let osDetect = this.getMobileOperatingSystem(false, true);
        if (!this.empty(osDetect)) {
            return this.setDefaultSeparator(this.getSeparatorByOsAndVersion(osDetect.os, osDetect.version), 1);
        }
        this.logger('%s - Unsupported operating system', 2, [this.APP_NAME]);
        return false;
    }

    /**
     *
     * @param {string} osType
     * @param {Number} osVersion
     * @returns {string}
     */
    getSeparatorByOsAndVersion(osType, osVersion) {
        if (!this.empty(osType)) {
            /** @type {string} */
            let os = osType.toLowerCase();
            if (os === 'android') {
                return '?';
            }
            /** @type {number|NaN} */
            let version = parseFloat(osVersion);
            if (os === 'ios' &&
                !isNaN(version) &&
                version !== this.getMinIOSVersion()) {
                return (osVersion < this.getMinIOSVersion()) ? ';' : '&';
            }
        }
        return '';
    }

    /**
     * @notice  If you want to use your own device detection,
     *          call method { setDefaultSeparator(separator) } directly.
     *          Method { getMobileOperatingSystem() } will be fully ignored.
     *
     * @param {boolean} [mobileOnly]
     * @param {boolean} [intOutput]
     * @returns {object}
     */
    getMobileOperatingSystem(mobileOnly, intOutput) {
        /** @type {object} */
        let objectReturn = {};
        if (this.ignoreList.facebook === true &&
            this.isFacebookApp()) {
            return objectReturn;
        }
        /** @type {Number|boolean} */
        let iOS = this.isIOS(intOutput);
        /** @type {boolean} */
        let android = this.isAndroid(mobileOnly);
        if (!!iOS === true) {
            objectReturn.os = 'iOS';
            objectReturn.version = iOS;
        } else if (android === true) {
            objectReturn.os = 'Android';
            objectReturn.version = android;
        }
        return objectReturn;
    }

}
