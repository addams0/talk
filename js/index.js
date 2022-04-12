(() => {
    let page = 0;
    let size = 10;
    let chatTotal = 0;
    let sendType = 'enter';

    // 初始化
    // 获取用户信息
    async function getUserInfo() {
        const res = await fetchFn({
            url: '/user/profile',
        })
        // console.log(res);
        nickName.innerHTML = res.nickname;
        accountName.innerHTML = res.loginId;
        loginTime.innerHTML = formaDate(res.lastLoginTime);
    }

    /**
     * 打开页面时的聊天信息位置
     * @param {*} direction 滚动条位置
     */
    async function intiChatList(direction) {
        const res = await fetchFn({
            url: '/chat/history',
            params: {
                page,
                size
            }
        })
        // 渲染聊天界面函数
        chatTotal = res.chatTotal;
        // console.log(res.data.reverse());
        renderChatForm(res.data.reverse(), direction);
    }

    /**
     * 定义渲染聊天界面函数
     * @param {*} list 传进去的一段聊天记录
     * @param {*} direction 滚动条位置
     * @returns 
     */
    const renderChatForm = ((list, direction) => {
        list
        // 没有历史记录u不需要进行渲染
        if (!list.length) {
            contentBody.innerHTML = `
            <div class="chat-container robot-container">
                <img src="./img/robot.jpg" alt="">
                <div class="chat-txt">
                    您好！我是腾讯机器人，非常欢迎您的到来，有什么想和我聊聊的吗？
                </div>
            </div>`
            return;
        }
        // 有历史记录进行渲染
        const chatData = list.map(item => {
            // console.log(item);
            return (item.from === 'user' ?
                `<div class="chat-container avatar-container">
                    <img src="./img/avtar.png" alt="">
                    <div class="chat-txt">${item.content}</div>
                </div>`:
                `<div class="chat-container robot-container">
                    <img src="./img/robot.jpg" alt="">
                    <div class="chat-txt">${item.content}</div>
                </div>`)
        })
        // 让滚动条去到底部
        if (direction === 'bottom') {
            contentBody.innerHTML += chatData.join('');
            const buttomDistances = document.querySelectorAll('.chat-container')[document.querySelectorAll('.chat-container').length - 1].offsetTop;
            contentBody.scrollTo(0, buttomDistances);
        } else {
            contentBody.innerHTML = chatData.join('') + contentBody.innerHTML;
        }
        // console.log(buttomDistances);
    })
    getUserInfo();
    intiChatList('bottom');


    // 注册事件
    // 发送的点击事件
    const onSendBtn = async () => {
        // 判断发送内容是否为空
        let content = inputContainer.value.trim();
        if (!content) {
            window.alert('发送消息不能为空');
            return;
        }
        // 调用渲染聊天界面函数
        renderChatForm([{ from: 'user', content }] , 'bottom');
        inputContainer.value = null;
        // 发送数据到后端
        const res = await fetchFn({
            method: 'POST',
            url: '/chat',
            params: {
                content
            }
        })
        // 调用渲染聊天界面函数
        renderChatForm([{ from: 'robot', content: res.content }] , 'bottom');
        // console.log(res);
    }
    sendBtn.addEventListener('click', onSendBtn);

    // 滚动事件监听
    contentBody.addEventListener('scroll', function () {
        // 滚动到顶部的时候进行加载第二页数据
        if (this.scrollTop === 0) {
            // 判断后端是否还有数据
            page++;
            if (chatTotal <= (page + 1) * 10) {
                return;
            }
            intiChatList('top');
        }
    })

    // 给发送旁边的下箭头绑定事件
    arrowBtn.addEventListener('click', () => {
        selectType.style.display = 'block';
    })

    // 给发送的方式绑定函数
    document.querySelectorAll('.select-item').forEach(node => node.addEventListener('click', onSelectItemClick))

    // 每一个选择按钮的列表项的事件函数
    function onSelectItemClick() {
        document.querySelectorAll('.select-item').forEach(node => node.classList.remove('on'));
        // 显示高亮状态
        this.classList.add('on');
        // 发送方式内容
        sendType = this.getAttribute('type');
        // console.log(sendType);
        selectType.style.display = 'none';
    }

    // 键盘输入事件
    inputContainer.addEventListener('keyup', (e) => {
        // console.log(e.keyCode, sendType, e.ctrlKey);
        if (e.keyCode === 13 && sendType === 'enter' && !e.ctrlKey || e.keyCode === 13 && sendType === 'ctrlEnter' && e.ctrlKey) {
            sendBtn.click();
        }
    })

    // 聊天界面右上角关闭
    closeBtn.addEventListener('click', () => {
        // 清空sessionStorage
        sessionStorage.removeItem('token');
        // 界面跳转
        window.location.replace(baseUrl + 'login.html')
    })
})() 