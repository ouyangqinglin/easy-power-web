<template>
  <el-form ref="form" :model="user" :rules="rules">
    <el-form-item label="Old Password" prop="oldPassword">
      <el-input
        @paste.native.capture.prevent
        @copy.native.capture.prevent
        v-model="user.oldPassword" placeholder="Please enter" type="password" show-password/>
    </el-form-item>
    <el-form-item label="New Password" prop="newPassword">
      <el-input
        @paste.native.capture.prevent
        @copy.native.capture.prevent
        v-model="user.newPassword" placeholder="Please enter" type="password" show-password/>
    </el-form-item>
    <el-form-item label="Please confirm" prop="confirmPassword">
      <el-input @paste.native.capture.prevent
                @copy.native.capture.prevent
                v-model="user.confirmPassword" placeholder="Please enter" type="password" show-password/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" @click="submit">Save</el-button>
      <el-button plain type="primary" size="mini" @click="close">Cancel</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { updateUserPwd } from "@/api/system/user";
import Cookies from "js-cookie";

export default {
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please enter'));
      } else {
        const reg = /(?!.*\s)(?!^[\u4e00-\u9fa5]+$)(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{8,16}$/
        if (reg.test(value)) {
          callback()
        } else callback(new Error('8-16 digital words, at least two of them: letters / numbers / symbols'))
      }
    }
    const equalToPassword = (rule, value, callback) => {
      if (this.user.newPassword !== value) {
        callback(new Error("The two input passwords are inconsistent!"));
      } else {
        callback();
      }
    }
    return {
      user: {
        oldPassword: undefined,
        newPassword: undefined,
        confirmPassword: undefined
      },
      // 表单校验
      rules: {
        oldPassword: [
          { required: true, message: "Please enter", trigger: "blur" }
        ],
        newPassword: [
          { required: true, message: "Please enter", trigger: "blur" },
          { required: true, validator: validatePass, trigger: "blur" }
        ],
        confirmPassword: [
          { required: true, message: "Please enter", trigger: "blur" },
          { required: true, validator: equalToPassword, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          updateUserPwd(this.user.oldPassword, this.user.newPassword).then(response => {
            this.$modal.msgSuccess("Succeeded");
            setTimeout(() => {
              this.$store.dispatch('LogOut').then(() => {
                location.href = '/index';
              })
              Cookies.remove("password");
            }, 200)
          });
        }
      });
    },
    close() {
      this.$tab.closePage();
    }
  }
};
</script>
