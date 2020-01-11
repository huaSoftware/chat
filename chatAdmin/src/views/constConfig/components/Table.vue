<!--
 * @Author: hua
 * @Date: 2019-04-23 20:38:30
 * @LastEditors  : hua
 * @LastEditTime : 2020-01-11 14:34:38
 -->
<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="聊天内容类型" name="CHAT">
        <el-form  :model="data" label-width="80px">
          <el-form-item :label="data.CHAT.RECORD.text">
             <el-input type="text" v-model="data.CHAT.RECORD.value"></el-input>
          </el-form-item>
          <el-form-item :label="data.CHAT.TEXT.text">
             <el-input type="text" v-model="data.CHAT.TEXT.value"></el-input>
          </el-form-item>
          <el-form-item :label="data.CHAT.IMG.text">
             <el-input type="text" v-model="data.CHAT.IMG.value"></el-input>
          </el-form-item>
          <el-form-item :label="data.CHAT.FILE.text">
             <el-input type="text" v-model="data.CHAT.FILE.value"></el-input>
          </el-form-item>
          <el-form-item class="right">
            <el-button type="primary" @click.native="handleSubmit">立即修改</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="日志模式" name="LOG">
        <el-form  :model="data" label-width="80px">
          <el-form-item :label="data.LOG.NORMAL.text">
             <el-input type="text" v-model="data.LOG.NORMAL.value"></el-input>
          </el-form-item>
          <el-form-item :label="data.LOG.DEBUG.text">
             <el-input type="text" v-model="data.LOG.DEBUG.value"></el-input>
          </el-form-item>
          <el-form-item :label="data.LOG.WARN.text">
             <el-input type="text" v-model="data.LOG.WARN.value"></el-input>
          </el-form-item>
          <el-form-item :label="data.LOG.ERROR.text">
             <el-input type="text" v-model="data.LOG.ERROR.value"></el-input>
          </el-form-item>
          <el-form-item class="right">
            <el-button type="primary"  @click.native="handleSubmit">立即修改</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="房间类型" name="ROOM">
        <el-form  :model="data" label-width="80px">
          <el-form-item :label="data.ROOM.ALONE.text">
             <el-input type="text" v-model="data.ROOM.ALONE.value"></el-input>
          </el-form-item>
          <el-form-item :label="data.ROOM.GROUP.text">
             <el-input type="text" v-model="data.ROOM.GROUP.value"></el-input>
          </el-form-item>
          <el-form-item :label="data.ROOM.NOTIFY.text">
             <el-input type="text" v-model="data.ROOM.NOTIFY.value"></el-input>
          </el-form-item>
          <el-form-item class="right">
            <el-button type="primary"  @click.native="handleSubmit">立即修改</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="存储类型" name="SAVE">
        <el-form  :model="data" label-width="80px">
          <el-form-item :label="data.SAVE.LOCAL.text">
             <el-input type="text" v-model="data.SAVE.LOCAL.value"></el-input>
          </el-form-item>
          <el-form-item :label="data.SAVE.CLOUD.text">
             <el-input type="text" v-model="data.SAVE.CLOUD.value"></el-input>
          </el-form-item>
          <el-form-item class="right">
            <el-button type="primary"  @click.native="handleSubmit">立即修改</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="发送类型" name="STATUS">
        <el-form  :model="data" label-width="80px">
          <el-form-item :label="data.STATUS.LOADING.text">
             <el-input type="text" v-model="data.STATUS.LOADING.value"></el-input>
          </el-form-item>
          <el-form-item :label="data.STATUS.SUCCESS.text">
             <el-input type="text" v-model="data.STATUS.SUCCESS.value"></el-input>
          </el-form-item>
           <el-form-item :label="data.STATUS.FAIL.text">
             <el-input type="text" v-model="data.STATUS.FAIL.value"></el-input>
          </el-form-item>
           <el-form-item :label="data.STATUS.RESEND.text">
             <el-input type="text" v-model="data.STATUS.RESEND.value"></el-input>
          </el-form-item>
          <el-form-item class="right">
            <el-button type="primary"  @click.native="handleSubmit">立即修改</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="申请好友类型" name="ADDFRIEND">
         <el-form  :model="data" label-width="80px">
          <el-form-item :label="data.ADDFRIEND.APPLY.text">
             <el-input type="text" v-model="data.ADDFRIEND.APPLY.value"></el-input>
          </el-form-item>
          <el-form-item :label="data.ADDFRIEND.PASS.text">
             <el-input type="text" v-model="data.ADDFRIEND.PASS.value"></el-input>
          </el-form-item>
           <el-form-item :label="data.ADDFRIEND.REFUSE.text">
             <el-input type="text" v-model="data.ADDFRIEND.REFUSE.value"></el-input>
          </el-form-item>
          <el-form-item class="right">
            <el-button type="primary"  @click.native="handleSubmit">立即修改</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="编码类型" name="CODE">
        <el-form  :model="data" label-width="140px">
          <el-form-item :label="data.CODE.SUCCESS.text">
             <el-input type="text" v-model="data.CODE.SUCCESS.value"></el-input>
          </el-form-item>
          <el-form-item :label="data.CODE.BAD_REQUEST.text">
             <el-input type="text" v-model="data.CODE.BAD_REQUEST.value"></el-input>
          </el-form-item>
           <el-form-item :label="data.CODE.NOT_FOUND.text">
             <el-input type="text" v-model="data.CODE.NOT_FOUND.value"></el-input>
          </el-form-item>
          <el-form-item :label="data.CODE.ERROR.text">
             <el-input type="text" v-model="data.CODE.ERROR.value"></el-input>
          </el-form-item>
          <el-form-item :label="data.CODE.ERROR_AUTH_CHECK_TOKEN_FAIL.text">
             <el-input type="text" v-model="data.CODE.ERROR_AUTH_CHECK_TOKEN_FAIL.value"></el-input>
          </el-form-item>
           <el-form-item :label="data.CODE.ERROR_AUTH_CHECK_TOKEN_TIMEOUT.text">
             <el-input type="text" v-model="data.CODE.ERROR_AUTH_CHECK_TOKEN_TIMEOUT.value"></el-input>
          </el-form-item>
          <el-form-item :label="data.CODE.ERROR_AUTH_TOKEN.text">
             <el-input type="text" v-model="data.CODE.ERROR_AUTH_TOKEN.value"></el-input>
          </el-form-item>
          <el-form-item :label="data.CODE.ERROR_AUTH.text">
             <el-input type="text" v-model="data.CODE.ERROR_AUTH.value"></el-input>
          </el-form-item>
           <el-form-item :label="data.CODE.ROOM_NO_EXIST.text">
             <el-input type="text" v-model="data.CODE.ROOM_NO_EXIST.value"></el-input>
          </el-form-item>
          <el-form-item class="right">
            <el-button type="primary"  @click.native="handleSubmit">立即修改</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="时间类型" name="TIME">
        <el-form  :model="data" label-width="80px">
          <el-form-item :label="data.TIME.TIME_OUT.text">
            <el-input type="text" v-model="data.TIME.TIME_OUT.value">
              <template slot="append">微妙</template>
            </el-input>
          </el-form-item>
          <el-form-item class="right">
            <el-button type="primary"  @click.native="handleSubmit">立即修改</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import { configConstJson, configConstJsonEdit} from "@/api/config";
