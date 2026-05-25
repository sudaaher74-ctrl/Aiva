const fs = require('fs');

global.window = {};
global.document = {
  querySelectorAll: () => [],
  getElementById: () => ({ addEventListener: () => {} }),
  addEventListener: () => {}
};
global.localStorage = { getItem: () => null, setItem: () => {} };

const code = fs.readFileSync("/Users/milquu/Documents/Aiva 2/js/main.js", "utf8");
try {
  eval(code);
  console.log("Success! No runtime errors on load.");
} catch(e) {
  console.error("Runtime error:", e);
}
