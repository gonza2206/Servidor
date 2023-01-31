import mongoose from "mongoose";

//const { default: dataModel } = require('../schema/data-schema');//importo el esquema
const meassureSchema = mongoose.Schema({
    meassure: String,
    date: Date
});

const dataModel = mongoose.model('Meassure', meassureSchema);

export default dataModel;
