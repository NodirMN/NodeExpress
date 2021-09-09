const {Router} = require('express')
const router = Router()
const Cars = require('../modeles/cars')
const auth = require('../middleware/auth')
router.get('/', auth, async (req, res) => {
    const cars = await Cars.find().lean()
    res.render('cars',{
        title: 'Avtomobillar ro`yhati',
        cars
    })
})
router.get('/new', auth, (req, res) => {
    res.render('newcar',{
        title: 'Yangi avtomobil'
    })
})
// o'zgarish form beradi
router.get('/edit/:id', auth, async (req, res) => {
    const car = await Cars.findById(req.params.id).lean()
    res.render('editcar',{
        title: `${car.model} ni tahrirlash`,
        car
    })
})
// o'zgarishni saqlaydi
router.post('/save', auth, async (req, res) => {
    const {_id} = req.body
    delete req.body._id
    await Cars.findByIdAndUpdate(_id,req.body)
    res.redirect('/cars')
})
// delete
router.get('/delete/:id', auth, async (req, res) => {
    await Cars.findByIdAndRemove(req.params.id)
    res.redirect('/cars')
})
// batafsil 
router.get('/show/:id', auth, async (req, res) => {
    const car = await Cars.findById(req.params.id).lean()
    res.render('car',{
        title: `${car.model} ning batafsil ma'lumoti`,
        car
    })
})

router.post('/add', auth, async (req, res) => {
    const car = await new Cars({
        model: req.body.model,
        color: req.body.color,
        distance: req.body.distance,
        year: req.body.year
    })
    car.save()
    res.redirect('/cars')
})

module.exports = router