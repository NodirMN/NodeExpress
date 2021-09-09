const {Schema, model} = require('mongoose')

const user = new Schema({
    name:{
        type:String,
        required: true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    skills:{ 
        type:  Array,
        default: []
    },
    avatar:{
        type:String,
        default:''
    },
})
module.exports = model('User',user)