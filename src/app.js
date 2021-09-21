// Successfully and error message
const messageContainer = document.getElementById('message-container');
const messageSignin = document.getElementById('message-signin');
const emailFieldIndex = document.getElementById('email-index');
const passwordFieldIndex = document.getElementById('password-index');

const hiddenMsg = (box) => {
	function hidden() {
		box.remove();
	}

	setTimeout(hidden, 2500);
};

const hiddenErrorIndex = (box) => {
	function hiddenMsgText() {
		box.remove();
	}

	emailFieldIndex.addEventListener('click', hiddenMsgText);
	passwordFieldIndex.addEventListener('click', hiddenMsgText);
};

// Loader
window.addEventListener('load', function () {
	document.getElementById('loader-container').remove();
});

// Refresh navigator for login
const eventRefresh = () => {
	window.addEventListener('pageshow', function (event) {
		var historyTraversal =
			event.persisted ||
			(typeof window.performance != 'undefined' &&
				window.performance.navigation.type === 2);
		if (historyTraversal) {
			window.location.reload();
		}
	});
};

// Close modal pay complete
const closeModalCart = () => {
	document.getElementById('modal-pay-complete').remove();
};

// Choose image profile
const choiceMenuProfile = (direction, id) => {
	const section = document.createElement('section');

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

	document.body.insertAdjacentElement('afterbegin', section);
};
const closeChoiceMenuProfile = () => {
	document.getElementById('choice-menu-profile').remove();
};

// Form add products
const formAddProducts = () => {
	let addProductForm = document.querySelector('.add-product-form');
	const boxIcons = document.querySelector('.seller-add-products');
	boxIcons.classList.toggle('after-box-add-products');
	if (addProductForm.style.display === 'block') {
		addProductForm.style.display = 'none';
	} else {
		addProductForm.style.display = 'block';
	}
};

hiddenMsg(messageContainer);
hiddenErrorIndex(messageSignin);
eventRefresh();
