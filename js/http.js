// 代码冗余，把引入的接口文件放一起
const BASE_URL = 'https://study.duyiedu.com/api';
const fetchFn = async ({ url, method = 'GET', params = {} }) => {
    // get请求的参数拼接
    let result = null;
    const extendsObj = {};
    sessionStorage.token && (extendsObj.Authorization = 'Bearer ' + sessionStorage.token); 
    // console.log(extendsObj);
    if (method === 'GET' && Object.keys(params).length) {
        // key=value & key1=value1
        url += '?' + Object.keys(params).map(key => ''.concat(key, '=', params[key])).join('&');
    }

    try {
        const response = await fetch(BASE_URL + url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...extendsObj
            },
            body: method === 'GET' ? null : JSON.stringify(params)
        })
        // 获取后端token值
        const token = response.headers.get('Authorization');
        // 存储token值
        token && (sessionStorage.token = token)
        result = await response.json();
        if(result.code === 0){
            // 如果后端返回值里有chatTotal，我们就把这个chatTotal也返回给前端
            if(result.hasOwnProperty('chatTotal')){
                result.data = {chatTotal : result.chatTotal, data : result.data}
            }
            return result.data;
        }else{
            // 权限错误处理
            if(result.status === 401){
                window.alert('权限token不正确');
                sessionStorage.removeItem('token');
                window.location.replace('../2/login.html');
                return;
            }
            window.alert(result.msg);
        }
    } catch (error) {
        console.log(error);
    }
}