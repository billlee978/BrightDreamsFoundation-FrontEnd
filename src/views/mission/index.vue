<template>
  <div class="app-container">
    <!--查询表单-->
    <div class="search-div">
      <el-row style="display:flex">
        <el-button type="success" icon="el-icon-plus" size="mini" @click="dialogVisible = true">添 加</el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" @click="batchRemove()">批量删除</el-button>
      </el-row>
    </div>
    <el-table
      v-loading="isLoading"
      :data="tableData"
      stripe
      style="width: 100%;margin-top: 10px;"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" />
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="任务类型">
              <span>{{ props.row.kindName }}</span>
            </el-form-item>
            <el-form-item label="目标次数 / 时长">
              <span>{{ props.row.targetNum }}</span>
            </el-form-item>
            <el-form-item label="奖励">
              <span>{{ props.row.reward }}</span>
            </el-form-item>
            <el-form-item label="结束日期">
              <span>{{ props.row.deadline }}</span>
            </el-form-item>
            <el-form-item label="开始日期">
              <span>{{ props.row.releaseDate === null ? '请先发布' : props.row.releaseDate }}</span>
            </el-form-item>
            <el-form-item label="状态">
              <span>{{ props.row.released ? '已发布' : '未发布' }}</span>
            </el-form-item>
            <el-form-item label="任务详细描述" style="width: 100%;">
              <span>{{ props.row.description }}</span>
            </el-form-item>
            <el-form-item label="任务上传文件" style="width: 100%;">
              <el-image
                :src="props.row.pictureURL"
                style="width: 200px; height: 200px;"
              />
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        label="任务编号"
        prop="id"
      />
      <el-table-column
        label="任务名"
        prop="missionName"
      />
      <el-table-column
        label="简短描述"
      >
        <template slot-scope="scope">{{ scope.row.description.substring(0,7).concat('...') }}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button :disabled="scope.row.released" type="warning" icon="el-icon-edit" size="mini" title="发布" plain @click="releaseMission(scope.row.id)">发 布</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" title="删除" plain @click="removeDataById(scope.row.id)">删 除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="fetchData"
    />
    <el-dialog title="添加任务" :visible.sync="dialogVisible" width="40%">
      <el-form ref="dataForm" :model="mission" label-width="150px" size="small" style="padding-right: 40px;">
        <el-form-item label="任务名称">
          <el-input v-model="mission.missionName" />
        </el-form-item>
        <el-form-item label="任务描述">
          <el-input v-model="mission.description" />
        </el-form-item>
        <el-form-item label="任务类型">
          <el-select v-model="mission.kind" placeholder="请选择">
            <el-option
              label="上传文件任务"
              value="0"
            />
            <el-option
              label="上传视频任务"
              value="1"
            />
            <el-option
              label="聊天任务"
              value="2"
            />
            <el-option
              label="视频通话任务"
              value="3"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="mission.kind == 2 || mission.kind == 3" label="目标次数 / 时长">
          <el-input v-model="mission.targetNum" />
        </el-form-item>
        <el-form-item label="任务奖励">
          <el-input v-model="mission.reward" />
        </el-form-item>
        <el-form-item label="结束日期">
          <el-date-picker
            v-model="mission.deadline"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="上传任务描述文件">
          <el-upload
            class="upload-demo"
            drag
            action="http://localhost:8080/mission/upload"
            multiple
            :http-request="upload"
            accept=".jpg,.png,.mp4"
            :before-upload="beforeFileUpload"
            :on-error="removeErrorUploadFile"
          >
            <i class="el-icon-upload" />
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png/mp4文件，且不超过20MB</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" icon="el-icon-refresh-right" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" icon="el-icon-check" size="small" @click="save()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/mission/mission'
export default {
  name: 'MissionList',
  // 定义数据模型
  data() {
    return {
      isLoading: true,
      total: 0, // 总记录数
      page: 1, // 页码
      limit: 10, // 每页记录数
      searchObj: {}, // 查询条件
      tableData: [],
      multipleSelection: [],
      mission: {},
      dialogVisible: false
    }
  },
  // 页面渲染成功后获取数据
  created() {
    this.fetchData()
  },
  // 定义方法
  methods: {
    fetchData(current = 1) {
      this.page = current
      // 调用api
      api.getPageList(this.page, this.limit, this.searchObj).then(response => {
        this.tableData = response.data.records
        this.total = response.data.total
        this.isLoading = false
      })
    },
    // 重置表单
    resetData() {
      this.searchObj = {}
      this.fetchData()
    },
    handleSelectionChange(selection) {
      this.multipleSelection = selection
    },
    // 批量删除
    batchRemove() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请选择要删除的记录！')
        return
      }
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 点击确定，远程调用ajax
        // 遍历selection，将id取出放入id列表
        var idList = []
        this.multipleSelection.forEach(item => {
          idList.push(item.id)
        })
        // 调用api
        return api.batchRemove(idList)
      }).then((response) => {
        this.fetchData()
        this.$message.success(response.message)
      })
    },
    removeDataById(id) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { // promise
        // 点击确定，远程调用ajax
        return api.removeById(id)
      }).then((response) => {
        this.fetchData(this.page)
        this.$message.success(response.message || '删除成功')
      })
    },
    releaseMission(id) {
      this.$confirm('此操作将发布该任务, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { // promise
        // 点击确定，远程调用ajax
        return api.releaseMission(id)
      }).then((response) => {
        this.fetchData(this.page)
        this.$message.success(response.message || '发布成功')
      })
    },
    save() {
      api.save(this.mission).then(response => {
        this.$message.success(response.message || '操作成功')
        this.dialogVisible = false
        this.fetchData(this.page)
        this.mission = {}
      })
    },
    upload(param) {
      const formData = new FormData()
      formData.append('file', param.file)
      api.upload(formData).then(response => {
        this.mission.pictureURL = response.data
      })
    },
    beforeFileUpload(file) {
      const isLt20M = file.size / 1024 / 1024 < 20
      if (!isLt20M) {
        this.$message.error('上传文件大小不能超过 20MB!')
      }
      return isLt20M
    },
    removeErrorUploadFile(file, fileList) {
      console.log(file)
      console.log(fileList)
    }
  }
}
</script>

<style>
.demo-table-expand {
    font-size: 0;
}
.demo-table-expand label {
    width: 200px;
    color: #99a9bf;
}
.demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
}
</style>