const fs = require('fs');
const path = require('path');

var createWidgetBuilderFile = function createWidgetBuilderFile(widgetName, vendorName) {
    const fileName = `${widgetName}_Builder.js`;
    const fileContent = `(function () {
        let template = document.createElement("template");
        template.innerHTML = \`
        <style>
            .name {
                font-family: Arial, sans-serif;
                color:blue;
            }
        </style>
        <h1 class="name">Welcome to ${widgetName} Builder</h1>
        \`;
        class ${widgetName}WidgetBuilderPanel extends HTMLElement {
           constructor() {
              super();
              this._shadowRoot = this.attachShadow({
                 mode: "open"
              });
              this._shadowRoot.appendChild(template.content.cloneNode(true));
              this._shadowRoot
                 .getElementById("form")
                 .addEventListener("submit", this._submit.bind(this));
           }
           _submit(e) {
                 e.preventDefault();
                 this.dispatchEvent(
                    new CustomEvent("propertiesChanged", {
                       detail: {
                          properties: {},
                       },
                    })
                 );
              }
               
                      }
     customElements.define("com-${vendorName}-sap-${widgetName.toLowerCase()}-builder", 
     ${widgetName}WidgetBuilderPanel
     );
  })();`;

    fs.writeFile(fileName, fileContent, (err) => {
        if (err) {
            console.error(err);
        } else {
            //console.log(`File ${fileName} has been created successfully!`);
        }
    });
};

exports.createWidgetBuilderFile = createWidgetBuilderFile;