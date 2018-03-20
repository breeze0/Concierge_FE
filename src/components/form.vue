<template>
  <div class="form-com-container">
    <div class="return_to_prev">
      <router-link to="/admin"><i class="el-icon-back"></i></router-link>
      <span>创建新预约项目</span>
    </div>
    <div class="form-wrapper">
      <el-form ref="form" :model="form">
        <el-form-item>
          <div class="form-item-desc">预约项目封面</div>
          <div class="img-wrapper">
            <img :src="form.cover" class="form-cover">
            <div class="change-cover-btn">
              <el-button type="primary" size="small" @click="modalVisible = true">更换封面</el-button>
              <el-dialog
                title="更换封面"
                :visible.sync="modalVisible"
                width="700px"
                center>
                <span>需要注意的是内容是默认不居中的</span>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="modalVisible = false">取 消</el-button>
                  <el-button type="primary" @click="modalVisible = false">确 定</el-button>
                </span>
              </el-dialog>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        form: {
          cover: require('@/assets/images/logo.png')
        },
        modalVisible: false
      } 
    }
  }
</script>