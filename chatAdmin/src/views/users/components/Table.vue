<!--
 * @Author: hua
 * @Date: 2019-04-23 20:38:30
 * @LastEditors: hua
 * @LastEditTime: 2020-08-16 13:32:45
 -->
<template>
  <div class="app-container">
    <el-table
      key="tableKey"
      v-loading="listLoading"
      :data="list"
      fit
      highlight-current-row
      style="width: 100%;border: 1px solid #ebeef5;"
      @sort-change="handleSort"
    >
      <el-table-column label="ID" prop="id" sortable align="center" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户昵称" prop="nick_name" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.nick_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="头像" prop="head_img" sortable height="50px" align="center">
        <template slot-scope="scope">
          <span>
            <Vimg style="width:50px;height:50px" :img-url="scope.row.head_img" />
          </span>
        </template>
      </el-table-column>
      <el-table-column label="首字母" prop="first_word" sortable align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.first_word }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" prop="email" sortable align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="created_at" class-name="status-col" sortable>
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.created_at) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" prop="updated_at" class-name="status-col" sortable>
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updated_at) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" plain @click="move(scope.row.id)">删除</el-button>
          <!-- <el-button size="mini" type="primary" plain @click="send(scope.row.id)">聊天</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page_no"
      :limit.sync="listQuery.per_page"
      @pagination="getList"
    />
    <el-dialog
      title="管理员发起会话 "
      :visible.sync="addReqVisible"
      :close-on-click-modal="false"
      width="500px"
    >
      <div>
        <el-form>
          <chat-item :msg-list="msgList" :user_id="user_id" />
          <el-form-item label="回复内容">
            <el-input v-model="content" type="textarea" @blur="handleOnblur" @focus="handleOnFocus" />
          </el-form-item>
          <el-form-item>
            <el-button size="mini" @click="addReqVisible = false">取消</el-button>
            <el-button
              size="mini"
              type="danger"
              plain
              @mousedown.native="record()"
              @mouseup.native="recordStop()"
            >录音</el-button>
            <el-button size="mini" type="primary" @click="addReq()">确定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { mapGetters, mapMutations } from 'vuex'
