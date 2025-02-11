import mongooseLeanVirtuals from 'mongoose-lean-virtuals';
import { v4 as uuid } from 'uuid';

import { model, Schema } from 'mongoose';

const ticketSchema = new Schema(
	{
		code: { type: String, default: uuid },
		purchase_datetime: {
			type: Date,
			default: Date.now,
		},
		amount: { type: Number, required: true },
		purchaser: { type: String, required: true },
	},
	{
		id: true,
		toObject: { virtuals: true },
		toJSON: { virtuals: true },
	}
);

ticketSchema.plugin(mongooseLeanVirtuals);

export const ticketModel = model('ticket', ticketSchema);
