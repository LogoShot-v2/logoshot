print("#!/bin/sh")
for i in range(20,25):
	print("wget -c -m --ftp-user=anonymous --ftp-password=raccoon@gmail.com ftp://s220ftp.tipo.gov.tw/TrademarkRegXMLB_0380"+str(i))
for i in range(39,46):
	for j in range(1,25):
	        print("wget -c -m --ftp-user=anonymous --ftp-password=raccoon@gmail.com ftp://s220ftp.tipo.gov.tw/TrademarkRegXMLB_0",i,"0"+str(format(j,'02d')),sep='')

