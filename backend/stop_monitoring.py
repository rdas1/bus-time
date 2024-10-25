import json
# import urllib.request
import requests
import sys
from constants import BUS_TIME_API_KEY, STOP_MONITORING_URL, OPERATOR_REF

# bus_line = "M101"
stop_id = "402506"
if len(sys.argv) == 2:
    stop_id = sys.argv[1]

url = STOP_MONITORING_URL
params = {
    "key": BUS_TIME_API_KEY,
    "version": "2",
    "OperatorRef": OPERATOR_REF, # Always "MTA", but API responses are faster if you include this param
    "MonitoringRef": stop_id,
    "DirectionRef": "1", # 0 for uptown, 1 for downtown. Not sure how it works in other boroughs
    "MinimumStopVisitsPerLine": "1",
}
response = requests.get(url, params=params)
print(response.url)
print(response.status_code)

print()
print('-' * 80)
print()

data = response.json()
print(json.dumps(data, indent=2))

# # Defining URL to obtain the information from MTA API
# url = "https://bustime.mta.info/api/siri/stop-monitoring.json?key=" + BUS_TIME_API_KEY  + "&VehicleMonitoringDetailLevel=calls&LineRef=" + sys.argv[2]
# with urllib.request.urlopen(url) as response:        
#     #Reading the response from the Site and Decoding it to UTF-8 Format
#     data = response.read().decode("utf-8")
#     #Converting the File to JSON Format
#     data = json.loads(data)
#     #This variable stores the value of the No. of Buses by 

#     No_buses = len(data['Siri']['ServiceDelivery']['VehicleMonitoringDelivery'][0]['VehicleActivity'])


#     print ("Bus Line:" + sys.argv[2])

#     print ("No. of Buses that are currently Active:%s"%(No_buses))

#     #A for loop that prints the location of each bus and runs until the count of the buses
#     for n in range(No_buses):
#         Bus_lat = data['Siri']['ServiceDelivery']['VehicleMonitoringDelivery'][0]['VehicleActivity'][n]['MonitoredVehicleJourney']['VehicleLocation']['Latitude']
#         Bus_lon = data['Siri']['ServiceDelivery']['VehicleMonitoringDelivery'][0]['VehicleActivity'][n]['MonitoredVehicleJourney']['VehicleLocation']['Longitude']
#         print ("The Bus %s is at Latitude  %s and Longitude %s" %(n+1, Bus_lat, Bus_lon))