import datetime
import os, constants
from flask import Flask, Response, request, jsonify, render_template, send_file
from flask_cors import CORS 
from firebase_admin import credentials, firestore, initialize_app
from google.cloud import storage
from login import login, userExists, createUser

app = Flask(__name__)
CORS(app)

# Local Testing: Initialize env var for service account authentication, else comment it
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = constants.GOOGLE_APP_CREDENTIALS
storage_client = storage.Client()
bucket = storage_client.bucket(constants.DEFAULT_BUCKET_NAME)

# Local Testing: Initialize firebase db authentication for local testing, else simply initialize_app()
cred = credentials.Certificate(constants.FIRESTORE_CREDENTIALS)
default_app = initialize_app(cred)

db = firestore.client()


@app.route('/upload', methods=['POST'])
def upload_file():
    if request.method == 'POST':
        # Requires "Content-Type: multipart/form-data" in header
        # Must have filename as a key in the pair having a file value
        # Key-value pairs: 
        #   "username": "clark",
        #   "{filename_string}": {file},
        #   "filepath": "/newtest/bread.jpg"

        if (username:= request.form.get('username', '')) == '':
            return 'Username not found', 400
        
        if (filepath:= request.form.get('filepath', '')) == '':
            return 'Incorrect path or filename', 400
        
        if (filename:= filepath.split("/")[-1]) not in request.files:
            return 'File not found in the body', 400
        
        file = request.files.get(filename)
        try:
            blob = bucket.blob(str(username + filepath))
            blob.upload_from_string(file.read())
        except Exception as e:
            print(e)

        return 'File uploaded successfully', 200
    else:
        return 'POST request expected', 400

@app.route('/list', methods=['POST'])
def downloadfiles():
    if request.method == 'POST':
        # {
        #   "username": "clark", 
        #   "filepath": "/newtest/" 
        # }
        try:
            blobs = storage_client.list_blobs(
            constants.DEFAULT_BUCKET_NAME, 
            prefix=request.json['username']+request.json['filepath'], 
            delimiter="/")  # "/" delim is used to return hierarchy of pwd
        except:
            return "Error! Check the passed username and filepath", 404

        files = []
        folders = []
        for blob in blobs:
            files.append(blob.name.split("/")[-1])

        for prefix in blobs.prefixes:
            folders.append(str(prefix).split("/")[-2])
        
        return jsonify({"files":files, "folders":folders}), 200
        

@app.route('/download', methods=['POST'])
def download_file():
    if request.method == 'POST':
        blob = bucket.blob(str(request.json.get('username') + request.json.get('filepath')))

        # {
        #   "request": "getfileurl"
        #   "username": "clark", 
        #   "filepath": "/newtest/bread.jpg" 
        # }
        # Generates a temporary signed URL for downloading a file.
        if request.json['request'] == 'getfileurl':
            url = blob.generate_signed_url(
                version="v4",
                expiration=datetime.timedelta(minutes=15),
                method="GET",
            )
            return jsonify({"fileurl": url}), 200
        
        # {
        #   "request": "downloadfile"
        #   "username": "clark", 
        #   "filepath": "/newtest/bread.jpg" 
        # }
        # TODO download as octet-stream or just give bytedata? 
        if request.json['request'] == 'downloadfile':
            if blob.exists():
                file_contents = blob.download_as_bytes()
                response = Response(file_contents, content_type='application/octet-stream')
                response.headers['Content-Disposition'] = f'attachment;'\
                    f'filename={request.json["filepath"].split("/")[-1]}'
                return response
            else:
                return 'File not found', 404


@app.route('/login', methods=['GET', 'POST'])
def login1():
    if request.method == 'POST':
        # {
        #   "request": "login", 
        #   "username": "clark", 
        #   "password": "clark" 
        # }
        if request.json['request'] == 'login':
            return login(db, request.json)
        
        # {
        #   "request": "ifexists", 
        #   "username": "clark" 
        # }
        if request.json['request'] == 'ifexists':
            return jsonify({"User Exists": userExists(db, request.json["username"])}), 200
        
        # {
        #   "request": "signup", 
        #   "name": "Clark Kent", 
        #   "email": "clark@kent.com", 
        #   "username": "clark", 
        #   "password": "clark"
        # }
        if request.json['request'] == 'signup':
            return createUser(db, request.json)


@app.route('/',methods=['GET', 'POST'])
def ssd():
    return render_template("index.html")

port = int(os.environ.get('PORT', 8080))
if __name__ == '__main__':
    app.run(
        threaded=True, 
        debug=True, 
        host='0.0.0.0', 
        port=int(os.environ.get("PORT", 5000)), 
        ssl_context="adhoc"
    )
