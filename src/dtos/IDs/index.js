import { CONFIG } from '../../config/config.js';
import { mongoIdParamSchema, mongoIdSchema } from './mongoId.dto.js';

let idSchema;
let idParamSchema;

switch (CONFIG.DB_TYPE) {
	case 'mongo':
		idSchema = mongoIdSchema;
		idParamSchema = mongoIdParamSchema;
		break;

	default:
		idSchema = mongoIdSchema;
		idParamSchema = mongoIdParamSchema;
		break;
}

export { idSchema, idParamSchema };
