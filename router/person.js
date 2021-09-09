const {Router} = require('express')
const router = Router()
const Person = require('../modeles/person')

router.get('/',async (req,res)=>{
    const persons = await Person.getPersons()
    res.render('persons',{
        title: 'Xodimlar bo`limi',
        isPersons:true,
        persons
    })
})
router.get('/add',(req,res)=>{
    res.render('newperson',{
        title: 'Yangi xodimni qo`shish'
    })
})
router.post('/',async (req,res)=>{
    const person = new Person(req.body.name,req.body.age,req.body.gender,req.body.depart) 
    await person.save()
    res.redirect('/persons')
})
module.exports = router