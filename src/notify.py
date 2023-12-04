import smtplib, ssl

def sendEmail(destEmail, otp):
#     Format for message =>
    message = f"""\
Subject: GuardianCloud: One-Time Password

Use one-time password {otp} to access the file.

This message is sent by GuardianCloud."""
    try:
        port = 587  # For SSL
        password ='guardiancloud=$'
        smtp_server="smtp-mail.outlook.com"
        sender_email="curensure@hotmail.com"
        
        context = ssl.create_default_context()
        with smtplib.SMTP(smtp_server, port) as server:
            server.starttls(context=context)
            server.login(sender_email, password)
            context = ssl.create_default_context()
            server.sendmail(sender_email, destEmail, message)
    except Exception as e: 
        return f'Exception {e} occured while sending the email', 401