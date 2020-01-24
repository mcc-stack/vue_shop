<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加角色按钮区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="success" @click="addRoleDialogVisible=true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row class="rights-tags">
              <el-col :span="5">
                <el-tag type="danger">一级权限</el-tag>
              </el-col>
              <el-col :span="19">
                <el-row>
                  <el-col :span="6">
                    <el-tag type="warning">二级权限</el-tag>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="success">三级权限</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row
              :class="['bd-bottom',i1 === 0 ? 'bd-top' : '','vcenter']"
              v-for="(item1,i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  type="danger"
                  closable
                  @close="removeRightById(scope.row,item1.id)"
                >{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[i2 === 0 ?  '': 'bd-top','vcenter']"
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="warning"
                      closable
                      @close="removeRightById(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                      type="success"
                      closable
                      @close="removeRightById(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              icon="el-icon-edit"
              @click="showRoleEidtDialog(scope.row.id)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeRoleById(scope.row)"
            >删除</el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色的对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleDialogVisible"
      width="50%"
      @close="addRoleDialogClosed"
    >
      <!-- 添加角色表单区域 -->
      <el-form ref="addRoleFormRef" :model="addRoleForm" :rules="RoleRules" label-width="80px">
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色的对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editRoleDialogVisible"
      width="50%"
      @close="editRoleDialogClosed"
    >
      <!-- 编辑表单区域 -->
      <el-form ref="editRoleFormRef" :model="editRoleForm" :rules="RoleRules" label-width="80px">
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defaultKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="success" @click="allocRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有角色列表数据
      rolesList: [],
      // 控制添加角色对话框的显示与隐藏
      addRoleDialogVisible: false,
      // 添加角色表单的数据
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      // 添加和编辑角色表单的校验规则
      RoleRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { min: 0, max: 20, message: '长度不超过 20 个字符', trigger: 'blur' }
        ]
      },
      // 控制编辑角色对话框的显示与隐藏
      editRoleDialogVisible: false,
      // 编辑角色表单的数据
      editRoleForm: {
        roleId: '',
        roleName: '',
        roleDesc: ''
      },
      //控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      //所有权限的数据
      rightsList: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的节点Id值数组
      defaultKeys: [],
      //当前即将分配权限的角色id
      roleId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取所有角色的列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status != 200) {
        return this.$message.error('获取角色列表失败!')
      }
      this.rolesList = res.data
    },
    // 添加角色
    async addRole() {
      const { data: res } = await this.$http.post('roles', this.addRoleForm)
      if (res.meta.status != 201) {
        return this.$msg.error('角色名已存在')
      }
      this.$msg({
        message: '添加角色成功!',
        type: 'success',
        duration: 1000
      })
      //隐藏添加用户的对话框
      this.addRoleDialogVisible = false
      //重新刷新
      this.getRolesList()
    },
    //监听添加角色的对话框的关闭事件
    addRoleDialogClosed() {
      this.$refs.addRoleFormRef.resetFields()
    },
    // 获取需要编辑的角色对象
    async showRoleEidtDialog(id) {
      const { data: res } = await this.$http.get(`roles/${id}`)
      if (res.meta.status != 200) {
        return this.$msg.error('获取角色信息失败')
      }
      this.editRoleForm = res.data
      this.editRoleDialogVisible = true
    },
    // 编辑角色
    async editRole() {
      const { data: res } = await this.$http.put(
        `roles/${this.editRoleForm.roleId}`,
        this.editRoleForm
      )
      if (res.meta.status != 200) {
        return this.$msg.error('修改角色信息失败')
      }
      this.editRoleForm = res.data
      //隐藏添加用户的对话框
      this.editRoleDialogVisible = false
      //重新刷新
      this.getRolesList()
      // 提示用户修改成功
      this.$msg({
        message: '修改角色信息成功!',
        type: 'success',
        duration: '1000'
      })
    },
    // 监听编辑角色的对话框的关闭事件
    editRoleDialogClosed() {
      this.$refs.editRoleFormRef.resetFields()
      this.editRoleForm = {}
    },
    // 根据角色Id删除对应的角色
    async removeRoleById(role) {
      // 弹框提示,是否要删除
      const confirmResult = await this.$confirm(
        '此操作将删除该角色, 是否继续?',
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
      const { data: res } = await this.$http.delete(`roles/${role.id}`)
      if (res.meta.status != 200) {
        return this.$msg.error('删除角色失败')
      }
      this.$msg.success('删除角色成功')
      // 重新刷新
      this.getRolesList()
    },

    // 根据权限Id删除对应的权限
    async removeRightById(role, rightId) {
      // 弹框提示,是否要删除
      const confirmResult = await this.$confirm(
        '此操作将删除该权限, 是否继续?',
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
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status != 200) {
        return this.$msg.error('删除权限失败')
      }
      this.$msg.success('删除权限成功')
      // console.log(role)
      role.children = res.data
    },
    // 展示分配权限的对话框
    async showSetRightDialog(role) {
      //展开对话框的时候讲用户的Id保存下来
      this.roleId = role.id
      //获取所有权限的数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status != 200) {
        return this.$msg.error('获取权限数据失败!')
      }
      // 把获取到的权限数据保存到rightsList里
      this.rightsList = res.data
      // console.log(this.rightsList)

      // 递归获取三级节点的Id
      this.getLeafKeys(role, this.defaultKeys)
      this.setRightDialogVisible = true
    },
    // 通过递归的形式,获取角色下所有三级权限的id,并保存到数组中
    getLeafKeys(node, arr) {
      // 如果当前node节点不包含children属性,则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    // 监听分配权限的对话框的关闭事件
    setRightDialogClosed() {
      // this.defaultKeys.splice(0, this.defaultKeys.length)
      this.defaultKeys.length = 0
    },
    // 点击分配权限
    async allocRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]

      const idStr = keys.join(',')

      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      )
      if (res.meta.status != 200) {
        return this.$msg.error('分配权限失败!')
      }

      this.$msg({
        message: '分配权限成功!',
        type: 'success',
        duration: 1000
      })
      this.getRolesList()
      this.setRightDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bd-top {
  border-top: 1px solid #eee;
}
.bd-bottom {
  border-bottom: 1px solid #eee;
}
.rights-tags {
  text-align: center;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>