'''
@Author: hua
@Date: 2019-02-10 09:55:10
@LastEditors: hua
@LastEditTime: 2019-11-07 21:56:13
'''
import cerberus

class CustomErrorHandler(cerberus.errors.BasicErrorHandler):
    def __init__(self, tree=None, custom_messages=None):
        super(CustomErrorHandler, self).__init__(tree)
        self.custom_messages = custom_messages or {}

    def format_message(self, field, error):
        tmp = self.custom_messages
        for x in error.schema_path:
            try:
                tmp = tmp[x]
            except KeyError:
                new = super(CustomErrorHandler, self)
                return new.format_message(field, error)
        if isinstance(tmp, dict):  # if "unknown field"
            new = super(CustomErrorHandler, self)
            return new.format_message(field, error)
        else:
            return tmp

