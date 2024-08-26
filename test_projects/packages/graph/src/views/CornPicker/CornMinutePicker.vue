<script lang="tsx">
import { defineComponent, ref, computed } from 'vue';
import { DefaultOptionType } from 'ant-design-vue/es/select'
import { Select } from 'ant-design-vue'

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
                    label: `${index}`.padStart(2, '0'),
                    value: `${index}`
                })
            }
        }
        initMinuteOptions()

        function handleMinuteChange(value) {
            console.log(value, 'value', typeof value)
            minute.value = value
        }
        /********************** template **********************/
        return () => {
            return (<Select value={minute.value} onChange={handleMinuteChange} options={minuteOptions.value} allowClear placeholder="分">
                {{
                    suffixIcon: () => <span>分</span>
                }}
            </Select >);
        };
    },
});
</script>