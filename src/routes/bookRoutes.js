import express from "express";
import cloudinary from "../lib/cloudinary.js";
import Book from "../models/Book.js";
import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();
// protectRoute,
// create a new book
router.post("/", protectRoute,  async(req, res) => {
    try {
        const { title, caption, ratings, image } = req.body;

        if(!title || !caption || !ratings || !image ) {
            return res.status(400).json({
            message: "Please provide all fields"
        })
    };

    // upload the iamge to cloudinary
        const uploadResponse = await cloudinary.uploader.upload(image);
        const imageUrl = uploadResponse.secure_url;


    // save to database
        const newBook = new Book({
            title, 
            caption, 
            ratings,
            image: imageUrl,
            user: req.user._id
        })

        await newBook.save();    
        res.status(201).json(newBook);

    } catch (error) {
        console.log('Error creating book', error)
        res.status(500).json({
            message: error.message
        })        
    }
})

router.get("/", protectRoute, async(req, res) => {
try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page -1) * limit;

    const books = await Book.find()
    .sort({ createdAt: -1}) // descending
    .skip(skip)
    .limit(limit)
    .populate("user", "username profileimage");

    const total = await Book.countDocuments();

    res.send({
        books,
        currentPage: page,
        totalBooks: total,
        totalPages: Math.ceil(totalBooks / limit),

    })

  res.status(books); 

} catch (error) {
    console.error("Error in get all books route", error);
    res.status(500).json({message: "Internal server error"});
}
})

router.delete("/id", protectRoute, async(req, res) => {
   try {
    const book = await Book.findById(req.params.id);
    if(!book) return res.status(404).json({message: "Book not found"});
    
    // check if user is creater of this book
    if(book.user.toString() !== req.user._id.toString()) 
        return res.status(401).json({message: "Unauthorized"});

    // delete image from cloudimary as well
    if(book.image && book.image.includes("cloudinary")){
        try {
            const publicId = book.image.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(publicId);

        } catch (error) {
            console.log("Error deleting image from cloudinary", error);
        }        
    }

    await book.deleteOne();

    res.json({message: "Book deleted successfully"});

   } catch (error) {
    console.error("Error in get all books route", error);
    res.status(500).json({message: "Internal server error"});
   } 
})

router.get("/user", protectRoute, async(req, res) => {
    try {
        const books = await Book.find({user: req.user._id}).sort({createdAt: -1});
        res.json(books);

    } catch (error) {
       console.error("Get user books error", error.message);
       res.status(500).json({message: "Server Error!" })         
    }
})

export default router;