import Vimg from '@/components/Vimg'
import { getToken } from '@/utils/auth'
import { userList, userDelete } from '@/api/user'
import { parseTime } from '@/utils/index'
import { roomList, msgGet } from '@/api/room'
import ChatItem from '@/components/ChatItem/index'
import { recOpen, recStart, recStop } from '@/utils/recorder'
import { adminCreateRoom, chatSend } from '@/socketioApi/chat'
import { uploadFile } from '@/socketioApi/common'
import { joinChatSend } from '@/socketioApi/chat'
import { send } from '@/utils/socketio'
export default {
  components: {
    Pagination,
    Vimg,
    ChatItem
  },
  data() {
    return {
      listLoading: false,
      addReqVisible: false,
      onFocusLock: false,
      currentRoomUuid: '',
      currentUserId: 0,
      content: '',
      // 表单
      list: [],
      user_id: 0,
      // 页码
      total: 0,
      listQuery: {
        page_no: 1,
        per_page: 10,
        orderBy: 'updated_at',
        order: 'desc'
      }
    }
  },
  computed: {
    ...mapGetters([
      'msgList',
      'RECORD',
      'TEXT',
      'RESEND',
      'IMG',
      'FILE',
      'LOADING',
      'SUCCESS',
      'FAIL',
      'CHAT_NOTIFY'
    ])
  },
  methods: {
    ...mapMutations({
      updateMsgList: 'updateMsgList'
    }),
    getList() {
      this.listLoading = true
      userList(this.listQuery).then(res => {
        console.log(res)
        this.list = res.data.list
        this.total = res.data.page.count
        this.listLoading = false
      })
    },
    move(id) {
      userDelete({ id: id }).then(res => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.getList()
      })
    },
    send(user_id) {
      this.updateMsgList([])
      adminCreateRoom({ user_id: user_id }).then(res => {
        const room_uuid = res.data.room_uuid
        joinChatSend({
          name: '系统会话',
          room_uuid: room_uuid,
          type: 3,
          save_action: 1
        })
        this.$store.commit('updateCurrentRoomUuid', room_uuid)
        this.$store.commit('updateCurrentRoomName', '系统会话')
        this.$store.commit('updateCurrentRoomType', 3)
        this.$store.commit('updateCurrentRoomSaveAction', 1)
        this.handleMsgGet(room_uuid, user_id, 1, 4)
      })
    },
    handleOnFocus() {
      if (!this.onFocusLock) {
        this.onFocusLock = true
        send(
          'adminInput',
          { room_uuid: this.currentRoomUuid, even: 'focus' },
          'broadcast'
        )
      }
    },
    handleOnblur() {
      this.onFocusLock = false
      send(
        'adminInput',
        { room_uuid: this.currentRoomUuid, even: 'blur' },
        'broadcast'
      )
    },
    handleMsgGet(room_uuid, user_id, page_no, per_page) {
      msgGet({
        room_uuid: room_uuid,
        page_no: page_no,
        per_page: per_page
      }).then(res => {
        console.log(res)
        this.currentRoomUuid = room_uuid
        this.currentUserId = user_id
        this.addReqVisible = true
        /* let msgList = JSON.parse(JSON.stringify(this.rawList));
        msgList = rawList.reverse().concat(msgList)
        this.updateMsgList(msgList);
        let rawList = res.data.list;
        rawList.map(item => {
          item["msg"] = item["formatMsg"];
          delete item["formatMsg"];
          return item;
        });
        this.msgList = rawList.reverse(); */
        const rawList = res.data.list.reverse()
        rawList.map(item => {
          item['msg'] = item['formatMsg']
          delete item['formatMsg']
          return item
        })
        this.updateMsgList(rawList)
        this.user_id = user_id
      })
    },
    addReq() {
      console.log(this.content)
      chatSend({
        data: {
          msg: this.content,
          room_uuid: this.currentRoomUuid,
          type: 1,
          save_action: 1,
          created_at: parseInt(new Date().getTime() / 1000)
        }
      }).then(res => {
        // this.addReqVisible = false;
        /* this.$message({
          message: "回复成功",
          type: "success"
        });
        this.handleMsgGet(this.currentRoomUuid, this.currentUserId, 1, 4); */
        this.content = ''
      })
    },
    record() {
      recOpen(function() {
        recStart()
      })
    },
    recordStop() {
      recStop(blob => {
        // name
        const filename =
          this.currentRoomUuid +
          this.currentUserId +
          new Date().getTime() +
          '.amr'
        // blob转file
        var file = new File([blob], filename, {
          type: 'amr',
          lastModified: Date.now()
        })
        var reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = e => {
          uploadFile({
            dataUrl: e.target.result,
            name: filename,
            size: file.size,
            type: 'amr'
          }).then(res => {
            var BenzAMRRecorder = require('benz-amr-recorder')
            var amr = new BenzAMRRecorder()
            const url = process.env.VUE_APP_CLIENT_SOCKET + res.data.path
            amr
              .initWithUrl(url)
              .then(() => {
                chatSend({
                  data: {
                    msg: JSON.stringify({
                      url: url,
                      duration: amr.getDuration(),
                      status: false
                    }),
                    room_uuid: this.currentRoomUuid,
                    type: this.RECORD,
                    save_action: 1
                  }
                })
              })
              .catch(e => {
                console.log(e)
              })
          })
        }
      })
    },
    handleSort({ column, prop, order }) {
      console.log(column, prop)
      if (!prop) return
      if (order == 'descending') {
        this.listQuery['order'] = 'desc'
        this.listQuery['orderBy'] = prop
      } else {
        this.listQuery['order'] = 'asc'
        this.listQuery['orderBy'] = prop
      }
      this.getList()
    },
    parseTime(time) {
      return parseTime(time)
    }
  },
  created: function() {
    this.getList()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
table i {
  color: #409eff;
  margin-left: 10px;
  cursor: pointer;
}
</style>
