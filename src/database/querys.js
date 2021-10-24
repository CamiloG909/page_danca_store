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
	`select town,address from ${process.env.DB_SCHEMA}.user_ where id = $1`,
	`insert into ${process.env.DB_SCHEMA}.order_ (id_client,order_date,status) values ($1,$2,'Pendiente');`,
	`select id from ${process.env.DB_SCHEMA}.order_`,
	`select price from ${process.env.DB_SCHEMA}.product where id = $1;`,
	`insert into ${process.env.DB_SCHEMA}.order_details (id_order,id_product,total_value,amount,color) values ($1,$2,$3,$4,$5);`,
	`insert into ${process.env.DB_SCHEMA}.payment (id_method_payment,id_order,bill_date,status) values ($1,$2,$3,'Completado')`,
	`insert into ${process.env.DB_SCHEMA}.shipping (id_order,shipping_company_name,town,address,shipping_date,delivery_date,status) values ($1,$2,$3,$4,$5,$6,'Pendiente')`,
];

clientQuerys.renderShoppingHistory = `select p.picture, p.name, od.total_value, o.order_date, o.id, o.status, s.delivery_date
from ${process.env.DB_SCHEMA}.order_ o
inner join ${process.env.DB_SCHEMA}.client c on o.id_client = c.id
inner join ${process.env.DB_SCHEMA}.order_details od on od.id_order = o.id
inner join ${process.env.DB_SCHEMA}.product p on od.id_product = p.id
inner join ${process.env.DB_SCHEMA}.shipping s on s.id_order= o.id
where c.id_user = $1
order by o.status DESC, o.order_date DESC
;`;

clientQuerys.renderProfile = `select u.id, c.name, c.last_name, u.email, u.phone_number, c.document_number, u.town, u.address, u.image_url from ${process.env.DB_SCHEMA}.client c inner join ${process.env.DB_SCHEMA}.user_ u on c.id_user = u.id where u.id = $1;`;

clientQuerys.renderUpdateUserInformation = `select u.id, c.name, c.last_name, u.email, u.phone_number, u.town, u.address, u.image_url from ${process.env.DB_SCHEMA}.client c inner join ${process.env.DB_SCHEMA}.user_ u on c.id_user = u.id where u.id = $1;`;

clientQuerys.updateUserInformation = [
	`select email from ${process.env.DB_SCHEMA}.user_ where email = $1;`,
	`select email from ${process.env.DB_SCHEMA}.user_ u where id = $1;`,
	`select password from ${process.env.DB_SCHEMA}.user_ where id = $1;`,
	`update ${process.env.DB_SCHEMA}.user_ set login=$1,password=$2,email=$3,phone_number=$4,town=$5,address=$6 where id = $7;`,
	`update ${process.env.DB_SCHEMA}.client set name=$1,last_name=$2 where id_user = $3;`,
];

clientQuerys.updateUserImage = `update ${process.env.DB_SCHEMA}.user_ set image_url = $1 where id = $2;`;

const sellerQuerys = {};

sellerQuerys.renderProducts = `select id, company_name from ${process.env.DB_SCHEMA}.supplier where status = 'Activo';`;

sellerQuerys.addProduct = [
	`select id, company_name from ${process.env.DB_SCHEMA}.supplier where status = 'Activo';`,
	`select reference from ${process.env.DB_SCHEMA}.product where reference = $1`,
	`insert into ${process.env.DB_SCHEMA}.product (reference,name,price,picture,specs,information,color,stock,id_category,id_supplier,status) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'Disponible');`,
];

sellerQuerys.renderProfile = `select u.id, c.name, c.last_name, u.email, u.phone_number, c.document_number, u.town, u.address, u.image_url from ${process.env.DB_SCHEMA}.client c inner join ${process.env.DB_SCHEMA}.user_ u on c.id_user = u.id where u.id = $1;`;

sellerQuerys.renderUpdateUserInformation = `select u.id, c.name, c.last_name, u.email, u.phone_number, u.town, u.address, u.image_url from ${process.env.DB_SCHEMA}.client c inner join ${process.env.DB_SCHEMA}.user_ u on c.id_user = u.id where u.id = $1;`;

sellerQuerys.updateUserInformation = [
	`select email from ${process.env.DB_SCHEMA}.user_ where email = $1;`,
	`select email from ${process.env.DB_SCHEMA}.user_ u where id = $1;`,
	`select password from ${process.env.DB_SCHEMA}.user_ where id = $1;`,
	`update ${process.env.DB_SCHEMA}.user_ set login=$1,password=$2,email=$3,phone_number=$4,town=$5,address=$6 where id = $7;`,
	`update ${process.env.DB_SCHEMA}.client set name=$1,last_name=$2 where id_user = $3;`,
];

sellerQuerys.updateUserImage = `update ${process.env.DB_SCHEMA}.user_ set image_url = $1 where id = $2;`;

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

module.exports = {
	indexQuerys,
	clientQuerys,
	sellerQuerys,
};
