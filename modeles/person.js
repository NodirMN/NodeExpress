const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid')
// npm i uuid
class Person {  
    constructor(name,age,gender,depart){
        this.name = name
        this.age  = age
        this.gender = gender
        this.depart = depart
        this.id = uuidv4()
    }
    toObj(){
        return {
            name: this.name,
            age: this.age,
            gender: this.gender,
            depart: this.depart,
            id: this.id
        }
    }
    async save(){
        const persons = await Person.getPersons()
        persons.push(this.toObj())
        return new Promise((resolve,reject)=>{
            fs.writeFile(
                path.join(__dirname,'..','data','persons.js'),
                JSON.stringify(persons),
                (err)=>{
                    if (err) reject(err) 
                    else resolve()
                }
            )
        })
    }
    static getPersons(){
        return new Promise((resolve,reject)=>{
            fs.readFile(
                path.join(__dirname,'..','data','persons.js'),
                'utf-8',
                (err,content)=>{
                    if (err) reject(err)
                    else resolve(JSON.parse(content))
                }
            )
        })
    }
}
module.exports = Person