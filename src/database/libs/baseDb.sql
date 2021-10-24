CREATE SCHEMA surr;
SET search_path TO surr;
CREATE TABLE rol (
	name VARCHAR(40),
	CONSTRAINT pk_rol PRIMARY KEY (name)
);
CREATE TABLE user_ (
	id serial NOT NULL,
	login VARCHAR(90) NOT NULL,
	password VARCHAR(90) NOT NULL,
	email VARCHAR(90) NOT NULL,
	phone_number BIGINT NOT NULL,
	town VARCHAR(100) NOT NULL,
	address VARCHAR(90) NOT NULL,
	image_url VARCHAR,
	status VARCHAR(100) NOT NULL,
	CONSTRAINT pk_user PRIMARY KEY (id),
	CONSTRAINT uk_user UNIQUE (login, email)
);
CREATE TABLE user_rol (
	id serial NOT NULL,
	rol_name VARCHAR(40) NOT NULL,
	id_user INTEGER NOT NULL,
	CONSTRAINT pk_user_rol PRIMARY KEY (id),
	CONSTRAINT uk_user_rol UNIQUE (rol_name, id_user),
	CONSTRAINT fk_rol_user_rol FOREIGN KEY (rol_name) REFERENCES rol(name) on update cascade on delete restrict,
	CONSTRAINT fk_user_user_rol FOREIGN KEY (id_user) REFERENCES user_(id)
);
CREATE TABLE document_type (
	id serial NOT NULL,
	initials VARCHAR(10) NOT NULL,
	document_name VARCHAR(40) NOT NULL,
	status VARCHAR(100) NOT NULL,
	CONSTRAINT pk_document_type PRIMARY KEY (id),
	CONSTRAINT uk_document_type UNIQUE (initials, document_name)
);
CREATE TABLE client (
	id serial NOT NULL,
	id_document_type INTEGER NOT NULL,
	document_number BIGINT NOT NULL,
	name VARCHAR(90) NOT NULL,
	last_name VARCHAR(90) NOT NULL,
	id_user INTEGER NOT NULL,
	CONSTRAINT pk_client PRIMARY KEY (id),
	CONSTRAINT uk_client UNIQUE (id_document_type, document_number, id_user),
	CONSTRAINT fk_docu_type_clie FOREIGN KEY (id_document_type) REFERENCES document_type(id),
	CONSTRAINT fk_user_clie FOREIGN KEY (id_user) REFERENCES user_(id)
);
CREATE TABLE supplier (
	id serial NOT NULL,
	company_name VARCHAR(50) NOT NULL,
	phone_number BIGINT NOT NULL,
	town VARCHAR(100) NOT NULL,
	address VARCHAR(90) NOT NULL,
	email VARCHAR(90) NOT NULL,
	status VARCHAR(100) NOT NULL,
	CONSTRAINT pk_supplier PRIMARY KEY (id),
	CONSTRAINT uk_supplier UNIQUE (company_name)
);
CREATE TABLE product_category (
	id serial NOT NULL,
	category_name VARCHAR(40) NOT NULL,
	status VARCHAR(100) NOT NULL,
	CONSTRAINT pk_product_category PRIMARY KEY (id),
	CONSTRAINT uk_category UNIQUE (category_name)
);
CREATE TABLE product (
	id serial NOT NULL,
	reference VARCHAR(100) NOT NULL,
	name VARCHAR(40) NOT NULL,
	price numeric(19, 0) NOT NULL,
	picture VARCHAR NOT NULL,
	specs VARCHAR NOT NULL,
	information VARCHAR NOT NULL,
	color VARCHAR(150) NOT NULL,
	stock int NOT NULL,
	id_category INTEGER NOT NULL,
	id_supplier INTEGER NOT NULL,
	status VARCHAR(100) NOT NULL,
	CONSTRAINT pk_product PRIMARY KEY (id),
	CONSTRAINT uk_product UNIQUE (reference),
	CONSTRAINT fk_prod_cate_prod FOREIGN KEY (id_category) REFERENCES product_category(id),
	CONSTRAINT fk_supp_prod FOREIGN KEY (id_supplier) REFERENCES supplier(id)
);
CREATE TABLE order_ (
	id serial NOT NULL,
	id_client INTEGER NOT NULL,
	order_date VARCHAR(100) NOT NULL,
	status VARCHAR(100) NOT NULL,
	CONSTRAINT pk_order PRIMARY KEY (id),
	CONSTRAINT fk_clie_orde FOREIGN KEY (id_client) REFERENCES client(id)
);
CREATE TABLE order_details (
	id serial NOT NULL,
	id_order INTEGER NOT NULL,
	id_product INTEGER NOT NULL,
	total_value numeric(19, 0) NOT NULL,
	amount int NOT NULL,
	color VARCHAR(150),
	CONSTRAINT pk_order_details PRIMARY KEY (id),
	CONSTRAINT uk_order_details UNIQUE (id_product, id_order),
	CONSTRAINT fk_prod_orde_deta FOREIGN KEY (id_product) REFERENCES product(id),
	CONSTRAINT fk_orde_orde_deta FOREIGN KEY (id_order) REFERENCES order_(id)
);
CREATE TABLE method_payment (
	id serial NOT NULL,
	method_payment VARCHAR(40) NOT NULL,
	CONSTRAINT pk_method_payment PRIMARY KEY (id),
	CONSTRAINT uk_method_payment UNIQUE (method_payment)
);
CREATE TABLE payment (
	id serial NOT NULL,
	id_method_payment INTEGER NOT NULL,
	id_order INTEGER NOT NULL,
	bill_date VARCHAR(100) NOT NULL,
	status VARCHAR(100) NOT NULL,
	CONSTRAINT pk_payment PRIMARY KEY (id),
	-- CONSTRAINT uk_payment UNIQUE (bill_date), -- Bug when not implementing a real payment system
	CONSTRAINT fk_meth_paym_paym FOREIGN KEY (id_method_payment) REFERENCES method_payment(id),
	CONSTRAINT fk_orde_paym FOREIGN KEY (id_order) REFERENCES order_(id)
);
CREATE TABLE shipping (
	id serial NOT NULL,
	id_order INTEGER NOT NULL,
	shipping_company_name VARCHAR(40) NOT NULL,
	town VARCHAR(100) NOT NULL,
	address VARCHAR(90) NOT NULL,
	shipping_date VARCHAR(100) NOT NULL,
	delivery_date VARCHAR(100) NOT NULL,
	status VARCHAR(100) NOT NULL,
	CONSTRAINT pk_shipping PRIMARY KEY (id),
	CONSTRAINT uk_shipping UNIQUE (id_order),
	CONSTRAINT fk_orde_ship FOREIGN KEY (id_order) REFERENCES order_(id)
);
