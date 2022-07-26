<template>


  <n-card title="搜索您的班级">
    <n-input-group>
      <n-input
          v-model:value="searchInput"
          :style="{ width: '50%' }"
          placeholder="班级名称" size="large"/>
      <n-button ghost size="large" type="primary" @click="filterClasses">
        搜索
      </n-button>
    </n-input-group>
  </n-card>

  <n-card>
    <n-data-table
        :columns="columns"
        :data="data"
        :max-height="550"

    />
  </n-card>
</template>

<script lang="ts" setup>
import type {DataTableColumns} from 'naive-ui'
import {NButton} from 'naive-ui'
import {ApiFindClassesList, ApiJoinClass} from "@/apis/classes";
import ClassesAction from "@/components/classes-action";
import {ClassesResult} from "@/types/api-classes";
import {get, isEmpty} from "lodash";


type Classes = {
  id: number,
  name: string,
  create_time: string,
}

const createColumns = (row): DataTableColumns<Classes> => {
  return [
    {
      title: 'No',
      key: 'id'
    },
    {
      title: '名称',
      key: 'name'
    },
    {
      title: '创建时间',
      key: 'create_time'
    },
    {
      title: 'Action',
      key: 'actions',
      render(record: ClassesResult) {
        const clickHandler = () => row.joinClasses(record)
        return h(
            ClassesAction,
            {
              clickHandler,
              userList: record.users
            },
        )
      }
    }
  ]
}

const searchInput = ref("")
const filterClasses = () => {
  const originData: ClassesResult[] = get(unref(res), 'data') || [];
  console.log(res);
  if (isEmpty(originData)) return;
  data.value = originData.filter(c => c.name.includes(unref(searchInput)))
  console.log(data.value)
  console.log(searchInput.value);
}
const res = ref(null);
const data = ref<ClassesResult[]>([]);

const loadData = async () => {
  res.value = await ApiFindClassesList()
  data.value = res.value.data;
}

watchEffect(() => loadData());

const columns = createColumns({
  joinClasses(row: Classes) {
    return ApiJoinClass(row.id).then(loadData);
  }
})
</script>

<style scoped>

</style>