import requests
from datetime import timezone, datetime
import csv

headers = {'Accept': 'application/json'}

baseURL = '	https://indexer.dydx.trade/v4'
ticker = 'BTC-USD'
currTime = datetime.now()
params = {
    'effectiveBeforeOrAt':
    currTime.strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z',
}
startTime = datetime(2024, 2, 1, 0, 0, 0).replace(tzinfo=timezone.utc)
result = []
while True:
  r = requests.get(f'{baseURL}/historicalFunding/{ticker}',
                   headers=headers,
                   params=params)
  result.extend(r.json()['historicalFunding'])
  time = datetime.fromisoformat(result[-1]['effectiveAt'])
  if time < startTime:
    break
  params = {
      'effectiveBeforeOrAt': time.strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z',
  }

output_csv = 'dydx_funding_rates.csv'
with open(output_csv, mode='w', newline='') as file:
  writer = csv.writer(file)

  # Write the header
  writer.writerow(['fundingRate', 'time'])

  # Write the data rows
  for entry in result:
    time = datetime.fromisoformat(entry['effectiveAt']).timestamp()
    writer.writerow([entry['rate'], time])
