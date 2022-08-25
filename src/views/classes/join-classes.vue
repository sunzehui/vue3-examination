<script lang="ts" setup>
import {DataTableColumn, NButton} from 'naive-ui'
import {ApiFindClassesList, ApiJoinClass} from "@/apis/classes";
import ClassesAction from "@/components/classes-action";
import {ClassesResult} from "@/types/api-classes";
import {get, isEmpty} from "lodash-es";


// 列表搜索
const searchInput = ref("")
const originData = ref<ClassesResult[]>([]);
// 展示过滤后的data
const sanitizedData = computed(() => {
  const oData = unref(originData)
  if (isEmpty(oData)) return [];
  return oData.filter(c => c.name.includes(unref(searchInput)))
});

const loadData = async () => {
  const result = await ApiFindClassesList()
  originData.value = result.data
}

watchEffect(() => loadData());

const createColumns = (): (DataTableColumn | { render: (row: any) => any })[] => {
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
        const clickHandler = async () => {
          return await ApiJoinClass(record.id).then(loadData);
        }
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

const columns = createColumns()
</script>

<template>
  <n-card title="搜索您的班级">
    <n-input-group>
      <n-input
          v-model:value="searchInput"
          :style="{ width: '50%' }"
          placeholder="班级名称" size="large"/>
    </n-input-group>
  </n-card>

  <n-card>
    <n-data-table
        :columns="columns"
        :data="sanitizedData"
        :max-height="550"
    />
  </n-card>
</template>
