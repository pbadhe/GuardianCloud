import os
from flask import Flask, Response, request, jsonify, render_template
from flask_cors import CORS 
from google.cloud import storage


app = Flask(__name__)
CORS(app)
    
# Initialize env var for service account authentication
#os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "/tmp/GOOGLE_APPLICATION_CREDENTIALS"
storage_client = storage.Client()

# Default bucket name
DEFAULT_BUCKET_NAME = "guardiancloud"

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return 'No file part'
    file = request.files['file']

    if file.filename == '':
        return 'No selected file'

    bucket_name = DEFAULT_BUCKET_NAME
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(file.filename)

    blob.upload_from_string(file.read())

    return 'File uploaded successfully'

@app.route('/download/<filename>')
def download_file(filename):
    bucket_name = DEFAULT_BUCKET_NAME
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(filename)

    if blob.exists():
        file_contents = blob.download_as_bytes()
        response = Response(file_contents, content_type='application/octet-stream')
        response.headers['Content-Disposition'] = f'attachment; filename={filename}'
        return response
    else:
        return 'File not found'


@app.route('/',methods=['GET', 'POST'])
def ssd():
    return render_template("index.html")

port = int(os.environ.get('PORT', 8080))
if __name__ == '__main__':
    app.run(threaded=True, host='0.0.0.0', port=int(os.environ.get("PORT", 5000)))
