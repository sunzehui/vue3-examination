import {NIcon} from 'naive-ui'
import {Component} from 'vue'
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import {TagStatus} from "@/enum/tag-status";
import {ElLoading} from "element-plus";

dayjs.extend(utc)
dayjs.extend(timezone)

export function renderIcon(icon: Component) {
    return () => h(NIcon, null, {default: () => h(icon)});
}


export function getLocalTime(time: string) {
    return +dayjs(time).tz("Asia/Shanghai")
}

export function getTagStatus(start: string, end: string) {
    const now = dayjs();
    const localStart = dayjs(start).tz("Asia/Shanghai");
    const localEnd = dayjs(end).tz("Asia/Shanghai");

    const isBefore = now.isBefore(localStart);
    const isAfter = now.isAfter(localEnd)
    if (isBefore) {
        return TagStatus.wait
    } else if (isAfter) {
        return TagStatus.off
    }
    return TagStatus.on;
}

export function splitByIndex(str: string, idxArr: number[]) {
    let strArr: string[] = []
    idxArr.reduce((acc, cur, idx, arr) => {
        let subStr = ''
        if (idx === arr.length - 1) {
            subStr = str.slice(acc, cur) + str.slice(cur)
        } else {
            subStr = str.slice(acc, cur)
        }
        strArr.push(subStr)
        return cur;
    }, 0);
    return strArr;
}