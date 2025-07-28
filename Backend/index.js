import express from 'express';
import cors from 'cors'
import mongoose from 'mongoose';
import routes from './routes/Routes.js';

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api', routes)

mongoose.connect(`mongodb://localhost:27017/LMS`)
    .then(() => {
        console.log('MongoDB connected');
    }).catch((err) => {
        console.error('MongoDB connection failed:', err.message);
    });

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
