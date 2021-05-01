const express = require('express')
const Student = require('../models/student');
const multer = require('multer');
const { storage } = require('../cloudinary');
const cloudinary = require('../cloudinary');
const upload = multer({ storage });
const router = express.Router()



router.get('/', async (req, res) => {
    if (req.query.name) {
        const sname = req.query.name
        console.log(sname)
        const students = await Student.find({ 'name': new RegExp(sname, 'i') })
        res.render('students/searchResult', { students });
    }
    else {
        const students = await Student.find({});
        res.render('students/index', { students })
    }

});


router.get('/new', (req, res) => {
    res.render('students/new');
})

router.post('/', upload.array('student[image]'), async (req, res) => {
    const student = new Student(req.body.student);
    student.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    await student.save();
    console.log(req.files)
    console.log(req.files.path)
    res.redirect(`/students/${student._id}`)

})



router.get('/:id', async (req, res,) => {
    const student = await Student.findById(req.params.id)
    res.render('students/show', { student });
});

router.get('/:id/edit', async (req, res) => {
    const student = await Student.findById(req.params.id)
    res.render('students/edit', { student });
})

router.put('/:id', upload.array("student[image]"), async (req, res) => {
    const { id } = req.params;
    const student = await Student.findByIdAndUpdate(id, { ...req.body.student });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    student.images.push(...imgs);
    await student.save()
    res.redirect(`/students/${student._id}`)
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    await Student.findByIdAndDelete(id);
    res.redirect('/students');
})

module.exports = router;