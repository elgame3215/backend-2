import { describe, expect, expectTypeOf, it } from "vitest";
import { ProductValidator } from "../utils/Product-Validator";
import { ProductsManager } from "../managers/Product-Manager";
let usedCode;
let usedId;

function randomCode() {
	return Math.round(Math.random() * 9999);
}


describe('POST /products valid', async () => {
	usedCode = randomCode()
	const validProduct = {
		title: "s",
		description: "d",
		price: 0,
		thumbnail: "",
		status: true,
		code: usedCode,
		stock: 25,
		category: "d",
	}
	const endpoint = 'http://localhost:8080/api/products';
	const response = await fetch(endpoint, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(validProduct)
	})
	const { addedProduct } = (await response.json());
	usedId = addedProduct.id
	it('Should have status 201', () => {
		expect(response.status).toBe(201)
	})
	it('Should return a JSON', () => {
		expect(response.headers.get('Content-Type')).toContain('application/json')
	})
	it('Product should have id', () => {
		expect(Object.hasOwn(addedProduct, 'id'))
	})
})
describe('POST /products with empty camp', async () => {
	const emptyCampProduct = {
		title: "",
		description: 'hola',
		price: 0,
		thumbnail: "",
		status: true,
		code: "asddsa",
		stock: 25,
		category: "d",
		asdad: "",
		id: 6
	}
	const endpoint = 'http://localhost:8080/api/products';
	const response = await fetch(endpoint, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(emptyCampProduct)
	})
	const data = await response.json();
	it('Should have status 400', () => {
		expect(response.status).toBe(400);
	})
	it('Error message should be empty camp', () => {
		expect(data.detail).toBe(ProductValidator.errorMessages.emptyCamp)
	})
})

describe('POST /products with missing camp', async () => {
	const missingCampProduct = {
		description: 'hola',
		price: 0,
		thumbnail: "",
		status: true,
		code: "asddsa",
		stock: 25,
		category: "d",
		asdad: "",
		id: 6
	}
	const endpoint = 'http://localhost:8080/api/products';
	const response = await fetch(endpoint, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(missingCampProduct)
	})
	const data = await response.json();

	it('Should have status 400', () => {
		expect(response.status).toBe(400)
	})
	it('Error message should be missing camp', () => {
		expect(data.detail).toBe(ProductValidator.errorMessages.missingCamp)
	})
})

describe('POST /products with duplicated code', async () => {
	const duplicatedCodeProduct = {
		title: 's',
		description: 'hola',
		price: 0,
		thumbnail: "",
		status: true,
		code: usedCode,
		stock: 25,
		category: "d",
		asdad: "",
		id: 6
	}
	const endpoint = 'http://localhost:8080/api/products';
	const response = await fetch(endpoint, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(duplicatedCodeProduct)
	})
	const data = await response.json();

	it('Should have status 400', () => {
		expect(response.status).toBe(400)
	})
	it('Error message should be duplicated code', () => {
		expect(data.detail).toBe(ProductValidator.errorMessages.duplicatedCode)
	})
})

describe('GET /products', async () => {
	const endpoint = 'http://localhost:8080/api/products';
	const response = await fetch(endpoint)
	const data = await response.json()
	it('Should have status 200', () => {
		expect(response.status).toBe(200)
	});
	it('Data should be an array', () => {
		expectTypeOf(data).toBeArray
	})
})

describe('GET /products/:pid valid', async () => {
	const endpoint = `http://localhost:8080/api/products/${usedId}`;
	const response = await fetch(endpoint)
	const product = await response.json();
	it('Should have status 200', () => {
		expect(response.status).toBe(200)
	})
	it('Product id is id requested', () => {
		expect(product.id).toBe(usedId)
	})
})

describe('GET /products/:pid not found id', async () => {
	const endpoint = `http://localhost:8080/api/products/-1`;
	const response = await fetch(endpoint)
	const data = await response.json()
	it('Should have status 404', () => {
		expect(response.status).toBe(404)
	})
	it('Error message should be product not found', () => {
		expect(data.error).toBe(ProductsManager.errorMessages.productNotFound)
	})
})

