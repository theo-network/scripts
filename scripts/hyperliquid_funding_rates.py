from hyperliquid import info
import csv

coin = "SOL"
startTime = 1706825050000
endTime = 1723759450000
info = info.Info()
response = []
while True:
  response.extend(info.funding_history(coin, startTime=startTime))
  startTime = response[-1]["time"]
  if startTime >= endTime:
    break
csv_file_path = 'output.csv'

filtered_data = [{'fundingRate': item['fundingRate'], 'time': item['time']} for item in response]

# Write the filtered data to a CSV file
with open(csv_file_path, mode='w', newline='') as file:
    writer = csv.DictWriter(file, fieldnames=['fundingRate', 'time'])
    writer.writeheader()
    writer.writerows(filtered_data)
