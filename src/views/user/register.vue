<script lang="ts" setup>
import useRegister from "@/composables/useRegister";
import {
  defineRule,
  ErrorMessage,
  Field as VField,
  Form as VForm,
} from "vee-validate";
import { Role } from "@/types/api-user";

defineRule("confirmed", (value, [other]) => {
  if (value !== other) {
    return "两次输入的密码不一致！";
  }
  return true;
});

const {
  onSubmit,
  username,
  userRole,
  nickname,
  password,
  usernameRule,
  passwordRule,
  classes,
} = useRegister();
</script>

<template>
  <div class="flex items-center justify-center min-h-full px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-xs space-y-6 -translate-y-1/3">
      <div>
        <h3 class="text-3xl font-bold text-center">
          注册
          <NDivider vertical />
          在线考试系统
        </h3>
      </div>
      <VForm class="mt-8 space-y-2" @submit="onSubmit">
        <div class="space-y-3 rounded-md shadow-sm">
          <div>
            <label class="sr-only">昵称</label>
            <VField
              v-model="nickname"
              autocomplete="nickname"
              class="exam-input"
              name="nickname"
              placeholder="昵称"
              type="text"
            />
          </div>
          <div>
            <label class="sr-only" for="email-address">手机号码/邮箱</label>
            <VField
              id="email-address"
              v-model="username"
              :rules="usernameRule"
              autocomplete="email"
              class="exam-input"
              name="email"
              placeholder="手机号码/邮箱"
              type="email"
            />
            <ErrorMessage
              class="text-xs italic text-red-500"
              name="email"
            ></ErrorMessage>
          </div>

          <div class="relative">
            <label class="sr-only" for="password">密码</label>
            <VField
              id="password"
              v-model="password"
              :rules="passwordRule"
              autocomplete="current-password"
              class="exam-input"
              name="password"
              placeholder="密码"
              type="password"
            />

            <ErrorMessage
              class="text-xs italic text-red-500"
              name="password"
            ></ErrorMessage>
          </div>
          <div class="relative">
            <label class="sr-only" for="password2">重复密码</label>
            <VField
              id="password2"
              autocomplete="current-password"
              class="exam-input"
              name="password2"
              placeholder="请再次输入密码"
              rules="confirmed:@password"
              type="password"
            />

            <ErrorMessage
              class="text-xs italic text-red-500"
              name="password2"
            ></ErrorMessage>
          </div>
          <div>
            <label>身份：</label>
            <n-radio-group v-model:value="userRole" name="role">
              <n-radio-button :value="Role.student" label="我是学生" />
              <n-radio-button :value="Role.teacher" label="我是老师" />
            </n-radio-group>
          </div>

          <n-select
            v-if="userRole === Role.student"
            v-model:value="classes.select"
            :options="classes.list"
          />
        </div>

        <div>
          <button
            class="group relative w-full flex justify-center px-4 border border-transparent text-sm py-2.5 font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            type="submit"
          >
            注册
          </button>
        </div>
        <div class="flex justify-center w-full gap-x-5">
          <router-link class="text-blue-400" to="/login"> 登录</router-link>
        </div>
      </VForm>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.eye_open,
.eye_close {
  @apply absolute top-1/2 right-2 h-full w-8 -translate-y-1/2;
  svg {
    @apply w-4 h-4 absolute top-1/2 right-2 -translate-y-1/2;
  }
}

.on-active {
  @apply focus:ring-indigo-500 focus:border-indigo-500 focus:z-10;
}

.exam-input {
  @apply appearance-none relative block w-full px-3 py-2 border border-gray-200 placeholder-gray-300 text-gray-900 rounded-md sm:text-sm h-10;
  @extend .on-active;
}
</style>
