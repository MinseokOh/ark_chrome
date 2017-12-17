var menu = 'home';
var userLanguage = navigator.language || navigator.userLanguage;

function showHome(complete){
	if(checkTransition() == true)
		return;

	menu = 'home';
	$('#home').transition({
		animation  : 'fade',
		duration   : '0.6s',
		onComplete : complete
	});
}

function showInfo(complete){
	if(checkTransition() == true)
		return;

	menu = 'info';	
	$('#info').transition({
		animation  : 'fade',
		duration   : '0.6s',
		onComplete : complete		                       
	});
}

function checkTransition() {
	if($('#home').transition('is animating') || $('#info').transition('is animating'))
		return true;

	return false;
}

function showAddWallet(condition){
	$('#addwallet').dimmer(condition);
}

