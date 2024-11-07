import requests
from constants import STOP_MONITORING_URL, OPERATOR_REF, MTA_API_VERSION, MINIMUM_STOP_VISITS_PER_LINE, STOPS_ALONG_ROUTE_URL, STOP_STATIC_INFO_URL
import os

MTA_API_KEY = os.getenv("MTA_API_KEY")
# MTA_API_KEY = app.config["MTA_API_KEY"]

def get_stops_along_route(route_id, include_polylines=False):
    url = STOPS_ALONG_ROUTE_URL.format(route_id=route_id)
    # return {"message": url}
    params = {
        'key': MTA_API_KEY,
        'includePolylines': include_polylines,
    }

    response = requests.get(url, params=params)
    
    if response.status_code == 200:
        return response.json()
    else:
        return {"error": "Failed to fetch data", "status_code": response.status_code}
    
def get_stop_info(stop_id):

    url = STOP_STATIC_INFO_URL.format(stop_id=stop_id)
    print(url)

    params = {
        'key': MTA_API_KEY,
    }

    response = requests.get(url, params=params)
    
    if response.status_code == 200:
        return response.json()
    else:
        return {"error": "Failed to fetch data", "status_code": response.status_code}

def get_stop_monitoring(stop_id, route_id=None, direction_id=None):
    # Placeholder for data-fetching logic

    params = {
        'key': MTA_API_KEY,
        'version': MTA_API_VERSION,
        'OperatorRef': OPERATOR_REF,
        'MonitoringRef': stop_id,
        'MinimumStopVisitsPerLine': MINIMUM_STOP_VISITS_PER_LINE
    }

    if route_id:
        # TODO: check route_id validity
        params['LineRef'] = route_id
    if direction_id == 0 or direction_id == 1:
        params['DirectionRef'] = direction_id

    response = requests.get(STOP_MONITORING_URL, params=params)

    if response.status_code == 200:
        return response.json()
    else:
        return {"error": "Failed to fetch data", "status_code": response.status_code} 

def get_data():
    # Placeholder for data-fetching logic
    return {"message": "Hello from Flask!"}
