import os, constants
from flask import Flask, Response, request, jsonify, render_template
from flask_cors import CORS 
from firebase_admin import credentials, firestore, initialize_app
from google.cloud import storage
from login import login, userExists, createUser

app = Flask(__name__)
CORS(app)

# Local Testing: Initialize env var for service account authentication, else comment it
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = constants.GOOGLE_APP_CREDENTIALS
storage_client = storage.Client()

# Local Testing: Initialize firebase db authentication for local testing, else simply initialize_app()
cred = credentials.Certificate(constants.FIRESTORE_CREDENTIALS)
default_app = initialize_app(cred)

db = firestore.client()

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return 'No file part'
    file = request.files['file']

    if file.filename == '':
        return 'No selected file'

    bucket_name = constants.DEFAULT_BUCKET_NAME
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(file.filename)

    blob.upload_from_string(file.read())

    return 'File uploaded successfully'

@app.route('/download/<filename>')
def download_file(filename):
    bucket_name = constants.DEFAULT_BUCKET_NAME
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(filename)

    if blob.exists():
        file_contents = blob.download_as_bytes()
        response = Response(file_contents, content_type='application/octet-stream')
        response.headers['Content-Disposition'] = f'attachment; filename={filename}'
        return response
    else:
        return 'File not found'

@app.route('/login',methods=['GET', 'POST'])
def login1():
    if request.method == 'POST':
        # {"request":"login", "username": "clark", "password": "clark" }
        if request.json['request'] == 'login':
            return login(db, request.json)
        
        # {"request":"ifexists", "username": "clark" }
        if request.json['request'] == 'ifexists':
            return jsonify({"User Exists": userExists(db, request.json["username"])}), 200
        
        # {"request":"signup", "name": "Clark Kent", "email": "clark@kent.com", "username": "clark", "password": "clark"}
        if request.json['request'] == 'signup':
            return createUser(db, request.json)


@app.route('/',methods=['GET', 'POST'])
def ssd():
    return render_template("index.html")

port = int(os.environ.get('PORT', 8080))
if __name__ == '__main__':
    app.run(threaded=True, host='0.0.0.0', port=int(os.environ.get("PORT", 5000)))
