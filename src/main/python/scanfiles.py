import os

path = "/mnt/c//Users/tuana9a/OneDrive/Documents/obsidian/movies"

for _, _, files in os.walk(path):
    for f in files:
        print(f.replace(".md", ""))
