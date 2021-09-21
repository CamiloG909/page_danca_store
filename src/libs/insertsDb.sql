SET search_path TO surr;

--rol
INSERT INTO rol VALUES
    ('Cliente'),
    ('Vendedor')
;

--document_type
INSERT INTO document_type (initials,document_name,status) VALUES
    ('CC','Cédula de Ciudadanía','Activo'),
    ('CE','Cédula de Extranjería','Activo')
;

--product_category
INSERT INTO product_category (category_name,status) VALUES
    ('Computadores','Activo'),
    ('Celulares','Activo')
;

--method_payment
INSERT INTO method_payment (method_payment) VALUES
    ('Efectivo'),
    ('Tarjeta de Crédito'),
    ('Tarjeta de Débito')
;
