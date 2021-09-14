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

--supplier TODO: Temporary
INSERT INTO supplier (company_name,phone_number,town,address,email,status) VALUES
    ('Xiaomi','3154319637','Bogotá','Cl. 8 Sur #7184','xiaomi@gmail.com','Activo'),
    ('Motorola Inc.','3138622497','Bogotá','Cl. 38 A sur #34D – 51','motorola@gmail.com','Activo'),
    ('Acer Inc.','3149874587','Bogotá','Cl. 73 #40','acer@gmail.com','Activo'),
    ('ASUS','3165479931','Bogotá','Cra. 16 #76-42 Oficina 204','asus@gmail.com','Activo'),
    ('Hewlett-Packard Development Company, L.P','3204568713','Bogotá','Cr. 7 No 99-45','hpcompany@gmail.com','Activo')
;

--product_category
INSERT INTO product_category (category_name,status) VALUES
    ('Computadores','Activo'),
    ('Celulares','Activo')
;

--product TODO: Temporary
INSERT INTO product (reference,name,price,picture,specs,information,color,stock,id_category,id_supplier,status) VALUES
    ('84654','All In One ASUS Vivo AIO V222FAK-BA241T','1529000','https://i.imgur.com/2W7HRiw.jpg',
	'Marca: ASUS Tipo: All in One Referencia: V222FAK-BA241T Procesador: Intel Pentium Gold 6405U Processor 2.4 GHz Sistema operativo: Windows 10 Home 64 bits Memoria RAM: 4 GB Disco duro: 1TB Funcionalidades: Camara WEB Integrada Pantalla: 21.5” Pulgadas Resolución: FULL HD Conectividad: BLUETOOTH, HDMI, USB, USB 2.0, WIFI',
	'La increíblemente hermosa PC todo en uno Vivo AiO V222 es una máquina creada para adaptarse a tus necesidades. Tiene un bisel de pantalla de 2 mm casi invisible que te brinda imágenes de borde a borde y una increíble relación de pantalla a cuerpo del 87%. Con una pantalla LED Full HD de 21.5 pulgadas y audio ASUS SonicMaster avanzado con un sistema de altavoces bass-reflex, Vivo AiO V222 te sumerge en imágenes increíbles y un sonido excelente para la mejor experiencia de entretenimiento y trabajo. El Vivo AiO V222 te ahorra espacio, es notablemente delgado, liviano, y presenta una impresionante relación de pantalla a cuerpo del 87%. Esta impresionante pantalla panorámica de 21.5 pulgadas incluye tecnología de visión amplia que la hace perfecta para compartir fotos o videos con amigos y familiares. Con una resolución Full HD (1920 x 1080) podrás disfrutar de juegos y películas con detalles, colores y contrastes sorprendentes y realistas.',
	'Dorado','12','1','4','Disponible'),
    ('45691','Xiaomi Note 8','699900','https://i.imgur.com/FFCY4oN.jpg',
	'Marca: XIAOMI Referencia: REDMI Note 8 128GB Sistema operativo: Android Versión sistema operativo: Android Pie 9.0 Pantalla: 6,3 ” Pulgadas Tipo y resolución de pantalla: Gorilla Glass, FHD+ Memoria interna: 128 GB Memoria RAM: 4 GB Red de transmision de datos: 4G, Dual SIM Procesador: Qualcomm Snapdragon, 4 Core 2.2 GHz +4 Core 1.8 GHZ, 8 Núcleos Tipo y resolución de la cámara frontal: Sencilla, 13 Mpx Tipo y resolución de camara posterior: Cuádruple con flash. 48Mpx, Dual 8 Mpx, Triple 2 Mpx, Cuádruple 2 Mpx Capacidad de la batería: 4000 mAh con carga rápida de 18W Lector de huella posterior',
	'Como un experto, podrás disfrutar las cuatro cámaras de Xiaomi para tomar las mejores fotos y tener el mejor rendimiento para todo el día. Mejor experiencia con su batería de 4000 mAh con carga rápida. Memoria de 128GB para guardar todos tus recuerdos. Pantalla sorprendente de 6,3" para ver tus películas favoritas.',
	'Negro espacial, Azul neptuno, Luz de luna','24','2','1','Disponible'),
    ('48213','Motorola G30','999900','https://comoto.vteximg.com.br/arquivos/ids/159108-800-800/_0005_2020_Capri-_BasicPack_PhantomBlack_Front-View.png?v=637487717947530000',
	'Memoria Interna: 128 GB Memoria RAM: 4 GB Procesador: Qualcomm 8 Núcleos Sistema Operativo: Android 11 Cámara Frontal: Sencilla 13 Mpx Cámara Posterior: Cuadruple 64  Mpx 8 MPX + 2MPX + 2MPX',
	'Una experiencia increíblemente fluida con tu MOTO G30.| Frecuencia de actualización de 90 Hz en una pantalla ultra ancha Max Vision HD+. para disfrutar tus juegos mucho más reales y un desplazamiento perfecto. Si buscas capturar fotos de alta resolución, con este Smartphone que incorpora un increíble sistema de 4 cámaras de 64 MP, obtendrás fotos como si fueras un profesional. Con MOTO G30, todo es posible. Aprovecha, ¡lleva el tuyo ahora!',
	'Morado, Negro','14','2','2','Disponible'),
    ('232181','Acer Porsche AP714-51t-555d','6999000','https://static.acer.com/up/Resource/Acer/Laptops/Porsche_Design_Acer_Book_RS/Images/20201012/Porsche-Design-Acer-Book-RS_AP714-51_modelmain.png',
	'Memoria RAM: 8 GB Almacenamiento: Disco Estado Solido (SSD) 512  GB Procesador: Intel Core I5 1135G7 Pantalla: Full HD 14  Pulgadas Duración de la Batería: 8  Horas Aproximadas Opciones de Conectividad: Bluetooth, USB, WiFi',
	'Acer y Porsche se unen para llevar a ti este nuevo y elegante portátil, equipado con un chasis cubierto por una película de fibra de carbono 3k. Esta aleación de componentes ayuda a reducir el peso del portátil hasta los 1,50 kilogramos y el centímetro y medio de grosor. Todo ello con unas líneas rectas y una bisagra de una sola pieza que ayuda a elevar ligeramente el teclado, lo que ayuda a facilitar la ventilación del portátil incluso aunque esté apoyado en una superficie plana. Adicionalmente viene equipado con los últimos procesadores de Intel de undécima generación, en concreto, los Intel Core i5 con gráficas Intel Iris X, para mejor rendimiento y pantalla de resolución Full HD para disfrutar de mayor detalle a la hora de reproducir imagines y videos.',
	'Gris plateado','6','1','3','Disponible'),
    ('56646','Xiaomi POCO X3','1049900','https://i.imgur.com/Vc4oDpk.jpeg',
	'Memoria Interna: 128 GB Memoria RAM: 6 GB Procesador: Qualcomm 8 Nucleos Sistema Operativo: Android 10 Cámara Frontal: Sencilla 20 Mpx Cámara Posterior: Cuadruple 64 Mpx 13MPX+2MPX+2MPX',
	'El POCO X3 NFC ofrece exactamente lo que necesitas, un excelente rendimiento gracias al nuevo procesador Snapdragon 732G, una gran batería de 5160mAh que carga en tan solo 1 hora y te permite hasta dos días de uso, cuádruple cámara de hasta 64MPX para tomar excelentes fotografías en cualquier momento y la mejor experiencia de juego gracias a sus 120Hz de tasa de refresco comparado con celulares de gama premium.',
	'Phantom Black, Frost Blue, Metal Bronze','9','2','1','Disponible')
;

--method_payment
INSERT INTO method_payment (method_payment) VALUES
    ('Efectivo'),
    ('Tarjeta de Crédito'),
    ('Tarjeta de Débito')
;
