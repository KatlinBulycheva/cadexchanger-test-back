import express from "express";
import { DB } from "./DB/db.js";
import morgan from "morgan";
import { schema } from "./validators/pointsValidators.js";

const PORT = 3005;

const app = express();
app.use(express.json());
app.use(morgan('dev'));

app.use(function(_, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/api/v1/points', (_, response) => {
    try {
        response.json(DB.points);
    } catch (error) {
        response.sendStatus(500);
    }
})

app.post('/api/v1/points', async (request, response) => {
    try {
        const body = request.body;
        let clientData = {};

        try {
            clientData = await schema.validate(body, {
                abortEarly: false,
                strict: true,
            });
        } catch (error) {

            const errorObject = error.inner.reduce((acc, el) => {
                acc[el.path] = el.errors.join(', ');
                return acc
            }, {})

            return response.status(400).json(errorObject)
        }

        const H = clientData.heightCone;
        const R = clientData.raduisCone;
        const N = clientData.numberSegmentsCone;

        DB.points = [];

        for(let i = 0; i <= N; i++ ) {
            if (i === N) {
                DB.points.push({
                    x: 0,
                    y: H,
                    z: 0,
                })
            } else {
                DB.points.push({
                    x: (R * Math.cos(2 * Math.PI * i / N)).toFixed(1),
                    y: 0,
                    z: (R * Math.sin(2 * Math.PI * i / N)).toFixed(1),
                })
            }
        }

        response.status(201).json(DB.points);

    } catch (error) {
        response.sendStatus(500)
    }
})

app.listen(PORT, () => {
    console.log('Server has been started on port', PORT);
})