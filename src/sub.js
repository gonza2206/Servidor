//MQTT SUBSCRIBER 
//Obtiene el mensaje del publisher. 
import dataModel from '../schema/data-schema.js';
import mqtt from 'mqtt';
import mongoose from "mongoose";
import { convertToISO } from '../utils/ISODate.js';


var client = mqtt.connect('mqtt://localhost:1234');
var topic = 'outTopic'; //topic al que me subscribo

client.on('message', (topic, message) => {//cuando recibo un mensaje lo parsep a string
    message = message.toString();
    if (message.startsWith("INIT")) {
        console.log("New device connected.");
    }
    else {
        console.warn("Device not recongnized");
        parseFrame(message);
        console.log(message);
    }
});

client.on('connect', () => {
    client.subscribe(topic);
});

/*Guardo la informacion en la base de datos */
const postData = async (meassure, date) => {
    mongoose.connect('mongodb+srv://gonza2206:natac1on@mediciones.sxhappl.mongodb.net/?retryWrites=true&w=majority');
    const newData = new dataModel({ meassure: meassure, date: date });
    await newData.save();
}

const parseFrame = (message) => {

    let meassure = message.split(',');
    meassure.forEach((element,index) => {
        console.log(`${index}: ${element}`);
    });
   // meassure[16] = '-' + meassure[16];
    //let date = meassure[15].concat(meassure[16]);
    //date = convertToISO(date);
    //Elimino los ultimos elementos del array, los cuales contienen la fecha. 
    meassure.pop();
    meassure.pop();
    let measurmentToString = meassure.toString();
    //postData(measurmentToString, date);
}
//r,250.00,21.99,22.42,1.02,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,5.50,13.01,2023-1-3,12-33-59



