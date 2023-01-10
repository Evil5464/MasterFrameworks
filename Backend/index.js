'use sctrict'

var mongoose = require('mongoose');
var app = require('./app.js');
var port = 3900;

mongoose.set('strictQuery', true); //Solución de warninig propuesta en la ejecución
// mongoose.set('useFindAndModify', false); //esto genera errores y no sirve en la actualidad

mongoose.Promise = global.Promise;/*  Permite usar promesas en mongoose */

/* estrucura de función de tipo callback que realiza la coneccion con la base de datos
mongoose.connect(URL, opciones).then(() => {});  */
mongoose.connect('mongodb://127.0.0.1/api_rest_blog', { useNewUrlParser: true})
    .then(()=>{
        console.log('conexión a bd La conexión a la base de datos se ha realizado correctamente!!!');
        // Crear servidor y escuchar peticiones http
        app.listen(port, () => {
            console.log("Servidor corriendo en http://127.0.0.1:"+ port);
        });

    });
