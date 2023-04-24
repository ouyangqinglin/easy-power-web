<template>
  <div class="app-container pages-profile">
    <common-flex style="min-height: 400px">
      <el-card class="box-card" style="min-width: 360px; flex-shrink: 0">
        <div>
          <div class="text-center">
            <userAvatar :user="user" />
          </div>
          <div class="pages-profile-info">
            <div class="nickname">{{ user.nickName }}</div>
            <div class="person">
              <common-flex class="person-item" justify="space-between" align="center">
                <common-flex align="center">
                  <img :src="require('@img/home/cphone.svg')" alt="">
                  <div class="name">Phone Number</div>
                </common-flex>
                <div class="value">{{ user.phonenumber }}</div>
              </common-flex>
              <common-flex class="person-item" justify="space-between" align="center">
                <common-flex align="center">
                  <img :src="require('@img/home/cemail.svg')" alt="">
                  <div class="name">User Email</div>
                </common-flex>
                <div class="value">{{ user.userName }}</div>
              </common-flex>
            </div>
          </div>
        </div>
      </el-card>
      <el-card style="flex-grow: 1; margin-left: 20px">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="Basic information" name="userinfo">
            <userInfo :user="user" />
          </el-tab-pane>
          <el-tab-pane label="Change Password" name="resetPwd">
            <resetPwd />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </common-flex>
  </div>
</template>

<script>
import userAvatar from "./userAvatar";
import userInfo from "./userInfo";
import resetPwd from "./resetPwd";
import { getUserProfile } from "@/api/system/user";

export default {
  name: "ProfileDetails",
  components: { userAvatar, userInfo, resetPwd },
  data() {
    return {
      user: {},
      roleGroup: {},
      postGroup: {},
      activeTab: "userinfo"
    };
  },
  created() {
    this.getUser();
  },
  methods: {
    getUser() {
      getUserProfile().then(response => {
        this.user = response.data;
        this.roleGroup = response.roleGroup;
        this.postGroup = response.postGroup;
      });
    }
  }
};
</script>

<style lang="scss">
.pages-profile {
  &-info {
    .nickname {
      margin-top: 16px;
      @include nFont(20 #000 600);
      text-align: center;
    }
    .person {
      margin-top: 18px;
      &-item {
        margin-top: 54px;
        img {
          margin-right: 8px;
          @include wh(24)
        }
        .name {
          @include nFont(14 #606266)
        }
        .value { @include nFont(16 #000 600) }
      }
    }
  }
  .el-tabs__item {
    font-size: 16px;
    font-weight: 600;
  }
}
</style>
