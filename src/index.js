//Core modules
const path = require("path");
//Extern modules
const express = require("express");
const hbs = require("hbs");
//Custom modules
const bookRouters = require("./routers/bookRouters");

//Init app
const app = express();

//Paths
const publicFolderPath = path.join(__dirname,'../public');
const viewsFolderPath = path.join(__dirname,'../templates/views');
const partialsFolderPath = path.join(__dirname,'../templates/partials');

//App & HBS config
app.set('view engine','hbs');
app.set('views',viewsFolderPath);
app.use(express.static(publicFolderPath));
app.use(express.json())
app.use(bookRouters)
hbs.registerPartials(partialsFolderPath);

require("./db/mongodbConnect"); //Start mongodb session

app.listen(process.env.PORT,()=>{
    console.log("Server up on port",process.env.PORT)
})