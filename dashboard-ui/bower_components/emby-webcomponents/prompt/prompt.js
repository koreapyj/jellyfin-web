define(['paperdialoghelper', 'layoutManager', 'globalize', 'dialogText', 'html!./icons.html', 'css!./style.css', 'paper-button', 'paper-input'], function (paperdialoghelper, layoutManager, globalize, dialogText) {

    function show(options, resolve, reject) {

        var dialogOptions = {
            removeOnClose: true
        };

        var backButton = false;
        var raisedButtons = false;

        if (layoutManager.tv) {
            dialogOptions.size = 'fullscreen';
            backButton = true;
            raisedButtons = true;
        } else {

            dialogOptions.modal = false;
            dialogOptions.entryAnimationDuration = 160;
            dialogOptions.exitAnimationDuration = 200;
        }

        var dlg = paperdialoghelper.createDialog(dialogOptions);

        dlg.classList.add('promptDialog');

        var html = '';
        var submitValue = '';

        html += '<div class="promptDialogContent">';
        if (backButton) {
            html += '<paper-icon-button tabindex="-1" icon="dialog:arrow-back" class="btnPromptExit"></paper-icon-button>';
        }

        if (options.title) {
            html += '<h2>';
            html += options.title;
            html += '</h2>';
        }

        html += '<form>';

        html += '<paper-input autoFocus class="txtPromptValue" value="' + (options.value || '') + '" label="' + (options.label || '') + '"></paper-input>';

        if (options.description) {
            html += '<div class="fieldDescription">';
            html += options.description;
            html += '</div>';
        }

        html += '<br/>';
        if (raisedButtons) {
            html += '<paper-button raised class="btnSubmit"><iron-icon icon="dialog:check"></iron-icon><span>' + globalize.translate(dialogText.buttonOk) + '</span></paper-button>';
        } else {
            html += '<div style="text-align:right;">';
            html += '<paper-button class="btnSubmit">' + globalize.translate(dialogText.buttonOk) + '</paper-button>';
            html += '<paper-button class="btnPromptExit">' + globalize.translate(dialogText.buttonCancel) + '</paper-button>';
            html += '</div>';
        }
        html += '</form>';

        html += '</div>';

        dlg.innerHTML = html;

        document.body.appendChild(dlg);

        dlg.querySelector('form').addEventListener('submit', function (e) {

            submitValue = dlg.querySelector('.txtPromptValue').value;
            paperdialoghelper.close(dlg);
            e.preventDefault();
            return false;
        });

        dlg.querySelector('.btnSubmit').addEventListener('click', function (e) {

            // Do a fake form submit this the button isn't a real submit button
            var fakeSubmit = document.createElement('input');
            fakeSubmit.setAttribute('type', 'submit');
            fakeSubmit.style.display = 'none';
            var form = dlg.querySelector('form');
            form.appendChild(fakeSubmit);
            fakeSubmit.click();
            form.removeChild(fakeSubmit);
        });

        dlg.querySelector('.btnPromptExit').addEventListener('click', function (e) {

            paperdialoghelper.close(dlg);
        });

        dlg.addEventListener('iron-overlay-closed', function () {

            var value = submitValue;
            if (value) {
                resolve(value);
            } else {
                reject();
            }
        });

        paperdialoghelper.open(dlg);
    }

    return function (options) {

        return new Promise(function (resolve, reject) {

            if (typeof options === 'string') {
                options = {
                    title: '',
                    text: options
                };
            }

            show(options, resolve, reject);
        });

    };
});