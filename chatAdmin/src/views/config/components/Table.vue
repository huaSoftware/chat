<!--
 * @Author: hua
 * @Date: 2019-04-23 20:38:30
 * @LastEditors: hua
 * @LastEditTime: 2020-04-17 23:13:36
 -->
<template>
  <div class="app-container">
    <div class="filter-container" style="display:flex;justify-content:space-between;">
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        @click="dialogVisible=!dialogVisible"
      >添加</el-button>
    </div>
    <!-- 添加弹窗 -->
    <el-dialog :visible.sync="dialogVisible" title="添加">
      <el-form
        ref="addForm"
        :model="addForm"
        class="add-form"
        auto-complete="on"
        label-position="left"
      >
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="addForm.name"
            placeholder="请输入名称"
            name="name"
            type="text"
            auto-complete="on"
          />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-input
            v-model="addForm.type"
            type="text"
            placeholder="请输入类型"
            name="text"
            auto-complete="on"
          />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="addForm.description"
            type="text"
            placeholder="请输入描述"
            name="text"
            auto-complete="on"
          />
        </el-form-item>
        <el-form-item label="编号" prop="code">
          <el-input
            v-model="addForm.code"
            type="text"
            placeholder="请输入编号"
            name="text"
            auto-complete="on"
          />
        </el-form-item>
        <el-form-item label="配置" prop="config">
          <el-input
            v-model="addForm.config"
            type="text"
            placeholder="请输入配置"
            name="text"
            auto-complete="on"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="addForm.status" clearable placeholder="请选择状态">
            <el-option label="启用" :value="1"></el-option>
            <el-option label="禁用" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-button
          type="primary"
          style="width:100%;margin-bottom:30px;"
          @click.native.prevent="handleAdd"
        >确认</el-button>
      </el-form>
    </el-dialog>
    <!-- 编辑弹窗 -->
    <el-dialog :visible.sync="editDialogVisible" title="编辑">
      <el-form
        ref="editForm"
        :model="editForm"
        class="edit-form"
        auto-complete="on"
        label-position="left"
      >
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="editForm.name"
            placeholder="请输入名称"
            name="name"
            type="text"
            auto-complete="on"
          />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-input
            v-model="editForm.type"
            type="text"
            placeholder="请输入类型"
            name="text"
            auto-complete="on"
          />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="editForm.description"
            type="text"
            placeholder="请输入描述"
            name="text"
            auto-complete="on"
          />
        </el-form-item>
        <el-form-item label="编号" prop="code">
          <el-input
            v-model="editForm.code"
            type="text"
            placeholder="请输入编号"
            name="text"
            auto-complete="on"
          />
        </el-form-item>
        <el-form-item label="配置" prop="config">
          <el-input
            v-model="editForm.config"
            type="text"
            placeholder="请输入配置"
            name="text"
            auto-complete="on"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="editForm.status" clearable placeholder="请选择状态">
            <el-option label="启用" :value="1"></el-option>
            <el-option label="禁用" :value="0"></el-option>
          </el-select>
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
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" prop="name" align="center" sortable>
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="type" align="center" sortable>
        <template slot-scope="scope">
          <span>{{scope.row.type}}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" prop="description" align="center" sortable>
        <template slot-scope="scope">
          <span>{{scope.row.description}}</span>
        </template>
      </el-table-column>
      <el-table-column label="编号" prop="code" align="center" sortable>
        <template slot-scope="scope">
          <span>{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status" align="center" sortable>
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            inactive-color="#ff4949"
            disabled
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="配置" prop="config" align="center" sortable>
        <template slot-scope="scope">
          <span>{{scope.row.config}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="created_at" class-name="status-col" sortable>
        <template slot-scope="scope">
          <span>{{parseTime(scope.row.created_at)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" prop="updated_at" class-name="status-col" sortable>
        <template slot-scope="scope">
          <span>{{parseTime(scope.row.updated_at)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" plain @click="handleEdit(scope.row)">编辑</el-button>
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
import { getToken } from "@/utils/auth";
import { configList, configDelete, configAdd, configEdit } from "@/api/config";
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
        order: "desc"
      },
      dialogVisible: false,
      addForm: {},
      editDialogVisible: false,
      editForm: {
        id: 0
      }
    };
  },
  components: {
    Pagination
  },
  methods: {
    getList() {
      this.listLoading = true;
      configList(this.listQuery).then(res => {
        console.log(res);
        this.list = res.data.list;
        this.total = res.data.page.count;
        this.listLoading = false;
      });
    },
    move(id) {
      configDelete({ id: id }).then(res => {
        this.$message({
          message: "删除成功",
          type: "success"
        });
        this.getList();
      });
    },
    handleAdd() {
      this.addForm.status = parseInt(this.addForm.status);
      configAdd(this.addForm).then(res => {
        this.$message({
          message: "新增成功",
          type: "success"
        });
        this.dialogVisible = false;
        this.getList();
      });
    },
    handleEdit(item) {
      this.editForm = JSON.parse(JSON.stringify(item));
      this.editForm.status = String(JSON.parse(JSON.stringify(item))["status"]);
      this.editDialogVisible = true;
    },
    comfrimEdit() {
      this.editForm.status = parseInt(this.editForm.status);
      configEdit(this.editForm).then(res => {
        this.$message({
          message: "编辑成功",
          type: "success"
        });
        this.editDialogVisible = false;
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
