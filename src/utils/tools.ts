import {NIcon} from "naive-ui";
import {Component} from "vue";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {TagStatus} from "@/enum/tag-status";
import {FillBlank, QType, Question} from "@/types/api-exam-paper";
import {head, last, mean} from "lodash";

dayjs.extend(utc);
dayjs.extend(timezone);

export function renderIcon(icon: Component) {
    return () => h(NIcon, null, {default: () => h(icon)});
}

export function getIdFromKey(key: string): number | null {
    try {
        return Number(last(key.split("-")));
    } catch (e) {
        return null;
    }
}

export function getLocalTimeUnix(time: string) {
    return +dayjs(time).tz("Asia/Shanghai");
}

export function getLocalTimeFormat(time: string) {
    return dayjs(time).tz("Asia/Shanghai").format("YYYY-MM-DD hh:mm:ss");
}

export function getTime(time: string): [string, number] {
    const format = getLocalTimeFormat(time);
    const timestamp = getLocalTimeUnix(time);
    return [format, timestamp];
}

export function getTagStatus(start: string, end: string) {
    const now = dayjs();
    const localStart = dayjs(start).tz("Asia/Shanghai");
    const localEnd = dayjs(end).tz("Asia/Shanghai");

    const isBefore = now.isBefore(localStart);
    const isAfter = now.isAfter(localEnd);
    if (isBefore) {
        return TagStatus.wait;
    } else if (isAfter) {
        return TagStatus.off;
    }
    return TagStatus.on;
}

export function getAvatarPath(url: string) {
    return `/static/${url}`;
}

export function getScoreSD(allScore: number[]) {
    const n = allScore.length;

    if (n === 0) return 0;
    const avg = mean(allScore);

    const result = allScore.reduce((acc, cur) => {
        return acc + (cur - avg) ** 2
    }, 0)

    return Math.sqrt(result / n);
}
