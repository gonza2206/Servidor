import bodyParser from "body-parser";
import { parse } from "dotenv";
import { Router } from "express";
import dataModel from "../schema/data-schema.js";
var aux1=0, aux2=0, max = 0.0;
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
          
          aux1 = parseFloat(dato.meassure.split(',')[2]);
          aux2+=aux1;
          count++;
          if (aux1 >= max) {
            max = aux1;
          }
        });
        let average = aux2/count;
        response.meassure = measurements;
        response.max = max;
        response.average = average;
        res.send(response);
      }
    );
  }
  else if (option === 'month') {
    console.log(month);
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
