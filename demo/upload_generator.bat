mkdir upload\folder_1\folder_1.1
mkdir upload\folder_1\folder_1.2
mkdir upload\folder_2\folder_2.1
cd upload\folder_1
cd folder_1.1
fsutil file createnew sample_file_b_1.tmp 1443600
fsutil file createnew sample_file_b_2.tmp 1547100
fsutil file createnew sample_file_b_3.tmp 1115300
cd ..
cd folder_1.2
fsutil file createnew sample_file_c_1.tmp 1443600
fsutil file createnew sample_file_c_2.tmp 1547100
fsutil file createnew sample_file_c_3.tmp 1115300
fsutil file createnew sample_file_c_4.tmp 2511300
