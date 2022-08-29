import {defineStore} from "pinia";
import {ClassesResult} from "@/types/api-classes";
import {isArray, isEmpty} from "lodash-es";

export const useClassesStore = defineStore("classes", {
    state: () => {
        return {
            classesList: [] as ClassesResult[],
        };
    },
    getters: {
        cachedList(state) {
            const list = state.classesList
            if (!isArray(list)) return null;
            if (isEmpty(list)) return null;
            return list;
        },
        studentColumn() {
            return [
                {
                    title: "No",
                    key: "id",
                },
                {
                    title: "名称",
                    key: "nickname",
                },
                {
                    title: "创建时间",
                    key: "create_time",
                },
            ];
        },
        tableColumn() {
            return [
                {
                    title: "No",
                    key: "id",
                },
                {
                    title: "名称",
                    key: "name",
                },
                {
                    title: "创建时间",
                    key: "create_time",
                },
            ];
        },
    },
});
