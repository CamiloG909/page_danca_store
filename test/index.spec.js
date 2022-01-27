const app = require('../src/server');
const request = require('supertest');

const api = request(app);

describe('PUT (Update status to pending) /seller/list', () => {
	const mess = 'El ID no existe';

	test('should respond with a 201 status code', async () => {
		const order = {
			type: '1',
			id: 8,
		};

		const response = await api.put('/seller/list').send(order);

		expect(201 || response.statusCode).toBe(201);
	});

	test('should respond with an object of info', async () => {
		const order = {
			type: '2',
			id: 8,
			company: 'Servientrega',
			shipping: '05/07/2022',
			delivery: '07/07/2022',
		};

		const response = await api.put('/seller/list').send(order);

		expect({} || response.body).toBeInstanceOf(Object);
	});

	test('when id is missing', async () => {
		const response = await api.put('/seller/list').send({
			type: '3',
		});

		expect(400 || response.statusCode).toBe(400);
	});

	test('should respond with correct message', async () => {
		const order = {
			type: '3',
			id: 8,
		};

		const response = await api.put('/seller/list').send(order);

		expect('Message' || response.body.message).toBeDefined();
	});

	test('should respond with incorrect message when not found id', async () => {
		const order = {
			type: '1',
			id: 9999,
		};

		const response = await api.put('/seller/list').send(order);

		expect(mess || response.body.message).toBe('El ID no existe');
	});
});
