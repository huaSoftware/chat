<!--
 * @Author: hua
 * @Date: 2019-04-23 20:38:30
 * @LastEditors: hua
 * @LastEditTime: 2019-12-09 10:02:29
 -->
<template>
  <div class="app-container">
   <div class="filter-container" style="display:flex;justify-content:space-between;">
      <el-select v-model="listQuery.level" clearable placeholder="请选择">
        <el-option label="调试" value="1"></el-option>
        <el-option label="警告" value="2"></el-option>
        <el-option label="错误" value="3"></el-option>
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getList">搜索</el-button>
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
      <el-table-column label="ID" prop="id" sortable align="center" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center" sortable>
        <template slot-scope="scope">
          <span v-if="scope.row.type">普通接口日志</span>
        </template>
      </el-table-column>
      <el-table-column label="等级" align="center" sortable>
        <template slot-scope="scope">
          <span v-if="scope.row.level == 1">调试</span>
          <span v-if="scope.row.level == 2">警告</span>
          <span v-if="scope.row.level == 3">错误</span>
        </template>
      </el-table-column>
      <el-table-column label="日志内容" class-name="status-col" align="center" sortable>
        <template slot-scope="scope" >
          <div @click="handleError(JSON.parse(scope.row.data))" style="max-height:50px;cursor:pointer">
           <div  v-for="(item, index) in JSON.parse(scope.row.data)" :key="index">{{item}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" class-name="status-col" sortable >
        <template slot-scope="scope">
          <span>{{parseTime(scope.row.create_time)}}</span>
        </template>
      </el-table-column>
     <!--  <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" plain @click="move(scope.row.room_uuid)">删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page_no"
      :limit.sync="listQuery.per_page"
      @pagination="getList"
    />
    <!-- 添加弹窗 -->
    <el-dialog :visible.sync="dialogVisible" title="错误日志">
      <div  v-for="(item, index) in data" :key="index">{{item}}</div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import { getToken } from "@/utils/auth";
import { logList } from "@/api/log";
import {parseTime} from "@/utils/index"

export default {
  data() {
    return {
      listLoading: false,
      dialogVisible:false,
      data:{},
      //表单
      list: [],
      //页码
      total: 0,
      listQuery: {
        page_no: 1,
        per_page: 10,
        orderBy:'create_time',
        order:'desc'
      }
    };
  },
  components: {
    Pagination
  },
  methods: {
    handleError(item){
      this.data = item
      this.dialogVisible = true
    },
    getList() {
      this.listLoading = true;
      logList(this.listQuery).then(res => {
        console.log(res);
        this.list = res.data.list;
        this.total = res.data.page.count
        this.listLoading = false;
      });
    },
    handleSort({ column, prop, order }){
      if(!prop)return
      if(order == 'descending'){
          this.listQuery['order'] = 'desc';
          this.listQuery['orderBy'] = prop;
          }else{
          this.listQuery['order'] = 'asc';
          this.listQuery['orderBy'] = prop;
      }
      this.getList();
    },
   /*  move(room_uuid) {
      roomDelete({ room_uuid: room_uuid }).then(res => {
        this.$message({
          message: "删除成功",
          type: "success"
        });
        this.getList();
      });
    }, */
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
