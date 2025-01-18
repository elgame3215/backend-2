import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';
import { CustomError } from './errors/CustomError.js';
import { engine } from 'express-handlebars';
import express from 'express';
import Handlebars from 'handlebars';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import { cartsRouter } from './routes/cart.routes.js'; // eslint-disable-line sort-imports
import { initializePassport } from './config/passport.config.js';
import passport from 'passport';
import { productsRouter } from './routes/product.routes.js';
import { viewsRouter } from './routes/views.routes.js';
import { sessionsRouter } from './routes/sessions.routes.js'; // eslint-disable-line sort-imports
import { sendError } from './utils/customResponses.js';

config();

const { PORT, MONGO_CLUSTER_URL } = process.env;

// EXPRESS
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// COOKIE-PARSER
app.use(cookieParser());

// HANDLEBARS
app.set('view engine', 'handlebars');
app.set('views', './src/views');
app.engine(
	'handlebars',
	engine({
		handlebars: allowInsecurePrototypeAccess(Handlebars), // brujeria de handlebars
	})
);

// PASSPORT
initializePassport();
app.use(passport.initialize());

const server = app.listen(PORT, () => {
	// eslint-disable-next-line no-console
	console.log(`Server up on http://localhost:${PORT}`);
});

const io = new Server(server);
app.use(express.static('./src/public'));
app.use('/api', (req, res, next) => {
	req.isApiReq = true;
	return next();
});

// ROUTERS
app.use('/api/carts', cartsRouter);
app.use('/api/sessions', sessionsRouter);
app.use(
	'/api/products',
	(req, res, next) => {
		req.io = io;
		return next();
	},
	productsRouter
);
app.use('/', viewsRouter);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
	if (!(err instanceof CustomError)) {
		console.error(err);
		throw err;
	}
	if (req.isApiReq) {
		const errDetails = {};
		for (const key in err) {
			// eslint-disable-next-line no-prototype-builtins
			if (err.hasOwnProperty(key)) {
				errDetails[key] = err[key];
			}
		}
		sendError(res, err.statusCode, err.message, { ...errDetails });
	} else {
		const { status, message } = err;
		res.status(err.statusCode).render('error', { status, message });
	}
});

(async () => {
	try {
		await mongoose.connect(MONGO_CLUSTER_URL, {
			dbName: 'ecommerce',
		});
		console.log(`DB connected`); // eslint-disable-line no-console
	} catch (error) {
		console.error(`Error connecting to DB: ${error.message}`);
	}
})();
