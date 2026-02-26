from flask import Blueprint, jsonify, request
from utils.mta_data_utils import get_data, get_stop_monitoring, get_stop_info, get_stops_along_route, get_stops_for_location, get_all_stops

api_bp = Blueprint('api', __name__)

@api_bp.route('/data', methods=['GET'])
def get_data_route():
    data = get_data()
    return jsonify(data)

@api_bp.route('/api/stop/<stop_id>/arrivals', methods=['GET'])
def get_stop_arrivals(stop_id):
    data = get_stop_monitoring(stop_id)
    return jsonify(data)

@api_bp.route('/api/stop/<stop_id>/info', methods=['GET'])
def get_static_stop_info(stop_id):
    data = get_stop_info(stop_id)
    return jsonify(data)

@api_bp.route('/api/route/<route_id>/stops', methods=['GET'])
def get_static_stops_along_route(route_id):
    # data = {'message': 'Hello from Flask!'}
    data = get_stops_along_route(route_id, True)
    return jsonify(data)

@api_bp.route('/api/stops/all', methods=['GET'])
def get_all_stops_route():
    data = get_all_stops()
    return jsonify(data)

@api_bp.route('/api/stops/nearby', methods=['GET'])
def get_nearby_stops():
    lat = request.args.get('lat', type=float)
    lon = request.args.get('lon', type=float)
    if lat is None or lon is None:
        return jsonify({"error": "lat and lon are required"}), 400
    data = get_stops_for_location(lat, lon)
    return jsonify(data)
