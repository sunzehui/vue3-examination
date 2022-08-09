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
    actions: {
        async getClassesList() {
            const list = await ApiFindClassesList();
            this.classesList = list.data;
            return this.classesList;
        },
        async getMineClassesList() {
            const list = await ApiFindMyClasses();
            this.classesList = list.data;
            return this.classesList;
        }
    },
    getters: {
        getClassesStudent: () => {
            return async (id: number) => {
                const studentResult = await ApiFindClassesStudent(id);

                return studentResult.data;
            };
        },
        nameOption(state) {
            return state.classesList.map((item) => {
                const value = `${item.name}-${item.id}`;
                return {
                    label: value,
                    value,
                };
            });
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
