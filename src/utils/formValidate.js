// 数字
const numberReg = /^\d+$|^\d+[.]?\d+$/
// 中文
const cnReg = /^[\u4e00-\u9fa5]+$/
// 检测姓名,必须要有两个汉字
// const nameReg = /^[\u4e00-\u9fa5]{2,}$/;
// 检测姓名,可以是中文/字母/数字
const nameReg = /^[\da-zA-Z\u4E00-\u9FA5]{1,10}$/
// 邮箱
const emailReg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
// 手机号
const phoneReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
// 手机号&&座机号
const phoneReg01 = /^(0|86|17951)?(13[0-9]|15[012356789]|17[01678]|18[0-9]|14[57])[0-9]{8}$/
const phoneReg02 = /^(0[0-9]{2,3}-)([2-9][0-9]{6,7})+(-[0-9]{1,4})?$/
// 身份证
const idCardReg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/
// 6位纯数字
const number6 = /^[0-9]{6}$/

export default {
  // 数字验证
  number: function (rule, value, callback) {
    if (value === undefined || value === null || value === '') {
      callback()
    }
    if (!numberReg.test(value)) {
      callback(new Error('请输入数字'))
    } else {
      callback()
    }
  },
  // 中文验证
  cn: function (rule, value, callback) {
    if (value === undefined || value === null || value === '') {
      callback()
    }
    if (!cnReg.test(value)) {
      callback(new Error('请输入中文'))
    } else {
      callback()
    }
  },
  // 姓名验证
  name: function (rule, value, callback) {
    if (value === undefined || value === null || value === '') {
      callback()
    }
    if (!nameReg.test(value)) {
      callback(new Error('请输入正确的姓名'))
    } else {
      callback()
    }
  },
  // 邮箱验证
  email: function (rule, value, callback) {
    if (value === undefined || value === null || value === '') {
      callback()
    }
    if (!emailReg.test(value)) {
      callback(new Error('请输入正确的邮箱'))
    } else {
      callback()
    }
  },
  // 手机验证
  telphone: function (rule, value, callback) {
    if (value === undefined || value === null || value === '') {
      callback()
    }
    if (!phoneReg.test(value)) {
      callback(new Error('请输入正确的手机号码'))
    } else {
      callback()
    }
  },
  // 手机 || 座机验证
  phone: function (rule, value, callback) {
    if (value === undefined || value === null || value === '') {
      callback()
    }
    if (!phoneReg01.test(value) && !phoneReg02.test(value)) {
      callback(new Error('请输入正确的号码'))
    } else {
      callback()
    }
  },
  // 身份证验证
  idCard: function (rule, value, callback) {
    if (value === undefined || value === null || value === '') {
      callback()
    }
    if (!idCardReg.test(value)) {
      callback(new Error('请输入正确的身份证号'))
    } else {
      callback()
    }
  },
  // 6位纯数字
  number6Password: function (rule, value, callback) {
    if (value === undefined || value === null || value === '') {
      callback()
    }
    if (!number6.test(value)) {
      callback(new Error('请输入6位数字的密码'))
    } else {
      callback()
    }
  },
  // 值大于0
  greaterThanZero: function (rule, value, callback, text = '输入值') {
    if (value === undefined || value === null || value === '') {
      callback()
    }
    if (value === 0) {
      callback(new Error(`${text}不能为0`))
    } else {
      callback()
    }
  }
}
