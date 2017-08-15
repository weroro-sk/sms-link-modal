# sms-link-modal
Show modal with sms send button.

dependencies: https://github.com/weroro-sk/sms-link

---
usage: 
```javascript
let sms_link_modal = new SmsLinkModal();

sms_link_modal
            .setFormID('your-element-id') // scrollTo after close - element id
            .setSms({
                number: '+123456', // sms tel number
                text: 'Your SMS text here.' // sms text
            })
            .linkFix((status) => { // linkFix - It's not necessary call this method
                // callback [optional]
            })
            .render();
```

For show and hide modal use:
```javascript
sms_link_modal.show();

sms_link_modal.hide();
```
---
notice:
* If you want to use your own device detection, call method { setDefaultSeparator(separator) } directly.
Internal device detection will be fully ignored.

example:
```javascript
let sms_link_modal = new SmsLinkModal();

sms_link_modal.setDefaultSeparator('yourSeparatorHere'); // read notice ^^^

sms_link_modal
            .setFormID('your-element-id') // form element id without sharp
            .setSms({
                number: '+123456', // sms tel number
                text: 'Your SMS text here.' // sms text
            })
            .linkFix((status) => { // linkFix - It's not necessary call this method
                // callback [optional]
            })
            .render();
```
---
### Methods for runtime changes

Set new tel. number.
```javascript
sms_link_modal.setSmsNumber('987654');
```
Set new sms text.
```javascript
sms_link_modal.setSmsText('Your new text here.');
```
Set new scrollto element ID.
```javascript
sms_link_modal.setFormID('your-new-element-id'); // without sharp
```
---
#### CUSTOM MODAL LABELS
Sms send button
```javascript
sms_link_modal.setSmsButonLabel('New sms button label');
```
Sms price label
```javascript
sms_link_modal.setSmsButtonPrice('New <b>price</b> label');
```
Form button
```javascript
sms_link_modal.setFormButtonLabel('New form button label');
```
Close button
```javascript
sms_link_modal.setCloseButtonLabel('New close button label');
```
###### MULTIPLE MODAL LABELS
```javascript
sms_link_modal.setModalTextData({
                                  sms_button_label: 'New sms button label', // [optional]
                                  sms_button_price: 'New <b>price</b> label', // [optional]
                                  form_button_anchor: '#your-new-element-id', // [optional] sharp must be included
                                  form_button_label: 'New form button label', // [optional]
                                  close_button_label: 'New close button label' // [optional]
                                });
```
---
### Creating your own callbacks

You can create your own custom callback functions for all existing events.
 
List of all existing IDs for events you get via:
 ```javascript
sms_link_modal.getCallbackIDList(true);
// returns Array ["escape_key", "outer_click", "send", "form", "close"]
```
or if you want the list with included functions:
```javascript
sms_link_modal.getCallbackIDList();
// returns Object {escape_key: null, outer_click: null, send: null, form: null, close: function}
```

For creating your callback use 'customCallback(callbackID, callback)' function.

Example: 
```javascript
// The function will be execute after click on close button.
smsLinkModal.customCallback('close', () => {
            console.log('Modal was closed with close button');
        });
```

---
#### MODAL HTML STRUCTURE AND LIST OF CSS CLASSES FOR CUSTOM STYLESHEETS
notice: 
* In your custom css please use strong selectors.
```
eg. [tag name] .classname

[div] .rs-sms-modal-overlay                     /* parent */
    └[div] .rs-sms-modal-box                    /* first child */
        ├─[a]    .rs-sms-modal-sms-button       /* second child */
        ├─[span] .rs-sms-modal-price            /* second child */
        ├─[a]    .rs-sms-modal-form-button      /* second child */
        └─[span] .rs-sms-modal-close-button     /* second child */
```
# API
```javascript
smsLinkModal.getSmsNumber(); // returns actual sms number
```
```javascript
smsLinkModal.getSmsText(); // returns actual sms text
```
```javascript
smsLinkModal.getSmsElements(); // Returns all found sms: href elements
```
```javascript
smsLinkModal.getModal(); // Returns modal element or null
```

#### Other features

```javascript
smsLinkModal.addClass(HTMLElement, className); // Adds CSS class

smsLinkModal.removeClass(HTMLElement, className); // Removes CSS class

smsLinkModal.empty(customVar); // Is variable empty? | Returns true / false

smsLinkModal.scrollTo(HTMLElement); // Animated scrolling to element.

smsLinkModal.getData(HTMLElement, 'my-custom-attr'); // <div data-my-custom-attr="hello"></div>

smsLinkModal.rTrim(String); // Removes unnecessary spaces from string.

smsLinkModal.getHighestZIndex(); // Returns highest z-index value in document.

smsLinkModal.appendHtml(htmlString, containerElement); // Appends html in document

smsLinkModal.capitalize(String); // Uppercase first letter.

smsLinkModal.underscoreCreator(String); // Transforms camelcase string to underscore
```