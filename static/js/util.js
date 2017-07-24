function typeConverter(senderid){
	return senderid == cacheWalletData.address;
}

function amountConverter(amount){
	var amount = amount /100000000;
	return amount.toFixed(2);
}

function amountCommaConverter(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function timeConverter(unixtime){
	var a = new Date(unixtime * 1000);
	var year = a.getYear();
	var month = a.getMonth();
	var date = a.getDate();
	var hour = a.getHours();
	var min = a.getMinutes();
	var time = date + '/' + month + ' ' + hour + ':' + min;
	return time;
}

function openTabs(url){
	chrome.tabs.create({ url: url });
}

function getCookie(key, cb){
	chrome.storage.local.get(null, function(items){
		console.log(items);
		cb(items)
	});
}

function setCookie(data){
	chrome.storage.local.set(data, function(){
	});
}
