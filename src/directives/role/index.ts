import {Role} from "@/types/api-user";
import {useUserStore} from "@/store/user";

export default {
    async mounted(el: HTMLElement, binding: any) {
        const userStore = useUserStore()
        const role = binding.value;
        if (role !== userStore.role) {
            el.style.display = 'none'
        }
    },
}
