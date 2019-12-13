'''
@Author: hua
@Date: 2019-12-13 09:23:14
@description: 入群邀请数据结构
@LastEditors: hua
@LastEditTime: 2019-12-13 09:40:14
'''
class Invite():
    action:str
    id:str

    def getAction(self):
        return self.action

    def setAction(self, action:str):
        self.action = action

    def getId(self):
        return self.id
    
    def setId(self, id:str):
        self.id = id