<template>
  <div class="login posr">
    <div class="posa language">
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          <common-flex align="center">
          <img :src="require('@subImg/locale.svg')" alt="" style="width: 20px;" class="mr-1">
          {{ $t('common.language') }}
          <i class="el-icon-caret-bottom" />
        </common-flex>
        </span>
        <template #dropdown>
          <el-dropdown-menu class="lang-item">
            <el-dropdown-item command="zh_CN" :disabled="activeLang === 'zh_CN'">cn-简体中文</el-dropdown-item>
            <el-dropdown-item command="en_US" :disabled="activeLang === 'en_US'">us-English</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <img class="login-bg posa" :src="require('@assets/logo/login-bg.webp')" alt="">
    <el-form v-show="modifyPas && forgetShow" ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form posr">
      <h2 class="title">EasyPower<br>Management System</h2>
      <el-form-item prop="username" :label="$t('login.account')">
        <el-input
          v-model="loginForm.username"
          type="text"
          auto-complete="off"
          :placeholder="this.$t('common.pleaseEnter') + this.$t('login.account')"
        >
          <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="password" :label="$t('login.password')">
        <el-input
          v-model="loginForm.password"
          :type="inputType"
          auto-complete="off"
          :placeholder="this.$t('common.pleaseEnter') + this.$t('login.password')"
          @input="verifyPsw($event,'loginForm', 'password')"
          @keyup.enter.native="handleLogin"
          @paste.native.capture.prevent
          @copy.native.capture.prevent
        >
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
          <template #suffix>
            <svg-icon v-if="eyes" @click.native="eyes = !eyes" style="cursor: pointer; margin-right: 10px" icon-class="eye" class="el-input__icon input-icon" />
            <svg-icon v-else @click.native="eyes = !eyes" style="cursor: pointer; margin-right: 10px" icon-class="eye-open" class="el-input__icon input-icon" />
          </template>
        </el-input>
      </el-form-item>
      <common-flex justify="space-between">
        <el-checkbox v-model="loginForm.rememberMe" style="margin:0 0 25px 0">{{ $t('login.rememberPsw')}}</el-checkbox>
        <span class="forget-pas" @click="forgetShow = false">{{ $t('login.forgotPsw')}}</span>
      </common-flex>
      <el-form-item style="width:100%;">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleLogin"
        >
          <span v-if="!loading">{{ $t('login.loginIn')}}</span>
          <span v-else>{{ $t('login.loginIn')}}...</span>
        </el-button>
        <div style="float: right;" v-if="register">
          <router-link class="link-type" :to="'/register'">立即注册</router-link>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button
          :loading="demoLoading"
          size="medium"
          type="text"
          style="width:100%;"
          @click.native.prevent="handleLoginDemo"
        >
          <span v-if="!demoLoading">{{ $t('login.demoSites') }}</span>
          <span v-else>{{ $t('login.loginIn')}}...</span>
        </el-button>
      </el-form-item>
    </el-form>
<!--    强制修改密码-->
    <el-form v-if="!modifyPas" ref="modifyForm" :model="modifyForm" :rules="modifyRules" class="login-form posr">
      <h3 class="title">{{ $t('login.loginSuccess') }}</h3>
      <p style="font-size: 12px; color: #ec6240">{{ $t('login.pleaseChangePassword') }}</p>
      <el-form-item prop="pass" :label="$t('login.newPassword')">
        <el-input
          v-model="modifyForm.pass"
          @input="verifyPsw($event,'modifyForm', 'pass')"
          :type="inputNew"
          auto-complete="off"
          :placeholder="$t('common.pleaseEnter')"
          @paste.native.capture.prevent
          @copy.native.capture.prevent
        >
          <template #suffix>
            <svg-icon v-if="eyesNew" @click.native="eyesNew = !eyesNew" style="cursor: pointer; margin-right: 10px" icon-class="eye" class="el-input__icon input-icon" />
            <svg-icon v-else @click.native="eyesNew = !eyesNew" style="cursor: pointer; margin-right: 10px" icon-class="eye-open" class="el-input__icon input-icon" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="checkPass" :label="$t('login.confirmPassword')">
        <el-input
          v-model="modifyForm.checkPass"
          @input="verifyPsw($event,'modifyForm', 'checkPass')"
          :type="inputAgain"
          auto-complete="off"
          :placeholder="$t('common.pleaseEnter')"
          @paste.native.capture.prevent
          @copy.native.capture.prevent
          @keyup.enter.native="handleLogin"
        >
          <template #suffix>
            <svg-icon v-if="eyesAgain" @click.native="eyesAgain = !eyesAgain" style="cursor: pointer; margin-right: 10px" icon-class="eye" class="el-input__icon input-icon" />
            <svg-icon v-else @click.native="eyesAgain = !eyesAgain" style="cursor: pointer; margin-right: 10px" icon-class="eye-open" class="el-input__icon input-icon" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-button
          :loading="modifyLoading"
          size="medium"
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleModify"
        >
          <span v-if="!modifyLoading">{{ $t('common.submit')}}</span>
        </el-button>
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-button
          size="medium"
          style="width:100%;"
          @click.native.prevent="cancelModify"
        >
          {{ $t('login.logOut') }}
        </el-button>
      </el-form-item>
    </el-form>
