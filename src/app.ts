import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { rateLimit } from 'express-rate-limit';

import { createClient } from 'redis';

dotenv.config();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached, etc. See below.
});

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const redisClient = createClient();

const DEFAULT_EXPIRATION = 3600;

const app: Express = express();

app.use(cors());
app.use(limiter);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

redisClient.on('error', (err) => console.error('Redis Client Error', err));

redisClient.connect().catch(console.error);

const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/canada?key=${process
  .env.API_KEY!}asdsfa`;

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Server is running' });
});

app.get('/weathers', async (req: Request, res: Response) => {
  try {
    const cachedData = await redisClient.get('weather');

    console.log(cachedData);

    if (!cachedData) {
      const response = await fetch(url);
      const data = await response.json();

      await redisClient.setEx(
        'weather',
        DEFAULT_EXPIRATION * 12,
        JSON.stringify(data)
      );

      res.json(data);
    } else {
      res.json(JSON.parse(cachedData));
    }
  } catch (error) {
    console.error(error);

    res.status(400).json({ message: 'Something went wrong' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
