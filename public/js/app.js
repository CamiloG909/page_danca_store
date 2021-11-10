// Loader
window.addEventListener('load', function () {
	document.getElementById('loader-container').remove();
});

// Load functions
eventListeners();

function eventListeners() {
	eventRefresh();
	hiddenMsg();
	moreInfoHistory();
	showFormAddProduct();
	showProducts();
	editProduct();
	editSupplier();
}

// Refresh navigator for login
function eventRefresh() {
	window.addEventListener('pageshow', function (event) {
		const historyTraversal =
			event.persisted ||
			(typeof window.performance != 'undefined' &&
				window.performance.navigation.type === 2);
		if (historyTraversal) {
			window.location.reload();
		}
	});
}

// Show messages with transition
function transitionMsg(msgContainer) {
	msgContainer.style.transform = 'translateY(-70px)'
	document.body.appendChild(msgContainer);
	setTimeout(() => {
		msgContainer.style.transform = null
	}, 100)

	// Hidden msg
	setTimeout(() => {
		msgContainer.style.transform = 'translateY(-70px)'
		// Remove from DOM
		setTimeout(() => {
			msgContainer.remove()
		}, 300)
	}, 1500)
}

// Hidden global messages
function hiddenMsg() {
	const msg = document.querySelector('#message-container');
	if (msg !== null) {
		msg.style.transform = 'translateY(0)';
		setTimeout(() => {
			msg.style.transform = 'translateY(-70px)';
			setTimeout(() => {
				msg.remove();
			}, 300);
		}, 2500);
	}
}

// Hidden error index
function hiddenErrorIndex() {
	if (document.querySelector('#message-signin') !== null) {
		document.querySelector('#message-signin').remove();
	}
}

// /history
function moreInfoHistory() {
	const cardsContainer = document.querySelector('.shopping-history-container');
	// Validate if exist cards in correct page
	if (cardsContainer !== null) {
		cardsContainer.addEventListener('click', (e) => {
			// Validate click button
			if (e.target.getAttribute('id') === 'history-show-info-parent' || e.target.getAttribute('id') === 'history-show-info') {
				const btnInfo = e.target.getAttribute('id') === 'history-show-info-parent' ? e.target : e.target.parentElement;
				const productCard = e.target.getAttribute('id') === 'history-show-info-parent' ? e.target.parentElement : e.target.parentElement.parentElement;

				// Add styles
				if (productCard.style.height == '') {
					// Get data
					const price = productCard.getAttribute('data-price-unit');
					const reference = productCard.getAttribute('data-ref');
					const color = productCard.getAttribute('data-color');
					const methodPayment = productCard.getAttribute('data-payment');
					const supplier = productCard.getAttribute('data-supplier');
					const address = productCard.getAttribute('data-address');
					const city = productCard.getAttribute('data-city');
					const shippingCompany = productCard.getAttribute('data-shipp-company');
					const shippingDate = productCard.getAttribute('data-shipp-date');

					// Create boxes
					const section = document.createElement('section');
					section.className = 'product-history__second-section'
					const sectionProduct = document.createElement('section');
					const sectionPayment = document.createElement('section');
					const sectionAddress = document.createElement('section');
					const sectionDelivery = document.createElement('section');
					sectionProduct.innerHTML = `<p class="product-history__more-text"><span class="product-history__more-assistant">$ ${price} </span>/ Unidad</p>
				<p class="product-history__more-text">Ref: <span class="product-history__more-text-gray">${reference}</span></p>
				<p class="product-history__more-text">Color: <span class="product-history__more-text-gray">${color}</span></p>`
					sectionPayment.innerHTML = `<p class="product-history__more-title">M&eacutetodo de pago</p>
				<p class="product-history__more-text-gray">${methodPayment}</p>
				<p class="product-history__more-title">Proveedor</p>
				<p class="product-history__more-text-gray">${supplier}</p>`
					sectionAddress.innerHTML = `<p class="product-history__more-title">Direcci&oacuten</p>
				<p class="product-history__more-text-gray">${address}</p>
				<p class="product-history__more-text-gray">${city}</p>`
					sectionDelivery.innerHTML = `<p class="product-history__more-title">Envío</p>
				<p class="product-history__more-text">Empresa: <span class="product-history__more-text-gray">${shippingCompany}</span></p>
				<p class="product-history__more-text">Fecha: <span class="product-history__more-text-gray">${shippingDate}</span></p>`

					// Insert in container
					section.appendChild(sectionProduct);
					section.appendChild(sectionPayment);
					section.appendChild(sectionAddress);
					section.appendChild(sectionDelivery);

					productCard.style.height = '243px';

					// Change style button
					btnInfo.classList.add('product-history__show-less')
					btnInfo.querySelector('i').className = "bi bi-dash-lg"

					// Insert info
					productCard.appendChild(section);
					setTimeout(() => {
						section.style.opacity = 1;
					}, 100)
				} else {
					productCard.style = null;
					btnInfo.classList.remove('product-history__show-less')
					btnInfo.querySelector('i').className = "bi bi-plus-lg"
					// Hidden info
					productCard.querySelector('.product-history__second-section').style.opacity = 0;
					setTimeout(() => {
						productCard.querySelector('.product-history__second-section').remove();
					}, 200)
				}
			}
		})
	}
}

