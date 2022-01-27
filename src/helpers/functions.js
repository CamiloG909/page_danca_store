const functions = {};

// Price formatter function
functions.formatterPrice = (object) => {
	for (let i = 0; i < object.length; i++) {
		const priceFormat = new Intl.NumberFormat('de-DE');
		const priceFormatted = priceFormat.format(object[i].price);
		const newResponse = object[i];
		newResponse.priceFormatted = priceFormatted;
	}
};

// First image function
functions.imageCardProduct = (object) => {
	for (let i = 0; i < object.length; i++) {
		const images = [];
		const resImages = object[i].picture;
		const arrImages = resImages.split(',');
		for (let i in arrImages) {
			let image = arrImages[i].trim();
			image = {
				image,
			};
			images.push(image);
		}

		const imageProduct = images[0].image;
		const newResponse = object[i];
		newResponse.image = imageProduct;
	}
};

// Status selector
functions.statusChoose = (object) => {
	for (let i = 0; i < object.length; i++) {
		if (object[i].status === 'Completado') {
			const newResponse = object[i];
			newResponse.statusDelivered = true;
		} else if (object[i].status === 'En camino') {
			const newResponse = object[i];
			newResponse.statusWay = true;
		} else if (object[i].status === 'Pendiente') {
			const newResponse = object[i];
			newResponse.statusPending = true;
		}
	}
};

// Generate random number
functions.numberRandom = (min, max) => {
	return Math.floor(Math.random() * (max + 1 - min) + min);
};

module.exports = functions;
