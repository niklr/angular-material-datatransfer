mkdir download
cd download
fsutil file createnew sample_file_1.tmp 27078904
fsutil file createnew sample_file_2.tmp 12754944
fsutil file createnew sample_file_3.tmp 14436000
fsutil file createnew sample_file_4.tmp 25471000
cd ..
xcopy "download" "..\projects\amd-app\src\public\files" /s/h/e/k/f/c