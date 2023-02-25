const app = require("./app");

const port = process.env.PORT || 3000;

function run() {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

exports = module.exports = {
  app,
  run,
};
