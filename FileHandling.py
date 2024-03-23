'''
Created on Nov 29, 2023

@author: godhu
'''
import pandas as pd
import openpyxl as op
import os
from openpyxl.utils.dataframe import dataframe_to_rows


FILE_NAME = "C:/Users/godhu/Python_workspace/Stock_price/Dataset/Stockprice_data.xlsx"  # Replace with your file path
sheet = "StockData"  # Specify the sheet name or number



def read_file():
    df = pd.read_excel(io=FILE_NAME, sheet_name=sheet)
    print("inside file handling")
    print(df.head(5)) 
    
    
def write_file(col_name, col_data):       
    if os.path.isfile(FILE_NAME):  # if file already exists append to existing file
        workbook = op.load_workbook(FILE_NAME)  # load workbook if already exists
        sheet = workbook['StockData']  # declare the active sheet 
    
        # append the dataframe results to the current excel file
        
        sheet.append(col_name,col_data)
    
    
    
def display_excel_stkprice():
    excel_data_df = pd.read_excel(FILE_NAME, sheet_name=sheet, usecols=['Company', 'Close'])
    print(excel_data_df)
    
    


def update_excel( column_name, new_data):
    # Read existing Excel file
    df = pd.read_excel(FILE_NAME)
    print("column name")
    print(df[column_name])

    df = pd.DataFrame({'A': 1, 'B': 2})
    
    # create excel file
    if os.path.isfile(FILE_NAME):  # if file already exists append to existing file
        workbook = op.load_workbook(FILE_NAME)  # load workbook if already exists
        sheet = workbook['my_sheet_name']  # declare the active sheet 
    
        # append the dataframe results to the current excel file
        for row in dataframe_to_rows(df, header = False, index = False):
            print(row)
            # sheet.append(row)
        workbook.save(FILE_NAME)  # save workbook
        workbook.close()  # close workbook