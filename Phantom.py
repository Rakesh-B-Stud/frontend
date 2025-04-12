#!/usr/bin/env python
# coding: utf-8

# In[4]:


get_ipython().system('pip install google-generativeai')


# In[27]:


get_ipython().system('pip install fuzzywuzzy[speedup]')


# In[49]:


from flask import Flask, request, jsonify
import google.generativeai as genai
from flask_cors import CORS
from fuzzywuzzy import fuzz
import re

# ✅ Configure your Gemini API key
genai.configure(api_key="AIzaSyBgJ43FOAOCUMlMDxSLwejOLx6Z4Kd2aVo")

# ✅ Define system behavior using system_instruction
new_instruction_here = (
        """You are a friendly travel assistant. Your name is Travask. Your job is to help users with anything related to:
- Travel planning (destinations, itineraries, transport)
- Tourist attractions, local landmarks, or events
- Cultural topics like local food, customs, festivals, history
- Travel safety, tips, or packing advice

If the user's message is clearly unrelated to travel or culture, politely decline to answer in 1 line. 
If it is ambiguous but could be related (e.g., packing, travel timing, safety, food), provide a helpful response within a travel context.


Always assume good intent. If it seems remotely travel-related, go ahead and answer it!
"""
)

# ✅ After changing the instruction
model = genai.GenerativeModel(
    model_name="models/gemini-1.5-flash-latest",
    system_instruction=new_instruction_here
)


# ✅ Setup Flask
app = Flask(__name__)
CORS(app)

# ✅ Maintain conversation history (for single user for now)
conversation_history = []

# ✅ Travel-related keywords for fuzzy matching
travel_keywords = [
    "travel", "trip", "itinerary", "tour", "vacation", "holiday",
    "landmark", "monument", "tourist spot", "museum", "heritage",
    "culture", "tradition", "customs", "food", "cuisine", "festival",
    "safety", "weather", "season", "adventure", "route", "transport"
]

def is_relevant_to_travel(message):
    for keyword in travel_keywords:
        if fuzz.partial_ratio(keyword.lower(), message.lower()) >= 40:
            return True
    return False

@app.route('/reset', methods=['POST'])
def reset_chat():
    global conversation_history
    conversation_history.clear()
    return jsonify({"message": "Conversation history cleared."})

def convert_markdown_to_html(text):
    # Convert **bold** to <strong>bold</strong>
    text = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', text)

    # Convert markdown bullets * Item or - Item into HTML list
    lines = text.splitlines()
    html_lines = []
    in_list = False

    for line in lines:
        if re.match(r'^\s*[\*\-]\s+', line):
            if not in_list:
                html_lines.append('<ul>')
                in_list = True
            line = re.sub(r'^\s*[\*\-]\s+', '', line)
            html_lines.append(f'<li>{line}</li>')
        else:
            if in_list:
                html_lines.append('</ul>')
                in_list = False
            html_lines.append(f'<p>{line}</p>' if line.strip() else '')

    if in_list:
        html_lines.append('</ul>')

    return '\n'.join(html_lines)

@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get("message")

    if not user_input:
        return jsonify({"error": "No message provided"}), 400

    if not is_relevant_to_travel(user_input):
        return jsonify({"reply": "Sorry, I can only help with travel and cultural information. Please ask something related to that."})

    # Add user message to the conversation history
    conversation_history.append({"role": "user", "parts": [user_input]})

    try:

        response = model.generate_content(conversation_history)
        reply = response.text

        # Convert markdown to HTML for frontend display
        reply = convert_markdown_to_html(reply)

        # Add bot reply to the conversation history
        conversation_history.append({"role": "model", "parts": [reply]})

        return jsonify({"reply": reply})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# In[50]:


from threading import Thread

def run_app():
    app.run(port=5000, debug=False, use_reloader=False)

thread = Thread(target=run_app)
thread.start()


# In[51]:


"""import requests
import json

response = requests.post("http://127.0.0.1:5000/chat", json={"message": "Hey! I'm going to Italy this summer."})
print(response.json()['reply'])"""

import requests

# Define the backend URL
url = "http://127.0.0.1:5000/chat"

# Create a function to simulate chat messages
def send_message(message):
    response = requests.post(url, json={"message": message})
    if response.status_code == 200:
        print("You:", message)
        print("Bot:", response.json()["reply"])
    else:
        print("Error:", response.json())

# Start the conversation
send_message("Hey! I'm going to Italy this summer.")
send_message("I love food and history. Any suggestions?")
send_message("What should I pack for July?")
send_message("Also... how safe is Rome for solo travelers?")
send_message("Finance status of guatemala")


# In[25]:


import requests

API_KEY = 'AIzaSyBgJ43FOAOCUMlMDxSLwejOLx6Z4Kd2aVo'  # replace with your actual API key
location = '28.6562,77.2410'  # Red Fort lat/lng
radius = 1500  # meters
type = 'restaurant'

url = f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={location}&radius={radius}&type={type}&key={API_KEY}"

response = requests.get(url)
places = response.json()

for i, place in enumerate(places['results'], start=1):
    print(f"{i}. {place['name']} - {place.get('vicinity', 'No address')}")


# In[16]:


get_ipython().system('pip install flask-cors')


# In[53]:


get_ipython().system('pip freeze > requirements.txt')


# In[ ]:




