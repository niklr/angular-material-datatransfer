mkdir download
cd download
fsutil file createnew sample_file_1.tmp 27078904
fsutil file createnew sample_file_2.tmp 12754944
fsutil file createnew sample_file_3.tmp 144360000
fsutil file createnew sample_file_4.tmp 254710000
cd ..
xcopy "download" "..\src\public\files" /s/h/e/k/f/c