<template>
  <n-card title="个人信息">
    <n-space justify="center" :size="60" class="w-full grid grid-cols-2">
      <div
          class="relative avatar-box"
          v-if="user"
      >
        <n-avatar
            :src="`/static/${user.avatar_url}`" style="height: 400px;width: 400px;" round/>
        <label class="mask" for="avatarUpload">
        </label>
        <input ref="fileInputRef" hidden type="file" id="avatarUpload" class="h-full w-full" @change="uploadAvatar">
      </div>

      <el-descriptions
          title="我的资料"
          :column="1"
          size="large"
          border
          v-if="user"
      >
        <el-descriptions-item width="300px">
          <template #label>
            <div class="cell-item">
              <el-icon :style="{verticalAlign:'text-bottom'}">
                <IconUser/>
              </el-icon>
              用户名
            </div>
          </template>
          {{ user.username }}
        </el-descriptions-item>

        <el-descriptions-item width="300px">
          <template #label>
            <div class="cell-item">
              <el-icon :style="{verticalAlign:'text-bottom'}">
                <IconUser/>
              </el-icon>
              昵称
            </div>
          </template>
          {{ user.nickname }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon :style="{verticalAlign:'text-bottom'}">
                <tickets/>
              </el-icon>
              身份
            </div>
          </template>
          <el-tag size="large" v-if="user.user_type===Role.teacher">老师</el-tag>
          <el-tag size="large" v-if="user.user_type===Role.student">学生</el-tag>
        </el-descriptions-item>
        <el-descriptions-item v-if="user.user_type===Role.student">
          <template #label>
            <div class="cell-item">
              <el-icon :style="{verticalAlign:'text-bottom'}">
                <office-building/>
              </el-icon>
              所在班级
            </div>
          </template>

          <n-select :value="join_classesOpt.map(item=>item.value)" multiple :options="join_classesOpt"/>
        </el-descriptions-item>
        <el-descriptions-item v-if="user.user_type===Role.teacher">
          <template #label>
            <div class="cell-item">
              <el-icon :style="{verticalAlign:'text-bottom'}">
                <office-building/>
              </el-icon>
              我创建的班级
            </div>
          </template>
          <n-select :value="create_classesOpt.map(item=>item.value)" multiple :options="create_classesOpt"/>
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon :style="{verticalAlign:'text-bottom'}">
                <Present/>
              </el-icon>
              加入时间
            </div>
          </template>
          {{ getLocalTimeFormat(user.create_time) }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon :style="{verticalAlign:'text-bottom'}">
                <Key/>
              </el-icon>
              uid
            </div>
          </template>
          {{ user.id }}
        </el-descriptions-item>


      </el-descriptions>


    </n-space>

  </n-card>
</template>

<script setup lang="ts">
import {
  OfficeBuilding,
  Tickets,
  Present,
  User as IconUser,
  Key
} from '@element-plus/icons-vue'
import {ApiGetUserProfile, ApiUploadAvatar} from "@/apis/user";
import {UserProfile} from "@/types/api-user";
import {Role} from "@/types/api-user";
import {getLocalTimeFormat} from "@/utils/tools";
import {get} from "lodash";

const user = ref<UserProfile>()
const join_classesOpt = ref<any>([])
const create_classesOpt = ref<any>([])
onMounted(async () => {
  const userResult = await ApiGetUserProfile()
  const userData = userResult.data;
  console.log(userData)
  user.value = userData
  join_classesOpt.value = userData.join_classes.map(item => ({
    label: item.name,
    value: item.id
  }))
  create_classesOpt.value = userData.created_classes.map(item => ({
    label: item.name,
    value: item.id
  }))

})
const fileInputRef = ref(null)
const uploadAvatar = async () => {
  if (fileInputRef.value === null) {
    await nextTick()
  }
  const fileChoice = unref(fileInputRef)
  if (fileChoice === null) return;
  const file = get(fileChoice, 'files[0]', null) as (File | null);
  if (file === null) return;
  await ApiUploadAvatar(file, file.name)

}
</script>

<style scoped lang="scss">
.mask {
  transition: all .3s linear;
  background: transparent;
  height: 400px;
  width: 400px;
  @apply absolute top-0 left-0 rounded-full  text-3xl text-white cursor-pointer select-none;
  &:after {
    content: '更换头像';
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: transparent;
  }
}

.avatar-box:hover .mask {
  background: rgba(1, 1, 1, 0.4); /* 前三个代表颜色，最后一个代表透明度 */
  &:after {
    color: white;
  }
}
</style>