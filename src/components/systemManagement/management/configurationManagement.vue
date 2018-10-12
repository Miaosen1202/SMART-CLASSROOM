<template>
  <div style="height: 100%;width: 100%;padding: 2%">

    <div style="float: left;width: 40%;height: 80%">

      <div>
        <ul>
          <li>
            <h4 style="color: #333333">{{$t('message.resourceName')}}:</h4>
            <el-input v-model="input"  size="small" :placeholder="$t('message.pleaseenter')"></el-input>
          </li>
          <li style="margin-top: 4%">
            <h4>{{$t('message.Category')}}:</h4>
            <el-select v-model="value" size="small" :placeholder="$t('message.pleaseselect')" style="display: block">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>

          </li>
          <li style="margin-top: 4%">
            <h4>{{$t('message.resourceDesc')}}:</h4>
            <el-input
              type="textarea"
              :autosize="{ minRows: 10, maxRows: 16}"
              placeholder=""
              v-model="textarea2">
            </el-input>
          </li>
        </ul>

      </div>
    </div>
    <div class="replace">
     <h4 style="margin-top: -4%;"> medin</h4>
      <div >
       <!-- <el-upload
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          multiple
          :limit="3"
          :on-exceed="handleExceed"
          :file-list="fileList">
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>-->
        <el-upload
          class="upload-demo"
          :action="action"
          :on-change="handleChange"
          :on-success="handleSuccess"
          :with-credentials="true"
          :file-list="fileList3"
          style="display: inline-block;margin: 18% 38%;">
          <img src="../../../../static/images/u550.png" alt="">
          <el-button type="primary" size="mini" style="float: right;">{{$t('message.replaceFile')}}</el-button>
        </el-upload>
      </div>

    </div>
    <el-button type="primary" size="mini" style="float: left;margin-left: 70%;">{{$t('message.update')}}</el-button>
  </div>
</template>

<script>
    export default {
        data() {
            return {
              textarea2:'',
              value: '',
              input:'',
              options: [{
                value: '选项1',
                label: '1'
              }, {
                value: '选项2',
                label: '2',
              }],
            }

        },
        methods: {
          handleRemove(file, fileList) {
            console.log(file, fileList);
          },
          handlePreview(file) {
            console.log(file);
          },
        }
    }
</script>

<style scoped="">
  .replace {
    float: left;
    background-color: #a4b7f0;
    width: 56%;
    height: 80%;
    margin-left: 4%;
    margin-top: 2%;
    border: 1px solid #bbdde5;
    border-radius: 4px;
  }
</style>
