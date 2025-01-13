import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';
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
app.use(
	'/api/products',
	(req, res, next) => {
		req.io = io;
		return next();
	},
	productsRouter
);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);
app.use('/api/sessions', sessionsRouter);

(async () => {
	try {
		await mongoose.connect(MONGO_CLUSTER_URL, {
			dbName: 'ecommerce',
		});
		// eslint-disable-next-line no-console
		console.log(`DB connected`);
	} catch (error) {
		console.error(`Error connecting to DB: ${error.message}`);
	}
})();
