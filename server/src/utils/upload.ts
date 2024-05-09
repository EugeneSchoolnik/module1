import multer from "multer";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const name = Date.now().toString(16) + "." + file.originalname.split(".").slice(-1)[0];
    cb(null, name);
  },
});
// export const upload = multer({ dest: "uploads/" });
export const upload = multer({ storage });
