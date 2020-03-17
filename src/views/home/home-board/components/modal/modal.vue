<template>
  <el-dialog
    :visible="visible"
    width="30%"
    @close="handleClose"
    :title="`${status === 'CREATE' ? '新建' : '编辑'}看板`"
  >
    <el-form :model="model" :rules="formRules" ref="board-form">
      <el-form-item prop="title">
        <el-input placeholder="请输入看板标题(必填)" v-model="model.title"></el-input>
      </el-form-item>
      <el-form-item prop="description">
        <el-input type="textarea" placeholder="输入看板描述(可选)" v-model="model.description"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="primary" size="medium" @click="handleSubmit">新建</el-button>
      <el-button size="medium" @click="handleClose">取消</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import api from '@/api';
import { Notification } from 'element-ui';

@Component({})
export default class BoardModal extends Vue {
  visible = false;
  status = 'CREATE'; // 'CREATE' or 'UPDATE'
  model = {
    title: '',
    description: ''
  };

  formRules = {
    title: [
      { required: true, message: '请输入看板标题', trigger: 'blur' }
    ]
  };

  show (board, status) {
    this.status = status;
    if (status !== 'CREATE') {
      this.model = board;
    }
    this.visible = true;
  }

  hide () {
    this.visible = false;
  }

  handleClose () {
    this.hide();
    this.$emit('on-close');
  }

  handleSubmit () {
    const form: any = this.$refs['board-form'];
    form.validate((isValid) => {
      if (isValid) {
        api.board.createBoard(this.model).then(() => {
          Notification({
            type: 'success',
            title: '新建成功',
            message: ''
          });
          this.$emit('on-submit');
        }).catch(err => {
          Notification({
            type: 'error',
            title: '新建失败',
            message: err.message
          });
        });
      }
    });
  }
}
</script>
