var tickers = JSON.parse(localStorage.getItem('tickers')) || [];
console.log("tickers is")
console.log(tickers)
var lastPrices = {};
var counter = 15;
var charts = {};

function startUpdateCycle() {
    updatePrices();
    //var countdown = setInterval(function () {
	setInterval(function () {
        counter--;
        $('#counter').text(counter);
        if (counter <= 0) {
            updatePrices();
            counter = 15;
        }
    }, 1000);
}

$(document).ready(function () {
    tickers.forEach(function (ticker) {
        addTickerToGrid(ticker);
    });

    updatePrices();

    $('#add-ticker-form').submit(function (e) {
        e.preventDefault();
        
        var newTicker = $('#new-ticker').val().trim().toUpperCase();
        if (!tickers.includes(newTicker)) {
			
			validateAndAddTicker(newTicker);
			}
			//if(validateSymbol(newTicker)==True){
	         //   tickers.push(newTicker);
	            
	           // localStorage.setItem('tickers', JSON.stringify(tickers));
	           // addTickerToGrid(newTicker);
	        //  }	else {
			//	console.log("Bad Input")
			//}
        //}
        $('#new-ticker').val('');
        updatePrices();
    });

    $('#tickers-grid').on('click', '.remove-btn', function () {
        var tickerToRemove = $(this).data('ticker');
        tickers = tickers.filter(function (t) { return t !== tickerToRemove; });
        $('#' + tickerToRemove).remove();
        localStorage.setItem('tickers', JSON.stringify(tickers));
        console.log("remove "+tickerToRemove)
        
               
    });

    startUpdateCycle();
});

//function addTickerToGrid(ticker) {
	//read data from excel
  //  $('#tickers-grid').append('<div id="' + ticker + '" class="stock-box"><h2>' + ticker + '</h2> <p id="' + ticker + '-info"></p><p id="' + ticker + '-logo"></p><p id="' + ticker + '-price"></p><p id="' + ticker + '-pct"></p><button class="remove-btn" data-ticker="' + ticker + '">Remove</button><canvas d="' + ticker + '-chart" width="400" height="200">stock chart</canvas></div>');
//}

function addTickerToGrid(ticker) {
    $('#tickers-grid').append('<div id="' + ticker + '" class="stock-box">' +
        '<h2>' + ticker + '</h2>' +
        '<p id="' + ticker + '-info"></p>' +
        //'img id="' + ticker + '-logo" src="" alt="Logo"' +
        '<p id="' + ticker + '-price"></p>' +
        '<p id="' + ticker + '-pct"></p>' +
        '<button class="remove-btn" data-ticker="' + ticker + '">Remove</button>' +
        '<canvas id="' + ticker + '-chart" width="600" height="400"></canvas>' +
        '</div>');
}