<!--    忘记密码-->
    <el-form v-if="!forgetShow" class="login-form posr" :model="forgetForm" ref="forgetForm" :rules="forgetRules">
      <common-flex class="posr">
        <i class="el-icon-back posa back-icon" @click="backLogin"></i>
        <h3 class="title">{{ $t('login.resetPsw') }}</h3>
      </common-flex>
      <el-form-item :label="$t('login.account')" prop="userName">
        <el-input :placeholder="$t('common.pleaseEnter') + $t('login.email')" v-model="forgetForm.userName"></el-input>
      </el-form-item>
      <el-form-item :label="$t('login.verificationCode')" class="posr" prop="code">
        <el-input :placeholder="$t('common.pleaseEnter')" v-model.number="forgetForm.code" @input="verifyCode"></el-input>
        <div class="posa send-btn">
          <el-button :loading="sendLoading" type="text" :disabled="hasSend" @click="sendCode">{{ sendText }}</el-button>
        </div>
      </el-form-item>
      <el-form-item :label="$t('login.newPassword')" prop="password">
        <el-input :type="inputNew"
                  @copy.native.capture.prevent
                  @paste.native.capture.prevent
                  :placeholder="$t('common.pleaseEnter')"
                  @input="verifyPsw($event,'forgetForm', 'password')"
                  v-model="forgetForm.password">
          <template #suffix>
            <svg-icon v-if="eyesNew" @click.native="eyesNew = !eyesNew" style="cursor: pointer; margin-right: 10px" icon-class="eye" class="el-input__icon input-icon" />
            <svg-icon v-else @click.native="eyesNew = !eyesNew" style="cursor: pointer; margin-right: 10px" icon-class="eye-open" class="el-input__icon input-icon" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item @paste.native.capture.prevent
                    @copy.native.capture.prevent
                    :label="$t('login.confirmPassword')"
                    prop="againPassword">
        <el-input :type="inputAgain" :placeholder="$t('common.pleaseEnter')"
                  @input="verifyPsw($event,'forgetForm', 'againPassword')"
                  v-model="forgetForm.againPassword">
          <template #suffix>
            <svg-icon v-if="eyesAgain" @click.native="eyesAgain = !eyesAgain" style="cursor: pointer; margin-right: 10px" icon-class="eye" class="el-input__icon input-icon" />
            <svg-icon v-else @click.native="eyesAgain = !eyesAgain" style="cursor: pointer; margin-right: 10px" icon-class="eye-open" class="el-input__icon input-icon" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="">
        <el-button :loading="loading" style="width: 100%" type="primary" @click="reset">{{ $t('common.reset') }}</el-button>
      </el-form-item>
    </el-form>
    <el-dialog
      :visible.sync="dialogShow"
      width="20%"
      :show-close="false"
      :before-close="beforeClose"
      :close-on-click-modal ="false"
      center>
      <span style="line-height: 24px">{{ $t('login.changePswSuccess') }} ({{ second }}s {{ $t('login.backLoginPage') }})</span>
      <span slot="footer" class="dialog-footer"><el-button type="primary" @click="beforeClose">OK</el-button></span>
    </el-dialog>
  </div>
</template>

<script>
import { getCodeImg } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from '@/utils/jsencrypt'
import { updateUserPwd, forgetResetPas, sendCode } from "@/api/system/user";
import {mapGetters, mapMutations} from "vuex";
import {setStorage} from "@sub/utils/language";

