"""
Yelp Fusion API code sample.
This program demonstrates the capability of the Yelp Fusion API
by using the Search API to query for businesses by a search term and location,
and the Business API to query additional information about the top result
from the search query.
Please refer to http://www.yelp.com/developers/v3/documentation for the API
documentation.
This program requires the Python requests library, which you can install via:
`pip install -r requirements.txt`.
Sample usage of the program:
`python sample.py --term="bars" --location="San Francisco, CA"`
"""

from fastapi import APIRouter
from fastapi.security import HTTPBearer
import requests
import json  # noqa: F401
import os

# import pprint
# import sys
import urllib  # noqa: F401
from urllib.parse import quote


router = APIRouter()

auth_scheme = HTTPBearer()


# from __future__ import print_function


# This client code can run on Python 2.x or 3.x.  Your imports can be
# simpler if you only need one of those.
# try:
# For Python 3.0 and later
# from urllib.error import HTTPError

# from urllib.parse import urlencode
# except ImportError:
#     # Fall back to Python 2's urllib2 and urllib
#     from urllib2 import HTTPError
#     from urllib import quote
#     from urllib import urlencode


# Yelp Fusion no longer uses OAuth as of December 7, 2017.
# You no longer need to provide Client ID to fetch Data
# It now uses private keys to authenticate requests (API Key)
# You can find it on
# https://www.yelp.com/developers/v3/manage_app


YELP_API_KEY = os.environ["YELP_API_KEY"]


# API constants, you shouldn't have to change these.
API_HOST = "https://api.yelp.com"
SEARCH_PATH = "/v3/businesses/search"
BUSINESS_PATH = "/v3/businesses/"  # Business ID will come after slash.


# Defaults for our simple example.
DEFAULT_TERM = "bars"
DEFAULT_LOCATION = "San Francisco, CA"
SEARCH_LIMIT = 10


def requestYelp(host, path, api_key=YELP_API_KEY, url_params=None):
    """Given your API_KEY, send a GET request to the API.
    Args:
        host (str): The domain host of the API.
        path (str): The path of the API after the domain.
        API_KEY (str): Your API Key.
        url_params (dict): An optional set of query parameters in the request.
    Returns:
        dict: The JSON response from the request.
    Raises:
        HTTPError: An error occurs from the HTTP request.
    """
    url_params = url_params or {}
    url = "{0}{1}".format(host, quote(path.encode("utf8")))
    headers = {
        "Authorization": "Bearer %s" % api_key,
    }

    print("Querying {0} ...".format(url))

    response = requests.request("GET", url, headers=headers, params=url_params)

    return response.json()


def search(YELP_API_KEY, term, location):
    """Query the Search API by a search term and location.
    Args:
        term (str): The search term passed to the API.
        location (str): The search location passed to the API.
    Returns:
        dict: The JSON response from the request.
    """

    url_params = {
        "term": term.replace(" ", "+"),
        "location": location.replace(" ", "+"),
        "limit": SEARCH_LIMIT,
    }

    return requestYelp(
        API_HOST, SEARCH_PATH, YELP_API_KEY, url_params=url_params
    )


def yelp_get_bar(api_key, business_id):
    """Query the Business API by a business ID.
    Args:
        business_id (str): The ID of the business to query.
    Returns:
        dict: The JSON response from the request.
    """
    business_path = BUSINESS_PATH + business_id

    return requestYelp(API_HOST, business_path, YELP_API_KEY)


def search_yelp(url, url_params):
    headers = {
        "Authorization": "Bearer %s" % YELP_API_KEY,
    }
    response = requests.request("GET", url, headers=headers, params=url_params)
    print(" QUERYING ", response.url)
    return response.json()
