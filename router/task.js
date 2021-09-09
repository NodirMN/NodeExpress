const {Router} = require('express')
const Task = require('../modeles/task')
const { populate } = require('../modeles/user')
const User = require('../modeles/user')
const router = Router()
const auth = require('../middleware/auth')

router.get('/',auth,async(req,res)=>{
    const tasks = await Task.find().lean().populate('userId','name email')
    res.render('tasks',{
        title:'Topshiriq ro`yhati',
        isTasks:true,
        tasks
    })
})

router.get('/new', auth, async (req, res) => {
    const users = await User.find().lean()
    res.render('newtask',{
        title:'Yanagi topshiriq',
        users
    })
})

router.post('/comment/:id', auth, async (req, res) => {
    const task = await  Task.findById(req.params.id).lean()
    const  comment = {
        userId:req.body.userId,
        text:req.body.text,
        createdAt: Date.now()
    }
    task.comments.comment.push(comment)
    await Task.findByIdAndUpdate(req.params.id,task)
    res.redirect(`/tasks/${req.params.id}`)

})

router.get('/delete/:id', auth, async (req, res) => {
    await Task.findOneAndDelete(req.params.id)
        res.redirect('/tasks')
})

router.get('/:id', auth, async (req, res) => {
    const task = await Task.findById(req.params.id).lean().populate('userId','name')
    const users = await User.find().select('_id name email').lean()
    res.render('viewtask',{
        title: `${task.title} | ${task.userId.name}`,
        task, users
    })
})
router.get('/:taskid/delcomment/:commentid', auth, async (req, res) => {
    const task = await Task.findById(req.params.taskid)
    const comments = task.comments.comment
    const index = comments.findIndex(c => c.id == req.params.commentid)
    comments.splice(index, 1)
    task.comments.comment = comments
    await Task.findByIdAndUpdate(req.params.taskid, task)
    res.redirect(`/tasks/${req.params.taskid}`)
})

router.post('/', auth, async (req, res) => {
    const task = await new Task({
        title: req.body.title,
        text:req.body.text,
        status:'Pending',
        userId:req.body.userId
    })
    task.save()
    res.redirect('/tasks')
})
module.exports = router