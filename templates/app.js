async function getStockData() {
    const symbolInput = document.getElementById('symbolInput').value;

    try {
        const response = await fetch(`/stock/${symbolInput}`);
        const data = await response.json();

        document.getElementById('companyName').innerText = data.companyName;
        document.getElementById('companyLogo').src = data.companyLogo;

        document.getElementById('currentPriceValue').innerText = data.currentPrice.Close;

        // Assuming data.historicalData is a DataFrame with a 'Close' column
        const chartData = data.historicalData;
        const chartElement = document.getElementById('chart');

        Plotly.newPlot(chartElement, [{
            x: chartData.index,
            y: chartData.Close,
            type: 'line',
            mode: 'lines',
            marker: {color: 'blue'},
        }], {title: 'Historical Prices'});
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
