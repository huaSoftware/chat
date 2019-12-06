### 
# @Author: hua
 # @Date: 2019-12-06 09:25:20
 # @description: 
 # @LastEditors: hua
 # @LastEditTime: 2019-12-06 09:37:23
 ###
yum install -y libffi-devel gcc gcc-dev openssl-dev readline zlib* libffi-devel;
wget https://www.python.org/ftp/python/3.7.3/Python-3.7.3.tar.xz;
tar -xvJf  Python-3.7.3.tar.xz;
cd Python-3.7.3;
./configure prefix=/usr/local/python3;
make && make install;
ln -s /usr/local/python3/bin/python3 /usr/bin/python3;
ln -s /usr/local/python3/bin/pip3 /usr/bin/pip3;
