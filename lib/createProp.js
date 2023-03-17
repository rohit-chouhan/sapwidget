const fs = require('fs');

var createProp = async function createProp(name, description, type, defaultValue, setter, getter) {

  var jsonFileName = await getJsonFileName();

  fs.readFile(jsonFileName, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const jsonObj = JSON.parse(data);

    jsonObj.properties[name] = {
      description: description,
      type: type,
      default: defaultValue
    };


    if (setter === "y" || setter === "Y") {
      //===== setter ==========
      var capital = name.charAt(0).toUpperCase() + name.slice(1);
      jsonObj.methods["set" + capital] = {
        description: "Set " + description,
        parameters: [{
          name: name,
          type: type,
          description: "Data for " + description
        }],
        body: "this." + name + " = " + name + ";"
      };
    }

    if (getter === "y" || getter === "Y") {
      //===== getter ==========
      var capital = name.charAt(0).toUpperCase() + name.slice(1);
      jsonObj.methods["get" + capital] = {
        returnType: type,
        description: "Return " + description,
        body: "return this." + name + ";"
      };
    }

    fs.writeFile(jsonFileName, JSON.stringify(jsonObj, null, 2), (err) => {
      if (err) {
        console.error(err);
        return;
      }

      console.log('\nProperty added successfully!');
    });
  });
};

function getJsonFileName() {
  return new Promise((resolve, reject) => {
    fs.readdir('.', (err, files) => {
      if (err) {
        reject(err);
        return;
      }
      const jsonFiles = files.filter(file => {
        return file.endsWith('.json');
      });
      if (jsonFiles.length > 0) {
        resolve(jsonFiles[0]);
      } else {
        reject('No JSON files found');
      }
    });
  });
}

exports.createProp = createProp;
