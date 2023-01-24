import bodyParser from "body-parser";
import { parse } from "dotenv";
import { Router } from "express";
import dataModel from "../schema/data-schema.js";
var aux1=0, aux2=0, max = 0.0, sum=0, sum2=0, sum3=0, sum4=0, sum5=0, sum6=0, sum7=0, sumThd=0, sumEkwh=0;
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
    //"2023-1-3-16-24-25"
    let month = req.query.Month;
    if (month === '0') {
      console.log(`StarDate: ${req.query.StartDate} \nendDate ${req.query.EndDate} \nMonth: ${req.query.Month} \n`);
      findInDataBase(res, req, month, 'all');

    } else {
      console.log(`StarDate: ${req.query.StartDate} \nendDate ${req.query.EndDate} \nMonth: ${req.query.Month} \n`);
      findInDataBase(res, req, month, 'month');
    }


  }
});

export default dataRouter;

/**
 * @param {Request} res 
 * @param {Request} req 
 * @param {number} month 
 * @param {String} option 
 * Look for data in the Database base on option parameter. 
 * * 'all' Look for data between two dates
 * * 'month' Look for information in a specific month
 */
const findInDataBase = (res, req, month, option) => {
  let response = {
    meassure: [],
    max: 0,
    average: 0,
    harmonics: []
  };
  if (option === 'all') {

    dataModel.find({

      $and:
        [
          { date: { $gte: req.query.StartDate } },
          { date: { $lte: req.query.EndDate } }
        ]
    },
      (err, measurements) => {
        measurements.forEach(dato => {
          getMaxValue(dato);  
        });
        let average = aux2/count;
        let averageHarmonic = sum/count;
        let averageHarmonic2 = sum2/count;
        let averageHarmonic3 = sum3/count;
        let averageHarmonic4 = sum4/count;
        let averageHarmonic5 = sum5/count;
        let averageHarmonic6 = sum6/count;
        let averageHarmonic7 = sum7/count;
        let averageThd = sumThd/count;
        let averageEkwh = sumEkwh/count;
        
        sum=0;
        sum2=0;
        sum3=0;
        sum4=0;
        sum5=0;
        sum6=0;
        sum7=0;
        sumThd=0;
        sumEkwh=0;
        count=0;
        aux2=0;
        response.meassure = measurements;
        response.max = max;
        response.average = average;
        response.harmonics.push(averageHarmonic);
        response.harmonics.push(averageHarmonic2);
        response.harmonics.push(averageHarmonic3);
        response.harmonics.push(averageHarmonic4);
        response.harmonics.push(averageHarmonic5);
        response.harmonics.push(averageHarmonic6);
        response.harmonics.push(averageHarmonic7);
        response.harmonics.push(averageThd);
        response.harmonics.push(averageEkwh);
        res.send(response);
      }
    );
  }
  else if (option === 'month') {
    //console.log(month);
    dataModel.find({
      $and:
        [
          { date: { $gte: `2023-1-3-0-0-0` } },
          { date: { $lte: `2023-1-4-0-0-0` } }
        ]
    },
      (err, measurements) => {
        res.send(measurements);
      }
    );
  }
}

const getMaxValue = (dato)=>{
  aux1 = parseFloat(dato.meassure.split(',')[2]);
  aux2+=aux1;
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
  let Ekwh = parseFloat(dato.meassure.split(',')[14]);
  sumEkwh += Ekwh;
  if (aux1 >= max) {
    max = aux1;
  }
}

