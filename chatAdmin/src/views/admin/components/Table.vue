<!--
 * @Author: hua
 * @Date: 2019-04-23 20:38:30
 * @LastEditors: hua
 * @LastEditTime: 2020-04-17 23:12:40
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
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        @click="dialogVisible = !dialogVisible"
      >添加</el-button>
    </div>
    <!-- 添加弹窗 -->
    <el-dialog :visible.sync="dialogVisible" title="添加管理员">
      <el-form
        ref="addForm"
        :model="addForm"
        :rules="addRules"
        class="add-form"
        auto-complete="on"
        label-position="left"
      >
        <el-form-item prop="name">
          <el-input
            v-model="addForm.name"
            placeholder="请输入用户名"
            name="name"
            type="text"
            auto-complete="on"
          />
        </el-form-item>

        <el-form-item prop="pwd">
          <el-input
            v-model="addForm.pwd"
            type="password"
            placeholder="请输入密码"
            name="pwd"
            auto-complete="on"
          />
        </el-form-item>
        <el-button
          type="primary"
          style="width:100%;margin-bottom:30px;"
          @click.native.prevent="handleAdd"
        >确认</el-button>
      </el-form>
    </el-dialog>
    <!-- 编辑弹窗 -->
    <el-dialog :visible.sync="editDialogVisible" title="编辑管理员">
      <el-form
        ref="editForm"
        :model="editForm"
        :rules="editRules"
        class="edit-form"
        auto-complete="on"
        label-position="left"
      >
        <el-form-item prop="name">
          <el-input
            v-model="editForm.name"
            placeholder="请输入用户名"
            name="name"
            type="text"
            readonly="readonly"
            auto-complete="on"
          />
        </el-form-item>

        <el-form-item prop="pwd">
          <el-input
            v-model="editForm.pwd"
            type="password"
            placeholder="请输入密码"
            name="pwd"
            auto-complete="on"
          />
        </el-form-item>
        <el-button
          type="primary"
          style="width:100%;margin-bottom:30px;"
          @click.native.prevent="comfrimEdit"
        >确认</el-button>
      </el-form>
    </el-dialog>
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
      <el-table-column label="用户名" prop="name" align="center" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" prop="email" align="center" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="登录时间" prop="login_time" align="center" sortable>
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.login_time) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" prop="update_time" class-name="status-col" sortable>
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.update_time) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" plain @click="move(scope.row.id)">删除</el-button>
          <el-button size="mini" type="primary" plain @click="handleEdit(scope.row)">编辑</el-button>
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
import { adminList, adminDelete, adminAdd, adminEdit } from "@/api/admin";
import { parseTime } from "@/utils/index";
export default {
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("用户名小于6位"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码小于6位"));
      } else {
        callback();
      }
    };
    return {
      listLoading: false,
      //表单
      list: [],
      //页码
      total: 0,
      listQuery: {
        page_no: 1,
        per_page: 10,
        orderBy: "update_time",
        order: "desc"
      },
      dialogVisible: false,
      addForm: {
        name: "",
        pwd: ""
      },
      addRules: {
        name: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        pwd: [{ required: true, trigger: "blur", validator: validatePassword }]
      },
      editDialogVisible: false,
      editForm: {
        name: "",
        pwd: "",
        id: 0
      },
      editRules: {
        name: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        pwd: [{ required: true, trigger: "blur", validator: validatePassword }]
      }
    };
  },
  components: {
    Pagination
  },
  methods: {
    getList() {
      this.listLoading = true;
      adminList(this.listQuery).then(res => {
        console.log(res);
        this.list = res.data.list;
        this.total = res.data.page.count;
        this.listLoading = false;
      });
    },
    move(id) {
      adminDelete({ id: id }).then(res => {
        this.$message({
          message: "删除成功",
          type: "success"
        });
        this.getList();
      });
    },
    handleAdd() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          adminAdd(this.addForm).then(res => {
            this.$message({
              message: "新增成功",
              type: "success"
            });
            this.dialogVisible = false;
            this.getList();
          });
        }
      });
    },
    handleEdit(item) {
      this.editDialogVisible = true;
      this.editForm.name = item.name;
      this.editForm.id = item.id;
    },
    comfrimEdit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          adminEdit(this.editForm).then(res => {
            this.$message({
              message: "编辑成功",
              type: "success"
            });
            this.editDialogVisible = false;
            this.getList();
          });
        }
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
