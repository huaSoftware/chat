<!--
 * @Author: hua
 * @Date: 2019-04-23 20:38:30
 * @LastEditors: hua
 * @LastEditTime: 2020-08-15 12:20:21
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
      <el-table-column label="ID" prop="id" align="center" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="关注者" prop="nick_name" align="center" sortable>
        <template slot-scope="scope">
          <span v-if="scope.row.users">{{ scope.row.users.nick_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="房间编号" prop="room_uuid" align="center" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.room_uuid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="被关注者" prop="nick_name" align="center" sortable>
        <template slot-scope="scope">
          <span v-if="scope.row.be_users">{{ scope.row.be_users.nick_name }}</span>
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
  </div>
</template>

<script>
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import { getToken } from "@/utils/auth";
import { addressBookList, addressBookDelete } from "@/api/addressBook";
import { parseTime } from "@/utils/index";
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
        orderBy: "updated_at",
        order: "desc",
      },
    };
  },
  components: {
    Pagination,
  },
  methods: {
    getList() {
      this.listLoading = true;
      addressBookList(this.listQuery).then((res) => {
        console.log(res);
        this.list = res.data.list;
        this.total = res.data.page.count;
        this.listLoading = false;
      });
    },
    move(id) {
      addressBookDelete({ id: id }).then((res) => {
        this.$message({
          message: "删除成功",
          type: "success",
        });
        this.getList();
      });
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
  },
  created: function () {
    this.getList();
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
table i {
  color: #409eff;
  margin-left: 10px;
  cursor: pointer;
}
</style>
