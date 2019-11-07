'''
@Author: hua
@Date: 2019-04-17 13:46:21
@LastEditors: hua
@LastEditTime: 2019-11-07 21:34:39
'''
from PIL import Image, ImageFont, ImageDraw, ImageFilter
import random, os



def getRandomColor():
    '''获取一个随机颜色(r,g,b)格式的'''
    c1 = random.randint(0,255)
    c2 = random.randint(0,255)
    c3 = random.randint(0,255)
    return (c1,c2,c3)
    
def validate_picture():
    total = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ012345789'
    # 图片大小130 x 50
    width = 130
    height = 50
    # 先生成一个新图片对象
    im = Image.new('RGB',(width, height), (255,255,255))
    # 设置字体
    font = ImageFont.truetype(os.getcwd()+'/app/Vendor/font/arial.ttf', 36)
    # 创建draw对象
    draw = ImageDraw.Draw(im)
    str = ''
    # 输出每一个文字
    for item in range(5):
        text = random.choice(total)
        str += text
        draw.text((5+random.randint(4,7)+20*item,5+random.randint(3,7)), text=text, fill=getRandomColor(),font=font )

    # 划几根干扰线
    for num in range(4):
        x1 = random.randint(0, int(width/2))
        y1 = random.randint(0, int(height/2))
        x2 = random.randint(0, width)
        y2 = random.randint(int(height/2), height)
        draw.line(((x1, y1),(x2,y2)), fill=getRandomColor(), width=1)
        
    # 画点
    for i in range(20):
        draw.point([random.randint(0, width), random.randint(0, height)], fill=getRandomColor())
        x = random.randint(0, width)
        y = random.randint(0, height)
        draw.arc((x, y, x + 4, y + 4), 0, 90, fill=getRandomColor())

    # 锐化。锐化滤波
    im = im.filter(ImageFilter.SHARPEN)
    return im, str
