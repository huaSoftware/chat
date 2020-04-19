<!--
 * @Author: hua
 * @Date: 2019-04-23 20:38:30
 * @LastEditors: hua
 * @LastEditTime: 2020-04-19 15:43:15
 -->
<template>
  <div class="app-container">
    <div class="filter-container" style="display:flex;justify-content:space-between;">
      <div>
        <el-input
          v-model="listQuery.keyword"
          placeholder="关键字"
          style="width: 200px;"
          class="filter-item"
        />
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getList">搜索</el-button>
      </div>
    </div>
    <el-table
      key="tableKey"
      v-loading="listLoading"
      :data="list"
      fit
      @sort-change="handleSort"
      highlight-current-row
      style="width: 100%;border: 1px solid #ebeef5;"
    >
      <el-table-column label="ID" prop="id" sortable align="center">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column label="房间名" prop="name" sortable align="center">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="房间编号" prop="room_uuid" sortable align="center">
        <template slot-scope="scope">
          <span>{{scope.row.room_uuid}}</span>
        </template>
      </el-table-column>
      <el-table-column label="房间类型" prop="type" sortable align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.type == 0">单聊</span>
          <span v-if="scope.row.type == 1">群聊</span>
        </template>
      </el-table-column>
      <el-table-column label="最近留言" prop="last_msg" sortable class-name="status-col">
        <template slot-scope="scope" v-if="scope.row.last_msg">
          <div v-if="JSON.parse(scope.row.last_msg)['type'] == IMG">[图片]</div>
          <div v-if="JSON.parse(scope.row.last_msg)['type'] == FILE">[文件]</div>
          <div v-if="JSON.parse(scope.row.last_msg)['type'] == RECORD">[语音]</div>
          <div
            v-if="JSON.parse(scope.row.last_msg)['type'] == TEXT"
            v-html="JSON.parse(scope.row.last_msg)['msg']"
          ></div>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="created_at" sortable class-name="status-col">
        <template slot-scope="scope">
          <span>{{parseTime(scope.row.created_at)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" prop="updated_at" sortable class-name="status-col">
        <template slot-scope="scope">
          <span>{{parseTime(scope.row.updated_at)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            plain
            @click="send(scope.row.room_uuid, scope.row.user_id)"
          >聊天</el-button>
          <el-button size="mini" type="danger" plain @click="move(scope.row.room_uuid)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page_no"
      :limit.sync="listQuery.per_page"
      @pagination="getList"
    />
    <el-dialog
      title="新增回复"
      :visible.sync="addReqVisible"
      :close-on-click-modal="false"
      width="500px"
    >
      <div>
        <el-form>
          <chat-item :msgList="msgList" :user_id="user_id"></chat-item>
          <el-form-item label="回复内容">
            <el-input type="textarea" v-model="content"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" @click="addReqVisible=false">取消</el-button>
            <el-button size="mini" type="primary" @click="addReq()">确定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import ChatItem from "@/components/ChatItem/index";
import { getToken } from "@/utils/auth";
import { roomList, roomDelete, msgGet } from "@/api/room";
import { chatSend } from "@/socketioApi/chat";
import { parseTime } from "@/utils/index";
export default {
  data() {
    return {
      listLoading: false,
      addReqVisible: false,
      currentRoomUuid: "",
      //表单
      list: [],
      msgList: [],
      user_id: 0,
      //页码
      total: 0,
      listQuery: {
        page_no: 1,
        per_page: 10,
        keyword: "",
        orderBy: "updated_at",
        order: "desc"
      },
      content: ""
    };
  },
  components: {
    Pagination,
    ChatItem
  },
  computed: {
    ...mapGetters(["RECORD", "TEXT", "IMG", "FILE"])
  },
  methods: {
    getList() {
      this.listLoading = true;
      roomList(this.listQuery).then(res => {
        this.list = res.data.list;
        this.total = res.data.page.count;
        this.listLoading = false;
      });
    },
    move(room_uuid) {
      /* roomDelete({ room_uuid: room_uuid }).then(res => {
        this.$message({
          message: "删除成功",
          type: "success"
        });
        this.getList();
      }); */
    },
    handleSort({ column, prop, order }) {
      if (!prop) return;
      if (order == "descending") {
        this.listQuery["order"] = "desc";
        this.listQuery["orderBy"] = prop;
      } else {
        this.listQuery["order"] = "asc";
        this.listQuery["orderBy"] = prop;
      }
      this.getList();
    },
    parseTime(time) {
      return parseTime(time);
    },
    send(room_uuid, user_id) {
      msgGet({ room_uuid: room_uuid, page_no: 1, per_page: 4 }).then(res => {
        this.currentRoomUuid = room_uuid;
        this.addReqVisible = true;
        let rawList = res.data.list;
        rawList.map(item => {
          item["msg"] = item["formatMsg"];
          delete item["formatMsg"];
          return item;
        });
        this.msgList = rawList.reverse();
        this.user_id = user_id;
      });
    },
    addReq() {
      chatSend({
        data: {
          msg: this.content,
          room_uuid: this.currentRoomUuid,
          type: 1,
          save_action: 1,
          created_at: parseInt(new Date().getTime() / 1000)
        }
      }).then(res => {
        this.addReqVisible = false;
        this.$message({
          message: "回复成功",
          type: "success"
        });
        this.getList();
        this.content = "";
      });
    }
  },
  created: function() {
    this.getList();
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
table i {
  color: #409eff;
  margin-left: 10px;
  cursor: pointer;
}
</style>
