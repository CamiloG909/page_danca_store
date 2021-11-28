// Loader
window.addEventListener('load', function () {
	document.getElementById('loader-container').remove();
});

// Load functions
eventListeners();

function eventListeners() {
	eventRefresh();
	hiddenMsg();
	imagesProduct()
	lineBreaksDetailProduct();
	moreInfoHistory();
	showFormAddProduct();
	showProducts();
	editProduct();
	editSupplier();
	moreInfoShoppingList();
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

// Validate forms
(() => {
	class Validation {
		expressions = {
			user: /^[a-zA-Z0-9\_\-]{4,16}$/,
			names: /^[a-zA-ZÀ-ÿ\s]{1,40}$/,
			email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			textCommas: /^[A-Za-zÀ-ÿ\,\s]*[A-Za-zÀ-ÿ]$/
		}

		expressionLimitter(min, max) {
			return new RegExp(`^.{${min},${max}}$`)
		}

		expressionLimitterNumbers(min, max) {
			return new RegExp(`^\\d{${min},${max}}$`)
		}

		validatePrice(value) {
			const price = value.replace(/\./g, '');

			if (!Number(price)) {
				return false;
			}

			return true
		}

		validateField(expression, input, field, obj, allowF, body = document) {
			// Validate price
			if (expression === 'validatePrice') {
				const response = this.validatePrice(input.value)

				if (response) {
					body.querySelector(`#input-${field}`).classList.add('--correct')
					body.querySelector(`#input-${field}`).classList.remove('--error')
					body.querySelector(`#input-${field} .group-input-validate__icon`).classList.add('--correct')
					body.querySelector(`#input-${field} .group-input-validate__icon`).classList.remove('--error')
					body.querySelector(`#input-${field} .group-input-validate__icon i`).classList.add('bi-check-circle-fill')
					body.querySelector(`#input-${field} .group-input-validate__icon i`).classList.remove('bi-x-circle-fill')
					obj[field] = true;
					allowF();
				} else {
					body.querySelector(`#input-${field}`).classList.add('--error')
					body.querySelector(`#input-${field}`).classList.remove('--correct')
					body.querySelector(`#input-${field} .group-input-validate__icon`).classList.add('--error')
					body.querySelector(`#input-${field} .group-input-validate__icon`).classList.remove('--correct')
					body.querySelector(`#input-${field} .group-input-validate__icon i`).classList.add('bi-x-circle-fill')
					body.querySelector(`#input-${field} .group-input-validate__icon i`).classList.remove('bi-check-circle-fill')
					obj[field] = false;
					allowF();
				}

				return;
			}

			if (expression.test(input.value)) {
				body.querySelector(`#input-${field}`).classList.add('--correct')
				body.querySelector(`#input-${field}`).classList.remove('--error')
				body.querySelector(`#input-${field} .group-input-validate__icon`).classList.add('--correct')
				body.querySelector(`#input-${field} .group-input-validate__icon`).classList.remove('--error')
				body.querySelector(`#input-${field} .group-input-validate__icon i`).classList.add('bi-check-circle-fill')
				body.querySelector(`#input-${field} .group-input-validate__icon i`).classList.remove('bi-x-circle-fill')
				obj[field] = true;
				allowF();
			} else {
				body.querySelector(`#input-${field}`).classList.add('--error')
				body.querySelector(`#input-${field}`).classList.remove('--correct')
				body.querySelector(`#input-${field} .group-input-validate__icon`).classList.add('--error')
				body.querySelector(`#input-${field} .group-input-validate__icon`).classList.remove('--correct')
				body.querySelector(`#input-${field} .group-input-validate__icon i`).classList.add('bi-x-circle-fill')
				body.querySelector(`#input-${field} .group-input-validate__icon i`).classList.remove('bi-check-circle-fill')
				obj[field] = false;
				allowF();
			}
		}

		showMessage(box, message, type = "error") {
			const text = document.createElement('p');
			text.className = type === 'error' ? 'group-input-validate__text' : 'group-input-validate__text-success'
			text.textContent = message;

			if (box.querySelector('.group-input-validate__text') == null) {
				box.appendChild(text);
				setTimeout(() => {
					text.remove()
				}, 3000)
			}
		}
	}
	const validation = new Validation();

	// Signup
	if (document.querySelector('#form-signup') != null) {
		const inputs = document.querySelectorAll('.signup-form__input')

		const fields = {
			name: false,
			last_name: false,
			document_type: true,
			document_number: false,
			email: false,
			phone_number: false,
			town: false,
			address: false,
			password: false,
		}

		const allowSubmit = () => {
			if (fields.name && fields.last_name && fields.document_type && fields.document_number && fields.email && fields.phone_number && fields.town && fields.address && fields.password) {
				document.querySelector('.signup-form__btn').classList.remove('--disabled')
				document.querySelector('.signup-form__btn').disabled = false
			} else {
				document.querySelector('.signup-form__btn').classList.add('--disabled')
				document.querySelector('.signup-form__btn').disabled = true
			}
		}

		const validateForm = (e) => {
			switch (e.target.name) {
				case "name":
					validation.validateField(validation.expressions.names, e.target, 'name', fields, allowSubmit);
					break;
				case "last_name":
					validation.validateField(validation.expressions.names, e.target, 'last_name', fields, allowSubmit);
					break;
				case "document_type":
					validation.validateField(validation.expressions.names, e.target, 'document_type', fields, allowSubmit);
					break;
				case "document_number":
					validation.validateField(validation.expressionLimitterNumbers(7, 12), e.target, 'document_number', fields, allowSubmit);
					break;
				case "email":
					validation.validateField(validation.expressions.email, e.target, 'email', fields, allowSubmit);
					break;
				case "phone_number":
					validation.validateField(validation.expressionLimitterNumbers(7, 14), e.target, 'phone_number', fields, allowSubmit);
					break;
				case "town":
					validation.validateField(validation.expressionLimitter(1, 50), e.target, 'town', fields, allowSubmit);
					break;
				case "address":
					validation.validateField(validation.expressionLimitter(1, 50), e.target, 'address', fields, allowSubmit);
					break;
				case "password":
					validation.validateField(validation.expressionLimitter(6, 50), e.target, 'password', fields, allowSubmit);
					break;
			}
		}

		inputs.forEach((input) => {
			// Validate selects
			if (input.classList.contains('signup-form__input--select')) {
				return input.addEventListener('change', () => {
					if (input.value !== '') {
						input.classList.add('--correct')
						input.classList.remove('--error')
						fields[input.name] = true;
						allowSubmit();
					} else {
						input.classList.add('--error')
						input.classList.remove('--correct')
						fields[input.name] = false;
						allowSubmit();
					}
				})
			}
			input.addEventListener('keyup', validateForm);
			input.addEventListener('blur', validateForm);
		});
	}

	// Update profile
	if (document.querySelector('#form-update-profile') != null) {
		const inputs = document.querySelectorAll('.update-profile-form__input')

		const fields = {
			name: true,
			last_name: true,
			email: true,
			phone_number: true,
			town: true,
			address: true,
		}

		const allowSubmit = () => {
			if (fields.name && fields.last_name && fields.email && fields.phone_number && fields.town && fields.address) {
				document.querySelector('.update-profile-form__btn-save').classList.remove('--disabled')
				document.querySelector('.update-profile-form__btn-save').disabled = false
			} else {
				document.querySelector('.update-profile-form__btn-save').classList.add('--disabled')
				document.querySelector('.update-profile-form__btn-save').disabled = true
			}
		}

		const validateForm = (e) => {
			switch (e.target.name) {
				case "name":
					validation.validateField(validation.expressions.names, e.target, 'name', fields, allowSubmit);
					break;
				case "last_name":
					validation.validateField(validation.expressions.names, e.target, 'last_name', fields, allowSubmit);
					break;
				case "email":
					validation.validateField(validation.expressions.email, e.target, 'email', fields, allowSubmit);
					break;
				case "phone_number":
					validation.validateField(validation.expressionLimitterNumbers(7, 14), e.target, 'phone_number', fields, allowSubmit);
					break;
				case "town":
					validation.validateField(validation.expressionLimitter(1, 50), e.target, 'town', fields, allowSubmit);
					break;
				case "address":
					validation.validateField(validation.expressionLimitter(1, 50), e.target, 'address', fields, allowSubmit);
					break;
			}
		}

		inputs.forEach((input) => {
			input.addEventListener('keyup', validateForm);
			input.addEventListener('blur', validateForm);
		});
	}

	// Add suppliers
	if (document.querySelector('#form-add-suppliers') != null) {
		const inputs = document.querySelectorAll('.add-supplier-form__input')

		const fields = {
			company_name: false,
			phone_number: false,
			email: false,
			town: false,
			address: false,
		}

		const allowSubmit = () => {
			if (fields.company_name && fields.phone_number && fields.email && fields.town && fields.address) {
				document.querySelector('.add-supplier-form__btn-save').classList.remove('--disabled')
				document.querySelector('.add-supplier-form__btn-save').disabled = false
			} else {
				document.querySelector('.add-supplier-form__btn-save').classList.add('--disabled')
				document.querySelector('.add-supplier-form__btn-save').disabled = true
			}
		}

		const validateForm = (e) => {
			switch (e.target.name) {
				case "company_name":
					validation.validateField(validation.expressionLimitter(1, 50), e.target, 'company_name', fields, allowSubmit);
					break;
				case "phone_number":
					validation.validateField(validation.expressionLimitterNumbers(5, 16), e.target, 'phone_number', fields, allowSubmit);
					break;
				case "email":
					validation.validateField(validation.expressions.email, e.target, 'email', fields, allowSubmit);
					break;
				case "town":
					validation.validateField(validation.expressionLimitter(1, 50), e.target, 'town', fields, allowSubmit);
					break;
				case "address":
					validation.validateField(validation.expressionLimitter(1, 50), e.target, 'address', fields, allowSubmit);
					break;
			}
		}

		inputs.forEach((input) => {
			input.addEventListener('keyup', validateForm);
			input.addEventListener('blur', validateForm);
		});
	}

	// Edit suppliers
	if (document.querySelector('.section-suppliers') != null) {
		const suppliersContainer = document.querySelector('.supplier-card-container')

		suppliersContainer.addEventListener('click', (e) => {
			if (e.target.classList.contains('supplier-card__icon-edit')) {
				const forms = e.target.parentElement.parentElement.parentElement.querySelectorAll('article form')

				forms.forEach((form) => {
					const inputs = form.querySelectorAll('.add-supplier-form__input');

					const fields = {
						company_name: true,
						phone_number: true,
						email: true,
						town: true,
						address: true,
						status: true,
					}

					const allowSubmit = () => {
						if (fields.company_name && fields.phone_number && fields.email && fields.town && fields.address && fields.status) {
							form.querySelector('.supplier-form__btn-save').classList.remove('--disabled')
							form.querySelector('.supplier-form__btn-save').disabled = false
						} else {
							form.querySelector('.supplier-form__btn-save').classList.add('--disabled')
							form.querySelector('.supplier-form__btn-save').disabled = true
						}
					}

					const validateForm = (e) => {
						switch (e.target.name) {
							case "company_name":
								validation.validateField(validation.expressionLimitter(1, 50), e.target, 'company_name', fields, allowSubmit, form);
								break;
							case "phone_number":
								validation.validateField(validation.expressionLimitterNumbers(5, 16), e.target, 'phone_number', fields, allowSubmit, form);
								break;
							case "email":
								validation.validateField(validation.expressions.email, e.target, 'email', fields, allowSubmit, form);
								break;
							case "town":
								validation.validateField(validation.expressionLimitter(1, 50), e.target, 'town', fields, allowSubmit, form);
								break;
							case "address":
								validation.validateField(validation.expressionLimitter(1, 50), e.target, 'address', fields, allowSubmit, form);
								break;
						}
					}

					inputs.forEach((input) => {
						// Validate selects
						if (input.name === 'status') {
							return input.addEventListener('change', () => {
								if (validation.expressionLimitter(1, 50).test(input.value)) {
									input.classList.add('--correct')
									input.classList.remove('--error')
									fields[input.name] = true;
									allowSubmit();
								} else {
									input.classList.add('--error')
									input.classList.remove('--correct')
									fields[input.name] = false;
									allowSubmit();
								}
							})
						}
						input.addEventListener('keyup', validateForm);
						input.addEventListener('blur', validateForm);
					});
				})
			}
		})
	}

	// Admin products
	if (document.querySelector('.index-seller-container') != null) {
		const references = JSON.parse(document.querySelector('.section-index-seller').getAttribute('data-references'))

		// New product
		if (document.querySelector('#form-new-product') != null) {
			const inputs = document.querySelectorAll('.add-product-form__input')
			const textareas = document.querySelectorAll('.add-product-form__input-textarea')
			const selects = document.querySelectorAll('.add-product-form__input-select')

			const fields = {
				reference: false,
				price: false,
				name: false,
				image: false,
				specs: false,
				information: false,
				color: false,
				stock: false,
				category: false,
				supplier: false,
			}

			const allowSubmit = () => {
				if (fields.reference && fields.price && fields.name && fields.image && fields.specs && fields.information && fields.color && fields.stock && fields.category && fields.supplier) {
					document.querySelector('.add-product-form__btn-save').classList.remove('--disabled')
					document.querySelector('.add-product-form__btn-save').disabled = false
				} else {
					document.querySelector('.add-product-form__btn-save').classList.add('--disabled')
					document.querySelector('.add-product-form__btn-save').disabled = true
				}
			}

			const validateForm = (e) => {
				switch (e.target.name) {
					case "reference":
						// Validate reference
						for (let obj of references) {
							if (obj.reference === e.target.value) {
								e.target.parentElement.classList.add('--error')
								e.target.parentElement.classList.remove('--correct')
								e.target.parentElement.querySelector(`.group-input-validate__icon`).classList.add('--error')
								e.target.parentElement.querySelector(`.group-input-validate__icon`).classList.remove('--correct')
								e.target.parentElement.querySelector(`.group-input-validate__icon i`).classList.add('bi-x-circle-fill')
								e.target.parentElement.querySelector(`.group-input-validate__icon i`).classList.remove('bi-check-circle-fill')
								fields[e.target.name] = false;
								allowSubmit()
								return validation.showMessage(e.target.parentElement, '* La referencia debe ser única')
							}
						}

						validation.validateField(validation.expressionLimitter(1, 50), e.target, 'reference', fields, allowSubmit);
						break;
					case "price":
						validation.validateField('validatePrice', e.target, 'price', fields, allowSubmit);
						break;
					case "name":
						validation.validateField(validation.expressionLimitter(1, 9999999999), e.target, 'name', fields, allowSubmit);
						break;
					case "specs":
						if (e.target.value.length > 0) {
							document.querySelector(`#input-specs`).classList.add('--correct')
							document.querySelector(`#input-specs`).classList.remove('--error')
							document.querySelector(`#input-specs .group-input-validate__icon`).classList.add('--correct')
							document.querySelector(`#input-specs .group-input-validate__icon`).classList.remove('--error')
							document.querySelector(`#input-specs .group-input-validate__icon i`).classList.add('bi-check-circle-fill')
							document.querySelector(`#input-specs .group-input-validate__icon i`).classList.remove('bi-x-circle-fill')
							fields[e.target.name] = true;
							allowSubmit();
						} else {
							document.querySelector(`#input-specs`).classList.add('--error')
							document.querySelector(`#input-specs`).classList.remove('--correct')
							document.querySelector(`#input-specs .group-input-validate__icon`).classList.add('--error')
							document.querySelector(`#input-specs .group-input-validate__icon`).classList.remove('--correct')
							document.querySelector(`#input-specs .group-input-validate__icon i`).classList.add('bi-x-circle-fill')
							document.querySelector(`#input-specs .group-input-validate__icon i`).classList.remove('bi-check-circle-fill')
							fields[e.target.name] = false;
							allowSubmit();
						}
						break;
					case "information":
						if (e.target.value.length > 0) {
							document.querySelector(`#input-information`).classList.add('--correct')
							document.querySelector(`#input-information`).classList.remove('--error')
							document.querySelector(`#input-information .group-input-validate__icon`).classList.add('--correct')
							document.querySelector(`#input-information .group-input-validate__icon`).classList.remove('--error')
							document.querySelector(`#input-information .group-input-validate__icon i`).classList.add('bi-check-circle-fill')
							document.querySelector(`#input-information .group-input-validate__icon i`).classList.remove('bi-x-circle-fill')
							fields[e.target.name] = true;
							allowSubmit();
						} else {
							document.querySelector(`#input-information`).classList.add('--error')
							document.querySelector(`#input-information`).classList.remove('--correct')
							document.querySelector(`#input-information .group-input-validate__icon`).classList.add('--error')
							document.querySelector(`#input-information .group-input-validate__icon`).classList.remove('--correct')
							document.querySelector(`#input-information .group-input-validate__icon i`).classList.add('bi-x-circle-fill')
							document.querySelector(`#input-information .group-input-validate__icon i`).classList.remove('bi-check-circle-fill')
							fields[e.target.name] = false;
							allowSubmit();
						}
						break;
					case "color":
						validation.validateField(validation.expressions.textCommas, e.target, 'color', fields, allowSubmit);
						break;
					case "stock":
						validation.validateField(validation.expressionLimitterNumbers(1, 10), e.target, 'stock', fields, allowSubmit);
						break;
				}
			}

			inputs.forEach((input) => {
				input.addEventListener('keyup', validateForm);
				input.addEventListener('blur', validateForm);
			});

			textareas.forEach((textarea) => {
				textarea.addEventListener('keyup', validateForm);
				textarea.addEventListener('blur', validateForm);
			});

			selects.forEach((select) => {
				select.addEventListener('change', () => {
					if (validation.expressionLimitterNumbers(1, 10).test(select.value)) {
						select.classList.add('--correct')
						select.classList.remove('--error')
						fields[select.name] = true;
						allowSubmit();
					} else {
						select.classList.add('--error')
						select.classList.remove('--correct')
						fields[select.name] = false;
						allowSubmit();
					}
				});
			})

			// UI and validate input file
			const inputFile = document.querySelector('#picture');

			inputFile.addEventListener('change', () => {
				const box = inputFile.parentElement.querySelector('.add-product-form__group-file')

				if (inputFile.files.length !== 6) {
					box.querySelector('.add-product-form__group-file-content i').className = 'bi bi-send-x-fill'
					box.classList.remove('--correct')
					box.classList.add('--error')
					box.querySelector('.add-product-form__group-file-text').textContent = 'Por favor agregue 6 imágenes (jpg, png, jpeg)'
					fields['image'] = false;
					allowSubmit();
				} else {
					// Validate format file
					const validation = []
					for (let i = 0; i < inputFile.files.length; i++) {
						if (inputFile.files[i].type !== 'image/jpeg' && inputFile.files[i].type !== 'image/png') {
							validation.push(false)
						} else {
							validation.push(true)
						}
					}

					if (validation.includes(false)) {
						box.querySelector('.add-product-form__group-file-content i').className = 'bi bi-send-x-fill'
						box.classList.remove('--correct')
						box.classList.add('--error')
						box.querySelector('.add-product-form__group-file-text').textContent = 'Por favor agregue 6 imágenes (jpg, png, jpeg)'
						fields['image'] = false;
						allowSubmit();
					} else {
						box.querySelector('.add-product-form__group-file-content i').className = 'bi bi-send-check-fill'
						box.classList.remove('--error')
						box.classList.add('--correct')
						box.querySelector('.add-product-form__group-file-text').textContent = 'Imágenes agregadas satisfactoriamente'
						fields['image'] = true;
						allowSubmit();
					}
				}
			})
		}

		// Modify products
		if (document.querySelector('.seller-products-container') != null) {
			const productsContainer = document.querySelector('.seller-products-container')

			productsContainer.addEventListener('click', (e) => {
				if (e.target.classList.contains('seller-product-icon')) {
					const forms = e.target.parentElement.parentElement.parentElement.parentElement.querySelectorAll('article form')

					forms.forEach((form) => {
						const inputs = form.querySelectorAll('.edit-product-form-input')
						const textareas = form.querySelectorAll('.edit-product-form-input-textarea')
						const selects = form.querySelectorAll('.edit-product-form-input-select')

						const fields = {
							reference: true,
							price: true,
							name: true,
							specs: true,
							information: true,
							color: true,
							stock: true,
							category: true,
							supplier: true,
						}

						const allowSubmit = () => {
							if (fields.reference && fields.price && fields.name && fields.specs && fields.information && fields.color && fields.stock && fields.category && fields.supplier) {
								document.querySelector('.edit-product-form-btn').classList.remove('--disabled')
								document.querySelector('.edit-product-form-btn').disabled = false
							} else {
								document.querySelector('.edit-product-form-btn').classList.add('--disabled')
								document.querySelector('.edit-product-form-btn').disabled = true
							}
						}

						const validateForm = (e) => {
							switch (e.target.name) {
								case "reference":
									// Get current reference product
									const currentReference = e.target.parentElement.parentElement.parentElement.querySelector('.seller-product-card .seller-product-card__info').getAttribute('data-ref')

									// Validate reference
									for (let obj of references) {
										if (obj.reference === e.target.value) {
											if (currentReference !== obj.reference) {
												e.target.parentElement.classList.add('--error')
												e.target.parentElement.classList.remove('--correct')
												e.target.parentElement.querySelector(`.group-input-validate-2__icon-2`).classList.add('--error')
												e.target.parentElement.querySelector(`.group-input-validate-2__icon-2`).classList.remove('--correct')
												e.target.parentElement.querySelector(`.group-input-validate-2__icon-2 i`).classList.add('bi-x-circle-fill')
												e.target.parentElement.querySelector(`.group-input-validate-2__icon-2 i`).classList.remove('bi-check-circle-fill')
												fields[e.target.name] = false;
												allowSubmit()
												return validation.showMessage(e.target.parentElement, '* La referencia debe ser única')
											}
										}
									}

									validateField(validation.expressionLimitter(1, 50), e.target, 'reference');
									break;
								case "price":
									validateField('validatePrice', e.target, 'price');
									break;
								case "name":
									validateField(validation.expressionLimitter(1, 9999999999), e.target, 'name');
									break;
								case "specs":
									if (e.target.value.length > 0) {
										document.querySelector(`#input-specs-2`).classList.add('--correct')
										document.querySelector(`#input-specs-2`).classList.remove('--error')
										document.querySelector(`#input-specs-2 .group-input-validate-2__icon-2`).classList.add('--correct')
										document.querySelector(`#input-specs-2 .group-input-validate-2__icon-2`).classList.remove('--error')
										document.querySelector(`#input-specs-2 .group-input-validate-2__icon-2 i`).classList.add('bi-check-circle-fill')
										document.querySelector(`#input-specs-2 .group-input-validate-2__icon-2 i`).classList.remove('bi-x-circle-fill')
										fields[e.target.name] = true;
										allowSubmit();
									} else {
										document.querySelector(`#input-specs-2`).classList.add('--error')
										document.querySelector(`#input-specs-2`).classList.remove('--correct')
										document.querySelector(`#input-specs-2 .group-input-validate-2__icon-2`).classList.add('--error')
										document.querySelector(`#input-specs-2 .group-input-validate-2__icon-2`).classList.remove('--correct')
										document.querySelector(`#input-specs-2 .group-input-validate-2__icon-2 i`).classList.add('bi-x-circle-fill')
										document.querySelector(`#input-specs-2 .group-input-validate-2__icon-2 i`).classList.remove('bi-check-circle-fill')
										fields[e.target.name] = false;
										allowSubmit();
									}
									break;
								case "information":
									if (e.target.value.length > 0) {
										document.querySelector(`#input-information-2`).classList.add('--correct')
										document.querySelector(`#input-information-2`).classList.remove('--error')
										document.querySelector(`#input-information-2 .group-input-validate-2__icon-2`).classList.add('--correct')
										document.querySelector(`#input-information-2 .group-input-validate-2__icon-2`).classList.remove('--error')
										document.querySelector(`#input-information-2 .group-input-validate-2__icon-2 i`).classList.add('bi-check-circle-fill')
										document.querySelector(`#input-information-2 .group-input-validate-2__icon-2 i`).classList.remove('bi-x-circle-fill')
										fields[e.target.name] = true;
										allowSubmit();
									} else {
										document.querySelector(`#input-information-2`).classList.add('--error')
										document.querySelector(`#input-information-2`).classList.remove('--correct')
										document.querySelector(`#input-information-2 .group-input-validate-2__icon-2`).classList.add('--error')
										document.querySelector(`#input-information-2 .group-input-validate-2__icon-2`).classList.remove('--correct')
										document.querySelector(`#input-information-2 .group-input-validate-2__icon-2 i`).classList.add('bi-x-circle-fill')
										document.querySelector(`#input-information-2 .group-input-validate-2__icon-2 i`).classList.remove('bi-check-circle-fill')
										fields[e.target.name] = false;
										allowSubmit();
									}
									break;
								case "color":
									validateField(validation.expressions.textCommas, e.target, 'color');
									break;
								case "stock":
									validateField(validation.expressionLimitterNumbers(1, 10), e.target, 'stock');
									break;
							}
						}

						const validateField = (expression, input, field) => {
							// Validate price
							if (expression === 'validatePrice') {
								const response = validation.validatePrice(input.value)

								if (response) {
									document.querySelector(`#input-${field}-2`).classList.add('--correct')
									document.querySelector(`#input-${field}-2`).classList.remove('--error')
									document.querySelector(`#input-${field}-2 .group-input-validate-2__icon-2`).classList.add('--correct')
									document.querySelector(`#input-${field}-2 .group-input-validate-2__icon-2`).classList.remove('--error')
									document.querySelector(`#input-${field}-2 .group-input-validate-2__icon-2 i`).classList.add('bi-check-circle-fill')
									document.querySelector(`#input-${field}-2 .group-input-validate-2__icon-2 i`).classList.remove('bi-x-circle-fill')
									fields[field] = true;
									allowSubmit();
								} else {
									document.querySelector(`#input-${field}-2`).classList.add('--error')
									document.querySelector(`#input-${field}-2`).classList.remove('--correct')
									document.querySelector(`#input-${field}-2 .group-input-validate-2__icon-2`).classList.add('--error')
									document.querySelector(`#input-${field}-2 .group-input-validate-2__icon-2`).classList.remove('--correct')
									document.querySelector(`#input-${field}-2 .group-input-validate-2__icon-2 i`).classList.add('bi-x-circle-fill')
									document.querySelector(`#input-${field}-2 .group-input-validate-2__icon-2 i`).classList.remove('bi-check-circle-fill')
									fields[field] = false;
									allowSubmit();
								}

								return;
							}

							if (expression.test(input.value)) {
								document.querySelector(`#input-${field}-2`).classList.add('--correct')
								document.querySelector(`#input-${field}-2`).classList.remove('--error')
								document.querySelector(`#input-${field}-2 .group-input-validate-2__icon-2`).classList.add('--correct')
								document.querySelector(`#input-${field}-2 .group-input-validate-2__icon-2`).classList.remove('--error')
								document.querySelector(`#input-${field}-2 .group-input-validate-2__icon-2 i`).classList.add('bi-check-circle-fill')
								document.querySelector(`#input-${field}-2 .group-input-validate-2__icon-2 i`).classList.remove('bi-x-circle-fill')
								fields[field] = true;
								allowSubmit();
							} else {
								document.querySelector(`#input-${field}-2`).classList.add('--error')
								document.querySelector(`#input-${field}-2`).classList.remove('--correct')
								document.querySelector(`#input-${field}-2 .group-input-validate-2__icon-2`).classList.add('--error')
								document.querySelector(`#input-${field}-2 .group-input-validate-2__icon-2`).classList.remove('--correct')
								document.querySelector(`#input-${field}-2 .group-input-validate-2__icon-2 i`).classList.add('bi-x-circle-fill')
								document.querySelector(`#input-${field}-2 .group-input-validate-2__icon-2 i`).classList.remove('bi-check-circle-fill')
								fields[field] = false;
								allowSubmit();
							}
						}

						inputs.forEach((input) => {
							input.addEventListener('keyup', validateForm);
							input.addEventListener('blur', validateForm);
						});

						textareas.forEach((textarea) => {
							textarea.addEventListener('keyup', validateForm);
							textarea.addEventListener('blur', validateForm);
						});

						selects.forEach((select) => {
							select.addEventListener('change', () => {
								if (validation.expressionLimitterNumbers(1, 10).test(select.value)) {
									select.classList.add('--correct')
									select.classList.remove('--error')
									fields[select.name] = true;
									allowSubmit();
								} else {
									select.classList.add('--error')
									select.classList.remove('--correct')
									fields[select.name] = false;
									allowSubmit();
								}
							});
						})
					})
				}
			})
		}
	}
})()

// Detail product
function imagesProduct() {
	if(document.querySelector('.product-imgs') != null) {
		const images = document.querySelector('.product-imgs').getAttribute('data-imgs').split(',');
		const bigImage = document.querySelector('.product-imgs .product-imgs__right img')

		bigImage.src = images[0]

		const containerImages = document.querySelector('.product-imgs .product-imgs__left')

		images.forEach((image) => {
			const figure = document.createElement('figure')
			figure.className = 'product-imgs__img-min'
			figure.innerHTML = `<img src="${image}" alt="Imagen del producto">`

			containerImages.appendChild(figure)
		})

		containerImages.addEventListener('click', (e) => {
			if(e.target.parentElement.classList.contains('product-imgs__img-min')) {
				bigImage.src = e.target.src
			}
		})
	}
}
function lineBreaksDetailProduct() {
	if (document.querySelector('.information-product') != null) {
		const specs = document.querySelector('.product-specs')
		const information = document.querySelector('.product-description')
		const textSpecs = specs.getAttribute('data-text').replace(/\\n/g, "<br />").replace(/\\r/g, "").replace(/\\"/g, '"');
		const textInformation = information.getAttribute('data-text').replace(/\\n/g, "<br />").replace(/\\r/g, "").replace(/\\"/g, '"');

		specs.querySelector('.product-specs__text').innerHTML = textSpecs;
		information.querySelector('.product-description__text').innerHTML = textInformation;
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
					btnInfo.classList.add('--less')
					btnInfo.querySelector('i').className = "bi bi-dash-lg"

					// Insert info
					productCard.appendChild(section);
					setTimeout(() => {
						section.style.opacity = 1;
					}, 100)
				} else {
					productCard.style = null;
					btnInfo.classList.remove('--less')
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
			const title = document.createElement('p')
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
			btnPay.setAttribute('form', 'pay-products-cart')
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
			if (showMsg) this.showMessage('Tu carrito se ha vaciado', 'error')
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
		if (document.querySelector('#modal-pay-complete') != null) {
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
			<form action="${direction}/update/image/${id}?_m=PUT" method="POST" enctype="multipart/form-data">
			<input type="hidden" name="_m" value="PUT">
			<div class="choice-image-profile__group-file">
			<p class="choice-image-profile__group-file-text"></p>
			<label for="image"><i class="bi bi-cloud-arrow-up-fill"></i> Eliga una imagen de su dispositivo * jpg, png, jpeg.</label>
			<input class="choice-image-profile__input-file" type="file" name="image" id="image" required>
			</div>
			<input class="choice-image-profile__btn --disabled" type="submit" value="Actualizar" disabled>
			</form>
		</div>`;

		const inputFile = document.querySelector('#image');
		inputFile.addEventListener('change', () => {
			if(inputFile.files[0].type !== 'image/jpeg' && inputFile.files[0].type !== 'image/png') {
				document.querySelector('.choice-image-profile__group-file').classList.remove('--correct');
				document.querySelector('.choice-image-profile__group-file').classList.add('--error');
				document.querySelector('.choice-image-profile__group-file-text').textContent = ''
				document.querySelector('.choice-image-profile__btn').classList.add('--disabled');
				document.querySelector('.choice-image-profile__btn').disabled = true
			} else {
				document.querySelector('.choice-image-profile__group-file').classList.remove('--error');
				document.querySelector('.choice-image-profile__group-file').classList.add('--correct');
				document.querySelector('.choice-image-profile__group-file-text').textContent = inputFile.files[0].name
				document.querySelector('.choice-image-profile__btn').classList.remove('--disabled');
				document.querySelector('.choice-image-profile__btn').disabled = false
			}
		})
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
				box.style.height = '1001px';
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
					productCard.style.height = '938px';
					e.target.style.transform = 'rotate(90deg)';
					e.target.className = 'bi bi-x-lg seller-product-icon';
					// Show form
					// Get data for inputs
					const info = e.target.parentElement.parentElement.querySelector(
						'.seller-product-card__info'
					);

					const idProduct = info.getAttribute('data-id');
					const reference = info.getAttribute('data-ref');
					const name = info.querySelector('.name').textContent.trim();
					const price = info.querySelector('.price').textContent.slice(2);
					const specs = info.getAttribute('data-specs').replace(/\\n/g, "\\\n").replace(/\\r/g, "").replace(/\\/g, '');
					const information = info.getAttribute('data-info').replace(/\\n/g, "\\\n").replace(/\\r/g, "").replace(/\\/g, '');
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
						<div class="first-products group-input-validate-2 --correct" id="input-reference-2">
						<label class="group-input-validate-2__icon-2 --correct"><i class="bi bi-check-circle-fill"></i></label>
						<input class="edit-product-form-input add-product-form__input first" type="text" name="reference" placeholder="Referencia"
							title="Referencia del producto" value="${reference}"  />
							</div>
							<div class="price-products group-input-validate-2 --correct" id="input-price-2">
						<label class="group-input-validate-2__icon-2 --correct"><i class="bi bi-check-circle-fill"></i></label>
						<input class="edit-product-form-input add-product-form__input price" type="text" name="price" placeholder="Precio"
							title="Introduzca el precio del producto" value="${price}"  />
							</div>
							<div class="group-input-validate-2 --correct" id="input-name-2">
						<label class="group-input-validate-2__icon-2 --correct"><i class="bi bi-check-circle-fill"></i></label>
						<input class="edit-product-form-input add-product-form__input" type="text" name="name" placeholder="Nombre"
							title="Nombre del producto" value='${name}'  />
							</div>
							<div class="group-input-validate-2 --correct" id="input-specs-2">
						<label class="group-input-validate-2__icon-2 --correct"><i class="bi bi-check-circle-fill"></i></label>
						<textarea class="edit-product-form-input-textarea add-product-form__input-textarea" name="specs" placeholder="Especificaciones"
							title="Especificaciones del producto" >${specs}</textarea>
							</div>
							<div class="group-input-validate-2 --correct" id="input-information-2">
						<label class="group-input-validate-2__icon-2 --correct"><i class="bi bi-check-circle-fill"></i></label>
						<textarea class="edit-product-form-input-textarea add-product-form__input-textarea" name="information" placeholder="Información"
							title="Información del producto" >${information}</textarea>
							</div>
							<div class="colors-products group-input-validate-2 --correct" id="input-color-2">
						<label class="group-input-validate-2__icon-2 --correct" style="inset-block-start: calc( 50% - 10px);"><i class="bi bi-check-circle-fill"></i></label>
						<input class="edit-product-form-input add-product-form__input colors" type="text" name="color" placeholder="Colores disponibles"
							title="Introduzca los colores separados por ','" value="${colors}"  />
							</div>
							<div class="stock-products group-input-validate-2 --correct" id="input-stock-2">
						<label class="group-input-validate-2__icon-2 --correct" style="display:none"><i class="bi bi-check-circle-fill"></i></label>
						<input class="edit-product-form-input add-product-form__input stock" type="number" name="stock" placeholder="Existencias"
							title="Existencias del producto" value="${stock}"  />
							</div>
						<input id="modify-product-update" class="edit-product-form-btn add-product-form__btn-save" type="submit" value="Guardar">
						<button id="modify-product-status" class="seller-product-form__btn-hidden">${status}</button>
						<button id="modify-product-delete" class="seller-product-form__btn-delete"><i class="bi bi-x-lg"></i> Eliminar</button>
					`;

					productCard.appendChild(form);
					setTimeout(() => {
						form.style.opacity = 1;
					}, 100);

					// Select categories
					const categories = document.createElement('select');
					categories.className = 'edit-product-form-input-select add-product-form__input-select category --correct';
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
					suppliers.className = 'edit-product-form-input-select add-product-form__input-select supplier --correct';
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
						<div class="group-input-validate --correct" id="input-company_name">
						<label for="" class="group-input-validate__icon --correct"><i class="bi bi-check-circle-fill"></i></label>
						<input class="add-supplier-form__input" type="text" name="company_name" placeholder="Nombre" title="Introduzca el nombre del proveedor" value="${name}" required>
						</div>
						<div class="group-input-validate --correct" id="input-phone_number">
				<label for="" class="group-input-validate__icon --correct"><i class="bi bi-check-circle-fill"></i></label>
						<input class="add-supplier-form__input" type="number" name="phone_number" placeholder="Teléfono" title="Introduzca el número de teléfono, 5 a 16 dígitos" value="${phone}" required>
						</div>
						<div class="group-input-validate --correct" id="input-email">
				<label for="" class="group-input-validate__icon --correct" style="inset-block-start: calc( 50% - 10px);"><i class="bi bi-check-circle-fill"></i></label>
						<input class="add-supplier-form__input" type="email" name="email" placeholder="Email" title="Introduzca el email" value="${email}" required>
						</div>
						<div class="group-input-validate --correct" id="input-town">
				<label for="" class="group-input-validate__icon --correct" style="inset-block-start: calc( 50% - 10px);"><i class="bi bi-check-circle-fill"></i></label>
						<input class="add-supplier-form__input" type="text" name="town" placeholder="Ciudad" title="Introduzca la ciudad" value="${city}" required>
						</div>
						<div class="group-input-validate --correct" id="input-address">
				<label for="" class="group-input-validate__icon --correct"><i class="bi bi-check-circle-fill"></i></label>
						<input class="add-supplier-form__input" type="text" name="address" placeholder="Dirección" title="Introduzca la dirección" value="${address}" required>
						</div>
						<select class="supplier-form__select --correct add-supplier-form__input" name="status" required style="padding: 0 10px;">
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

// Shopping list more into
function moreInfoShoppingList() {
	const cardsContainer = document.querySelector('.section-shopping-list');
	// Validate if exist cards in correct page
	if (cardsContainer !== null) {
		cardsContainer.addEventListener('click', (e) => {
			// Validate click button
			if (e.target.getAttribute('id') === 'shopping-list-info-parent' || e.target.getAttribute('id') === 'shopping-list-info') {
				const btnInfo = e.target.getAttribute('id') === 'shopping-list-info-parent' ? e.target : e.target.parentElement;
				const productCard = e.target.getAttribute('id') === 'shopping-list-info-parent' ? e.target.parentElement : e.target.parentElement.parentElement;

				// Change styles
				if (productCard.style.blockSize == '') {
					// Get data
					const amount = productCard.getAttribute('data-amount');
					const methodPayment = productCard.getAttribute('data-payment');
					const supplier = productCard.getAttribute('data-supplier');
					const idClient = productCard.getAttribute('data-id');
					const address = productCard.getAttribute('data-address');
					const city = productCard.getAttribute('data-city');
					const shippingCompany = productCard.getAttribute('data-company');
					const shippingDate = productCard.getAttribute('data-shipping');
					const deliveryDate = productCard.getAttribute('data-delivery');

					// Create boxes
					const sectionProduct = document.createElement('section');
					sectionProduct.setAttribute('id', 'section-product');
					sectionProduct.innerHTML = `
					<p class="purchase-card__text">Cantidad: ${amount}</p>
					<p class="purchase-card__title">M&eacutetodo de pago</p>
					<p class="purchase-card__text">${methodPayment}</p>
					<p class="purchase-card__title">Proveedor</p>
					<p class="purchase-card__text">${supplier}</p>
					`;

					const sectionClient = document.createElement('section');
					sectionClient.setAttribute('id', 'section-client');
					sectionClient.innerHTML = `
					<p class="purchase-card__title">ID de cliente</p>
					<p class="purchase-card__text">${idClient}</p>
					<p class="purchase-card__title">Direcci&oacuten</p>
					<p class="purchase-card__text">${address}</p>
					<p class="purchase-card__text">${city}</p>
					`

					const sectionTotal = document.createElement('section');
					sectionTotal.setAttribute('id', 'section-total');
					sectionTotal.innerHTML = `
					<p class="purchase-card__title">Env&iacuteo</p>
					<p class="purchase-card__text">Empresa: ${shippingCompany}</p>
					<p class="purchase-card__text">Fecha de env&iacuteo: ${shippingDate}</p>
					<p class="purchase-card__text">Fecha de entrega: ${deliveryDate}</p>
					`

					// Insert info
					productCard.querySelector('.purchase-card__section-product').appendChild(sectionProduct)
					productCard.querySelector('.purchase-card__section-client').appendChild(sectionClient)
					productCard.querySelector('.purchase-card__section-total').appendChild(sectionTotal)

					productCard.style.blockSize = '225px';

					// Change style button
					btnInfo.classList.add('--less')
					btnInfo.querySelector('i').className = "bi bi-dash-lg"

					setTimeout(() => {
						sectionProduct.style.opacity = 1;
						sectionClient.style.opacity = 1;
						sectionTotal.style.opacity = 1;
					}, 100)
				} else {
					productCard.style = null;
					btnInfo.classList.remove('--less')
					btnInfo.querySelector('i').className = "bi bi-plus-lg"
					// Hidden info
					productCard.querySelector('#section-product').style.opacity = 0;
					productCard.querySelector('#section-client').style.opacity = 0;
					productCard.querySelector('#section-total').style.opacity = 0;
					setTimeout(() => {
						productCard.querySelector('#section-product').remove()
						productCard.querySelector('#section-client').remove()
						productCard.querySelector('#section-total').remove()
					}, 200)
				}
			}
		})
	}
}
