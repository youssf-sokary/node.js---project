const express = require("express");
const mongoose = require("mongoose");

//Create server with express
const app = express();

app.use(express.json());

//Connect server to mongo server
mongoose.connect("mongodb+srv://yossef:Assemble2025@cluster0.zyzkv7z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("DB now is connected"))
    .catch((err) => console.log("Error connecting to DB:", err));


//Schema
const studentsSchema = new mongoose.Schema({
    name: String,
    age: Number,
    level: String,
    address: String
});

//Schema
const doctorsSchema = new mongoose.Schema({
    name: String,
    age: Number,
    phone: String
});

//convert schema to model
let studentsModel = mongoose.model("Students", studentsSchema);
let doctorsModel = mongoose.model("Doctors", doctorsSchema)


//Add a New Student (Hardcoded)
app.post('/Students', async (req, res) => {
    try {
        let newstudent = await studentsModel({
            name: "Youssef",
            age: 20,
            level: "Two",
            address: "PortSaid"
        }).save();

        res.status(201);
        res.json("Students has created");
    }
    catch (error) {
        res.status(500);
        res.json({ error: "Failed to create student" });
    }

})




//Add a New Student (From Request Body)
app.post('/Students/add', async (req, res) => {
    try {
        let newstudent = await studentsModel(req.body).save();

        res.status(201);
        res.json("Students has created");
    }
    catch (error) {
        res.status(500);
        res.json({ error: "Failed to create student" });
    }

})



//Add a New Doctor (From Query Parameters)
app.post('/Doctors', async (req, res) => {
    try {
        let newdoctor = await doctorsModel(req.query).save();

        res.status(201);
        res.json("Doctors has created");
    }
    catch (error) {
        res.status(500);
        res.json({ error: "Failed to create doctor" });
    }

})


//endpoint fetch all students from DB
app.get('/Students', async (req, res) => {
    try {
        let allStudents = await studentsModel.find();
        res.status(200);
        res.json(allStudents);
    }
    catch (error) {
        res.status(500);
        res.json({ error: "Failed to fetch students" });
    }
})


//endpoint fetch all doctors from DB
app.get('/Doctors', async (req, res) => {
    try {
        let allDoctors = await doctorsModel.find();
        res.status(200);
        res.json(allDoctors);
    }
    catch (error) {
        res.status(500);
        res.json({ error: "Failed to fetch doctors" });
    }
})


//Delete a Student
app.delete('/Students/:id', async (req, res) => {
    try {
        const deletedstudent = await studentsModel.findByIdAndDelete(req.params.id);
        if (!deletedstudent) {
            res.status(404);
            res.json({ message: 'Student not found' });
        }
        res.status(201);
        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500);
        res.json({ error: 'Invalid ID or server error' });
    }
})





//Update a doctor name
app.put('/Doctors/:id', async (req, res) => {
    try {
        const newname = req.body.name;

        const olddoctor = await doctorsModel.findById(req.params.id);
        if (!olddoctor) {
            res.status(404);
            res.json({ message: 'Doctor not found' });
        }
        const oldName = olddoctor.name;

        const updatedDoctor = await doctorsModel.findByIdAndUpdate(req.params.id,
            { name: newname },
            { new: true });
        res.status(201);
        res.json({ message: 'Doctor updated successfully', oldName, newname });
    }
    catch (err) {
        res.status(500);
        res.json({ error: 'Invalid ID or server error' });
    };
});


app.get('/Students/Doctors', async (req, res) => {
    try {
        let allStudents = await studentsModel.find();
        let allDoctors = await doctorsModel.find();
        res.status(200);
        res.json({ allStudents, allDoctors });
    }
    catch (error) {
        res.status(500);
        res.json({ error: "Failed to fetch students and doctors" });
    }
})



app.listen(3000, function () {
    console.log("Server running on http://localhost:3000");
});