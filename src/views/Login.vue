<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="logo_box">
        <img src="../assets/logo.png" />
      </div>
      <!-- 登录表单区域 -->
      <el-form ref="loginRef" :model="loginForm" :rules="loginRules" class="login_form">
        <!-- 用户名 校验规则:username-->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 校验规则:password-->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont icon-3702mima"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="success" @click="login">登录</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 这是表单的验证规则对象
      loginRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 点击登录按钮, 对表单数据进行预校验
    // 注意: 这里的回调函数必须要加上 async 和 await,否则返回的不是数据而是一个promise对象
    login() {
      this.$refs.loginRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status != 200) return this.$msg.error('登录失败! ')
        this.$msg({
          message: '登录成功!',
          type: 'success',
          duration: 800
        })
        /**
         * 1. 将登录成功之后的token, 保存到客户端的 sessionStorage 中
         *   1.1 项目中除了登录之外的其他API接口,必须在登陆之后才能访问
         *   1.2 token1 只应在当前网站打开期间生效,所以讲 token 保存在 sessionStorage中
         * 2. 通过编程式导航跳转到后台主页,路由地址是 /home
         * */
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    },
    // 点击重置按钮, 重置登录表单
    resetForm() {
      this.$refs.loginRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #bbe6d6;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .logo_box {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 128px;
    width: 128px;
    border: 1px solid #eee;
    border-radius: 50%;
    box-shadow: 0 0 10px #ddd;

    img {
      border-radius: 50%;
      background: #eee;
      width: 100%;
      height: 100%;
    }
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>