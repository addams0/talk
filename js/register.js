(() => {
    let isRepeat = false;
    // 创建程序入口函数
    const init = () => {
        initEvent();
    }

    // 创建事件入口函数
    const initEvent = () => {
        userName.addEventListener('blur', onUserNameBlur);
        formContainer.addEventListener('submit', onFormSubmit);
    }

    // 注册提交事件
    const onFormSubmit = (e) => {
        // 阻止事件的默认行为
        e.preventDefault();
        // 表单项的收集
        const loginId = userName.value;
        const nickname = userNickname.value;
        const loginPwd = userPassword.value;
        const confirmPwd = userConfirmPassword.value;
        // 表单验证操作
        if (!checkForm(loginId, nickname, loginPwd, confirmPwd)) return;
        // 请求数据
        sendData(loginId, nickname, loginPwd);
    }

    // 请求数据函数
    const sendData = async (loginId, nickname, loginPwd) => {
        const res = await fetchFn({
            url: '/user/reg',
            method: 'POST',
            params: {
                loginId,
                nickname,
                loginPwd
            }
        })
        res && window.location.replace(baseUrl + 'index.html')
    }

    // 验证表单函数
    const checkForm = (loginId, nickname, loginPwd, confirmPwd) => {
        switch (true) {
            case !loginId:
                window.alert('注册用户名不能为空')
                return;
            case !nickname:
                window.alert('昵称名不能为空')
                return;
            case !loginPwd:
                window.alert('密码不能为空')
                return;
            case !confirmPwd:
                window.alert('确认密码不能为空')
                return;
            case loginPwd !== confirmPwd:
                window.alert('密码与确认密码不一致')
                return;
            case isRepeat:
                window.alert('用户名已存在，请更换')
            default:
                return true;
        }
    }

    // 创建账户失去焦点的事件函数
    const onUserNameBlur = async () => {
        // 获取输入的账户的value值
        const loginId = userName.value.trim();
        // 如果是空的信息不做任何操作
        if (!loginId) return;

        const res = await fetchFn({
            url: '/user/exists',
            method: 'GET',
            params: {
                loginId
            }
        })
        isRepeat = res;
    }
    init();
})()