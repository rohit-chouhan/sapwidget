const fs = require('fs');
const path = require('path');

function update(widgetName, username) {
    copyFiles();
    // Load the JSON file
    const data = fs.readFileSync('build/' + widgetName + '.json', 'utf8');
    const json = JSON.parse(data);

    // Update the URL values of the webcomponents array
    json.icon = `https://raw.githubusercontent.com/${username}/${widgetName}/main/icon.png`;
    json.webcomponents[0].url = `https://cdn.jsdelivr.net/gh/${username}/${widgetName}/${widgetName}.js`;
    json.webcomponents[1].url = `https://cdn.jsdelivr.net/gh/${username}/${widgetName}/${widgetName}_Builder.js`;

    // Save the updated JSON back to the file
    fs.writeFileSync('build/' + widgetName + '.json', JSON.stringify(json, null, 4), 'utf8');
}

function copyFiles() {
    const sourceDir = './';
    const targetDir = './build';

    // Check if target directory exists, create it if it doesn't
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir);
    }

    // Get a list of files in the source directory
    const files = fs.readdirSync(sourceDir);

    // Copy each file to the target directory
    files.forEach((file) => {
        if (file !== "build" || file !== "favicon.ico") {
            const sourcePath = path.join(sourceDir, file);
            const targetPath = path.join(targetDir, file);
            fs.copyFileSync(sourcePath, targetPath);
        }
    });
}

exports.update = update;