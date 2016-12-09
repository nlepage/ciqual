var express = require("express");
var app = express();
app.use("/ciqual", express.static(__dirname));
app.listen(8086);