// /cart
// Shopping cart
(() => {

	let productsCart = []

	class InfoProduct {
		constructor(id, user, reference, product, name, picture, price, amount, color) {
			this.id = id
			this.user = user
			this.reference = reference
			this.product = product
			this.name = name
			this.picture = picture
			this.price = price
			this.amount = amount
			this.color = color
		}
	}

	// Local Storage
	class LS {
		getProducts() {
			if (localStorage.getItem('products-cart') === null) {
				localStorage.setItem('products-cart', '[]')
			} else {
				productsCart = JSON.parse(localStorage.getItem('products-cart'))
				ui.showNotificationCount()
			}
		}

		syncProducts() {
			localStorage.setItem('products-cart', JSON.stringify(productsCart))
			ui.showNotificationCount()
		}
	}

	class UI {
		showNotificationCount() {
			// Get info of user logged
			const user = document.querySelector('#header__btn-menu').getAttribute('data-user')
			const productsCartUser = productsCart.filter(product => product.user === user)

			const count = productsCartUser.length
			if (count > 0) {
				// Show count cirlce in header
				const header = document.querySelector('.header .header__limit .header__icons-right #count-header-cart')
				const circle = document.createElement('div')
				circle.className = 'header__circle-count'
				circle.textContent = count

				header.appendChild(circle)
			}
		}

		addProduct(product) {
			ls.getProducts()
			productsCart.unshift(product)
			this.showNotificationCount()
			ls.syncProducts()
		}

		showMessage(message, type = "succesfully") {
			const divContainer = document.createElement('div')
			divContainer.className = 'message-container'
			divContainer.setAttribute('id', 'message-container')

			const div = document.createElement('div')
			div.className = `message message--${type}`
			div.setAttribute('id', 'message')
			div.innerHTML = `<i class="bi bi-caret-up-fill message--${type}-icon"></i>
		<p class="message__text">${message}</p>`

			divContainer.appendChild(div)
			transitionMsg(divContainer)
		}

		showProducts() {
			// Get info of user logged
			const user = document.querySelector('#header__btn-menu').getAttribute('data-user')
			const productsCartUser = productsCart.filter(product => product.user === user)

			const count = productsCartUser.length
			if (count > 0) {
				// Clean HTML
				document.querySelector('.shopping-cart').innerHTML = ''

				// Create container products
				const container = document.createElement('section')
				container.className = 'shopping-cart-container'
				document.querySelector('.shopping-cart').appendChild(container)

				const containerCards = document.createElement('section')
				containerCards.className = 'products-shopping-cart'
				container.appendChild(containerCards)

				productsCartUser.forEach(product => {
					const article = document.createElement('article')
					article.className = 'product-cart'
					article.innerHTML = `<div id="delete-product" class="product-cart__delete-product" data-id="${product.id}">
				<i id="delete-product-icon" class="bi bi-x-lg"></i>
			</div>
			<figure class="product-cart__img-container">
				<img src="${product.picture}" alt="Imagen del producto" />
			</figure>
			<section class="product-cart__text">
				<div>
					<p class="product-cart__name">${product.name}</p>
					<p class="product-cart__price">$ ${product.price}</p>
					<p class="product-cart__color">Color: ${product.color}</p>
				</div>
			</section>
			<section class="product-cart__amount">
				<div>
					<p class="product-cart__amount-title">Cantidad</p>
					<p class="product-cart__amount-number">${product.amount}
						<p class="product-cart__amount-title">Referencia</p>
						<p class="product-cart__amount-number">${product.reference}
						</p>
				</div>
			</section>`

					containerCards.appendChild(article)

				})
				// Show total products
				this.showTotalBox(productsCartUser)
			} else {
				// Clean notification count
				document.querySelector('#count-header-cart').innerHTML = '<i class="bi bi-cart3 header__icon"></i>'

				// Clean HTML
				document.querySelector('.shopping-cart').innerHTML = ''

				const container = document.createElement('div')
				container.className = 'shopping-cart-container--fail'
				container.innerHTML = `<figure class="shopping-history-fail">
				<div>
					<p class="shopping-history-fail__text">Aún no has agregado ningún producto</p>
					<p class="shopping-history-fail__face">:(</p>
				</div>
			</figure>`
				document.querySelector('.shopping-cart').appendChild(container)
			}
		}

		showTotalBox(products) {
			// Create box container
			const container = document.createElement('section')
			container.className = 'total-value-cart'
			document.querySelector('.shopping-cart-container').appendChild(container)

			// Create title
			const title =  document.createElement('p')
			title.className = 'total-value-cart__title'
			title.textContent = 'Valor total'
			container.appendChild(title)

			// Create form
			const form = document.createElement('form')
			form.setAttribute('id', 'pay-products-cart')
			form.action = '/cart/pay'
			form.method = 'POST'
			container.appendChild(form)

			// Show products
			let totalValue = 0
			products.forEach(product => {
				const text = document.createElement('p')
				text.className = 'total-value-cart__product'
				text.innerHTML = `${product.name} <span> x${product.amount}</span>`
				container.appendChild(text)

				// Add to the total
				let price = product.price.replace(/\./g, '');
				price = Number(price)
				totalValue += price * product.amount

				// Add inputs to form
				form.innerHTML += `
				<input type="hidden" name="product" value="${product.product}">
				<input type="hidden" name="amount" value="${product.amount}">
				<input type="hidden" name="color" value="${product.color}">
				`
			})

			// Format total
			const priceFormatter = new Intl.NumberFormat('de-DE');
			totalValue = priceFormatter.format(totalValue);

			// Create line
			const line = document.createElement('hr')
			line.className = 'total-value-cart__line'
			container.appendChild(line)

			// Create total text
			const total = document.createElement('p')
			total.className = 'total-value-cart__total'
			total.innerHTML = `<span>$ </span>${totalValue}`
			container.appendChild(total)

			// Create button pay
			const btnPay = document.createElement('button')
			btnPay.className = 'total-value-cart__btn-pay'
			btnPay.setAttribute('form','pay-products-cart')
			btnPay.innerHTML = 'Ir a pagar<i class="bi bi-cash-coin total-value-cart__btn-pay-icon"></i>'
			container.appendChild(btnPay)

			// Create button clear cart
			const btnClear = document.createElement('button')
			btnClear.className = 'total-value-cart__btn-clear'
			btnClear.innerHTML = '<i class="bi bi-trash2-fill"></i> Vaciar carrito'
			container.appendChild(btnClear)
			btnClear.onclick = () => {
				this.clearCart()
			}
		}

		deleteProduct(id) {
			const name = productsCart.find(product => product.id === id).name
			productsCart = productsCart.filter(product => product.id !== id)
			ls.syncProducts()
			this.showProducts()
			this.showMessage(`${name} eliminado del carrito`, 'error')
		}

		clearCart(showMsg = true) {
			productsCart = productsCart.filter(product => product.user !== document.querySelector('#header__btn-menu').getAttribute('data-user'))
			ls.syncProducts()
			this.showProducts()
			if(showMsg) this.showMessage('Tu carrito se ha vaciado', 'error')
		}
	}

	const ls = new LS()
	const ui = new UI()

	// Know if the user is client
	window.addEventListener('DOMContentLoaded', () => {
		// Show count in header
		if (document.querySelector('.header') != null && document.querySelector('.header').getAttribute('name') === 'header-client') {
			const headerClient = document.querySelector('.header')
			ls.getProducts();
		}

		// Show products in shopping cart
		if (document.querySelector('.shopping-cart') != null) {
			ui.showProducts()
			// Delete product
			if (document.querySelector('.shopping-cart') != null) {
				document.querySelector('.shopping-cart').addEventListener('click', (e) => {
					if (e.target.getAttribute('id') === 'delete-product' || e.target.getAttribute('id') === 'delete-product-icon') {
						let id = e.target.getAttribute('id') === 'delete-product' ? e.target : e.target.parentElement
						id = id.getAttribute('data-id')
						ui.deleteProduct(id)
					}
				})
			}
		}

		// Clear cart if user already paid
		if(document.querySelector('#modal-pay-complete') != null) {
			ui.clearCart(false)
		}
	})

	// Get data from form
	const getDataProduct = (e) => {
		e.preventDefault()

		const form = document.querySelector('#add-cart-product-form')
		const data = new FormData(form)

		// Validate amount
		if (Number(data.get('amount')) > 3 || Number(data.get('amount')) < 1) return ui.showMessage('La cantidad permitida es de 1 a 3 por producto', 'error')

		// Get stock
		const stock = form.parentElement.querySelector('.product-abstract__stock').textContent.slice(18)

		// Validate amount and stock
		if (Number(stock) < data.get('amount')) return ui.showMessage('Por favor corrija la cantidad', 'error')

		// Create obj product with info
		const product = new InfoProduct(
			uuid.v4(),
			data.get('user'),
			data.get('reference'),
			data.get('product'),
			data.get('name'),
			data.get('picture'),
			data.get('price'),
			data.get('amount'),
			data.get('color'),
		)

		ui.addProduct(product)
		ui.showMessage(`${data.get('name')} agregado al carrito`)
	}
	if (document.querySelector('#add-cart-product-form') !== null) {
		document.querySelector('#add-cart-product-form').addEventListener('submit', getDataProduct)
	}

})();
// Close modal pay complete
function closeModalCart() {
	const box = document.querySelector('#modal-pay-complete');
	box.style.opacity = 0;
	setTimeout(() => {
		box.remove();
	}, 200);
}

