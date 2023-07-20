const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "src/images");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    },
});
const upload = multer({ 
    storage: storage ,
    // fileFilter: function (req, file, callback) {
    //     var ext = path.extname(file.originalname);
    //     if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
    //         return callback(new Error('Only images are allowed'))
    //     }
    //     callback(null, true)
    // }
});
console.log(upload)

// console.log(upload)   
module.exports = upload