(async () => {
    // 使用id的形式进行DOM元素的获取可以不用查，默认成为window下的对象
    // const doms = {
    //     userName : document.querySelector('#userName'),
    //     userPassword : document.querySelector('#userPassword')
    // }

    // 定义入口函数
    const init = () => {
        initEvent();
    }

    // 所有事件都在这个里面进行绑定
    const initEvent = () => {
        formContainer.addEventListener('submit', onFormSubmitClick);
    }

    // 创建form表单提交的事件函数
    const onFormSubmitClick = (e) => {
        // 阻止form表单的默认行为
        e.preventDefault();
        // 获取表单数据
        const loginId = userName.value.trim();// 去掉空格
        const loginPwd = userPassword.value.trim();
        if (!loginId || !loginPwd) {
            window.alert('用户名或密码为空');
        }
        // 进行表单数据的发送
        sendData(loginId, loginPwd);
    }

    const sendData = async (loginId, loginPwd) => {
        const res = await fetchFn({
            url: '/user/login',
            method: 'POST',
            params: {
                loginId,
                loginPwd
            }
        })
        res && window.location.replace('../2/index.html')


    }






    init();
})()