import smtplib
from email.mime.text import MIMEText

def sendEmail(destEmail, otp):
    subject = "GuardianCloud: One-Time Password"
    body = f"Use one-time password {otp} to access the file."
    sender = "guardiancloud123@gmail.com"
    app_password = "xqdi mbtl dney rpwt"
    send_email(subject, body, sender, destEmail, app_password)


def send_email(subject, body, sender, recipient, password):
    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = sender
    msg['To'] = recipient
    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp_server:
       print(msg.as_string())
       smtp_server.login(sender, password)
       smtp_server.sendmail(sender, recipient, msg.as_string())
    return "Message sent!"