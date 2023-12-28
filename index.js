import express from 'express';
import multer from 'multer';
import axios from 'axios';
import cors from 'cors'
const app = express();
const PORT = 5000;
app.use(cors());
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });

app.use(express.json());

app.post('/process-image', upload.single('image'), async (req, res) => {
  try {

    const apiUrl = 'https://api.clarifai.com/v2/users/clarifai/apps/main/models/general-image-recognition/versions/aa7f35c01e0642fda5cf400f543e7c40/outputs';
    const pat = 'Key 011d621baf884eb080ae45f3afe8da10';
    const image_base64 = req.file.buffer.toString('base64');


    // console.log("image_base64 " + image_base64)

    const response = await axios.post(apiUrl, {
      "inputs": [
        {
          "data": {
            "image": {
              "base64": image_base64
            }
          }
        }
      ]
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': pat,
      },
    });

    console.log(response.data.outputs[0].data.concepts);

    res.json(response.data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