export default {
  name: "Login",
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('common.pleaseEnter')));
      } else {
        const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)(?![^a-zA-Z0-9]+$)[^\u4e00-\u9fa5]{8,16}$/
        if (reg.test(value)) {
          callback()
        } else callback(new Error('8-16 digital words, at least two of them: letters / numbers / symbols'))
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('login.pleaseEnterAgain')));
      } else if (value !== this.modifyForm.pass) {
        callback(new Error(this.$t('login.passwordInconsistent')));
      } else {
        callback();
      }
    }
    const validatePass3 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('login.pleaseEnterAgain')));
      } else if (value !== this.forgetForm.password) {
        callback(new Error(this.$t('login.passwordInconsistent')));
      } else {
        callback();
      }
    }
    return {
      eyes: true,
      eyesAgain: true,
      eyesNew: true,
      countTimer: null,
      second: 3,
      dialogShow: false,
      timer: null,
      sendText: this.$t('login.send'),
      hasSend: false,
      modifyPas: true,
      forgetShow: true,
      token: '',
      codeUrl: "",
      loginForm: {
        username: "",
        password: "",
        rememberMe: false,
        uuid: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: this.$t('common.pleaseEnter') + this.$t('login.account') }
        ],
        password: [
          { required: true, trigger: "blur", message: this.$t('common.pleaseEnter') + this.$t('login.password') }
        ],
        // code: [{ required: true, trigger: "blur", message: "Please enter the verification code" }]
      },
      loading: false,
      demoLoading: false,
      sendLoading: false,
      modifyForm: {
        pass: '',
        checkPass: ''
      },
      modifyRules: {
        pass: [
          { required: true, validator: validatePass, trigger: 'blur'}
        ],
        checkPass: [
          { required: true, validator: validatePass2, trigger: 'blur'}
        ],
      },
      forgetForm: {
        userName: '',
        code: '',
        password: '',
        againPassword: '',
      },
      forgetRules: {
        userName: [
          { required: true, message: this.$t('common.pleaseEnter'), trigger: 'blur' },
          { type: 'email', message: this.$t('login.formatIncorrect'), trigger: ['blur', 'change'] }
        ],
        code: [
          { required: true, message: this.$t('common.pleaseEnter'), trigger: 'blur' }
        ],
        password: [
          { required: true, validator: validatePass, trigger: 'blur'}
        ],
        againPassword: [
          { required: true, validator: validatePass3, trigger: 'blur'}
        ],
      },
      modifyLoading: false,
      // 验证码开关
      captchaEnabled: true,
      // 注册开关
      register: false,
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
        if (this.redirect === '/') this.redirect ='/index'
      },
      immediate: true
    }
  },
  computed: {
    ...mapGetters({
      activeLang: 'language'
    }),
    inputType() {
      return this.eyes ? 'password' : 'text'
    },
    inputNew() {
      return this.eyesNew ? 'password' : 'text'
    },
    inputAgain() {
      return this.eyesAgain ? 'password' : 'text'
    },
  },
  created() {
    // this.getCode()
    this.getCookie()
  },
  methods: {
    ...mapMutations({
      setLanguage: 'language/setLanguage'
    }),
    handleCommand(value) {
      this.$i18n.locale = value
      this.setLanguage(value)
      setStorage('lang', value)
      this.$modal.msgSuccess(this.$t('common.succeeded'))
      location.reload()
    },
    verifyCode(e) {
      this.forgetForm.code = e.replace(/\D/g, '')
    },
    verifyPsw(v, base, str) {
      this[base][str] = v.replace(/\s+/g,"")
    },
    backLogin() {
      this.forgetShow = true
      Object.keys(this.forgetForm).forEach(i => {
        this.forgetForm[i] = ''
      })
    },
    openDialog() {
      this.dialogShow = true
      this.second = 3
      setTimeout(() => {
        this.second = 2
      }, 1000)
      setTimeout(() => {
        this.second = 1
      }, 2000)
      setTimeout(() => {
        this.second = 0
        this.beforeClose()
      }, 3000)
    },
    beforeClose() {
      this.dialogShow = false
      this.forgetShow = true
    },
    reset() {
      this.$refs.forgetForm.validate(v => {
        if (v) {
          this.loading = true
          forgetResetPas(this.forgetForm).then(res => {
            if (+res.code === 200) {
              this.$message({
                type: 'success',
                message: this.$t('common.succeeded')
              })
              setTimeout(() => {
                this.openDialog()
              }, 500)
            }
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    // 忘记密码短信验证码
    sendCode() {
      this.$refs.forgetForm.validateField('userName', v => {
        if (!v) {
          this.hasSend = true
          this.sendLoading = true
          let data = {
            userName: this.forgetForm.userName
          }
          sendCode(data).then(res => {
            if (+res.code === 200) {
              this.$message({
                type: 'success',
                message: this.$t('common.succeeded')
              })
              this.sendLoading = false
              let count = 60
              clearInterval(this.timer)
              this.timer = setInterval(() => {
                count--
                if (count < 1) {
                  clearInterval(this.timer)
                  this.sendText = this.$t('login.send')
                  this.hasSend = false
                  return
                }
                this.sendText = `${count}s`
              }, 1000)
            }
          }).catch(() => this.hasSend = true)
        }
      })
    },
    // log out
    cancelModify() {
      this.modifyPas = true
      this.getCode()
      this.loginForm.code = ''
      this.modifyForm.pass = this.modifyForm.checkPass = ''
    },
    getCode() {
      getCodeImg().then(res => {
        this.captchaEnabled = res.captchaEnabled === undefined ? true : res.captchaEnabled;
        if (this.captchaEnabled) {
          this.codeUrl = "data:image/gif;base64," + res.img
          this.loginForm.uuid = res.uuid
        }
      });
    },
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get('rememberMe')
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      };
    },
    // 修改验证
    handleModify() {
      this.$refs.modifyForm.validate(v => {
        if (v) {
          // 修改密码接口
          this.modifyLoading = true
          // 修改密码成功后 再 登录一次设置token admin admin123
          updateUserPwd(this.loginForm.password, this.modifyForm.pass).then(res => {
            if (+res.code === 200) {
              this.modifyLoading = false
              this.$message({
                type: 'success',
                message: this.$t('common.succeeded')
              })
              if (this.loginForm.rememberMe) {
                Cookies.set("username", this.loginForm.username, { expires: 30 });
                Cookies.set("password", encrypt(this.modifyForm.pass), { expires: 30 });
                Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 });
              } else {
                Cookies.set("username", this.loginForm.username, { expires: 30 });
                Cookies.remove("password");
                Cookies.remove('rememberMe');
              }
              let data = {
                username: this.loginForm.username,
                password: this.modifyForm.pass,
                rememberMe: this.loginForm.rememberMe
              }
              this.$store.dispatch("Login", data).then((res) => {
                this.$router.push({ path: this.redirect || "/index" })
              }).catch(() => {

              })
            }
          }).finally(() => {
            this.modifyLoading = false
          })
        }
      })
    },
    handleLoginDemo() {
      this.demoLoading = true
      Cookies.remove("password")
      Cookies.remove('rememberMe')
      let data = {
        username: 'demo@163.com',
        password: 'Test123456',
        rememberMe: false,
      }
      this.$store.dispatch("Login", data).then((res) => {
        this.$router.push({ path: this.redirect || "/index" }).catch(()=>{})
      }).finally(() => {
        this.demoLoading = false
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set("username", this.loginForm.username, { expires: 30 });
            Cookies.set("password", encrypt(this.loginForm.password), { expires: 30 });
            Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 });
          } else {
            Cookies.set("username", this.loginForm.username, { expires: 30 });
            Cookies.remove("password");
            Cookies.remove('rememberMe');
          }
          this.$store.dispatch("Login", this.loginForm).then((res) => {
            if (+res.changePassword === 2) this.modifyPas = false // 未修改过密码，强制修改
            else this.$router.push({ path: this.redirect || "/index" }).catch(()=>{})
          }).catch(() => {
            if (this.captchaEnabled) {
              this.getCode()
            }
          }).finally(() => {
            this.loading = false
          })
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.forget-pas {
  @include nFont(12 #3EBCD4);
  cursor: pointer;
}
.back-icon {
  left: 0;
  top: 0;
  &:before {
    font-size: 30px;
    cursor: pointer;
  }
}
.send-btn {
  right: 10px;
  bottom: 0;
  cursor: pointer;
}
.login {
  padding-right: 3vw;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
  background-color: #3EBCD4;
  background-size: cover;
  &-bg {
    z-index: 1;
    top: 50%;
    left: 10%;
    transform: translateY(-50%);
  }
  .el-dialog:not(.is-fullscreen) {
    margin-top: 40vh !important;
  }
  .language {
    top: 12px;
    right: 12px;
    .el-dropdown-link {
      cursor: pointer;
    }
    .el-dropdown-menu {
      .is-disabled {
        cursor: default;
        color: $commonColor !important;
        pointer-events: none;
      }
    }
  }
}
.title {
  margin: 0 auto 30px auto;
  text-align: left !important;
  color: #3EBCD4 !important;
}

.login-form {
  z-index: 2;
  border-radius: 6px;
  background: #ffffff;
  width: 430px;
  padding: 25px 25px 5px 25px;
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}
.login-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.login-code-img {
  height: 38px;
}
</style>
