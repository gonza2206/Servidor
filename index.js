//MQTT BROKER
import mosca from 'mosca';
import dotenv from "dotenv";
import express from "express";
import mongoose from 'mongoose';
import datatRouter from "./routes/data.js";
import cors from 'cors';
//MQTT SERVER

var settings = { port: 1234 };
var broker = new mosca.Server(settings);

broker.on('ready', () => {
    console.log('Broker ready on port 1234');


});

broker.on('published', (packet) => {
    console.log(packet.payload.toString());
});


//HTTP SERVER

dotenv.config();

const PORT = process.env.PORT;
const expressApp = express();
expressApp.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
expressApp.use(express.json());
expressApp.use(express.text());

//expressApp.use("/account", accountRouter);//este es un midleware que solo se ejecuta para el path account. SI no lo defino es un middleware a nivel global y se ejecutaria para todos los path 
expressApp.use("/data", datatRouter);//Conexion con ESP


const bootstrap = async () => {
    //Primero me tengo que conectar a mongo y despues empezar a escuchar por el puerto.
    await mongoose.connect('mongodb+srv://gonza2206:natac1on@mediciones.sxhappl.mongodb.net/?retryWrites=true&w=majority');

    expressApp.listen(PORT, () =>
        console.log(`Servidor levantado en el puerto ${PORT}`)
    );
}

bootstrap();//no tiene nada que ver con bootstrap de css. indica que comienza el server.

//el schema define la forma de los usuarios en la base de datos. EL modelo es el esquema compilado. Es un objeto que se pueede usar en JS