// /user
// Choose image profile
function choiceMenuProfile(direction, id) {
	const section = document.createElement('section');

	setTimeout(() => {
		section.className = 'container-choice-image-profile';
		section.setAttribute('id', 'choice-menu-profile');
		section.innerHTML = `<div class="choice-image-profile">
			<i class="bi bi-x-circle choice-image-profile__icon-close" onclick="closeChoiceMenuProfile()"></i>
			<p class="choice-image-profile__title">IMAGEN DE PERFIL</p>
			<form action="${direction}/update/image/${id}?_m=PUT" method="POST">
			<input type="hidden" name="_m" value="PUT">
			<input class="choice-image-profile__input" type="text" name="image_url" placeholder="Enlace" title="Introduzca el hipervínculo de su imagen" required>
			<input class="choice-image-profile__btn" type="submit" value="Actualizar">
			</form>
		</div>`;
		section.style.opacity = 1;
	}, 100);

	document.body.insertAdjacentElement('afterbegin', section);
}

function closeChoiceMenuProfile() {
	const box = document.querySelector('#choice-menu-profile');
	box.style.opacity = null;
	setTimeout(() => {
		box.remove();
	}, 200);
}

// /seller/products
// Form add products
function showFormAddProduct() {
	const btn = document.querySelector('#open-add-product-form');
	const box = document.querySelector('#container-form-add');

	if (btn !== null) {
		// Apply effect background
		document.body.className = 'body-seller-products';

		btn.addEventListener('click', () => {
			// Color purple
			btn.parentElement.parentElement.classList.toggle(
				'seller-index-box-purple'
			);
			document
				.querySelector('#text-add-products')
				.classList.toggle('seller-index-box-purple');

			if (box.style.height === '100px') {
				// Rotate btn
				btn.parentElement.style.transform = 'rotate(180deg)';
				// Size box
				box.style.height = '1055px';
			} else {
				btn.parentElement.style.transform = 'rotate(0deg)';
				box.style.height = '100px';
			}
		});
	}
}
// Modify products
function showProducts() {
	const btn = document.querySelector('#open-show-products');
	const box = document.querySelector('#container-show-all');

	if (btn !== null) {
		btn.addEventListener('click', () => {
			// Change icon folder
			setTimeout(() => {
				btn.parentElement.parentElement
					.querySelector('i')
					.classList.toggle('bi-folder2-open');
			}, 200);
			// Color purple
			btn.parentElement.parentElement.classList.toggle(
				'seller-index-box-purple'
			);
			document
				.querySelector('#text-show-products')
				.classList.toggle('seller-index-box-purple');

			if (box.style.maxHeight === '100px') {
				// Rotate btn
				btn.parentElement.style.transform = 'rotate(180deg)';
				// Size box
				box.style.maxHeight = null;
			} else {
				btn.parentElement.style.transform = 'rotate(0deg)';
				box.style.maxHeight = '100px';
			}
		});
	}
}
// Form product edit
function editProduct() {
	const productsContainer = document.querySelector(
		'.seller-products-container'
	);
	if (productsContainer !== null) {
		productsContainer.addEventListener('click', (e) => {
			if (e.target.classList.contains('seller-product-icon')) {
				const productCard = e.target.parentElement.parentElement.parentElement;
				const productsParentContainer =
					e.target.parentElement.parentElement.parentElement.parentElement;

				// Get suppliers in array
				let suppliersArray = productsParentContainer.getAttribute('data-suppliers');
				suppliersArray = suppliersArray.substring(0, suppliersArray.length - 1);
				suppliersArray = suppliersArray.split(',');

				// Get index of suppliers in array for value
				let suppliersIndex = productsParentContainer.getAttribute('data-indexsuppliers');
				suppliersIndex = suppliersIndex.substring(0, suppliersIndex.length - 1);
				suppliersIndex = suppliersIndex.split(',');

				if (productCard.style.height === '134px') {
					// Expand card
					productCard.style.height = '1160px';
					e.target.style.transform = 'rotate(90deg)';
					e.target.className = 'bi bi-x-lg seller-product-icon';
					// Show form
					// Get data for inputs
					const info = e.target.parentElement.parentElement.querySelector(
						'.seller-product-card__info'
					);

					const idProduct = info.getAttribute('data-id');
					const reference = info.getAttribute('data-ref');
					const name = info.querySelector('.name').textContent;
					const price = info.querySelector('.price').textContent.slice(2);
					const pictures = info.getAttribute('data-img');
					const specs = info.getAttribute('data-specs');
					const information = info.getAttribute('data-info');
					const colors = info.getAttribute('data-colors');
					const supplier = info.getAttribute('data-supplier');
					const stock = info.querySelector('.stock').textContent.slice(13);
					const category = info.getAttribute('data-category');
					let status = info
						.querySelector('.name .status')
						.classList.contains('--active') ?
						`<i class="bi bi-eye-slash"></i> Ocultar` :
						`<i class="bi bi-eye"></i> Mostrar`;

					// Show name supplier
					for (let i = 0; i < suppliersIndex.length; i++) {
						if (supplier == suppliersIndex[i]) {
							info.querySelector('.supplier').textContent = `Proveedor: ${suppliersArray[i]}`
						}
					}
					// Create form
					const form = document.createElement('form');
					form.className = 'seller-product-form';
					form.method = 'POST';
					form.style.opacity = 0;
					form.innerHTML = `
					<i class="bi bi-caret-down-fill seller-product-form__arrow"></i>
						<p class="seller-product-form__title">Modificar producto</p>
						<input id="method-input" type="hidden" name="_m" value="">
						<input class="add-product-form__input first" type="text" name="reference" placeholder="Referencia"
							title="Referencia del producto" value="${reference}" required />
						<input class="add-product-form__input price" type="text" name="price" placeholder="Precio"
							title="Introduzca el precio del producto" value="${price}" required />
						<input class="add-product-form__input" type="text" name="name" placeholder="Nombre"
							title="Nombre del producto" value='${name}' required />
						<textarea class="add-product-form__input-textarea" name="picture" placeholder="Imágenes"
							title="Hipervínculo de las imágenes" required>${pictures}</textarea>
						<textarea class="add-product-form__input-textarea" name="specs" placeholder="Especificaciones"
							title="Especificaciones del producto" required>${specs}</textarea>
						<textarea class="add-product-form__input-textarea" name="information" placeholder="Información"
							title="Información del producto" required>${information}</textarea>
						<input class="add-product-form__input colors" type="text" name="color" placeholder="Colores disponibles"
							title="Introduzca los colores separados por ','" value="${colors}" required />
						<input class="add-product-form__input stock" type="number" name="stock" placeholder="Existencias"
							title="Existencias del producto" value="${stock}" required />
						<input id="modify-product-update" class="add-product-form__btn-save" type="submit" value="Guardar">
						<button id="modify-product-status" class="seller-product-form__btn-hidden">${status}</button>
						<button id="modify-product-delete" class="seller-product-form__btn-delete"><i class="bi bi-x-lg"></i> Eliminar</button>
					`;

					productCard.appendChild(form);
					setTimeout(() => {
						form.style.opacity = 1;
					}, 100);

					// Select categories
					const categories = document.createElement('select');
					categories.className = 'add-product-form__input-select category';
					categories.name = 'category';
					categories.required = true;
					categories.innerHTML =
						category == 1 ?
						`
					<option value="1" selected>Computadores</option>
					<option value="2">Celulares</option>` :
						`
					<option value="1">Computadores</option>
					<option value="2" selected>Celulares</option>`;

					form.insertBefore(categories, form.querySelector('#modify-product-update'));

					// Select suppliers
					const suppliers = document.createElement('select');
					suppliers.className = 'add-product-form__input-select supplier';
					suppliers.name = 'supplier';
					suppliers.required = true;

					// Insert options
					for (let i = 0; i < suppliersArray.length; i++) {
						const option = document.createElement('option');
						option.value = suppliersIndex[i];
						option.textContent = suppliersArray[i];
						if (suppliersIndex[i] == supplier) option.selected = true;

						suppliers.appendChild(option);

					}

					form.insertBefore(suppliers, form.querySelector('#modify-product-update'));


					// Methods
					const btnUpdate = form.querySelector('#modify-product-update');
					const btnHidden = form.querySelector('#modify-product-status');
					const btnDelete = form.querySelector('#modify-product-delete');
					// PUT
					btnUpdate.addEventListener('click', () => {
						form.action = `/seller/product/edit?id=${idProduct}&_m=PUT`;
						form.querySelector('#method-input').value = 'PUT';
					});

					// PUT (STATUS)
					btnHidden.addEventListener('click', () => {
						const statusDb = info
							.querySelector('.name .status')
							.classList.contains('--active') ?
							2 :
							1;

						form.action = `/seller/product/edit-status?id=${idProduct}&status=${statusDb}&product=${name}&_m=PUT`;
						form.querySelector('#method-input').value = 'PUT';
					});

					// DELETE
					btnDelete.addEventListener('click', () => {
						form.action = `/seller/product/delete?id=${idProduct}&product=${name}&_m=DELETE`;
						form.querySelector('#method-input').value = 'DELETE';
					});
				} else {
					// Hidden supplier
					const supplier = e.target.parentElement.parentElement.querySelector('.seller-product-card__info').getAttribute('data-supplier')
					e.target.parentElement.parentElement.querySelector('.supplier').textContent = `Proveedor: ${supplier}`

					productCard.style.height = '134px';
					e.target.style.transform = 'rotate(0deg)';
					e.target.className = 'bi bi-pencil-square seller-product-icon';
					productCard.querySelector('form').remove();
				}
			}
		});
	}
}