import {parseTime} from "@/utils/index"
export default {
  data() {
    return {
      activeName:'CHAT',
      data:{
        "CHAT":{
            "RECORD":{
                "text":"录音",
                "value": 0
            },
            "TEXT":{
                "text":"文字",
                "value": 1
            },
            "IMG":{
                "text":"图片",
                "value": 2
            },
            "FILE":{
                "text":"文件",
                "value": 3
            }
        },
        "LOG":{
            "NORMAL":{
                "text":"普通日志",
                "value": 0
            },
            "DEBUG":{
                "text":"调试日志",
                "value": 1
            },
            "WARN":{
                "text":"警告日志",
                "value": 2
            },
            "ERROR":{
                "text":"错误日志",
                "value": 3
            }
        },
        "ROOM":{
            "ALONE":{
                "text":"单聊",
                "value": 0
            },
            "GROUP":{
                "text":"群聊",
                "value": 1
            },
            "NOTIFY":{
                "text":"通知",
                "value": 2
            }
        },
        "SAVE":{
            "LOCAL":{
                "text":"本地存储",
                "value": 0
            },
            "CLOUD":{
                "text":"远端存储",
                "value": 1
            }
        },
        "STATUS":{
            "LOADING":{
                "text":"发送中",
                "value": 0
            },
            "SUCCESS":{
                "text":"发送成功",
                "value": 1
            },
            "FAIL":{
                "text":"发送失败",
                "value": 2
            },
            "RESEND":{
                "text":"重新发送",
                "value": 3
            }
        },
        "ADDFRIEND":{
            "APPLY":{
              "text":"申请",
              "value": 0
            },
            "PASS":{
              "text":"通过",
              "value": 1
            },
            "REFUSE":{
              "text":"拒绝",
              "value": 2
            }
        },
        "CODE":{
            "SUCCESS":{
                "text":"成功",
                "value": 200
            },
            "BAD_REQUEST":{
                "text":"错误请求(客户端)",
                "value": 400
            },
            "NOT_FOUND":{
                "text":"未找到路由",
                "value": 404
            },
            "ERROR":{
                "text":"服务器错误",
                "value": 500
            },
            "ERROR_AUTH_CHECK_TOKEN_FAIL":{
                "text":"权限验证令牌失败",
                "value": 10001
            },
            "ERROR_AUTH_CHECK_TOKEN_TIMEOUT":{
                "text":"权限验证令牌超时",
                "value": 10002
            },
            "ERROR_AUTH_TOKEN":{
                "text":"权限验证令牌错误",
                "value": 10003
            },
            "ERROR_AUTH":{
                "text":"权限验证错误",
                "value": 10004
            },
            "ROOM_NO_EXIST":{
                "text":"房间不存在",
                "value": 20000
            }
        },
        "TIME":{
            "TIME_OUT":{
              "text":"超时时间",
              "value":15000
            }
        }
      }
    };
  },
  components: {
  },
  methods: {
    handleClick(tab, event) {
     /*  console.log(tab, event); */
    },
    handleSubmit(){
      configConstJsonEdit(this.data).then(res=>{
        this.$message({
          message: '修改成功',
          type: 'success'
        })
      })
    },
    getConstConfig(){
      configConstJson().then(res=>{
        this.data = res.data
      })
    }
  },
  created: function() {
    this.getConstConfig()
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>


table i {
  color: #409eff;
  margin-left: 10px;
  cursor: pointer;
}
.right{
 display:flex;
 justify-content:flex-end;
 width:100%;
}
</style>
