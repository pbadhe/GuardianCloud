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