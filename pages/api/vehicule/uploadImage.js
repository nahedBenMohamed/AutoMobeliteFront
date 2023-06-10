import multer from 'multer';

// Setup multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

export default function handler(req, res) {
    if (req.method === 'POST') {
        upload.single('file')(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(500).json(err);
            } else if (err) {
                return res.status(500).json(err);
            }

            // File uploaded successfully
            return res.status(200).send(req.file);
        });
    } else {
        res.status(405).end(); //Method not allowed
    }
}
