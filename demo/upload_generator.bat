mkdir upload\folder_1\folder_1.1
mkdir upload\folder_1\folder_1.2
mkdir upload\folder_2\folder_2.1
cd upload\folder_1
cd folder_1.1
fsutil file createnew sample_file_b_1.tmp 14436000
fsutil file createnew sample_file_b_2.tmp 15471000
fsutil file createnew sample_file_b_3.tmp 11153000
cd ..
cd folder_1.2
fsutil file createnew sample_file_c_1.tmp 14436000
fsutil file createnew sample_file_c_2.tmp 15471000
fsutil file createnew sample_file_c_3.tmp 11153000
fsutil file createnew sample_file_c_4.tmp 25113000
