import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';
import cookieParser from 'cookie-parser';
import { engine } from 'express-handlebars';
import express from 'express';
import Handlebars from 'handlebars';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import { router as cartsRouter } from './routes/cart.routes.js'; // eslint-disable-line sort-imports
import { initializePassport } from './config/passport.config.js';
import passport from 'passport';
import { router as productsRouter } from './routes/product.routes.js';
import { router as viewsRouter } from './routes/views.routes.js';
import { router as userRouter } from './routes/sessions.routes.js'; // eslint-disable-line sort-imports
import { MONGO_CLUSTER_URL, PORT } from './config/config.js';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());

app.set('view engine', 'handlebars');
app.set('views', './src/views');
app.engine(
	'handlebars',
	engine({
		handlebars: allowInsecurePrototypeAccess(Handlebars), // brujeria de handlebars
	})
);

initializePassport();
app.use(passport.initialize());

const server = app.listen(PORT, () => {
	// eslint-disable-next-line no-console
	console.log(`Server up on http://localhost:${PORT}`);
});

const io = new Server(server);
app.use(express.static('./src/public'));
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
app.use('/api/sessions', userRouter);

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
