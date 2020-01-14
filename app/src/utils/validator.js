/* 验证，参看http://wangchujiang.com/validator.js/ 
 * author: hua
 * date:2018/3/13
 * param: string 
 * param: array
 * [
      {
          //name 字段
          name: 'email',
          display:"你输入的不{{email}}是合法邮箱|不能为空|太长|太短",
          // 验证条件
          rules: 'is_emil|max_length(12)'
          // rules: 'valid_email|required|max_length(12)|min_length(2)'
      },{
          //name 字段
          name: 'sex',
          display:"请你选择性别{{sex}}",
          // 验证条件
          rules: 'required'
      }
    ]
*/
import { Toast } from 'vue-ydui/dist/lib.rem/dialog';

var validator = require('@/assets/js/validator').default
// 输入错误样式,用于mini-ui
// params obj errors 错误对象
// params array array  传入表单name作为key, data中state状态为value
export function validatedError (errors, array) {
  // 消除前一次的状态
  for (var key in array) {
    array[key] = null
  }
  for (var i = 0; i < errors.length; i++) {
    for (var key in array) {
      if (errors[i]['name'] === key) {
        array[key] = true
      }
    }
  }
}
// form表单验证
//点了确定后整体验证
export function allvalidated (formId, option) {
  ////console.log(validator)
  var va = new validator(formId, option,
    function (obj, evt) {

      if (obj.errors.length !== 0) {
        // 判断是否错误
        var error_str = ''
        for (var i = 0; i < obj.errors.length; i++) {
          if (i === obj.errors.length-1 ){ 
            error_str += obj.errors[i].message
          } else {
            error_str += obj.errors[i].message + ','
          }
        }
        Toast({mes: error_str})
      }
    })
  return va.validate().errors
}

// 邮箱验证
export function validatedEmail (param)  {
  var v = new validator()
  if (v.isEmail(param)) {
    return true
  } else {
    Toast('邮箱不正确')
    return false
  }
}

// 手机验证
export function validatedPhone (param) {
  var v = new validator()
  if (v.isPhone(param)) {
    return true
  } else {
    return false
  }
}

// 电话验证
export function validatedTel (param) {
  var v = new validator()
  if (v.isTel(param)) {
    return true
  } else {
    return false
  }
}

// 是否是钱
export function validatedMoney (param) {
  var v = new validator()
  if (v.isMoney(param)) {
    return true
  } else {
    return false
  }
}