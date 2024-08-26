<script lang="tsx">
import { defineComponent, ref, computed } from 'vue';
import { DefaultOptionType } from 'ant-design-vue/es/select'
import { DatePicker, Select } from 'ant-design-vue'

export default defineComponent({
    name: 'CornPicker',
    emits: ['update:value'],
    props: {
        value: {
            type: String,
            required: true
        },
        showItems: {
            type: String,
            default: 'year,month,week,day,hour,minute,second'
        },
    },
    setup(props, { emit }) {
        const corn = computed({
            get() {
                if (!props.value) {
                    return new Array(7).fill(undefined)
                } else {
                    return props.value.split(' ').map(i => i === '*' ? undefined : i)
                }
            },
            set(corn) {
                emit('update:value', corn.map(i => i === undefined ? '*' : i).join(' '))
            }
        })
        /********************** year **********************/
        const year = computed({
            get() {
                return corn.value[6]
            },
            set(y) {
                const temp = corn.value.slice()
                temp[6] = y
                corn.value = temp
            }
        })
        function handleYearChange(value) {
            console.log(value, 'handleYearChange', typeof value)
            year.value = value === null ? undefined : value
        }

        /********************** month **********************/
        const month = computed({
            get() {
                return corn.value[4]
            },
            set(y) {
                const temp = corn.value.slice()
                temp[4] = y
                corn.value = temp
            }
        })

        const monthOptions = ref<DefaultOptionType[]>([
            {
                label: '一月',
                value: '1',
            },
            {
                label: '二月',
                value: '2',
            },
            {
                label: '三月',
                value: '3',
            },
            {
                label: '四月',
                value: '4',
            },
            {
                label: '五月',
                value: '5',
            },
            {
                label: '六月',
                value: '6',
            },
            {
                label: '七月',
                value: '7',
            },
            {
                label: '八月',
                value: '8',
            },
            {
                label: '九月',
                value: '9',
            },
            {
                label: '十月',
                value: '10',
            },
            {
                label: '十一月',
                value: '11',
            },
            {
                label: '十二月',
                value: '12',
            },
        ])

        function handleMonthChange(value) {
            console.log(value, 'value', typeof value)
            month.value = value
        }

        /********************** week **********************/
        const week = computed({
            get() {
                return corn.value[5]
            },
            set(y) {
                const temp = corn.value.slice()
                temp[5] = y
                corn.value = temp
            }
        })

        function handleWeekChange(value) {
            console.log(value, 'value', typeof value)
            week.value = value
        }

        const weekOptions = ref<DefaultOptionType[]>([
            {
                label: '周一',
                value: '1',
            },
            {
                label: '周二',
                value: '2',
            },
            {
                label: '周三',
                value: '3',
            },
            {
                label: '周四',
                value: '4',
            },
            {
                label: '周五',
                value: '5',
            },
            {
                label: '周六',
                value: '6',
            },
            {
                label: '周日',
                value: '0',
            },
        ])

        /********************** day **********************/
        const day = computed({
            get() {
                return corn.value[3]
            },
            set(y) {
                const temp = corn.value.slice()
                temp[3] = y
                corn.value = temp
            }
        })
        const dayOptions = ref<DefaultOptionType[]>([])

        function initDayOptions() {
            dayOptions.value = []
            for (let index = 1; index <= 31; index++) {
                dayOptions.value.push({
                    label: `${numberToString(index)}`,
                    value: `${index}`
                })
            }
        }
        initDayOptions()

        function handleDayChange(value) {
            console.log(value, 'value', typeof value)
            day.value = value
        }

        /********************** hour **********************/
        const hour = computed({
            get() {
                return corn.value[2]
            },
            set(y) {
                const temp = corn.value.slice()
                temp[2] = y
                corn.value = temp
            }
        })
        const hourOptions = ref<DefaultOptionType[]>([])

        function initHourOptions() {
            hourOptions.value = []
            for (let index = 0; index <= 23; index++) {
                hourOptions.value.push({
                    label: `${numberToString(index)}`,
                    value: `${index}`
                })
            }
        }
        initHourOptions()

        function handleHourChange(value) {
            console.log(value, 'value', typeof value)
            hour.value = value
        }

        /********************** minute **********************/
        const minute = computed({
            get() {
                return corn.value[1]
            },
            set(y) {
                const temp = corn.value.slice()
                temp[1] = y
                corn.value = temp
            }
        })
        const minuteOptions = ref<DefaultOptionType[]>([])

        function initMinuteOptions() {
            minuteOptions.value = []
            for (let index = 0; index <= 59; index++) {
                minuteOptions.value.push({
                    label: `${numberToString(index)}`,
                    value: `${index}`
                })
            }
        }
        initMinuteOptions()

        function handleMinuteChange(value) {
            console.log(value, 'value', typeof value)
            minute.value = value
        }

        /********************** second **********************/

        const secondOptions = ref<DefaultOptionType[]>([])
        const second = computed({
            get() {
                return corn.value[0]
            },
            set(y) {
                const temp = corn.value.slice()
                temp[0] = y
                corn.value = temp
            }
        })
        function initSecondOptions() {
            secondOptions.value = []
            for (let index = 0; index <= 59; index++) {
                secondOptions.value.push({
                    label: `${numberToString(index)}`,
                    value: `${index}`
                })
            }
        }
        initSecondOptions()

        function handleSecondChange(value) {
            console.log(value, 'value', typeof value)
            second.value = value
        }

        /**
         * 将数字补到两位 如：1 -> 01
         * @param number 
         */
        function numberToString(number: number) {
            if (String(number).length === 1) {
                return `0${number}`
            } else {
                return number
            }
        }

        /********************** template **********************/
        return () => {

            const Year = <DatePicker value={year.value} onChange={handleYearChange} picker="year" valueFormat='YYYY' class="corn-picker-item corn-picker-year"></DatePicker>
            const Month = <Select value={month.value} onChange={handleMonthChange} options={monthOptions.value} allowClear placeholder="月" class="corn-picker-item corn-picker-month"></Select>
            const Week = <Select value={week.value} onChange={handleWeekChange} options={weekOptions.value} allowClear placeholder="周" class="corn-picker-item corn-picker-week"></Select>
            const Day = <Select value={day.value} onChange={handleDayChange} options={dayOptions.value} allowClear placeholder="日期" class="corn-picker-item corn-picker-day">
                {{
                    suffixIcon: () => <span>号</span>
                }}
            </Select >
            const Hour = <Select value={hour.value} onChange={handleHourChange} options={hourOptions.value} allowClear placeholder="时" class="corn-picker-item corn-picker-hour">
                {{
                    suffixIcon: () => <span>点</span>
                }}
            </Select >
            const Minute = <Select value={minute.value} onChange={handleMinuteChange} options={minuteOptions.value} allowClear placeholder="分" class="corn-picker-item corn-picker-minute">
                {{
                    suffixIcon: () => <span>分</span>
                }}
            </Select >
            const Second = <Select value={second.value} onChange={handleSecondChange} options={secondOptions.value} allowClear placeholder="秒" class="corn-picker-item corn-picker-second">
                {{
                    suffixIcon: () => <span>秒</span>
                }}
            </Select >
            const showItems = props.showItems.replace(' ', '').split(',')
            return (<div class="corn-picker">
                {
                    showItems.map(item => {
                        switch (item) {
                            case 'year':
                                return Year
                            case 'month':
                                return Month
                            case 'week':
                                return Week
                            case 'day':
                                return Day
                            case 'hour':
                                return Hour
                            case 'minute':
                                return Minute
                            case 'second':
                                return Second
                            default:
                                return <></>
                        }
                    })
                }
            </div>);
        };
    },
});
</script>
<style scoped>
.corn-picker {
    display: flex;
}

.corn-picker .corn-picker-item {
    min-width: 100px;
    margin: 0 2px;
}
</style>