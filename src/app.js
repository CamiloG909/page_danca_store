// Loader
window.addEventListener('load', function () {
	document.getElementById('loader-container').remove();
});

// Load functions
eventListeners();

function eventListeners() {
	eventRefresh();
	hiddenMsg();
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

// /cart
// Close modal pay complete
function closeModalCart() {
	const box = document.querySelector('#modal-pay-complete');
	box.style.opacity = 0;
	setTimeout(() => {
		box.remove();
	}, 100);
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
	}, 100);
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
			}, 100);
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
					const name = info.querySelector('.name').textContent;
					const price = info.querySelector('.price').textContent.slice(2);
					const supplier = info.querySelector('.supplier').textContent;
					const stock = info.querySelector('.stock').textContent.slice(13);
					let status = info
						.querySelector('.name .status')
						.classList.contains('--active')
						? `<i class="bi bi-eye-slash"></i> Ocultar`
						: `<i class="bi bi-eye"></i> Mostrar`;

					let method;
					// Create form
					const form = document.createElement('form');
					form.className = 'seller-product-form';
					form.action = '/seller/products';
					form.style.opacity = 0;
					form.innerHTML = `
					<i class="bi bi-caret-down-fill seller-product-form__arrow"></i>
						<p class="seller-product-form__title">Modificar producto</p>
						<input class="add-product-form__input first" type="number" name="reference" placeholder="Referencia"
							title="Referencia del producto" required />
						<input class="add-product-form__input price" type="text" min="1000" name="price" placeholder="Precio"
							title="No son necesarios los puntos" value="${price}" required />
						<input class="add-product-form__input" type="text" name="name" placeholder="Nombre"
							title="Nombre del producto" value="${name}" required />
						<textarea class="add-product-form__input-textarea" name="picture" placeholder="Imágenes"
							title="Hipervínculo de las imágenes" required></textarea>
						<textarea class="add-product-form__input-textarea" name="specs" placeholder="Especificaciones"
							title="Especificaciones del producto" required></textarea>
						<textarea class="add-product-form__input-textarea" name="information" placeholder="Información"
							title="Información del producto" required></textarea>
						<input class="add-product-form__input colors" type="text" name="color" placeholder="Colores disponibles"
							title="Introduzca los colores separados por ','" value="" required />
						<input class="add-product-form__input stock" type="number" name="stock" placeholder="Existencias"
							title="Existencias del producto" value="${stock}" required />
						<select class="add-product-form__input-select category" name="category" required>
							<option value="" default>Categoría</option>
							<option value="1">Computadores</option>
							<option value="2">Celulares</option>
						</select>
						<select class="add-product-form__input-select supplier" name="supplier" required>
							<option value="" default>Proveedor</option>
							<option value="test" default>Test</option>
						</select>
						<input id="modify-product-update" class="add-product-form__btn-save" type="submit" value="Guardar">
						<button id="modify-product-status" class="seller-product-form__btn-hidden">${status}</button>
						<button id="modify-product-delete" class="seller-product-form__btn-delete"><i class="bi bi-x-lg"></i> Eliminar</button>
					`;

					productCard.appendChild(form);
					setTimeout(() => {
						form.style.opacity = 1;
					}, 100);

					// Methods
					const btnUpdate = form.querySelector('#modify-product-update');
					const btnHidden = form.querySelector('#modify-product-status');
					const btnDelete = form.querySelector('#modify-product-delete');
					// PUT
					btnUpdate.addEventListener('click', () => {
						form.action = '/seller/products?_m=PUT';
						form.method = 'POST';
					});

					// PUT (STATUS)
					btnHidden.addEventListener('click', () => {
						form.action = '/seller/products?_m=PUT';
						form.method = 'POST';
					});

					// DELETE
					btnDelete.addEventListener('click', () => {
						form.method = 'DELETE';
					});
				} else {
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
						.classList.contains('--active')
						? 'Activo'
						: 'Suspendido';
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
