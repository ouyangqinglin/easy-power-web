<template>
  <common-flex class="upload-file posr">
    <el-upload
      :disabled="!!fileList.length"
      multiple
      action=""
      :before-upload="handleBeforeUpload"
      :file-list="fileList"
      :limit="limit"
      :on-error="handleUploadError"
      :on-exceed="handleExceed"
      :on-success="handleUploadSuccess"
      :show-file-list="false"
      :headers="headers"
      class="upload-file-uploader"
      ref="fileUpload"
    >
      <!-- 上传按钮 -->
      <el-button size="mini" type="primary" :disabled="!!fileList.length">Upload</el-button>
      <!-- 上传提示 -->
<!--      <div class="el-upload__tip" slot="tip" v-if="showTip">-->
<!--        请上传-->
<!--        <template v-if="fileSize"> 大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b> </template>-->
<!--        <template v-if="fileType"> 格式为 <b style="color: #f56c6c">{{ fileType.join("/") }}</b> </template>-->
<!--        的文件-->
<!--      </div>-->
    </el-upload>

    <!-- 文件列表 -->
    <transition-group class="posa upload-file-list ellipsis" name="el-fade-in-linear" tag="ul">
      <div :key="file.url" class="el-upload-list__item ele-upload-list__item-content" v-for="(file, index) in fileList">
        <common-flex align="center">
          <el-link :href="`${baseUrl}${file.url}`" :underline="false" target="_blank">
            <span style="color: #FFB968">{{ getFileName(file.name) }} </span>
          </el-link>
          <img @click="handleDelete(index)" style="width: 16px; height: 16px; margin-left: 8px" :src="require('@img/delete.svg')" alt="">
        </common-flex>
      </div>
    </transition-group>
  </common-flex>
</template>

<script>
import { getToken } from "@/utils/auth";

export default {
  name: "FileUpload",
  props: {
    // 值
    value: [String, Object, Array],
    // 数量限制
    limit: {
      type: Number,
      default: 5,
    },
    // 大小限制(MB)
    fileSize: {
      type: Number,
      default: 5,
    },
    // 文件类型, 例如['png', 'jpg', 'jpeg']
    fileType: {
      type: Array,
      default: () => ["doc", "xls", "ppt", "txt", "pdf"],
    },
    // 是否显示提示
    isShowTip: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      number: 0,
      uploadList: [],
      baseUrl: process.env.VUE_APP_BASE_API,
      uploadFileUrl: process.env.VUE_APP_BASE_API + "/common/upload", // 上传的图片服务器地址
      headers: {
        Authorization: "Bearer " + getToken(),
      },
      fileList: [],
    };
  },
  watch: {
    value: {
      handler(val) {
        if (val) {
          let temp = 1;
          // 首先将值转为数组
          const list = Array.isArray(val) ? val : this.value.split(',');
          // 然后将数组转为对象数组
          this.fileList = list.map(item => {
            if (typeof item === "string") {
              item = { name: item, url: item };
            }
            item.uid = item.uid || new Date().getTime() + temp++;
            return item;
          });
        } else {
          this.fileList = [];
          return [];
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    // 是否显示提示
    showTip() {
      return this.isShowTip && (this.fileType || this.fileSize);
    },
  },
  methods: {
    // 上传前校检格式和大小
    handleBeforeUpload(file) {
      // 校检文件类型
      // if (this.fileType) {
      //   let fileExtension = "";
      //   if (file.name.lastIndexOf(".") > -1) {
      //     fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);
      //   }
      //   const isTypeOk = this.fileType.some((type) => {
      //     if (file.type.indexOf(type) > -1) return true;
      //     if (fileExtension && fileExtension.indexOf(type) > -1) return true;
      //     return false;
      //   });
      //   if (!isTypeOk) {
      //     this.$modal.msgError(`The file format is incorrect, Please upload${this.fileType.join("/")}format file!`);
      //     return false;
      //   }
      // }
      // 校检文件大小
      if (this.fileSize) {
        const isLt = file.size / 1024 / 1024 < this.fileSize;
        if (!isLt) {
          this.$modal.msgError(`The size of the uploaded file cannot exceed ${this.fileSize} MB!`);
          return false;
        }
      }
      this.$modal.loading("Uploading file...");
      this.number++;
      this.$emit('upload', file)
      return true;
    },
    // 文件个数超出
    handleExceed() {
      this.$modal.msgError(`上传文件数量不能超过 ${this.limit} 个!`);
    },
    // 上传失败
    handleUploadError(err) {
      this.$modal.msgError("上传图片失败，请重试");
      this.$modal.closeLoading()
    },
    // 上传成功回调
    handleUploadSuccess(res, file) {

      if (res.code === 200) {
        this.uploadList.push({ name: res.fileName, url: res.fileName });
        this.uploadedSuccessfully();
      } else {
        this.number--;
        this.$modal.closeLoading();
        this.$modal.msgError(res.msg);
        this.$refs.fileUpload.handleRemove(file);
        this.uploadedSuccessfully();
      }
    },
    // 删除文件
    handleDelete(index) {
      this.fileList.splice(index, 1);
      this.$emit("input", this.listToString(this.fileList));
      this.$emit('delete')
    },
    // 上传结束处理
    uploadedSuccessfully() {
      if (this.number > 0 && this.uploadList.length === this.number) {
        this.fileList = this.fileList.concat(this.uploadList);
        this.uploadList = [];
        this.number = 0;
        this.$emit("input", this.listToString(this.fileList));
        this.$modal.closeLoading();
      }
    },
    // 获取文件名称
    getFileName(name) {
      if (name.lastIndexOf("/") > -1) {
        return name.slice(name.lastIndexOf("/") + 1);
      } else {
        return "";
      }
    },
    // 对象转成指定字符串分隔
    listToString(list, separator) {
      let strs = "";
      separator = separator || ",";
      for (let i in list) {
        strs += list[i].url + separator;
      }
      return strs != '' ? strs.substr(0, strs.length - 1) : '';
    }
  }
};
</script>

<style scoped lang="scss">
.upload-file-uploader {
  margin-bottom: 5px;
}
.upload-file-list {
  top: -16px;
  left: 60px;
  max-width: 450px;
}
</style>
