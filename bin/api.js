#!/usr/bin/env node

var createJsonFile = require('../lib/createJsonFile.js');
var createProp = require('../lib/createProp.js');
var exportapi = require('../lib/exportapi.js');
const localtunnel = require('localtunnel');

const http = require("http");
const fss = require('fs').promises;


const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let name, description, vendor, eula, version, license;

var args = process.argv.splice(process.execArgv.length + 2);

if (args[0] == "" || args[0] == null) {
    console.log("\n");
    console.log('█▀ ▄▀█ █▀█   █░█░█ █ █▀▄ █▀▀ █▀▀ ▀█▀');
    console.log('▄█ █▀█ █▀▀   ▀▄▀▄▀ █ █▄▀ █▄█ ██▄ ░█░');

    console.log("Version:1.0.7\nDeveloped by Rohit Chouhan | linkedin.com/in/itsrohitchouhan");

    console.log("\n ====== Inputs =====")
    console.log("-create : create new project");
    console.log("          -ex. sapwidget create colorbox");
    console.log("-props  : create new properties");
    console.log("          -ex. sapwidget props bgcolor");
    console.log("-start  : deploy project live for testing");
    console.log("          -ex. sapwidget start");
    console.log("-export : build widget for go-live");
    console.log("          -ex. sapwidget export");
    process.exit();
}

if (args[0] == "create" || (args[0] == "create" && args[1] != null)) {
    rl.question('Enter widget name: ' + (args[1] != null ? args[1] : "") + '', (answer) => {
        name = answer || (args[1] || "Hello World");
        rl.question('Enter description: ', (answer) => {
            description = answer;
            rl.question('Enter vendor/owner: ', (answer) => {
                vendor = answer || "rohitchouhan";
                rl.question('Enter EULA: ', (answer) => {
                    eula = answer;
                    rl.question('Enter version: (1.0.0) ', (answer) => {
                        version = answer || "1.0.0";
                        rl.question('Enter license: (MIT)', (answer) => {
                            license = answer || "MIT";
                            createJsonFile.createJsonFile(name, vendor, version, description, eula, license);
                            rl.close();
                        });
                    });
                });
            });
        });
    });
}

if (args[0] == "props" || (args[0] == "props" && args[1] != null)) {
    rl.question('Enter property name: ' + (args[1] != null ? args[1] : "") + '', (name) => {
        name = name || (args[1] || "sample");
        rl.question('Enter property description: ', (description) => {
            rl.question('Enter property type: ', (type) => {
                rl.question('Enter property default value: ', (defaultValue) => {
                    rl.question('Want to add set method? (y/n): ', (setter) => {
                        rl.question('Want to add get method? (y/n): ', (getter) => {
                            createProp.createProp(name, description, type, defaultValue, setter, getter);
                            rl.close();
                        });
                    });
                });
            });
        });
    });
}


if (args[0] == "start") {
    http.createServer(function (req, res) {
        var filePath = req.url.replace("/", "");
        res.setHeader("Bypass-Tunnel-Reminder", true);
        if (filePath === "") {
            const htmlcontents = `
            <html>
                <head><title>Ready to test</title></head>
                <body>
                <h1>Hy, Developer</h1>
            <h2 style="color:green">Your widget is ready to test</h2>
            </body>
            </html>
            `;
            res.setHeader("Content-Type", "Content-Type: text/html");
            res.writeHead(200);
            res.end(htmlcontents);
        } else {
            fss.readFile(filePath).then(contents => {
                res.setHeader("Content-Type", "application/javascript");
                res.writeHead(200);
                res.end(contents);
            })
        }

    }).listen(8080, () => {
        startLocalTunnel();
    });
}

if (args[0] == "export") {
    console.log("\n******** NOTE *********")
    console.log("\nMake sure your Repository Name, Should be same as Widget Name.")
    console.log("Example: if Widget name is \"Color Box\", then Repository name should be \"ColorBox\" (case-sensitive + without space)\n")
    rl.question('I am Userstood? (y/n): ', (any) => {
        if (any === 'y' || any === "Y") {
            rl.question('\nEnter Repository Link: ', (url) => {
                if (url !== null || url !== "") {
                    const repository = getUsernameAndRepoNameFromUrl(url);
                    exportapi.update(repository.repoName, repository.username);
                    console.log(`\n==================================================================`);
                    console.log(`\nCongratulations, ${repository.repoName} widget exported successfully to build folder.`);
                    console.log("\nUpload All files from \"Build\" folder to your")
                    console.log(`"${url}" github repository.`)
                    console.log(`\n==================================================================`);
                    process.exit();
                }
                if (url == null || url == "") {
                    console.log("Invalid Repository Link");
                }
            });
        } else {
            console.log("export closed!")
            process.exit();
        }
    });
}

function getNameValue() {
    return new Promise((resolve, reject) => {
        fs.readdir('.', (err, files) => {
            if (err) reject(err);

            const jsonFiles = files.filter(file => {
                const fileExt = file.split('.').pop();
                return fileExt === 'json';
            });

            fs.readFile(jsonFiles[0], 'utf8', (err, data) => {
                if (err) reject(err);

                const jsonData = JSON.parse(data);
                resolve(jsonData.name.toLowerCase().replace(/ /g, ''));
            });
        });
    });
}

async function startLocalTunnel() {
    try {
        const host = await getNameValue();
        const tunnel = await localtunnel({
            port: 8080,
            subdomain: `${host}-sap-rohitchouhan`
        });
        console.log(`\nServer started at ${tunnel.url}`);
        console.log("\nNote: Open the Link, and click to \"Click to Continue\" button to make testing live.")
        tunnel.on('close', () => {
            console.log('Server stopped');
        });
    } catch (error) {
        console.error(error);
    }
}

function getUsernameAndRepoNameFromUrl(url) {
    const regex = /^https?:\/\/github\.com\/([^/]+)\/([^/]+)$/i;
    const match = url.match(regex);

    if (match) {
        const username = match[1];
        const repoName = match[2];
        return {
            username,
            repoName
        };
    } else {
        throw new Error('Invalid GitHub URL');
    }
}
