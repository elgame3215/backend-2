import { PORT, MONGO_CLUSTER_URL, SECRET } from "./config.js"
import { router as productsRouter } from "./routes/product.router.js";
import { router as cartsRouter } from "./routes/cart.router.js";
import { router as viewsRouter } from "./routes/views.router.js"
import { router as userRouter } from "./routes/user.router.js"
import express from 'express'
import session from "express-session";
import mongoose from 'mongoose';
import Handlebars from "handlebars"
import cookieParser from 'cookie-parser'
import { Server } from 'socket.io';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';
import { engine } from "express-handlebars";
import FileStore from 'session-file-store';

const fileStore = FileStore(session);

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
	session({
		secret: SECRET,
		saveUninitialized: false,
		resave: false,
		store: new fileStore({
			path: './sessions',
			ttl: 60,
			retries: 0
		}),
	})
);
app.engine('handlebars', engine({
	handlebars: allowInsecurePrototypeAccess(Handlebars) // brujeria de handlebars
}))
app.set('view engine', 'handlebars')
app.set('views', './src/views')

const server = app.listen(PORT, () => {
	console.log(`Server up on http://localhost:${PORT}`);
})

const io = new Server(server);
app.use(express.static('./src/public'))
app.use(
	'/api/products',
	(req, res, next) => {
		req.io = io;
		return next();
	},
	productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/products', viewsRouter);
app.use('/user', userRouter);

	(async () => {
		try {
			await mongoose.connect(
				MONGO_CLUSTER_URL,
				{
					dbName: "ecommerce"
				}
			)
			console.log(`DB connected`)
		} catch (error) {
			console.log(`Error connecting to DB: ${error.message}`)
		}
	})();