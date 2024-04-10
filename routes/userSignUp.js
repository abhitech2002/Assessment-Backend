import express from "express";
import bcrypt from 'bcrypt'
import { SignUp } from "../models/signUp.js";
import { validateUser } from "../middleware/validationUser.js";

const router = express.Router()

// Getting User details
router.get('/', async(req, res) => {
    try {
        const user = await SignUp.find({})
        return res.status(200).send({
            count: user.length,
            data: user
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({message: error.message})
    }
});

// Sign-up Route
router.post('/',validateUser, async(req, res) => {
    try {
        const {firstName, lastName, email, location, userName, password, repassword} = req.body

        //Checking if user already exist
        const exisitingUser = await SignUp.findOne({ email })
        if(exisitingUser) {
            return res.status(400).send({message: "User Already Exists"})
        }
    
        // if password and repassword match
        if(password !== repassword) {
            return res.status(400).send({message: "Password do not match"})
        }
    
        // Encrypting password
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // Creating new user
        const newUser = new SignUp({firstName, lastName, email, location, userName, password:hashedPassword})
        await newUser.save()
    
        res.status(201).send({message: "User Created Successfully..."})
    
    } catch (error) {
        console.log(error)
        res.status(500).send({message: "Internal Server Error"})
    }
})

export default router
