const {Router} = require('express')
const router = Router()
const User  = require('../modeles/user')
const bcrypt = require('bcryptjs')

router.get('/login',async(req,res)=>{
    res.render('auth/login',{
            title:'Tizimga kirish',
            error: req.flash('error'),
            succsess: req.flash('succsess')
    })
})

//////////////////////////////////////////////
router.post('/reg',async(req,res)=>{
    const {name,email,password,rpassword} = req.body
    const reallyMan = await User.findOne({email})
    if(reallyMan){
        req.flash('error','Bunday emaildagi foydalanuvchi mavjud!')
        res.redirect('/auth/login')
    }else{
        const hashPass = await bcrypt.hash(password,10)
        const really = await new User(
            {
                name,
                email,
                password:hashPass
            })
        await really.save()
        req.flash('succsess','Ro`yhatdan o`tdingiz')
        res.redirect('/auth/login')
    }
})

router.get('/logout',async(req,res)=>{
    req.session.destroy((err)=>{
        if(err) throw err
        res.redirect('/auth/login')
    })
})

///////////////////////////////////////////////
router.post('/login',async(req,res)=>{
    const {email,password} = req.body
    const maybeUser = await User.findOne({email})
    if (maybeUser){
        const comparePass = await bcrypt.compare(password,maybeUser.password)
        if(comparePass){
            req.session.user = maybeUser
            req.session.isAuthed = true
            req.session.save((err)=>{
                if (err) 
                    throw err
                else 
                res.redirect('/')
            })
        } else  {
            req.flash('error','Mahfiy kalit noto`g`ri kiritildi')
            res.redirect('/auth/login')}

    } else  {
        req.flash('error', 'Bunday email foydalanuvchi mavjud emas!')
        res.redirect('/auth/login')
        }
    })
module.exports = router