//Core modules
const path = require("path");
//Extern modules
const express = require("express");
const hbs = require("hbs");
const cookieParser = require("cookie-parser");
//Custom modules
const bookRouters = require("./routers/bookRouters");
const adminRouters = require("./routers/adminRouters");
const userRouters = require("./routers/userRouters");

//Init app
const app = express();

//Paths
const publicFolderPath = path.join(__dirname,'../public');
const viewsFolderPaths = [path.join(__dirname,'../templates/views/store'),
                          path.join(__dirname,'../templates/views/admin')];
const partialsFolderPath = path.join(__dirname,'../templates/partials');

//App & HBS config
app.set('view engine','hbs');
app.set('views',viewsFolderPaths);
app.use(cookieParser());
app.use(express.static(publicFolderPath));
app.use(express.json());
app.use(bookRouters);
app.use(adminRouters);
app.use(userRouters);
hbs.registerPartials(partialsFolderPath);

require("./db/mongodbConnect"); //Start mongodb session

app.listen(process.env.PORT,()=>{
    console.log("Server up on port",process.env.PORT)
})