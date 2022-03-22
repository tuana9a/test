import json
import paramiko
import threading

hosts = json.load(open("config.json"))["hosts"]

mongo_hosts = map(lambda h: h + ':27017', hosts)
id_rsa_pub = open('id_rsa.pub', 'r').read()
username = "root"
password = ""

commands = [
    # ================= TEMP =======================
    # "sudo poweroff",
    # "source env/bin/activate",
    "netstat -n | grep 27017 | wc -l",

    # ================= MONGODB MONITOR =====================
    # "sudo systemctl status mongod",
    # "sudo systemctl start mongod",
    # "sudo systemctl restart mongod",
    # "sudo systemctl stop mongod",

    # "sudo docker-compose down",
    # "bash rm-old-volume.sh",
    # "docker-compose up -d",

    # "sudo docker ps -a",

    # "sudo docker-compose -f docker-compose.v4.0.yml down",
    # "sudo docker-compose -f docker-compose.v4.0.yml up -d",

    # "sudo docker-compose -f docker-compose.v4.2.yml down",
    # "sudo docker-compose -f docker-compose.v4.2.yml up -d",

    # "sudo docker-compose -f docker-compose.v4.4.yml down",
    # "sudo docker-compose -f docker-compose.v4.4.yml up -d",

    # "sudo docker-compose -f docker-compose.v5.0.yml down",
    # "sudo docker-compose -f docker-compose.v5.0.yml up -d",

    # f"mongodump --uri=\"mongodb://{','.join(mongo_hosts)}/?replicaSet=rs0\" -u admin -p admin",
    # f"mongodump --uri=\"mongodb://admin:admin@{','.join(mongo_hosts)}/?replicaSet=rs0\"",
]


def task(hostname='localhost'):

    client = paramiko.SSHClient()
    # add to known hosts
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(hostname=hostname, username=username, password=password)
        # execute the commands
        for command in commands:
            # print("COMMAND: ", command)
            stdin, stdout, stderr = client.exec_command(command)
            print(f"{hostname}: {stdout.read().decode()}")
            # print(f"{hostname}: {stderr.read().decode()}")
    except:
        print(f"[!] Error: {hostname}")
        return


def main():
    for hostname in hosts:
        threading.Thread(target=task, args=(hostname,)).start()


if __name__ == '__main__':
    main()
