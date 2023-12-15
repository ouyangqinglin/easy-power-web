<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" v-if="!topNav"/>
    <top-nav id="topmenu-container" class="topmenu-container" v-if="topNav"/>
    <div class="right-menu">
<!--      <template v-if="device!=='mobile'">-->
<!--        <search id="header-search" class="right-menu-item" />-->
<!--        <screenfull id="screenfull" class="right-menu-item hover-effect" />-->
<!--        <el-tooltip content="布局大小" effect="dark" placement="bottom">-->
<!--          <size-select id="size-select" class="right-menu-item hover-effect" />-->
<!--        </el-tooltip>-->
<!--      </template>-->
    </div>
    <div class="right-menu">
      <el-dropdown class="avatar-container right-menu-item hover-effect">
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/user/profile" v-if="userName !== 'demo@163.com'">
            <el-dropdown-item>My Details</el-dropdown-item>
          </router-link>
<!--          <el-dropdown-item @click.native="setting = true">-->
<!--            <span>Layout Settings</span>-->
<!--          </el-dropdown-item>-->
          <el-dropdown-item divided @click.native="logout">
            <span>Log out</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
<!--    <div class="right-menu">-->
<!--      <el-dropdown @command="handleCommand">-->
<!--        <span class="el-dropdown-link">-->
<!--          <common-flex align="center">-->
<!--          <img :src="require('@subImg/locale.svg')" alt="" style="width: 20px;" class="mr-1">-->
<!--          {{ $t('common.language') }}-->
<!--          <i class="el-icon-caret-bottom" />-->
<!--        </common-flex>-->
<!--        </span>-->
<!--        <template #dropdown>-->
<!--          <el-dropdown-menu class="lang-item">-->
<!--            <el-dropdown-item command="zh_CN" :disabled="activeLang === 'zh_CN'">cn-简体中文</el-dropdown-item>-->
<!--            <el-dropdown-item command="en_US" :disabled="activeLang === 'en_US'">us-English</el-dropdown-item>-->
<!--          </el-dropdown-menu>-->
<!--        </template>-->
<!--      </el-dropdown>-->
<!--    </div>-->
  </div>
</template>

<script>
import {mapGetters, mapState} from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import TopNav from '@/components/TopNav'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'
import RuoYiGit from '@/components/RuoYi/Git'
import RuoYiDoc from '@/components/RuoYi/Doc'

export default {
  components: {
    Breadcrumb,
    TopNav,
    Hamburger,
    Screenfull,
    SizeSelect,
    Search,
    RuoYiGit,
    RuoYiDoc
  },
  data() {
    return {
      activeLang: 'en_US'
    }
  },
  computed: {
    ...mapState({
      'userName': (state) => state.user.name
    }),
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ]),
    setting: {
      get() {
        return this.$store.state.settings.showSettings
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'showSettings',
          value: val
        })
      }
    },
    topNav: {
      get() {
        return this.$store.state.settings.topNav
      }
    },
  },
  created() {
    this.activeLang = localStorage.getItem("lang") || 'en_US'
  },
  methods: {
    handleCommand(value) {
      this.$i18n.locale = value
      localStorage.setItem("lang", value)
      this.activeLang = localStorage.getItem("lang")
      this.$modal.msgSuccess(this.$t('common.succeeded'))
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      this.$confirm('Are you sure to log out and exit the system?', 'Tips', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('LogOut').then(() => {
          location.href = '/index';
        })
      }).catch(() => {});
    }
  }
}
</script>

<style lang="scss">
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .topmenu-container {
    position: absolute;
    left: 50px;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
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
</style>
