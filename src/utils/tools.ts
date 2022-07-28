import {NIcon} from 'naive-ui'
import {Component} from 'vue'
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import {TagStatus} from "@/enum/tag-status";
import {FillBlank, QType, Question} from "@/types/api-exam-paper";
import {head} from "lodash";

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

export function splitByIndex(Q: Question, blankPos: FillBlank[]) {
    let strArr: (FillBlank & { content: string })[] = []
    if (Q.type !== QType.fill_blank) return;
    const content = Q.content
    blankPos.reduce((acc, cur, idx, arr) => {
        let subStr = ''
        if (!acc || !cur) throw new Error()
        const lastPos = Number(acc.pos);
        const curPos = Number(cur.pos);
        if (idx === arr.length - 1) {
            subStr = content.slice(lastPos, curPos) + content.slice(curPos)
        } else if (idx === 0) {
            subStr = content.slice(0, lastPos)
        } else {
            subStr = content.slice(lastPos, curPos)
        }
        strArr.push({
            ...cur,
            content: subStr
        })
        return cur;
    }, head(blankPos));
    return strArr;
}