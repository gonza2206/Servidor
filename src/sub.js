//MQTT SUBSCRIBER 
//Obtiene el mensaje del publisher. 
import dataModel from '../schema/data-schema.js';
import mqtt from 'mqtt';
import mongoose from "mongoose";
import { convertToISO } from '../utils/ISODate.js';
import secondFloorModel from '../schema/secondSchema.js';


var client = mqtt.connect('mqtt://localhost:1234');
var topic = 'outTopic'; //topic al que me subscribo

client.on('message', (topic, message) => {//cuando recibo un mensaje lo parsep a string
    let status = false;
    message = message.toString();
    status = match(message);

    if (status === true) {
        console.log("New message receive.");
        parseFrame(message);
    }
    else {
        console.log("Frame Error");
        console.log(message);
    }
});

client.on('connect', () => {
    client.subscribe(topic);
});

/*Guardo la informacion en la base de datos */
const postData = async (meassure, date, option) => {
    mongoose.connect('mongodb+srv://gonza2206:natac1on@mediciones.sxhappl.mongodb.net/?retryWrites=true&w=majority');
    if (option === 'r') {
        const newData = new dataModel({ meassure: meassure, date: date });
        await newData.save();
    } else {
        const newData = new secondFloorModel({ meassure: meassure, date: date });
        await newData.save();
    }
}

const match = (message) => {

    let meassure = message.split(',');
    if (meassure[0] === "r" && message.length > 150) {
        return true;
    }
    else {
        return false;
    }
}


const parseFrame = (message) => {

    let meassure = message.split(',');
    /*Divido el mensaje entrante en las dos tramas correspondientes */
     meassure.forEach((element,index) => {
        console.log(`${index} : ${element}`);
    });
    let frameR = meassure.slice(0, 15).join(",");
    let frameS = meassure.slice(15, 30).join(",");
    
    /*concateno las el dia y la hora con un "-" */
    meassure[31] = '-' + meassure[31];
    let date = meassure[30].concat(meassure[31]);
    date = convertToISO(date);

    console.log(`frameR: ${frameR}\nframeS: ${frameS}\ndate: ${date}`);

    postData(frameR, date, 'r');
    postData(frameS, date, 's');
}
//r,250.00,21.99,22.42,1.02,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,5.50,13.01,2023-1-3,12-33-59




