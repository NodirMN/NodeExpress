module.exports = (req,res,next)=>{
    res.locals.isAuth = req.session.isAuthed
    res.locals.csrf = req.csrfToken()
    next()
} 
