import {defineStore} from "pinia";
import {
    ApiFindClassesList,
    ApiFindClassesStudent, ApiFindMyClasses,
} from "@/apis/classes";
import {ClassesResult} from "@/types/api-classes";

export const useClassesStore = defineStore("classes", {
    state: () => {
        return {
            classesList: [] as ClassesResult[],
        };
    },
    getters: {
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
