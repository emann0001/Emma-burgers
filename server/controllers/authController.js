import USER from "../models/userModel.js"
// Sign up
export const signUp = async (req, res)=>{
    const {firstName, lastName, email, password, cPassword} = req.body;
    if(!email || !password || !firstName || !lastName || !cPassword){
        res.status(400).json({success:false,errMsg:"all fields are required for registration"});
        return;
    }

    if(password !== cPassword){
        res.status(400).json({success:false,errMsg:"passwords do not match"});
        return;
    }
    try {
    const existingEmail = await USER.findOne({email});
    // const existingUserName = await USER.findOne({userName});
    // if(existingUserName){
    //     res.status(400).json({success:false,errMsg:"username already in use"});
    //     return;
    // }
    if (password.lenght < 8){
        res.status(400).json({success:false, errMsg:"min password length must be 8 chrs"});
        return;
    }
    if(existingEmail){
        res.status(400).json({success:false,errMsg:"email already in use"});
        return;
    }

    const User = await USER.create({...req.body});
    res.status(201).json({success:true,message:"registration successful", User});
    } catch (error) {
        res.status(500).send(error.message)
    }
}