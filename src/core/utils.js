import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)

export function weekDays() {
    return [
        {
            label: 'All',
            value: 'all',
        },
        {
            label: 'Monday',
            value: 'monday',
        },
        {
            label: 'Tuesday',
            value: 'tuesday',
        },
        {
            label: 'Wednesday',
            value: 'wednesday',
        },
        {
            label: 'Thursday',
            value: 'thursday',
        },
        {
            label: 'Friday',
            value: 'friday',
        },
        {
            label: 'Saturday',
            value: 'saturday',
        },
        {
            label: 'Sunday',
            value: 'sunday',
        }
    ]
}

export function getIntervalTimeFromNow(dateEnd) {
    const d = dayjs(dateEnd)
    return {
        label: d.fromNow(),
        day: d.diff(dayjs(), 'day')
    }
}