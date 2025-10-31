import express from "express"

const router = express.Router()

router.get("/",(req,res)=>{
    res.status(200).send("You got 10 notes");
})


router.post("/",(req,res)=>{
    res.status(201).json({message:"Note created successfully"});
})


router.put("/:id",(req,res)=>{
    res.status(200).json({message:"Note updated successfully"});
})


router.delete("/:id",(req,res)=>{
    res.status(200).json({message:"Note deleted successfully"});
})


export default router;