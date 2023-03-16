const fs = require('fs');
const path = require('path');

var createWidgetJSFile = function createWidgetJSFile(widgetName, vendorName) {
    const widgetJSCode = `
  (function() {
      let template = document.createElement("template");
      template.innerHTML = \`
      <style>
      .name {
          font-family: Arial, sans-serif;
          color:green;
      }
  </style>
  <h1 class="name">Welcome to ${widgetName}</h1>
      \`;
      class ${widgetName}Widget extends HTMLElement {
          constructor() {
              super();
              let shadowRoot = this.attachShadow({
                  mode: "open"
              });
              shadowRoot.appendChild(template.content.cloneNode(true));
              this._props = {};
          }
          async connectedCallback() {
              this.initMain();
          }
          async initMain() {
            //start your code from here, happy coding :)
          }
          onCustomWidgetBeforeUpdate(changedProperties) {
              this._props = {
                  ...this._props,
                  ...changedProperties
              };
          }
          onCustomWidgetAfterUpdate(changedProperties) {
              this.initMain();
          }
      }
      customElements.define("com-${vendorName}-sap-${widgetName.toLowerCase()}", ${widgetName}Widget);
  })();`;

    const fileName = `${widgetName}.js`;

    fs.writeFile(fileName, widgetJSCode, (err) => {
        if (err) throw err;
        //console.log(`Created ${fileName}`);
    });
};

exports.createWidgetJSFile = createWidgetJSFile;