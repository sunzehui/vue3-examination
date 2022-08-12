import {io} from "socket.io-client";
import {ElMessage} from "element-plus";
import {useUserStore} from "@/store/user";

enum EType {
    error,
    warring
}

function showError(error: any, type: EType = EType.error) {
    if (type === EType.warring) {
        ElMessage.warning(error)
    } else if (type === EType.error) {
        ElMessage.error(error)
    }
}

export function useSocket() {
    const userStore = useUserStore()
    const token = userStore.token;
    const socket = io("http://localhost:3000", {
        extraHeaders: {
            authorization: token ?? null
        }
    })
    socket.emit('registerUser')
    socket.on("Error", (err) => showError(err))
    socket.on('exception', (exception) => showError(exception, EType.warring))
    return {
        socket
    }
}