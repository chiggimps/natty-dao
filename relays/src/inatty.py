# Connect to the iNaturalist API and get the data for a given user

import requests
import sys
import os
from dotenv import load_dotenv
load_dotenv()

# Get the user's API key from the environment
api_key = os.environ['INAT_API_KEY']

# recent observations from danieleseglie
# https://api.inaturalist.org/v1/observations?user_id=danieleseglie&order_by=observed_on&order=desc&per_page=1

# a class for this iNatty module
class iNatty(object):

    def __init__(self, user_name, api_key):
        self.user_name = user_name
        self.api_key = api_key

    def get_observations(self):
        # Get the observations for the user
        url = 'https://api.inaturalist.org/v1/observations'
        params = {'user_id': self.user_name, 'per_page': 200, 'order_by': 'observed_on', 'order': 'desc'}
        r = requests.get(url, params=params)
        print(r.json())
        return r.json()

    def get_user_info(self):
        user_data = requests.get('https://api.inaturalist.org/v1/users/' + self.user_name + '?key=' + api_key).json()
        print(user_data)
        return user_data

    # # Get the user's observations from the API
    # user_obs = requests.get('https://api.inaturalist.org/v1/observations?user_id=' + str(user_id) + '&key=' + api_key).json()
    # # Get the user's observations
    # obs = user_obs['results']

    # # Get the user's most recent observation
    # most_recent_obs = requests.get('https://api.inaturalist.org/v1/observations?user_id=' + str(user_id) + '&order_by=observed_on&order=desc&per_page=1&key=' + api_key).json()

    # # Get recent observations from user charlesrobbins
    # recent_obs = requests.get('https://api.inaturalist.org/v1/observations?user_id=charlesrobbins&order_by=observed_on&order=desc&per_page=1&key=' + api_key).json()


if __name__ == '__main__':
    c = iNatty('danieleseglie', api_key)
    c.get_observations()
    c.get_user_info()