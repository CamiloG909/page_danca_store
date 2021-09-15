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

hiddenMsg(messageContainer);
hiddenErrorIndex(messageSignin);
eventRefresh();
