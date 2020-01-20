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
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div
          :class="isCollapse ? 'toggle-button rotate': 'toggle-button'"
          @click="toggleCollapse"
        >|||</div>
        <el-divider />
        <!-- 侧边栏菜单区域 -->
        <el-menu
          background-color="#fff"
          text-color="#2C3E50"
          active-text-color="#52BF8E"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
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
              :index="'/'+subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/'+ subItem.path)"
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
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    // 左侧菜单数据
    return {
      menuList: [],
      iconObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      // 是否折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: ''
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
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
    },
    //点击按钮
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    //保存链接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #bbe6cb;
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
}

.el-aside {
  background: #fff;
  .toggle-button {
    font-size: 10px;
    text-align: center;
    letter-spacing: 0.3em;
    height: 36px;
    line-height: 36px;
    cursor: pointer;
  }
  .rotate {
    transform: rotate(90deg);
  }
  .iconfont {
    margin-right: 10px;
  }
}
.el-main {
  background-color: #e4f5ef;
}
</style>