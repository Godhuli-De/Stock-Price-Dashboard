'''
Created on Nov 29, 2023

@author: godhu
'''
import yfinance as yf
from flask import Flask, render_template, request, jsonify
import pandas as pd
from datetime import datetime
import openpyxl



# filepath='C:/Users/godhu/Python_workspace/Stock_price/Dataset/Stockprice_data.xlsx'
filepath='C:/Users/godhu/Python_workspace/Stock_price/Dataset/StockData.xlsx'
# Data_Stock

app = Flask(__name__, template_folder='templates')

# Create an empty DataFrame to store stock price data
stock_data_df = pd.DataFrame(columns=['Ticker', 'Timestamp', 'CurrentPrice', 'OpenPrice','History'])


@app.route('/')
def index():
    return render_template('index2.html')


@app.route('/get_stock_data', methods=['POST'])
def get_stock_data():
    global stock_data_df
    # data = None
    try: 
        ticker=request.get_json()['ticker']
        
        # To get historical data for the last month
        data=yf.Ticker(ticker).history(period='1mo')
        
        if data.empty!=True:
            print("Current price")
            print(data.iloc[-1].Close)
            print("Open price")
            print(data.iloc[-1].Open)
            print("History data price")
            print(data[['Close']])
            
            history_data = [{'Date': date.strftime('%Y-%m-%d %H:%M:%S'), 'Close': close} for date, close in zip(data.index, data['Close'])]
            print("History data")
            print(history_data)
            
            save_to_excel(data,ticker,filepath)
            
            
    
            return jsonify({'currentPrice': data.iloc[-1].Close,
                    'openPrice':data.iloc[-1].Open,
                    # 'history': data[['Close']].to_dict('records')})
                    'history': history_data
            })
    
        else : 
            print(f"Cannot get info of {ticker}, it probably does not exist")
            return jsonify({'currentPrice': None,
                    'openPrice':None, 'history':None})        
    except:
        print(f"Eror in getting data ")
    
    
    return jsonify({'currentPrice': data.iloc[-1].Close,
                    'openPrice':data.iloc[-1].Open,
                    'history': history_data})




#get company info and logo based on symbol    
@app.route('/company-info/<symbol>')
def get_company_info(symbol):
    try:
        stock = yf.Ticker(symbol)
        company_name = stock.info.get('longName', 'N/A')
        return jsonify({'companyName': company_name})
    except Exception as e:
        return jsonify({'error': str(e)}), 500



def save_to_excel(data,tickername, filename=filepath):
    print("in save to excel")
    # Create or load the existing Excel file
    try:
        df = pd.read_excel(filename, sheet_name="StockData")
        print("able to read ")
    except FileNotFoundError:
        # If the file doesn't exist, create a new DataFrame
        print("file not found here")
        df = pd.DataFrame()
    
    # Add a new row with the current timestamp and stock data
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    data['Ticker']= tickername
    data['Timestamp'] = timestamp
    print("data to store"+data)
    
    df = pd.concat([df, pd.DataFrame(data)], ignore_index=True)
    
    # Save the DataFrame to the Excel file
    df.to_excel(filename,sheet_name="StockData", index=False)
    
      
if __name__ == '__main__':
    app.run(debug=True)