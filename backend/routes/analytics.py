# Analytics about user & transactions

from flask import Blueprint, request, jsonify
from routes.auth import validate_token
from models.models import db, User
from scripts.stockdata import fetch_stock_data
from utils.cache import cache
import pandas as pd

analytics_bp = Blueprint('analytics', __name__)

