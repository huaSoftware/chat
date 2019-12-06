<!--
 * @Author: hua
 * @Date: 2019-04-23 20:38:30
 * @LastEditors: hua
 * @LastEditTime: 2019-12-06 16:42:17
 -->
<template>
  <div class="app-container">
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
      <el-table-column label="用户昵称" sortable>
        <template slot-scope="scope">
          <span>{{scope.row.nick_name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="头像" sortable height="50px"  align="center">
        <template slot-scope="scope">
          <span><Vimg style="width:50px;height:50px" :imgUrl="scope.row.head_img"/></span>
        </template>
      </el-table-column>
      <el-table-column label="首字母" sortable align="center">
        <template slot-scope="scope">
          <span>{{scope.row.first_word}}</span> 
        </template>
      </el-table-column>
      <el-table-column label="邮箱" sortable align="center">
        <template slot-scope="scope">
          <span>{{scope.row.email}}</span> 
        </template>
      </el-table-column>
      <el-table-column label="创建时间" class-name="status-col" sortable>
        <template slot-scope="scope">
          <span>{{parseTime(scope.row.created_at)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" class-name="status-col" sortable>
        <template slot-scope="scope">
          <span>{{parseTime(scope.row.updated_at)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" plain @click="move(scope.row.id)">删除</el-button>
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
import Vimg from "@/components/Vimg";
import { getToken } from "@/utils/auth";
import { userList, userDelete } from "@/api/user";
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
        orderBy:'updated_at',
        order:'desc'
      }
    };
  },
  components: {
    Pagination, Vimg
  },
  methods: {
    getList() {
      this.listLoading = true;
      userList(this.listQuery).then(res => {
        console.log(res);
        this.list = res.data.list;
        this.total = res.data.page.count
        this.listLoading = false;
      });
    },
    move(id) {
      /* userDelete({ id: id }).then(res => {
        this.$message({
          message: "删除成功",
          type: "success"
        });
        this.getList();
      }); */
    },
    handleSort({ column, prop, order }){
      if(order == 'descending'){
        this.listQuery['order'] = 'desc';
        this.listQuery['orderBy'] = prop;
        }else{
        this.listQuery['order'] = 'asc';
        this.listQuery['orderBy'] = prop;
      }
      this.getList();
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
