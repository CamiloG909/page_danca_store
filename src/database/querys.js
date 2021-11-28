const indexQuerys = {};

indexQuerys.signUp = [
	`select email from ${process.env.DB_SCHEMA}.user_ where email = $1;`,
	`insert into ${process.env.DB_SCHEMA}.user_ (login,password,email,phone_number,town,address,status) values ($1,$2,$3,$4,$5,$6,'Activo');`,
	`select id from ${process.env.DB_SCHEMA}.user_ where email = $1;`,
	`insert into ${process.env.DB_SCHEMA}.user_rol (rol_name,id_user) values ('Cliente',$1)`,
	`insert into ${process.env.DB_SCHEMA}.client (id_document_type,document_number,name,last_name,id_user) values ($1, $2, $3, $4, $5);`,
];

const clientQuerys = {};

clientQuerys.renderRol = `select rol_name from ${process.env.DB_SCHEMA}.user_rol where id_user = $1;`;

clientQuerys.renderHome = `select id, picture, name, price from ${process.env.DB_SCHEMA}.product where status = 'Disponible' order by id desc;`;

clientQuerys.renderComputers = `select id, picture, name, price from ${process.env.DB_SCHEMA}.product where id_category = 1 and status = 'Disponible' order by id desc;`;

clientQuerys.renderPhones = `select id, picture, name, price from ${process.env.DB_SCHEMA}.product where id_category = 2 and status = 'Disponible' order by id desc;`;

clientQuerys.renderProductDetail = `select p.id, p.reference, p.name, p.price, p.picture, p.specs, p.information, p.color, p.stock, s.company_name from ${process.env.DB_SCHEMA}.product p inner join ${process.env.DB_SCHEMA}.supplier s on p.id_supplier = s.id where p.id = $1;`;

clientQuerys.productsPay = [
	`insert into ${process.env.DB_SCHEMA}.order_ (id_client,order_date,status) values ($1,$2,'Pendiente');`,
	`select id from ${process.env.DB_SCHEMA}.order_ where id=(select max(id) from ${process.env.DB_SCHEMA}.order_)`,
	`select price from ${process.env.DB_SCHEMA}.product where id = $1;`,
	`insert into ${process.env.DB_SCHEMA}.order_details (id_order,id_product,total_value,amount,color) values ($1,$2,$3,$4,$5);`,
	`insert into ${process.env.DB_SCHEMA}.payment (id_method_payment,id_order,bill_date,status) values ($1,$2,$3,'Completado')`,
	`select town,address from ${process.env.DB_SCHEMA}.user_ where id = $1`,
	`insert into ${process.env.DB_SCHEMA}.shipping (id_order,shipping_company_name,town,address,shipping_date,delivery_date,status) values ($1,'-------',$2,$3,'-------','-------','Pendiente')`,
];

clientQuerys.renderShoppingHistory = `select p.reference, p.picture, p.name, p.price, sr.company_name, s.address, s.town, od.total_value, od.color, o.order_date, o.id, o.status, s.shipping_company_name, s.shipping_date, s.delivery_date, mp.method_payment
from ${process.env.DB_SCHEMA}.order_ o
inner join ${process.env.DB_SCHEMA}.client c on o.id_client = c.id
inner join ${process.env.DB_SCHEMA}.user_ u on c.id_user = u.id
inner join ${process.env.DB_SCHEMA}.order_details od on od.id_order = o.id
inner join ${process.env.DB_SCHEMA}.product p on od.id_product = p.id
inner join ${process.env.DB_SCHEMA}.supplier sr on p.id_supplier = sr.id
inner join ${process.env.DB_SCHEMA}.shipping s on s.id_order= o.id
inner join ${process.env.DB_SCHEMA}.payment pt on pt.id_order= o.id
inner join ${process.env.DB_SCHEMA}.method_payment mp on pt.id_method_payment= mp.id
where c.id_user = $1
order by o.id DESC
;`;

clientQuerys.renderProfile = `select u.id, c.name, c.last_name, u.email, u.phone_number, c.document_number, u.town, u.address, u.image_url from ${process.env.DB_SCHEMA}.client c inner join ${process.env.DB_SCHEMA}.user_ u on c.id_user = u.id where u.id = $1;`;

clientQuerys.renderUpdateUserInformation = `select u.id, c.name, c.last_name, u.email, u.phone_number, u.town, u.address, u.image_url from ${process.env.DB_SCHEMA}.client c inner join ${process.env.DB_SCHEMA}.user_ u on c.id_user = u.id where u.id = $1;`;

clientQuerys.updateUserInformation = [
	`select email from ${process.env.DB_SCHEMA}.user_ where email = $1;`,
	`select email from ${process.env.DB_SCHEMA}.user_ u where id = $1;`,
	`select password from ${process.env.DB_SCHEMA}.user_ where id = $1;`,
	`update ${process.env.DB_SCHEMA}.user_ set login=$1,email=$2,phone_number=$3,town=$4,address=$5 where id = $6;`,
	`update ${process.env.DB_SCHEMA}.user_ set login=$1,password=$2,email=$3,phone_number=$4,town=$5,address=$6 where id = $7;`,
	`update ${process.env.DB_SCHEMA}.client set name=$1,last_name=$2 where id_user = $3;`,
];

clientQuerys.updateUserImage = [
	`select image_id from ${process.env.DB_SCHEMA}.user_ where id=$1;`,
	`update ${process.env.DB_SCHEMA}.user_ set image_url = $1, image_id = $2 where id = $3;`,
];

