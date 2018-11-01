from merge import SendMessage
import os


def mail(emailid, username, link):
    body = open("forgotPassword.txt", 'r').read()
    body = body.replace("{{username}}",username).replace("{{link}}",link)
    to = emailid
    sender = "alcodingclubportal@gmail.com"
    subject = "[The Alcoding Club] Password Reset"
    SendMessage(sender, to, subject, body, '')
    print(sender, to, "\n", sep = "\n")


if __name__ == '__main__':
    try:
        fin = open("emails.csv", 'r')
        lines = fin.readlines()
    except IOError:
        print("Error: File open error")
        exit()

    for line in lines:
        emailid, username, link = line.split(",")
        mail(emailid, username, link)

    fdel = open("emails.csv", 'w')
    fdel.seek(0)
    fdel.truncate()
    
    
