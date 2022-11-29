const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

// Setup image upload using multer for getting data to backend

const storage = multer.diskStorage({
    destination: path.join(__dirname, "uploads"),
    filename: (req, file, callback) => {
        uidSafe(24).then((uid) => {
            const extension = path.extname(file.originalname);
            const newFileName = uid + extension;
            callback(null, newFileName);
        });
    },
});

module.exports.uploader = multer({
    storage,
    limits: {
        fileSize: 2097152,
    },
});

// Setup S3 --- unused

// const aws = require("aws-sdk");

// const s3 = new aws.S3({
//     accessKeyId: process.env.AWS_KEY,
//     secretAccessKey: process.env.AWS_SECRET,
// });

// module.exports.awsUpload = function (filename, path, mimetype, size) {
//     console.log(path);
//     s3.putObject({
//         Bucket: "spicedling",
//         ACL: "public-read",
//         Key: filename,
//         Body: fs.createReadStream(path),
//         ContentType: mimetype,
//         ContentLength: size,
//     });
// };
