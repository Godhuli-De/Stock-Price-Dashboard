'''
Created on Nov 28, 2023

@author: godhu
'''
from flask import Flask, render_template, request, jsonify
import yfinance as yf
import plotly.express as px
import pandas as pd
import FileHandling as fh


app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index1.html')


@app.route('/dashboard')
def get_stock_data():
    try:
        symbol = request.args.get('symbol')  # Get the symbol from the query parameter
        print("Symbol in py file is "+symbol)
        duration="1mo"
        
        current_price = yf.download(symbol, period="1d")
        print("current_price is ")
        print(type(current_price))
        historical_data_list = yf.download(symbol, period=duration)
        print("historical_data_list IS")
        print(historical_data_list)
        print(historical_data_list.to_dict())
        # return historical_data_list

        # save_to_excel(symbol, current_price, historical_data_list)
        # print('paased save file')
        fh.read_file()
        fh.write_file('Company', "IBM")
    
        return jsonify({
            'currentPrice': current_price.to_dict(),
            'historicalData': historical_data_list.to_dict(),
            'companyName': "IBM",
            'companyLogo': "LOGOOO"
        })
    

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
# Function to plot stock data
# def plot_stock_data(stock_data):
#     fig = px.line(stock_data, x=stock_data.index, y='Close', title='Stock Price Chart')
#     fig.show()

# def save_to_excel(symbol, current_price, historical_data):
#     df = pd.DataFrame({
#         'Symbol': [symbol],
#         'Current Price': [current_price],
#         'Historical Data': [historical_data]
#     })

    # with pd.ExcelWriter('stockData.xlsx', engine='xlsxwriter') as writer:
    #     df.to_excel(writer, sheet_name='StockData', index=False)

if __name__ == '__main__':
    app.run(host='localhost', port=9874,debug=True)

