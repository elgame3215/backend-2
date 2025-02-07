import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';
import { CONFIG } from './config/config.js';
import cookieParser from 'cookie-parser';
import { CustomError } from './errors/CustomError.js';
import { engine } from 'express-handlebars';
import express from 'express';
import { expressJoiValidations } from 'express-joi-validations';
import Handlebars from 'handlebars';
import { initializePassport } from './config/passport.config.js';
import mongoose from 'mongoose';
import passport from 'passport';
import { router } from './routes/index.js';
import { Server } from 'socket.io';

const { PORT, MONGO_CLUSTER_URL } = CONFIG;

// EXPRESS
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('./src/public'));

// COOKIE-PARSER
app.use(cookieParser());

// HANDLEBARS
app.set('view engine', 'handlebars');
app.set('views', './src/views');
app.engine(
	'handlebars',
	engine({
		handlebars: allowInsecurePrototypeAccess(Handlebars), // brujería de handlebars
	})
);

// PASSPORT
initializePassport();
app.use(passport.initialize());

// JOI
app.use(expressJoiValidations({ overwriteRequest: true, throwErrors: true }));

// ROUTER
app.use(router);

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

const server = app.listen(PORT, () => {
	// eslint-disable-next-line no-console
	console.log(`Server up on http://localhost:${PORT}`);
});

const io = new Server(server);
router.use('/api/products', (req, res, next) => {
	req.io = io;
	return next();
});
