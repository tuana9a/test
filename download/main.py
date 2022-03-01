import requests
import threading


def handler(start, end, url, filename, number):
    headers = {'Range': 'bytes=%d-%d' % (start, end)}

    r = requests.get(url, headers=headers, stream=True)

    with open(filename+str(number), "wb") as fp:
        fp.write(r.content)

    print("Downloaded "+str(number) + " /32")


url_of_file = "https://chiaseacc.com/music/Auld_Lang_Syne_Instrumental.mp3"
number_of_threads = 32
name = "C:/Users/Tuana9a/Download/Temp/1.mp3"


def download(url_of_file, name, number_of_threads):
    r = requests.head(url_of_file)
    if name:
        file_name = name
    else:
        file_name = url_of_file.split('/')[-1]
    try:
        file_size = int(r.headers['content-length'])
    except:
        print("Invalid URL")
        return

    part = int(file_size) / number_of_threads
    fp = open(file_name, "w")
    fp.write('\0' * file_size)
    fp.close()

    for i in range(number_of_threads):
        start = part * i
        end = start + part

        # create a Thread with start and end locations
        opts = {'start': start, 'end': end,
                'url': url_of_file, 'filename': file_name,
                'number': i}

        t = threading.Thread(target=handler,
                             kwargs=opts)
        t.setDaemon(True)
        t.start()

    main_thread = threading.current_thread()
    for t in threading.enumerate():
        if t is main_thread:
            continue
        t.join()

    print
    '%s downloaded' % file_name


download(url_of_file, name, number_of_threads)


'''
url = "https://chiaseacc.com/music/Auld_Lang_Syne_Instrumental.mp3"
r = requests.get(url, stream=True)

print(r.headers['content-length'])
'''
