import datetime, math, random, os, constants, uuid
from flask import Flask, Response, request, jsonify, render_template, send_file
from flask_cors import CORS 
from firebase_admin import credentials, firestore, initialize_app
from google.cloud import storage
from login import login, userExists, createUser,get_user_details
from notify import sendEmail
from google.cloud.exceptions import NotFound

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


@app.route('/createfolder', methods=['POST'])
def createfolder():
    if request.method == 'POST':
        # {
        #   "username": "clark", 
        #   "filepath": "/create/newfolder/" 
        # }

        if (username:= request.json.get('username', '')) == '':
            return 'Username not found', 400
        
        if (filepath:= request.json.get('filepath', '')) == '':
            return 'Incorrect path or filename', 400
        
        filepath = filepath if filepath.endswith("/") else filepath + "/"

        try:
            blob = bucket.blob(username + filepath)
            blob.upload_from_string("")
            return "Folder created successfully", 200
        except:
            return "Error! Check the passed username and filepath", 404
    else:
        return 'POST request expected', 400


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
            return "Error occured"+str(e), 400

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
        predirectory = request.json['username']+request.json['filepath']
        try:
            blobs = storage_client.list_blobs(
            constants.DEFAULT_BUCKET_NAME, 
            prefix=predirectory, 
            delimiter="/")  # "/" delim is used to return hierarchy of pwd
        except:
            return "Error! Check the passed username and filepath", 404

        files = []
        folders = []
        for blob in blobs:
            if blob.name != predirectory:
                files.append(blob.name.split("/")[-1])

        for prefix in blobs.prefixes:
            folders.append(str(prefix).split("/")[-2])
        
        return jsonify({"files":files, "folders":folders}), 200

def get_signed_url(blob):
    return blob.generate_signed_url(
                version="v4",
                expiration=datetime.datetime.utcnow() + datetime.timedelta(seconds=120),
                method="GET"
            )


@app.route('/download', methods=['POST'])
def download_file():
    if request.method == 'POST':
        # {
        #   "request": "getfileurl"
        #   "username": "clark", 
        #   "filepath": "/newtest/bread.jpg" 
        # }
        # Generates a temporary signed URL for downloading a file.
        blob = bucket.blob(str(request.json.get('username') + request.json.get('filepath')))
        if request.json['request'] == 'getfileurl':
            try:
                url = get_signed_url(blob)
            except Exception as e:
                print(e)
            return jsonify({"fileurl": url}), 200
        
        # {
        #   "request": "downloadfile"
        #   "username": "clark", 
        #   "filepath": "/newtest/bread.jpg" 
        # }
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


@app.route('/share', methods=['POST'])
def share_file_with():
    '''Return a shareble URL without confidential details'''
    if request.method == 'POST':
        # {
        #   "useremail": "bruce@wayne.com", 
        #   "owner": "clark",
        #   "filepath": "/newtest/bread.jpg" 
        # }
        absfilepath = request.json['owner'] + request.json['filepath']  
        temp_suffix = str(uuid.uuid4())[:8]
        email = request.json['useremail']
        try:
            db.collection(u'Sharedfiles').document(temp_suffix).set(
                {"useremail": email, "absfilepath": absfilepath}
            )
        except Exception as e:
            return f"Exception occured, {str(e)}", 400
        
        return jsonify({"shareable_url":constants.GCLOUD_BASE_URL + temp_suffix}), 200  #shareable URL
        
    else:
        return "POST request expeceted", 400
    

def generateOTP():
    digits = "0123456789"
    OTP = ""
    for _ in range(4):
        OTP += digits[math.floor(random.random() * 10)]
    return OTP


@app.route('/getfileaccess', methods=['POST'])
def getfileaccess():
    '''Returns a temporary URL & an email OTP to be verified'''
    if request.method == 'POST':
        # {
        #   "useremail": "bruce@wayne.com", 
        #   "shareable_url": "https://guardiancloud-jt5nilkupq-uc.a.run.app/12c34066" 
        # }
        temp_suffix = request.json['shareable_url'].split("/")[-1] 
        otp = generateOTP()

        try:
            shareddoc = db.collection(u'Sharedfiles').document(temp_suffix).get().to_dict()
            
            if shareddoc:
                if shareddoc["useremail"] != request.json['useremail']:
                    return jsonify({"message":"You don't have access to this file"}), 401
                
                sendEmail(shareddoc["useremail"], otp)
                blob = bucket.blob(shareddoc["absfilepath"])
                signedurl = get_signed_url(blob)

                return jsonify({"temporary_signed_url": signedurl, "otp": str(otp)}), 200
            else:
                return jsonify({"message":f"Link Not Found, {request.json['shareable_url']}"}), 404

        except Exception as e:
            return f"Exception occured, {str(e)}", 400
        
    else:
        return "POST request expeceted", 400


@app.route('/revokefileaccess', methods=['POST'])
def revokefileaccess():
    if request.method == 'POST':
        # {
        #   "username": "clark", 
        #   "filepath": "/newtest/bread.jpg" 
        # }
         
        absfilepath =  request.json['username'] + request.json['filepath']  
        
        try:
            docs = db.collection('Sharedfiles').where('absfilepath', '==', absfilepath).stream()

            docs_count = 0
            for doc in docs:
                docs_count += 1
                doc.reference.delete()
            
            if docs_count == 0:
                return jsonify({"message":f"File sharing is off for {request.json['filepath'] }"}), 200

            return jsonify({"message":f"File access revoked successfully"}), 200
        except Exception as e:
            return f"Exception occured, {str(e)}", 400


@app.route('/getuserdetails', methods=['POST'])
def getuserdetails():
    return get_user_details(db,request)


@app.route('/deletefile', methods=['POST'])
def delete_file_or_folder():
    if request.method == 'POST':
        # Expects a JSON payload with username and filepath
        # {
        #   "username": "clark", 
        #   "filepath": "/newtest/bread.jpg"
        # }

        try:
            full_path = str(request.json.get('username') + request.json.get('filepath'))
            blob = bucket.blob(full_path)
            if not blob.exists():
                return 'File or folder not found', 404
            blob.delete()

            return 'File or folder deleted successfully', 200

        except NotFound:
            return 'File or folder not found', 404
    else:
        return 'POST request expected', 400


@app.route('/deletefolder', methods=['POST'])
def deletefilesrecursive():
    if request.method == 'POST':
        # {
        #   "username": "clark", 
        #   "filepath": "/newtest/" 
        # }
        pfix = request.json['username']+request.json['filepath']
        try:
            blobs = storage_client.list_blobs(
            constants.DEFAULT_BUCKET_NAME, 
            prefix=pfix)
            bucket.delete_blobs(list(blobs))
        except:
            return "Error! Check the passed username and filepath", 404
            
    return "Deletion successful", 200 


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
