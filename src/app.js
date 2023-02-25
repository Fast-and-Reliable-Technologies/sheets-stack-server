const express = require("express");
const cors = require("cors");
const app = express();

const serviceRoutes = require("./routes/service");
const listdbRoutes = require("./routes/listdb");
const basicdbRoutes = require("./routes/basicdb");

app.use(express.json());
app.use(cors());

app.use("/service", serviceRoutes);
app.use("/listdb", listdbRoutes);
app.use("/db/v1", basicdbRoutes);

module.exports = app;
