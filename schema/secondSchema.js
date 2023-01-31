import mongoose from "mongoose";


const secondFloorSchema = mongoose.Schema({
    meassure: String,
    date: Date
})
const secondFloorModel = mongoose.model('SecondFloor', secondFloorSchema);

export default secondFloorModel;