const sellerQuerys = {};

sellerQuerys.renderProducts = [
	`select id, company_name, status from ${process.env.DB_SCHEMA}.supplier;`,
	`select * from ${process.env.DB_SCHEMA}.product order by name asc;`,
	`select reference from ${process.env.DB_SCHEMA}.product;`,
];

sellerQuerys.addProduct = [
	`select id from ${process.env.DB_SCHEMA}.supplier where id = $1 and status = 'Activo';`,
	`select id, reference from ${process.env.DB_SCHEMA}.product where reference = $1`,
	`insert into ${process.env.DB_SCHEMA}.product (reference,name,price,picture,picture_id,specs,information,color,stock,id_category,id_supplier,status) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'Disponible');`,
];

sellerQuerys.updateProduct = `update ${process.env.DB_SCHEMA}.product set reference= $1, name= $2, price= $3, specs= $4, information= $5, color= $6, stock= $7, id_category= $8, id_supplier= $9 where id = $10;`;

sellerQuerys.updateStatusProduct = `update ${process.env.DB_SCHEMA}.product set status = $1 where id = $2;`;

sellerQuerys.deleteProduct = [
	`select picture_id from ${process.env.DB_SCHEMA}.product where id = $1;`,
	`delete from ${process.env.DB_SCHEMA}.product where id = $1;`,
];

sellerQuerys.renderProfile = `select u.id, c.name, c.last_name, u.email, u.phone_number, c.document_number, u.town, u.address, u.image_url from ${process.env.DB_SCHEMA}.client c inner join ${process.env.DB_SCHEMA}.user_ u on c.id_user = u.id where u.id = $1;`;

sellerQuerys.renderUpdateUserInformation = `select u.id, c.name, c.last_name, u.email, u.phone_number, u.town, u.address, u.image_url from ${process.env.DB_SCHEMA}.client c inner join ${process.env.DB_SCHEMA}.user_ u on c.id_user = u.id where u.id = $1;`;

sellerQuerys.updateUserInformation = [
	`select email from ${process.env.DB_SCHEMA}.user_ where email = $1;`,
	`select email from ${process.env.DB_SCHEMA}.user_ u where id = $1;`,
	`select password from ${process.env.DB_SCHEMA}.user_ where id = $1;`,
	`update ${process.env.DB_SCHEMA}.user_ set login=$1,email=$2,phone_number=$3,town=$4,address=$5 where id = $6;`,
	`update ${process.env.DB_SCHEMA}.user_ set login=$1,password=$2,email=$3,phone_number=$4,town=$5,address=$6 where id = $7;`,
	`update ${process.env.DB_SCHEMA}.client set name=$1,last_name=$2 where id_user = $3;`,
];

sellerQuerys.updateUserImage = [
	`select image_id from ${process.env.DB_SCHEMA}.user_ where id=$1;`,
	`update ${process.env.DB_SCHEMA}.user_ set image_url = $1, image_id = $2 where id = $3;`,
];

sellerQuerys.renderSuppliers = `select id, company_name, phone_number, email, town, address, status from ${process.env.DB_SCHEMA}.supplier order by id DESC;`;

sellerQuerys.updateSupplier = [
	`select company_name from ${process.env.DB_SCHEMA}.supplier where company_name = $1;`,
	`update ${process.env.DB_SCHEMA}.supplier set company_name=$1, phone_number=$2, town=$3, address=$4, email=$5, status=$6 where id = $7;`,
];

sellerQuerys.deleteSupplier = `delete from ${process.env.DB_SCHEMA}.supplier where id = $1;`;

sellerQuerys.addSupplier = [
	`select company_name from ${process.env.DB_SCHEMA}.supplier where company_name = $1;`,
	`insert into ${process.env.DB_SCHEMA}.supplier (company_name,phone_number,town,address,email,status) values ($1,$2,$3,$4,$5,'Activo');`,
];

sellerQuerys.renderShoppingList = `
	select o.id, o.id_client, o.order_date, o.status, od.total_value, od.amount, od.color, p.reference, p.name as p_name, p.price, s.company_name, c.document_number, c.name as c_name, c.last_name, dt.initials, u.email, u.phone_number, u.town, u.address, mp.method_payment, sg.shipping_company_name, sg.shipping_date, sg.delivery_date from ${process.env.DB_SCHEMA}.order_ o
		inner join ${process.env.DB_SCHEMA}.order_details od on od.id_order = o.id
		inner join ${process.env.DB_SCHEMA}.product p on od.id_product = p.id
		inner join ${process.env.DB_SCHEMA}.supplier s on p.id_supplier = s.id
		inner join ${process.env.DB_SCHEMA}.client c on o.id_client = c.id
		inner join ${process.env.DB_SCHEMA}.document_type dt on dt.id = c.id_document_type
		inner join ${process.env.DB_SCHEMA}.user_ u on c.id_user = u.id
		inner join ${process.env.DB_SCHEMA}.payment pt on pt.id_order = o.id
		inner join ${process.env.DB_SCHEMA}.method_payment mp on pt.id_method_payment = mp.id
		inner join ${process.env.DB_SCHEMA}.shipping sg on sg.id_order = o.id
	order by o.id DESC
	;
`;

module.exports = {
	indexQuerys,
	clientQuerys,
	sellerQuerys,
};
