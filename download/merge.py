number_of_threads = 32
name = "C:/Users/Tuana9a/Download/Auld_Lang_Syne_Instrumental.mp3"
fm = open(name, "w+")
fm.write("")
fm.close()
fm = open(name, "ab")
for i in range(0, number_of_threads):
    myfile = open(name+str(i), "rb")
    content = myfile.read()
    fm.write(content)

fm.close()
