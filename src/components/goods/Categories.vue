<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="success" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <tree-table
        class="tree-table"
        :data="categoryList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        show-row-hover
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color:lightgreen;"
          ></i>
          <i class="el-icon-error" v-else style="color:red;"></i>
        </template>
        <!-- 等级排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" type="danger" v-if="scope.row.cat_level ==0">一级</el-tag>
          <el-tag size="mini" type="warning" v-else-if="scope.row.cat_level ==1">二级</el-tag>
          <el-tag size="mini" type="success" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button
            type="success"
            class="el-icon-edit"
            size="mini"
            @click="showEditCateDialog(scope.row.cat_id)"
          >编辑</el-button>
          <el-button
            type="danger"
            class="el-icon-delete"
            size="mini"
            @click="removeCateById(scope.row.cat_id)"
          >删除</el-button>
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="sizeChange"
        @current-change="currentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加商品分类"
      :visible.sync="addCateDialogVisible"
      width="30%"
      @close="addCateDialogClosed"
    >
      <!-- 添加分类的表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name" placeholder="必填"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <!-- options用来指定数据源 -->
          <!-- props用来指定配置对象 -->
          <!-- v-model绑定的必须是数组 -->
          <el-cascader
            clearable
            :options="parentCateList"
            :props="cascaderProps"
            v-model="selectedKeys"
            @change="parentCateChanged"
            placeholder="选填(若不填,则默认该分类为三级分类)"
          ></el-cascader>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click=" addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类的对话框 -->
    <el-dialog
      title="修改分类名称"
      :visible.sync="editCateDialogVisible"
      width="30%"
      @close="editCateDialogClosed"
    >
      <!-- 添加分类的表单 -->
      <el-form :model="editCateForm" :rules="addCateFormRules" ref="editCateFormRef">
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click=" editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类的数据列表,默认为空
      categoryList: [],
      // 总数据条数
      total: 0,
      // 为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 表示,将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'isok'
        },
        {
          label: '等级',
          // 表示,将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'order'
        },
        {
          label: '操作',
          // 表示,将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'opt'
        }
      ],
      // 控制对话框的显示和隐藏
      addCateDialogVisible: false,
      // 添加分类的表单的数据对象
      addCateForm: {
        // 将要添加的分类的名称
        cat_name: '',
        // 父级分类的Id
        cat_pid: 0,
        // 分类的等级,默认要添加的是1级分类
        cat_level: 0
      },
      // 添加分类的表单的验证规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 0, max: 10, message: '字数不能超过10个', trigger: 'blur' }
        ]
      },
      // 父级分类的列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true,
        expandTrigger: 'hover'
      },
      // 选中的父级分类的Id数组
      selectedKeys: [],
      // 控制编辑分类对话框的显示和隐藏
      editCateDialogVisible: false,
      // 编辑分类的表单
      editCateForm: {}
    }
  },
  created() {
    this.getCategoryList()
  },
  methods: {
    // 获取商品的分类数据
    async getCategoryList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status != 200) {
        return this.$message.error('获取商品分类失败!')
      }
      // 把数据列表,赋值给 categoryList
      this.categoryList = res.data.result
      // 为总数据条数赋值
      this.total = res.data.total
    },
    // 监听 pagesize 改变
    sizeChange(newPageSize) {
      this.queryInfo.pagesize = newPageSize
      this.getCategoryList()
    },
    // 监听 pagenum 改变
    currentChange(newPageNum) {
      this.queryInfo.pagenum = newPageNum
      this.getCategoryList()
    },
    // 点击按钮,展示添加分类的对话框
    showAddCateDialog() {
      // 先获取父级分类的数据列表
      this.getParentCateList()
      // 再展示出对话框
      this.addCateDialogVisible = true
    },
    // 监听添加分类对话框的关闭
    addCateDialogClosed() {
      // 重置数据
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys.length = 0
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status != 200) {
        return this.$msg.error('获取父级分类失败')
      }
      this.parentCateList = res.data
    },
    // 监听选择项变化
    parentCateChanged() {
      // 如果 selectedKeys 数组中的length 大于0,证明选中了父级分类
      // 反之,就说明没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的Id
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ]
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      } else {
        // 父级分类的Id
        this.addCateForm.cat_pid = 0
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = 0
      }
    },
    // 点击按钮,添加新的分类
    addCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )
        if (res.meta.status != 201) {
          return this.$msg.error('添加分类失败!')
        }
        this.$msg({
          message: '添加分类成功',
          type: 'success',
          duration: 1000
        })
        this.getCategoryList()
        this.addCateDialogVisible = false
      })
    },
    // 显示编辑分类的名称
    async showEditCateDialog(id) {
      // 获取分类的名称
      const { data: res } = await this.$http.get(`categories/${id}`)
      if (res.meta.status != 200) {
        return this.$msg.error('获取分类名失败!')
      }
      this.editCateForm = res.data
      this.editCateDialogVisible = true
    },
    // 提交编辑
    async editCate() {
      const { data: res } = await this.$http.put(
        `categories/${this.editCateForm.cat_id}`,
        {
          cat_name: this.editCateForm.cat_name
        }
      )
      if (res.meta.status != 200) {
        return this.$msg.error('更新失败')
      }
      this.editCateDialogVisible = false
      this.$msg({
        message: '更新成功',
        type: 'success',
        duration: '1000'
      })
      this.getCategoryList()
    },
    // 监听编辑对话框的关闭
    editCateDialogClosed() {
      this.$refs.editCateFormRef.resetFields()
      this.editCateForm = {}
    },
    // 删除分类

    async removeCateById(id) {
      // 弹框提示,是否要删除
      const confirmResult = await this.$confirm(
        '此操作将删除该分类, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      // 确认删除,返回字符串 confirm
      // 取消删除,返回字符串 cancel
      // console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$msg.info('已取消删除')
      }
      const { data: res } = await this.$http.delete(`categories/${id}`)
      if (res.meta.status != 200) {
        return this.$msg.error('删除分类失败')
      }
      this.$msg.success('删除分类成功')
      // 重新刷新
      this.getCategoryList()
    }
  }
}
</script>

<style lang="less" scoped>
.tree-table {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>