<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <div class="wrapper">
          <img src="../assets/logo.png" />
        </div>
        <span>Vue-后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside classwidth="200px">
        <!-- 侧边栏菜单区域 -->
        <el-menu
          background-color="#fff"
          text-color="#2C3E50"
          active-text-color="#52BF8E"
          unique-opened
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单的模板区域 -->
            <div slot="title">
              <!-- 图标 -->
              <i :class="iconObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </div>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="subItem.id + ''"
              v-for="subItem in item.children"
              :key="subItem.id"
            >
              <div slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.authName}}</span>
              </div>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>content</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    //左侧菜单数据
    return {
      menuList: [],
      iconObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      }
    }
  },
  created() {
    this.getMenuList()
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status != 200) return this.$msg.error(res.meta.msg)
      /** 
       * this.$msg.success(res.meta.msg)
         this.$msg({
         message: res.meta.msg,
         type: 'success',
         duration: 1000
         })
      */
      // console.log(res)
      this.menuList = res.data
      console.log(res.data)
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #bbe6d2;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
  }
  span {
    margin-left: 15px;
  }
}
.wrapper {
  border-radius: 50%;
  box-shadow: 0 0 5px #fff;
  width: 58px;
  height: 58px;
  > img {
    width: 48px;
    height: 48px;
    padding-left: 5px;
    padding-top: 9px;
  }
}
.el-aside {
  background: #fff;
  .el-menu {
    border-right: none;
    .iconfont {
      margin-right: 10px;
    }
  }
}
.el-main {
  background-color: #e4f5ef;
}
</style>