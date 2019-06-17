<!--
 * @Author: hua
 * @Date: 2019-04-23 20:38:30
 * @LastEditors: hua
 * @LastEditTime: 2019-04-23 20:38:30
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
      highlight-current-row
      style="width: 100%;border: 1px solid #ebeef5;"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column label="房间名">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="房间编号" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.room_uuid}}</span>
        </template>
      </el-table-column>
      <el-table-column label="房间类型" width="110px" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.type == 0">单聊</span>
          <span v-if="scope.row.type == 1">群聊</span>
        </template>
      </el-table-column>
      <el-table-column label="最近留言" class-name="status-col" width="200">
        <template slot-scope="scope">
          <span v-html="scope.row.last_msg">{{scope.row.last_msg}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" class-name="status-col" width="200">
        <template slot-scope="scope">
          <span>{{parseTime(scope.row.created_at)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" class-name="status-col" width="200">
        <template slot-scope="scope">
          <span>{{parseTime(scope.row.updated_at)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
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
  </div>
</template>

<script>
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import { getToken } from "@/utils/auth";
import { roomList,roomDelete } from "@/api/room";
import {parseTime} from "@/utils/index"

export default {
  data() {
    return {
      listLoading: false,
      //表单
      list: [],
      //页码
      total: 0,
      listQuery: {
        page_no: 1,
        per_page: 10,
        keyword: ""
      }
    };
  },
  components: {
    Pagination
  },
  methods: {
    getList() {
      this.listLoading = true;
      roomList(this.listQuery).then(res => {
        console.log(res);
        this.list = res.data.list;
        this.total = res.data.page.count
        this.listLoading = false;
      });
    },
    move(room_uuid) {
      roomDelete({ room_uuid: room_uuid }).then(res => {
        this.$message({
          message: "删除成功",
          type: "success"
        });
        this.getList();
      });
    },
    parseTime(time){
      return parseTime(time)
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
