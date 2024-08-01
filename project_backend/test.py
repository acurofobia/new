import requests, json

BASE = "http://127.0.0.1:5000/"


with open('2k.json') as json_file:
      data = json.load(json_file)
data = json.dumps(data)


response = requests.put(BASE + "end/4557/2", json={'test': data})
print(response)