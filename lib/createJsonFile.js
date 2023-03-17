const fs = require('fs');
const path = require('path');
const createWidgetBuilderFile = require('./createWidgetBuilderFile');
const createWidgetJSFile = require('./createWidgetJSFile');

var createJsonFile = function createJsonFile(name, vendor, version, description, eula, license) {
    const jsonObject = {
        "id": `com.rohitchouhan.${vendor.toLowerCase().replace(/ /g, '')}.${name.toLowerCase().replace(/ /g, '')}`,
        "version": version,
        "name": name,
        "description": description,
        "newInstancePrefix": name.replace(/ /g, ''),
        "vendor": vendor,
        "eula": eula,
        "license": license,
        "icon": `https://${name.toLowerCase().replace(/ /g, '')}-sap-rohitchouhan.loca.lt/icon.png`,
        "webcomponents": [{
                "kind": "main",
                "tag": `com-${vendor.toLowerCase().replace(/ /g, '')}-sap-${name.toLowerCase().replace(/ /g, '')}`,
                "url": `https://${name.toLowerCase().replace(/ /g, '')}-sap-rohitchouhan.loca.lt/${name.replace(/ /g, '')}.js`,
                "integrity": "",
                "ignoreIntegrity": true
            },
            {
                "kind": "builder",
                "tag": `com-${vendor.toLowerCase().replace(/ /g, '')}-sap-${name.toLowerCase().replace(/ /g, '')}-builder`,
                "url": `https://${name.toLowerCase().replace(/ /g, '')}-sap-rohitchouhan.loca.lt/${name.replace(/ /g, '')}_Builder.js`,
                "integrity": "",
                "ignoreIntegrity": true
            }
        ],
        "properties": {},
        "methods": {},
        "events": {}
    };

    // Write the JSON object to a file
    const fileName = `${name.replace(/ /g, '')}.json`;
    fs.writeFile(fileName, JSON.stringify(jsonObject, null, 4), (err) => {
        if (err) {
            console.error(err);
            return;
        }
        createWidgetBuilderFile.createWidgetBuilderFile(name.replace(/ /g, ''), vendor.toLowerCase().replace(/ /g, ''));
        createWidgetJSFile.createWidgetJSFile(name.replace(/ /g, ''), vendor.toLowerCase().replace(/ /g, ''));
        fs.copyFile(path.join(__dirname, '../') + '/icon.png', 'icon.png', (err) => {
            if (err) throw err;
        });
        fs.copyFile(path.join(__dirname, '../') + '/favicon.ico', 'favicon.ico', (err) => {
            if (err) throw err;
        });

        console.log(`\n${name} Widget Created Successfully!`);

        fs.writeFile(fileName, JSON.stringify(jsonObject, null, 4), (err) => {
            if (err) {
                console.error(err);
                return;
            }
        });
    });
};

exports.createJsonFile = createJsonFile;
