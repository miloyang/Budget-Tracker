const multer = require("multer")
const router = require('express').Router();
const fs = require("fs");
const path = require("path")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,"public/images")
    },
    filename: (req, file, cb) => {
        console.log(file)
        const fileExtension = path.extname(file.originalname); // Extracts file extension
        cb(null, "image" + fileExtension);
    }
})

const upload = multer ({storage: storage})

router.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

router.post("/", upload.single("image"), (req, res) => {
    const tempPath = req.file.path;
    const imgName = req.body.imgname || 'default';
    const newFileName = imgName + path.extname(req.file.originalname);
    const newPath = path.join('public/images', newFileName);

    // Relative path for the response
    const imagePath = `/images/${newFileName}`;

    fs.rename(tempPath, newPath, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error renaming file");
        }
        // Send the response after the file is successfully renamed
        res.json({ imagePath: `/images/${newFileName}` });
    });
});

module.exports = router