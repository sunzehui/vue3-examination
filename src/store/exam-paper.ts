import {defineStore} from "pinia";
import {useLocalStorage} from "@vueuse/core";
import {ApiGetExamPaper} from "@/apis/exam-paper";

export const useExamPaperStore = defineStore("exam-paper", {
    state: () => {
        return {
            examPaper: useLocalStorage('exam-paper', {} as any)
        }
    },
    actions: {
        async getExamPaperList() {
            const result = await ApiGetExamPaper();
            return result.data;
        }
    },
    getters: {}
});
