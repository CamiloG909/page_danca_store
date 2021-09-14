// Successfully and error message
const messageContainer = document.getElementById('message-container');

const hiddenMsg = () => {
	setTimeout(() => {
		document.body.removeChild(messageContainer);
	}, 2000);
};

const eventRefresh = () => {
	if (performance.navigation.type == 2) {
		location.reload(true);
	}
};

eventRefresh();
hiddenMsg();
