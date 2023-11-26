import bcrypt

def encrypt(inputPassword):
    return bcrypt.hashpw(inputPassword.encode('utf-8'), bcrypt.gensalt(10)) 

def checkPassword(inputPassword, hashed):
    return bcrypt.checkpw(inputPassword.encode('utf-8'), hashed)