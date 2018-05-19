#!/usr/bin/python3

import os

diR = os.getcwd()

for filename in os.listdir(diR):
       infilename = os.path.join(diR,filename)
       if not os.path.isfile(infilename): continue
       oldbase = os.path.splitext(filename)
       newname = infilename.replace('.html', '.ejs')
       output = os.rename(infilename, newname)