//for logo 
async function getCompanyLogo(ticker) {
    try {
        const response = await fetch(`https://finance.yahoo.com/_finance_doubledown/api/resource/searchassist;searchTerm=${ticker}`);
        const data = await response.json();
        
        // Check if the data contains information about the company
        if (data && data.finance && data.finance.result && data.finance.result.length > 0) {
            const companyInfo = data.finance.result[0];
            console.log('Company info'+companyInfo);
            const logoUrl = companyInfo.image.imageUrl;
            console.log('Company logoUrl'+logoUrl);

            return logoUrl;
        } else {
            console.error('Unable to fetch company logo.');
            return null;
        }
    } catch (error) {
        console.error('Error fetching company logo:', error.message);
        return null;
    }
}




 function updatePrices() {
    //tickers.forEach(function (ticker) {
	//for (const ticker of tickers) {
	 const promises = tickers.map(async function (ticker) {
        $.ajax({
            url: '/get_stock_data',
            type: 'POST',
            data: JSON.stringify({'ticker': ticker}),
            contentType: 'application/json;charset=utf-8',
            dataType: 'json',
            success: async function (data) {
				try{
					// Fetch company logo
					if(ticker==="AMZN"){
					
	                    //const logoElement = $('#' + ticker + '-logo');
	                    //const logoPath = 'C:/Users/godhu/Python_workspace/Stock_price/Dataset/' + ticker + '.png';  // Assuming logos are saved as PNG files
	                    //console.log("paass logo")
	                    //$('#' + ticker + '-logo').attr('src', logoPath);
                    	//console.log("paass logo")
                    	//const logoPath = `/static/${ticker}.png`;
    					//$('#' + ticker + '-logo').attr('src', logoPath);
                    	//setCompanyLogo(ticker);
					}
                    
                    
                    console.log(data);
					var changePercent = ((data.currentPrice - data.openPrice) / data.openPrice) * 100;
					
					var hist=data.history;
					//console.log("at begin history is "+hist)
					var companyInfo=getCompanyInfo(ticker);
					
	                var colorClass;
	                if (changePercent <= -2) {
	                    colorClass = 'dark-red';
	                } else if (changePercent < 0) {
	                    colorClass = 'red';
	                } else if (changePercent == 0) {
	                    colorClass = 'gray';
	                } else if (changePercent <= 2) {
	                    colorClass = 'green';
	                } else {
	                    colorClass = 'dark-green';
	                }
	
	                $('#' + ticker + '-price').text('Close: $' + data.currentPrice.toFixed(2));
	                $('#' + ticker + '-pct').text(changePercent.toFixed(2) + '%');
	               	//$('#' + ticker + '-logo').text(logopath);
	                $('#' + ticker + '-price').removeClass('dark-red red gray red dark-green').addClass(colorClass);
	                $('#' + ticker + '-pct').removeClass('dark-red red gray red dark-green').addClass(colorClass);
	
					                    
                   // console.log(" BEFORE chart thing");
                    console.log(data.history);
                    var formattedData = data.history.map(entry => {
						console.log("date here is "+entry.date)
						var parts = entry.Date.toString().split(" ");
					    var datePart = parts[0].split("T")[0];
					    console.log("date PART is "+datePart)
					    var timePart = parts[1].split("-")[0]; // Remove the timezone offset
					    console.log("time PART  here is "+timePart)
					    var formattedTimestamp = new Date(datePart).toISOString().split('T')[0];
    					console.log("date here is "+formattedTimestamp)
						  return {
							  timestamp: formattedTimestamp,
							  close: entry.Close
						    //timestamp: new Date().toISOString().split('T')[0], // Replace with your actual timestamp logic
						    
						  };
						});
					renderChart(ticker, formattedData);
					console.log(" after chart thing");
					
	                var flashClass;
	                if (lastPrices[ticker] > data.currentPrice) {
	                    flashClass = 'red-flash';
	                } else if (lastPrices[ticker] < data.currentPrice) {
	                    flashClass = 'green-flash';
	                } else {
	                    flashClass = 'gray-flash';
	                }
	
	                lastPrices[ticker] = data.currentPrice;
	
	                $('#' + ticker).addClass(flashClass);
	                setTimeout(function () {
	                    $('#' + ticker).removeClass(flashClass);
	                }, 1000);
	            }catch(error){
					console.error('Error Updating prices:',error.message);
				}
			}
         });
           // Use Promise.all to wait for all promises to resolve
    		Promise.all(promises);
    });
}

//function to validate ymbol
function validateAndAddTicker(ticker) {
	var isValid = false;
    var errorMessage = '';
	
    $.ajax({
        url: `/company-info/${ticker}`,
        type: 'GET',
        contentType: 'application/json;charset=utf-8',
        dataType: 'json',
        success: function (data) {
            if (data.companyName) {
                // Valid stock symbol
                isValid = true;
                
                tickers.push(ticker);
                localStorage.setItem('tickers', JSON.stringify(tickers));
                addTickerToGrid(ticker);
                
                $('#error-message').text('');
                updatePrices();
            } else {
                // Invalid stock symbol
                console.log("Invalid stock symbol---->"+ticker);
                errorMessage = 'Invalid stock symbol. Please enter a valid stock symbol.';
                //alert("Invalid stock symbol. Please enter a valid stock symbol.");
                $('#error-message').text(errorMessage);
            }
        },
        error: function (xhr, status, error) {
            // Handle the error (e.g., network issue)
            console.error('Error validating stock symbol:', error);
        }
    });
}


function getCompanyInfo(symbol) {
        
		var company_name="";
        $.ajax({
            url: `/company-info/${symbol}`,
            type: 'GET',
            contentType: 'application/json;charset=utf-8',
            dataType: 'json',
            success: function(data) {
                if (data.companyName) {
                    // Display company information on the frontend
                    company_name=data.companyName;
                    console.log(`Company Name: ${data.companyName}`);
                    $('#' + symbol + '-info').text(data.companyName);
                } else {
                    console.error('Company information not available.');
                    company_name="Invalid Input";
                }
            },
            error: function(xhr, status, error) {
                console.error('Error fetching company information:', error);
            }
        });
}

function renderChart(ticker, historyData) {
	
	if (charts[ticker]) {
        charts[ticker].destroy();
    }
    const canvas = document.getElementById(ticker + '-chart');
    const ctx = canvas.getContext('2d');

    // Extract dates and closing prices from historical data
    const dates = historyData.map(entry => entry.index);
    const closingPrices = historyData.map(entry => entry.Close);

    // Create a new chart
    charts[ticker] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: historyData.map(entry => entry.timestamp),
            datasets: [{
                label: 'Closing Price',
                borderColor: 'rgb(75, 192, 192)',
                data: historyData.map(entry => entry.close),
            }],
        },
    });
}
function setCompanyLogo(ticker) {
    //const logoUrl = await getCompanyLogo(ticker);
    //const logoElement = $('#' + ticker + '-logo');
    const logoPath = `/static/logos/${ticker}.png`;
    $('#' + ticker + '-logo').attr('src', logoPath);
    
    
    //if (logoElement && logoUrl) {
      //  logoElement.attr('src', logoUrl);
    //}
}