// /seller/suppliers
// Edit suppliers
function editSupplier() {
	const suppliersContainer = document.querySelector('.supplier-card-container');
	if (suppliersContainer !== null) {
		suppliersContainer.addEventListener('click', (e) => {
			if (e.target.classList.contains('supplier-card__icon-edit')) {
				const supplierCard = e.target.parentElement.parentElement;

				if (supplierCard.style.height === '143px') {
					// Expand card
					supplierCard.style.height = '635px';
					e.target.style.transform = 'rotate(90deg)';
					e.target.className = 'bi bi-x-lg supplier-card__icon-edit';

					// Show form
					// Get data for inputs
					const info = e.target.parentElement;
					const idSupplier = info.getAttribute('data-id');
					const name = info.querySelector('.name').textContent;
					const phone = info.querySelector('.phone').textContent.slice(10);
					const email = info.querySelector('.email').textContent.slice(7);
					const city = info.querySelector('.city').textContent.slice(8);
					const address = info.querySelector('.address').textContent.slice(11);
					const statusCurrent = info
						.querySelector('#status')
						.classList.contains('--active') ?
						'Activo' :
						'Suspendido';
					const statusAlternate =
						statusCurrent === 'Activo' ? 'Suspendido' : 'Activo';

					// Create form
					const form = document.createElement('form');
					form.className = 'supplier-form';
					form.style.opacity = 0;
					form.method = 'POST';
					form.innerHTML = `
						<i class="bi bi-caret-down-fill supplier-form__arrow"></i>
						<p class="supplier-form__title">Editar proveedor</p>
						<input name="id" type="hidden" value="${idSupplier}">
						<input name="company_name_current" type="hidden" value="${name}">
						<input class="add-supplier-form__input" type="text" name="company_name" placeholder="Nombre" title="Introduzca el nombre del proveedor" value="${name}" required>
						<input class="add-supplier-form__input" type="number" name="phone_number" placeholder="Teléfono" title="Introduzca el número de teléfono" value="${phone}" required>
						<input class="add-supplier-form__input" type="email" name="email" placeholder="Email" title="Introduzca el email" value="${email}" required>
						<input class="add-supplier-form__input" type="text" name="town" placeholder="Ciudad" title="Introduzca la ciudad" value="${city}" required>
						<input class="add-supplier-form__input" type="text" name="address" placeholder="Dirección" title="Introduzca la dirección" value="${address}" required>
						<select class="supplier-form__select" name="status" required>
							<option value="${statusCurrent}" default>${statusCurrent}</option>
							<option value="${statusAlternate}">${statusAlternate}</option>
						</select>
						<input id="update-supplier" class="supplier-form__btn-save" type="submit" value="Actualizar cambios">
						<button id="delete-supplier" class="supplier-form__btn-delete"><i class="bi bi-x-lg"></i> Eliminar proveedor</button>
					`;

					supplierCard.appendChild(form);

					setTimeout(() => {
						form.style.opacity = 1;
					}, 100);

					// Method
					form.addEventListener('click', (e) => {
						const input = document.createElement('input');
						input.type = 'hidden';
						input.name = '_m';

						if (e.target.id === 'update-supplier') {
							form.action = '/seller/suppliers?_m=PUT';
							input.value = 'PUT';
							form.insertAdjacentElement('afterbegin', input);
						}
						if (e.target.id === 'delete-supplier') {
							form.action = '/seller/suppliers?_m=DELETE';
							input.value = 'DELETE';
							form.insertAdjacentElement('afterbegin', input);
						}
					});
				} else {
					supplierCard.style.height = '143px';
					e.target.style.transform = 'rotate(0deg)';
					e.target.className = 'bi bi-pencil-square supplier-card__icon-edit';
					supplierCard.querySelector('form').remove();
				}
			}
		});
	}
}
