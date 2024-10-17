import { describe, it, expect, expectTypeOf } from "vitest";
import { CartsManager } from "../managers/Carts-Manager";
let usedId;

describe('POST /carts valid', async () => {
	const endpoint = 'http://localhost:8080/api/carts';
	const response = await fetch(endpoint, { method: 'POST' })
	const data = await response.json()
	usedId = data.addedCart.id
	it('Should have status 201', () => {
		expect(response.status).toBe(201)
	})
})

describe('GET /carts/:cid valid', async () => {
	const endpoint = `http://localhost:8080/api/carts/${usedId}`;
	const response = await fetch(endpoint)
	const data = await response.json()

	it('Should have status 200', () => {
		expect(response.status).toBe(200)
	})
	it('Data is an array', () => {
		expectTypeOf(data).toBeArray
	})
})

describe('GET /carts/:cid invalid id', async () => {
	const endpoint = 'http://localhost:8080/api/carts/-1';
	const response = await fetch(endpoint)
	const data = await response.json()

	it('Should have status 404', () => {
		expect(response.status).toBe(404)
	})
	it('Error message should be cart not found', () => {
		expect(data.detail).toBe(CartsManager.errorMessages.cartNotFound)
	})
})

describe('GET /carts/:cid NaN id', async () => {
	const endpoint = 'http://localhost:8080/api/carts/a';
	const response = await fetch(endpoint)
	const data = await response.json()

	it('Should have status 400', () => {
		expect(response.status).toBe(400)
	})
	it('Error message should non numeric id', () => {
		expect(data.detail).toBe(CartsManager.errorMessages.nonNumericId)
	})
})
