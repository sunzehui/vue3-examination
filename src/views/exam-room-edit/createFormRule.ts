export default {
    name: {
        required: true,
        trigger: ['blur', 'input'],
        message: '请输入 考试名称'
    },
    desc: {
        required: true,
        trigger: ['blur', 'input'],
        message: '请输入 通知内容'
    },
    use_exam_paper: {
        required: true,
        trigger: ['blur', 'change'],
        message: '请选择 使用试卷'
    },
    classes_id: {
        type: 'array',
        required: true,
        trigger: ['blur', 'change'],
        message: '请选择 使用班级'
    },
    begin_time: {
        type: 'number',
        required: true,
        trigger: ['blur', 'change'],
        message: '请输入 开始时间'
    },
    end_time: {
        type: 'number',
        required: true,
        trigger: ['blur', 'change'],
        message: '请输入 结束时间'
    },
}