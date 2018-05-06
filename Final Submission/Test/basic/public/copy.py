#!/usr/bin/python

import os
import shutil

fullpath = os.path.join
python_directory = "./views"
start_directory = os.getcwd()
text_files = "./txt"


def main():
    for dirname, dirnames, filenames in os.walk(start_directory):
        for filename in filenames:
            source = fullpath(dirname, filename)
            if filename.endswith("ejs"):
               shutil.move(source, fullpath(python_directory, filename))
            elif filename.endswith("txt"):
                shutil.move(source, fullpath(text_files, filename))

if __name__ == "__main__":
    main()
