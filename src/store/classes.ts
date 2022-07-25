import {defineStore} from "pinia";
import {ApiFindClassesDetail, ApiFindClassesList} from "@/apis/classes";
import {ClassesResult} from "@/types/api-classes";

const store = {
    state: () => {
        return {
            classesList: [] as ClassesResult[]
        }
    },
    actions: {
        async getClassesList() {
            const list = await ApiFindClassesList()
            this.classesList = list.data;
            return this.classesList;
        },
    },
    getters: {
        getClassesDetail: (state) => {
            return async (id) => {
                const classes = await ApiFindClassesDetail(id)
                console.log({classes})
            }
        },
        nameOption() {
            return this.classesList.map(
                item => {
                    const value = `${item.name}-${item.id}`
                    console.log(value)
                    return {
                        label: value, value
                    }
                }
            )
        },
        tableColumn() {
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
                }
            ]
        }
    }
}

export const useClassesStore = defineStore("classes", store);
