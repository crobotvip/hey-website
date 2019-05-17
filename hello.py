import requests
#import urllib.request


#from urllib3 import request
import urllib3

page = 1401
startPage = 1400

http = urllib3.PoolManager()

def getPicture(page):
    pic_num = 1
    url_pic_num =1
    all_num = page - startPage
    for i in range(startPage,page):
        print("\r rage:{:}%".format((i-startPage)*100/all_num))
        while True:
            url = "http://img1.mm131.me/pic/"+str(i)+"/"+str(url_pic_num)+".jpg"
            url ="http://img.51miz.com/Photo/2017/03/27/14/P221692_3f0c82bbcf579253d1218b5310969a0e.jpeg"
            headers = {
            'Upgrade-Insecure-Requests':'1',
            'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36Name',
            "Referer": "http://www.mm131.com/"
            }


            print(url)
            try:

                response = http.request('get',url,headers=headers)
                res=response.data
                if response.status!=200:
                    url_pic_num = 1
                    break

                #print(res.decode())
                #change path
                path = "/Users/luopeng/Desktop/code/hey-website/beauty/" +str(i)+ str(pic_num) + ".jpg"
                with open(path, 'wb') as f:
                    f.write(res)
                    f.close()
                pic_num += 1
                url_pic_num += 1
            except:
                url_pic_num = 1
                print("error")
                break
def main():
   print("xxxxxx")
   getPicture(page)
if __name__ == '__main__':
   main()