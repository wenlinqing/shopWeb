//获取cookie
export function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)")
    if(arr = document.cookie.match(reg)) {
        return arr[2];
    }else {
        return null;
    }
}

//设置cookie
export function setCookie(c_name, value) {
    const exdate = new Date();
    exdate.setMinutes(exdate.getMinutes() + 30);
    document.cookie = c_name + '=' + value + ';expires='+exdate.toGMTString()
    // escape(value)
}

//删除cookie
export function delCookie (name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
      document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}