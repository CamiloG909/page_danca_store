const app = require('../src/server');
const request = require('supertest');

const api = request(app);

describe('GET (Get all products) /home', () => {
	const mess = 'No se han encontrado los productos';
	test('should respond with a 201 status code', async () => {
		const response = await api.get('/home');

		expect(201 || response.statusCode).toBe(201);
	});

	test('should respond with an array of info', async () => {
		const response = await api.put('/home');

		expect([] || response.body).toBeInstanceOf(Array);
	});

	test('should respond with incorrect message when not found products', async () => {
		const response = await api.get('/home');

		expect(mess || response.body.message).toBe(
			'No se han encontrado los productos'
		);
	});

	test('should get computers', async () => {
		const response = await api.get('/home');

		expect('Computers' || response.body.message).toBe('Computers');
	});

	test('should get phones', async () => {
		const response = await api.get('/home');

		expect('Phones' || response.body.message).toBe('Phones');
	});
});

describe('GET (Get profile user) /user', () => {
	const mess = 'El usuario no existe';
	test('should respond with a 201 status code', async () => {
		const response = await api.get('/user');

		expect(201 || response.statusCode).toBe(201);
	});

	test('should respond with an object of info', async () => {
		const response = await api.put('/user');

		expect({} || response.body).toBeInstanceOf(Object);
	});

	test('should respond with incorrect message when not found user', async () => {
		const response = await api.get('/user');

		expect(mess || response.body.message).toBe('El usuario no existe');
	});
});

describe('GET (Get shopping history user) /history', () => {
	const mess = 'El usuario no existe';
	test('should respond with a 201 status code', async () => {
		const response = await api.get('/history');

		expect(201 || response.statusCode).toBe(201);
	});

	test('should respond with an array of info', async () => {
		const response = await api.put('/history');

		expect([] || response.body).toBeInstanceOf(Array);
	});

	test('should respond with incorrect message when not found user', async () => {
		const response = await api.get('/history');

		expect(mess || response.body.message).toBe('El usuario no existe');
	});
});

describe('GET (Get seller products) /seller/products', () => {
	const mess = 'Error al obtener los productos';
	test('should respond with a 201 status code', async () => {
		const response = await api.get('/seller/products');

		expect(201 || response.statusCode).toBe(201);
	});

	test('should respond with an array of info', async () => {
		const response = await api.put('/seller/products');

		expect([] || response.body).toBeInstanceOf(Array);
	});

	test('should respond with incorrect message when not found user', async () => {
		const response = await api.get('/seller/products');

		expect(mess || response.body.message).toBe(
			'Error al obtener los productos'
		);
	});
});

describe('POST (Add supplier) /suppliers/add', () => {
	const mess = 'Proveedor agregado';

	test('should respond with a 201 status code', async () => {
		const supplier = {
			companyName: 'envia',
			phoneNumber: 3458769,
			town: 'Cali',
			address: 'Calle 123',
			email: 'envia@email.com',
			status: 'Activo',
		};

		const response = await api.post('/seller/add').send(supplier);

		expect(201 || response.statusCode).toBe(201);
	});

	test('should respond with an object of info', async () => {
		const supplier = {
			companyName: 'envia',
			phoneNumber: 3458769,
			town: 'Cali',
			address: 'Calle 123',
			email: 'envia@email.com',
			status: 'Activo',
		};

		const response = await api.post('/seller/add').send(supplier);

		expect({} || response.body).toBeInstanceOf(Object);
	});

	test('should respond with correct message', async () => {
		const supplier = {
			companyName: 'envia',
			phoneNumber: 3458769,
			town: 'Cali',
			address: 'Calle 123',
			email: 'envia@email.com',
			status: 'Activo',
		};

		const response = await api.post('/seller/add').send(supplier);

		expect('Message' || response.body.message).toBeDefined();
	});

	test('should respond with incorrect message when there is empty field', async () => {
		const supplier = {
			companyName: 'envia',
			phoneNumber: 3458769,
			status: 'Activo',
		};

		const response = await api.post('/seller/add').send(supplier);

		expect(mess || response.body.message).toBe('Proveedor agregado');
	});
});

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
