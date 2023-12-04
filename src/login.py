from flask import jsonify
import cryptify


def login(db, requestDict):
    login_input_username = requestDict['username']
    login_input_password = requestDict['password']
    try:
        for doc in db.collection('Login').stream():
            if login_input_username == doc.to_dict()['username']:
                dbHashedPw = doc.to_dict()['password']
                if cryptify.checkPassword(login_input_password, dbHashedPw):
                    return jsonify({"success": True, "message": "Login successful"}), 200
                else:
                    return jsonify({"success": False, "message": "Invalid Password"}), 401

        return jsonify({"Login_Success": "Invalid Username"}), 401
    except Exception as e:
        return jsonify(f'Internal application error',e), 401


def createUser(db, requestDict):
    requestDict.pop("request")
    login_username = requestDict.pop("username")

    if not userExists(db, login_username):
        hashedPw = cryptify.encrypt(requestDict.pop("password"))
        try:
            db.collection(u'Login').document(login_username).set(
                {"username": login_username, "password": hashedPw, "name": requestDict["name"], "email": requestDict["email"]}
            )
            return jsonify({"success": True, "message":"Signup successful"}), 200
        except Exception as e:
            return  f"An Error Occurred While Creating User : {e}", 401
    else:
        return jsonify({"success": False, "message":"Already Exists"}), 401


def userExists(db, login_username):
    for doc in db.collection('Login').stream():
        if login_username == doc.to_dict().get('username', None):
            return True
    return False


def get_user_details(db,request):
    if request.method == 'POST':
        # Assuming you are passing the username in the request body
        username = request.json.get('username', '')

        if not username:
            return jsonify({"success": False, "message": "Username not provided"}), 400

        user_details = get_user_details_from_db(db,username)

        if user_details:
            return jsonify({"success": True, "user_details": user_details}), 200
        else:
            return jsonify({"success": False, "message": "User not found"}), 404
    else:
        return jsonify({"success": False, "message": "POST request expected"}), 400

def get_user_details_from_db(db,username):
    # Assuming 'Login' is the collection in Firestore where user data is stored
    user_ref = db.collection('Login').document(username)
    user_data = user_ref.get()

    if user_data.exists:
        user_details = {
            "username": user_data.get("username"),
            "email": user_data.get("email")
        }
        return user_details
    else:
        return None
