from merge import SendMessage
import os
import datetime

__location__ = os.path.realpath(
    os.path.join(os.getcwd(), os.path.dirname(__file__)))


def mail(emailid, username, link):
    body = open(os.path.join(__location__, "forgotPassword.txt"), 'r').read()
    body = body.replace("{{username}}",username).replace("{{link}}",link)
    to = emailid
    sender = "alcodingclubportal@gmail.com"
    subject = "[The Alcoding Club] Password Reset"
    SendMessage(sender, to, subject, body, '')
    print(sender, to, ' at ', datetime.datetime.now(), "\n", sep = "\n")


if __name__ == '__main__':
    try:
        fin = open(os.path.join(__location__, 'emails.csv'), 'r')
        lines = fin.readlines()
    except IOError:
        print("Error: File open error" + IOError)
        exit()

    for line in lines:
        emailid, username, link = line.split(",")
        mail(emailid, username, link)
    fdel = open(os.path.join(__location__, 'emails.csv'), 'w')
    fdel.seek(0)
    fdel.truncate()
    
    
