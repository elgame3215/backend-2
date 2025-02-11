import { ticketModel } from '../models/ticket.model.js';

export class TicketService {
	static async generateTicket({ products, purchaser }) {
		const amounts = products.map(p => p.product.price * p.quantity);
		const amount = amounts.reduce((sum, curAmount) => (sum += curAmount));
		const newTicket = await ticketModel.create({ purchaser, amount });
		return newTicket.toObject();
	}
}
