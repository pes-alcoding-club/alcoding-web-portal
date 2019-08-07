from merge import SendMessage
import os
import datetime

__location__ = os.path.realpath(
    os.path.join(os.getcwd(), os.path.dirname(__file__)))


def forgotPasswordMail(emailid, username, link):
    body = open(os.path.join(__location__, "templates/forgotPassword.txt"), 'r').read()
    body = body.replace("{{username}}",username).replace("{{link}}",link)
    to = emailid
    sender = "alcodingclubportal@gmail.com"
    subject = "[The Alcoding Club] Password Reset"
    SendMessage(sender, to, subject, body, '')
    print(sender, to, ' at ', datetime.datetime.now(), "\n", sep = "\n")

def setPasswordMail(emailid, username, link):
    body = open(os.path.join(__location__, "templates/setPassword.txt"), 'r').read()
    body = body.replace("{{username}}",username).replace("{{link}}",link)
    to = emailid
    sender = "alcodingclubportal@gmail.com"
    subject = "[The Alcoding Club] Set Account Password"
    SendMessage(sender, to, subject, body, '')
    print(sender, to, ' at ', datetime.datetime.now(), "\n", sep = "\n")

if __name__ == '__main__':
    try:
        fin = open(os.path.join(__location__, 'emails.csv'), 'r')
        lines = fin.readlines()
    except IOError:
        print("Error: File open error" + IOError)
        exit()
    mailDispatcher = {'forgotPassword': forgotPasswordMail, 'setPassword': setPasswordMail}
    for line in lines:
        emailid, username, link, mailType = line.split(",")
        try:
            mailDispatcher[mailType](emailid, username, link)
        except KeyError:
            raise ValueError('invalid input emailType')
    fdel = open(os.path.join(__location__, 'emails.csv'), 'w')
    fdel.seek(0)
    fdel.truncate()
    
    
