const path = require("path")
const multer = require("multer")
const fs = require("fs");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,"images")
    },
    filename: (req, file, cb) => {
        console.log(file)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname); // Extracts file extension
        const imgName = req.body.imgname
        cb(null, "image" + fileExtension);
    }
})

const upload = multer ({storage: storage})

app.get('/upload', (req,res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post("/upload", upload.single("image"), (req, res) => {
    const tempPath = req.file.path;
    const imgName = req.body.imgname || 'default';
    const newFileName = imgName + path.extname(req.file.originalname);
    const newPath = path.join('images', newFileName);

    fs.rename(tempPath, newPath, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error renaming file");
        }
        res.send(newFileName + "uploaded");
    });
});