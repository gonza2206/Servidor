import bodyParser from "body-parser";
import { parse } from "dotenv";
import { Router } from "express";
import dataModel from "../schema/data-schema.js";
import secondFloorModel from "../schema/secondSchema.js"
import { convertToISO } from "../utils/ISODate.js";

var aux1 = 0, aux2 = 0, max = 0.0, sum = 0, sum2 = 0, sum3 = 0, sum4 = 0, sum5 = 0, sum6 = 0, sum7 = 0, sumThd = 0, sumEkwh = 0, sumPower = 0;
let count = 0;
const dataRouter = Router();

dataRouter.use((req, res, next) => {
  console.log(req.ip); //Me devuelve la ip del que hace la solicitud

  next(); //funcion necesaria para indicar que se ejecute la siguiente funcion. Osea el endpoint segun si hicimos un get, post , etc
});

dataRouter.post("/", async (req, res) => {
  var auxiliar = req.body;

  console.log(auxiliar);

  return res.send("Data receive");
});

dataRouter.use(bodyParser.json({ limit: "20mb" }));

dataRouter.use(
  bodyParser.urlencoded({
    limit: "20mb",
    extended: true,
  })
);

dataRouter.get("/", async (req, res) => {
  if (!req.query.StartDate || !req.query.EndDate) {
    res.sendStatus(400);
  } else {
    console.log(req.query.Floor);
    let month = req.query.Month;
    if (month === '0') {
      console.log(`StarDate: ${req.query.StartDate} \nendDate ${req.query.EndDate} \nMonth: ${req.query.Month} \n`);
      findInDataBase(res, req, month, req.query.Floor, 'all');

    } else {
      console.log(`StarDate: ${req.query.StartDate} \nendDate ${req.query.EndDate} \nMonth: ${req.query.Month} \n `);
      findInDataBase(res, req, month, req.query.Floor, 'month');
    }


  }
});

export default dataRouter;

/**
 * @param {Request} res 
 * @param {Request} req 
 * @param {number} month 
 * @param {number} floor
 * @param {String} option 
 * Look for data in the Database base on option parameter. 
 * * 'all' Look for data between two dates
 * * 'month' Look for information in a specific month
 */
const findInDataBase = (res, req, month, floor, option) => {
  let response = {
    meassure: [],
    max: 0,
    average: 0,
    harmonics: []
  };
  const startDate = convertToISO(req.query.StartDate)//new Date( req.query.StartDate);
  const endDate = convertToISO(req.query.EndDate)//new Date(req.query.EndDate);

  if (option === 'all') {
    if (floor === '1') {

      dataModel.find({
        $and:
          [
            { date: { $gte: startDate } },
            { date: { $lte: endDate } }
          ]
      },
        (err, measurements) => {
          response = getResponse(measurements, response);
          res.send(response);
        }
      );
    } else {
      secondFloorModel.find({
        $and:
          [
            { date: { $gte: startDate } },
            { date: { $lte: endDate } }
          ]
      },
        (err, measurements) => {
          response = getResponse(measurements, response);
          res.send(response);
        }
      );
    }
  }

  else if (option === 'month') {
    let maxDay = setMaxDay(month);
    if (floor === '1') {

      dataModel.find({
        $and:
          [
            { date: { $gte: convertToISO(`2023-${month}-1-0-0-0`) } },
            { date: { $lte: convertToISO(`2023-${month}-${maxDay}-0-0-0`) } }
          ]
      },
        (err, measurements) => {
          response = getResponse(measurements, response);
          res.send(response);
        }
      );
    } else {
      secondFloorModel.find({
        $and:
          [
            { date: { $gte: convertToISO(`2023-${month}-1-0-0-0`) } },
            { date: { $lte: convertToISO(`2023-${month}-${maxDay}-0-0-0`) } }
          ]
      },
        (err, measurements) => {
          response = getResponse(measurements, response);
          res.send(response);
        }
      );
    }
  }
}

const getMaxValue = (dato) => {
  aux1 = parseFloat(dato.meassure.split(',')[2]);
  aux2 += aux1;
  count++;
  let harmonic1 = parseFloat(dato.meassure.split(',')[5]);
  sum += harmonic1;
  let harmonic2 = parseFloat(dato.meassure.split(',')[6]);
  sum2 += harmonic2;
  let harmonic3 = parseFloat(dato.meassure.split(',')[7]);
  sum3 += harmonic3;
  let harmonic4 = parseFloat(dato.meassure.split(',')[8]);
  sum4 += harmonic4;
  let harmonic5 = parseFloat(dato.meassure.split(',')[9]);
  sum5 += harmonic5;
  let harmonic6 = parseFloat(dato.meassure.split(',')[10]);
  sum6 += harmonic6;
  let harmonic7 = parseFloat(dato.meassure.split(',')[11]);
  sum7 += harmonic7;
  let thd = parseFloat(dato.meassure.split(',')[12]);
  sumThd += thd;
  let power = parseFloat(dato.meassure.split(',')[13]);
  sumPower += power;
  let Ekwh = parseFloat(dato.meassure.split(',')[14]);
  sumEkwh += Ekwh;
  if (aux1 >= max) {
    max = aux1;
  }
}

const getResponse = (measurements, response) => {
  measurements.forEach(dato => {
    getMaxValue(dato);
  });
  let average = aux2 / count;
  let averageHarmonic = sum / count;
  let averageHarmonic2 = sum2 / count;
  let averageHarmonic3 = sum3 / count;
  let averageHarmonic4 = sum4 / count;
  let averageHarmonic5 = sum5 / count;
  let averageHarmonic6 = sum6 / count;
  let averageHarmonic7 = sum7 / count;
  let averageThd = sumThd / count;
  let averagePower = sumPower /count;
  let averageEkwh = sumEkwh / count;
  sum = 0;
  sum2 = 0;
  sum3 = 0;
  sum4 = 0;
  sum5 = 0;
  sum6 = 0;
  sum7 = 0;
  sumThd = 0;
  sumPower = 0;
  sumEkwh = 0;
  count = 0;
  aux2 = 0;
  
  const S = 250 * average;
  const Q = S * averageThd;
  const cos_phi = Math.sqrt(Math.pow(S, 2) - Math.pow(Q, 2)) / S;
  
  console.log("Potencia aparente: " + S + " VA");
  console.log("Potencia reactiva: " + Q + " VAr");
  console.log("Coseno phi: " + cos_phi);
  console.log(average);

  response.meassure = measurements;
  response.max = max;
  response.average = average;
  response.harmonics.push(averageHarmonic);//0
  response.harmonics.push(averageHarmonic2);//1
  response.harmonics.push(averageHarmonic3);//2
  response.harmonics.push(averageHarmonic4);//3
  response.harmonics.push(averageHarmonic5);//4
  response.harmonics.push(averageHarmonic6);//5
  response.harmonics.push(averageHarmonic7);//6
  response.harmonics.push(averageThd);//7
  response.harmonics.push(averageEkwh);//8
  response.harmonics.push(averagePower);//9
  response.harmonics.push(cos_phi);//10
  response.harmonics.push(Q);//11

  return (response);
}

const setMaxDay = (month) => {
  if (month === 1 || month === 3 || month === 4 || month === 6 || month === 7 || month === 8 || month === 10 || month === 3 || month === 12) {

    return (31);
  }
  if (month === 2) {
    return (28)
  }
  else {
    return (30);
  }
}