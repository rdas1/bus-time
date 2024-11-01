from flask import Blueprint, jsonify
from utils.mta_data_utils import get_data, get_stop_monitoring, get_stop_info

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

