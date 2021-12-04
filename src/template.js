const ejs = require("ejs");

module.exports = { render };

function render(content, data) {
  return ejs.render(content, data);
}