describe('GET /products/:pid NaN id', async () => {
	const endpoint = `http://localhost:8080/api/products/a`;
	const response = await fetch(endpoint)
	const data = await response.json()
	
	it('Should have status 400', () => {
		expect(response.status).toBe(400)
	})
	it('Error message should be non numeric id', () => {
		expect(data.detail).toBe(ProductsManager.errorMessages.nonNumericId)
	})
})

describe('PUT /products/:pid valid', async () => {
	const newCode = randomCode()
	const validProduct = {
		title: "a",
		description: "b",
		price: 0,
		thumbnail: "",
		status: true,
		code: newCode,
		stock: 30,
		category: "c",
		id: -1
	}
	const endpoint = `http://localhost:8080/api/products/${usedId}`;
	const response = await fetch(endpoint, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(validProduct)
	})
	const { updatedProduct } = await response.json()
	const { id } = updatedProduct

	it('Should have status 200', () => {
		expect(response.status).toBe(200)
	})
	it('Id should have not changed', () => {
		expect(id).toBe(usedId)
	})
	delete validProduct.id
	delete updatedProduct.id
	it('Should update values', () => {
		expect(updatedProduct).include(validProduct)
	})
})

describe('PUT /products/:pid invalid id', async () => {
	const invalidIdProduct = {
		title: "a",
		description: "b",
		price: 0,
		thumbnail: "",
		status: true,
		code: 912,
		stock: 30,
		category: "c",
		id: -1
	}
	const endpoint = `http://localhost:8080/api/products/-1`;
	const response = await fetch(endpoint, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(invalidIdProduct)
	})
	const data = await response.json()

	it('Should have status 404', () => {
		expect(response.status).toBe(404)
	})
	it('Error message should be product not found', () => {
		expect(data.detail).toBe(ProductsManager.errorMessages.productNotFound)
	})
})

describe('PUT /products/:pid NaN id', async () => {
	const endpoint = `http://localhost:8080/api/products/a`;
	const response = await fetch(endpoint, {method: 'PUT'})
	const data = await response.json()

	it('Should have status 400', () => {
		expect(response.status).toBe(400)
	})
	it('Error message should be non numeric id', () => {
		expect(data.detail).toBe(ProductsManager.errorMessages.nonNumericId)
	})
})

describe('PUT /products/:pid invalid values', async () => {
	const invalidIdProduct = {
		title: "",
		description: "b",
		price: 0,
		thumbnail: "",
		status: true,
		code: 912,
		stock: 30,
		category: "c",
		id: -1
	}
	const endpoint = `http://localhost:8080/api/products/-1`;
	const response = await fetch(endpoint, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(invalidIdProduct)
	})
	const data = await response.json()

	it('Should have status 400', () => {
		expect(response.status).toBe(400)
	})
	it('Error message should be empty camp', () => {
		expect(data.detail).toBe(ProductValidator.errorMessages.emptyCamp)
	})
})

describe('DELETE /products/:pid valid', async () => {
	const endpoint = `http://localhost:8080/api/products/${usedId}`;
	let response = await fetch(endpoint, { method: 'DELETE' })
	const data = await response.json()
	const { status } = response

	it('Should have status 200', () => {
		expect(status).toBe(200)
	})

	response = await fetch(endpoint)
	it('Product is not aviable after delete', () => {
		expect(response.status).toBe(404)
	})
})

describe('DELETE /products/:pid invalid id', async () => {
	const endpoint = 'http://localhost:8080/api/products/-1';
	let response = await fetch(endpoint, { method: 'DELETE' })
	const data = await response.json()

	it('Should have status 404', () => {
		expect(response.status).toBe(404)
	})
	it('Error message should be product not found', () => {
		expect(data.detail).toBe(ProductsManager.errorMessages.productNotFound)
	})
})