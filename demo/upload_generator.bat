mkdir upload\folder_1\folder_1.1
mkdir upload\folder_1\folder_1.2
mkdir upload\folder_2\folder_2.1
cd upload\folder_1
fsutil file createnew sample_file_a_1.tmp 131793052
fsutil file createnew sample_file_a_2.tmp 165550000
cd folder_1.1
fsutil file createnew sample_file_b_1.tmp 144360000
fsutil file createnew sample_file_b_2.tmp 154710000
fsutil file createnew sample_file_b_3.tmp 111530000
cd ..
cd folder_1.2
fsutil file createnew sample_file_c_1.tmp 144360000
fsutil file createnew sample_file_c_2.tmp 154710000
fsutil file createnew sample_file_c_3.tmp 111530000
cd ..\..
cd folder_2\folder_2.1
fsutil file createnew sample_file_d_1.tmp 144360000
fsutil file createnew sample_file_d_2.tmp 154710000
fsutil file createnew sample_file_d_3.tmp 111530000
fsutil file createnew sample_file_d_4.tmp 96530000
