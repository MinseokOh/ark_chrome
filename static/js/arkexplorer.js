var getAccountURL = "https://explorer.ark.io/api/getAccount";
var getTransactionURL = "https://explorer.ark.io/api/getTransactionsByAddress"
var wallet_address;

var btc_currency;
var usd_currency;
var krw_currency;

var currency = 'btc';

init();

function init(){
	showMain();

	$('.download').click(function(){
		chrome.tabs.create({'url': "https://github.com/ArkEcosystem/ark-desktop/releases" } );
	});

	$('.join').click(function(){
		chrome.tabs.create({'url': "https://ark.io/slack" });
	});

	$('.arkio').click(function(){
		chrome.tabs.create({'url': "https://ark.io" });
	});

	$('.addaddress').click(function(){
		showAddAcount();
	});

	getBalance();

	getCookie(function(data){
		console.log(data);
		address = data.address;
		if(address == null){
			$('.addWalletBtn').click(function(){
				loadAccount($('input[name=adress]').val());
			});
		} else {
			$('.addWalletBtn').text(address.substring(0, 25) + "...");
			$('.addWalletBtn').click(function(){
				loadAccount(address);
			});
			$('input[name=adress]').remove();			
		}
	});

}

function loadAccount(address) {
	getAccount(
		address, 
		function(data){
			if(data.success == true) {
				showInfo();
				setAccountData(data);
			} else {
				showMain();
			}
		}
	);
}

function setAccountData(data){
	wallet_address = data.address;
	setCookie(wallet_address);

	$('div[name=walletAddress]').text(data.address);
	$('div[name=balance]').text('Ѧ'+ amountConverter(data.balance));

	getTransaction();
}


function getTransaction(){
	var url = getTransactionURL + "?address=" + wallet_address + "&limit=20&offset=0";
	console.log(url);
	$.ajax({
            type: "GET", //or GET
            url: url,
            crossDomain:true,
            cache:false,
            async:false,
            success: function(data){
            	if(data.success == true){
            		console.log(data);
            		setTransactionData(data.transactions);
            	} else {
            		console.log(data);
            	}
            },
            error: function(data){
            	console.log(data);
            }
        });
}

function setTransactionData(data){
	var label = '<div class="ui ${COLOR} label">${AMOUNT}</div>';
	var element = '<tr><td>${TYPE}</td><td>${AMOUNT}</td><td>${BALANCE}</td></tr>';
	$('#transaction').empty();

	for(var i = 0; i < data.length; i++){
		time = timeConverter(data[i].timestamp);
		amount = amountConverter(data[i].amount);
		sender = typeConverter(data[i].senderId);
		var labelAmount = label.replace("${COLOR}", sender==true ? "red" : "green").replace("${AMOUNT}",(sender==true ? "-" : "" )+ amount);
		$('#transaction').append(element.replace("${BALANCE}", (amount * btc_currency).toFixed(4)).replace("${TYPE}", sender==true ? "Send" : "Recived").replace("${AMOUNT}", labelAmount));
	}
}

function getBalance(){
	url = "https://api.coinmarketcap.com/v1/ticker/ark/";
	$.ajax({
            type: "GET", //or GET
            url: url,
            crossDomain:true,
            cache:false,
            async:false,
            success: function(data){
            	usd_currency = data[0].price_usd;            	
            	btc_currency = data[0].price_btc;

				$('.usdPrice').text("$ " + usd_currency);
				$('.btcPrice').text("Ƀ " + btc_currency);
				getKRWBalance();		
            },
            error: function(data){
            	console.log(data);
            }
        });
}

function getKRWBalance(){
	url = "https://api.coinone.co.kr/ticker/?format=json&currency=btc";
	$('.krwPrice').text('');
	$.ajax({
            type: "GET", //or GET
            url: url,
            crossDomain:true,
            cache:false,
            async:false,
            success: function(data){
            	krw_currency = parseInt(data.last * btc_currency);
            	$('.krwPrice').text("₩ " + krw_currency);
            },
            error: function(data){
            	console.log(data);
            },
        });
}




function typeConverter(senderid){
	return senderid == wallet_address;
}

function amountConverter(amount){
	var amount = amount /100000000;
	return amount.toFixed(2);
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

function getCookie(cb){
	chrome.storage.local.get(['address'], function(items){
		cb(items)
	});
}

function setCookie(value){
	console.log(value);
	chrome.storage.local.set({ 'address' : value }, function(){
		console.log("complete")
	});
}

function showMain(){
	$('#main').transition({
		animation  : 'fade',
		duration   : '1.2s',
	});
}

function showAddAcount(){
	$('.ui.dimmer').dimmer('show');
}

function showInfo(){
	$('#info').transition({
		animation  : 'fade',
		duration   : '1s',                              
	});
}
