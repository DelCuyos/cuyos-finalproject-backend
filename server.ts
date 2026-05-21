import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import errorHandler from './_middleware/error-handler';
import accountsController from './accounts/account.controller';
import swaggerDocs from './_helpers/swagger';

const app = express();

const corsOptions = {
    origin: (origin, callback) => {
        if (process.env.NODE_ENV === 'production') {
            const allowedOrigin = process.env.CORS_ORIGIN;
            if (origin === allowedOrigin) {
                callback(null, true);
            } else if (!origin) {
                // Allow requests with no origin (mobile apps, curl requests)
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        } else {
            // Development: allow all origins
            callback(null, true);
        }
    },
    credentials: true
};

app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/accounts', accountsController); 

app.use('/api-docs', swaggerDocs);

app.use(errorHandler);

const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
app.listen(port, () => console.log('Server listening on port ' + port));