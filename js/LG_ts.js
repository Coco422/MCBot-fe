const BASE_URL = 'https://nlp-demo.szmckj.cn';
const wzyc = 'https://wzyc-demo.szmckj.cn'
const BASE_URL_TS = 'http://172.16.99.32:1033';
const Authorization = 'Bearer lg-evduwtdszwhdqzgqkwvdtmjgpmffipkwoogudnnqemjtvgcv';


const id = null;
const idA = null;
const question_id = null;
const question_idA = null;
const tts_message = null;
const if_kb = false
const chat_id = null;
const user_id = null
let md = null; // 将md定义为可变的
const idtest = null
const echartsData = '1111';
const question_title = null;
localStorage.setItem('if_kb_QA', true);
localStorage.setItem('if_user_kb', false);

const if_kb_QA = true;
// // 是否开启R1
function toggleKnowledgeR1(checkbox_ai) {
    if (checkbox_ai.checked) {
        localStorage.setItem('if_kb_QA', true);
    } else {
        localStorage.setItem('if_kb_QA', false);
        // console.log('关闭R1', this.if_kb_QA)
    }
}

const if_user_kb = false;
// // 是否开启知识库
function toggleKnowledgebash(checkbox_ai) {
    if (checkbox_ai.checked) {
        localStorage.setItem('if_user_kb', true);
        // console.log('开启知识库', this.if_user_kb)
    } else {
        // this.if_user_kb = false;
        localStorage.setItem('if_user_kb', false);
        // console.log('关闭知识库', this.if_user_kb)
    }
}
// 全局变量
let globalQuestionId = null;

// 动态创建选项的函数
function createOption(container, optionKey, optionValue) {
    const optionDiv = document.createElement('div');
    optionDiv.className = 'option-item';
    optionDiv.textContent = `${optionKey}、${optionValue}`;
    container.appendChild(optionDiv);
}

// 获取随机题目接口2
function fetchRandomQuestionA() {
    axios.get(`${BASE_URL}/api/randomquestion`)
        .then(function (response) {
            // 设置题目
            document.getElementById('questionA').innerText = response.data.q_stem;
            this.idA = response.data.id;
            console.log('随机题目',this.question_id);
            // 清空选项区域
            const optionsContainer = document.getElementById('optionsA');
            optionsContainer.innerHTML = ''; // 清空现有选项

            const options = response.data.options;
            const splitData = options.split('|');

            if (splitData.length === 2 && splitData.includes("正确") && splitData.includes("错误")) {
                // 如果选项是"正确|错误"格式
                createOption(optionsContainer, "A", "正确");
                createOption(optionsContainer, "B", "错误");
            } else {
                // 创建一个对象来存储切分后的数据
                const alloptions = {};
                splitData.forEach(item => {
                    const [key, value] = item.split("、"); // 根据冒号切分键值对
                    alloptions[key] = value; // 将数据存储到对象中
                });

                // 动态生成选项
                createOption(optionsContainer, "A", alloptions["A"] || "无数据");
                createOption(optionsContainer, "B", alloptions["B"] || "无数据");
                createOption(optionsContainer, "C", alloptions["C"] || "无数据");
                createOption(optionsContainer, "D", alloptions["D"] || "无数据");
            }
        })
        .catch(function (err) {
            console.log(err);
        });
}

// 实现按钮被点击后保持黑色
// 获取所有具有 'btn-primary' 类的按钮
document.querySelectorAll('.btn-primary').forEach(button => {
    // 为每个按钮添加点击事件监听器
    button.addEventListener('click', function () {
        // 切换当前按钮的 'clicked' 类
        this.classList.toggle('clicked');
    });
});

// 打字机效果函数
function displayTypingEffect(text) {
    const analysisContainer = document.getElementById('analysis-container');
    analysisContainer.innerHTML = ''; // 清空容器内容
    let index = 0;

    function type() {
        if (index < text.length) {
            analysisContainer.innerHTML += text.charAt(index);
            index++;
            setTimeout(type, 10); // 设置打字速度
        }
    }

    type();
}

// 语音助手的开始页面初始化的三条信息
function selectMessage(message) {
    document.getElementById('chat-input').innerHTML = message;
}

// 语音助手的开始页面初始化的三条信息
function selectMessage_test(message) {
    const qaMessages = document.getElementById("qa_messages");
    qaMessages.classList.remove("show");

    const dataMessages = document.getElementById("data_messages");
    dataMessages.classList.remove("show");

    document.getElementById('chat-input').innerHTML = message;
}


// 获取chat_id的接口
function getChatId() {

    this.user_id = getRandomIdFromCookie(); // 从 cookie 获取用户 ID
    const randomId = getRandomIdFromCookie();

    axios.get(`${BASE_URL}/api/chat_id_title_list?user_id=${randomId}`)
        .then(function (response) {
            let historyIds = response.data.chat_id_list;
            console.log('historyIds.length', historyIds)
            // 如果没有历史记录，分配新的 chat_id
            if (historyIds.length === 0) {
                axios.get(`${BASE_URL}/api/chatid?user_id=${this.user_id}`)
                    .then(function (response) {
                        // 获取 chat_id
                        this.chat_id = response.data.chat_id;
                        // localStorage.setItem('chat_id', this.chat_id);
                        console.log('没有历史记录，分配新的 chat_id:', this.chat_id);
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            } else {
                // 获取索引为 0 的历史记录
                const firstHistory = historyIds[0];
                // 如果历史记录有 title，重新获取 chat_id
                if (firstHistory.title) {
                    axios.get(`${BASE_URL}/api/chatid?user_id=${this.user_id}`)
                        .then(function (response) {
                            // 获取 chat_id
                            this.chat_id = response.data.chat_id;
                            // localStorage.setItem('chat_id', this.chat_id);
                            console.log('历史记录有 title，重新获取 chat_id:', this.chat_id);
                        })
                        .catch(function (err) {
                            console.log(err);
                        });
                } else {
                    this.chat_id = firstHistory.chat_id
                }
            }
        })
        .catch(function (err) {
            console.log(err);
        });
}

// 学习对话接口
async function sendMessage() {
    const input = document.getElementById('chat-input');
    const messageText = input.innerHTML;
    // const rendermessage = this.md.render(messageText);
    console.log(messageText)
    if (messageText) {
        // 添加用户消息
        const userMessage = document.createElement('div');
        userMessage.className = 'message user-message';
        userMessage.innerHTML = `
            <div class="message-content">
                <div class="message-text" style="color:white">${messageText}</div>
            </div>
            <img src="images/user.png" alt="User Avatar" class="avatar">
        `;
        document.getElementById('chat-messages').appendChild(userMessage);
        // 清空输入框
        input.innerHTML = '';
        try {
            // 发送POST请求
            const response = await fetch(`${BASE_URL}/api/chat/train`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_input: messageText, if_kb: this.if_kb, question_id: this.idA, chat_id: "f47e82a1-1878-453f-81e9-e9641773abd6" })
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedMessage = ''; // 用于存储累积的消息
            // 创建机器人消息容器
            const botMessage = document.createElement('div');
            botMessage.className = 'message bot-message';
            const uniqueId = `audio-${Date.now()}`;
            botMessage.innerHTML = `
                <img src="images/robot.png" alt="Bot Avatar" class="avatar">
                <div class="message-content" style="background-color: #e5e5e5;">
                    <div class="message-text">${accumulatedMessage}</div>
                    <i class="fa-regular fa-circle-play" id="play_${uniqueId}" style="display:none;" onclick="bf_vedio('${uniqueId}', '${accumulatedMessage}')"></i>
                    <i class="fa-regular fa-circle-pause" style="display:none" id="pause_${uniqueId}" onclick="zt_vedio('${uniqueId}')"></i>
                    <audio id="${uniqueId}" style="display:none"></audio>
                </div>
            `;
            document.getElementById('chat-messages').appendChild(botMessage);
            // 获取消息文本容器
            const messageTextContainer = botMessage.querySelector('.message-text');
            const playButton = botMessage.querySelector(`#play_${uniqueId}`);
            const pauseButton = botMessage.querySelector(`#pause_${uniqueId}`);
            async function read() {
                const { done, value } = await reader.read();
                if (done) {
                    // 显示播放按钮
                    playButton.style.display = 'block';
                    return;
                }
                const responseText = decoder.decode(value);
                // 解析SSE格式的数据
                const lines = responseText.split('\n');
                console.log(lines)
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (line.startsWith('event:update')) {
                        // 找到对应的data行
                        const dataLine = lines[i + 1]?.trim();
                        if (dataLine && dataLine.startsWith('data:')) {
                            const data = dataLine.slice(5).trim();
                            if (data) {
                                // 累积AI消息
                                accumulatedMessage += data;
                                // 使用 marked.js 将 Markdown 转换为 HTML
                                const htmlContent = this.md.render(accumulatedMessage);
                                // 更新机器人消息内容
                                // setTimeout(() => {
                                messageTextContainer.innerHTML = htmlContent;
                                playButton.setAttribute('onclick', `bf_vedio('${uniqueId}', '${accumulatedMessage}')`);
                                // }, 200);
                                // 滚动到底部
                                const chatMessages = document.getElementById('chat-messages');
                                chatMessages.scrollTop = chatMessages.scrollHeight;
                            }
                        }
                    }
                }
                await read();
            }
            await read();
        } catch (error) {
            console.error('Fetch failed:', error);
        }
    }
}

let streamingInProgress = false;
let currentMarkdown = ""; // 保存 Markdown 格式内容

// TODO :  chat_id暂时未改好  20250206
// step3不能渲染markdown格式
async function sendMessagedemo() {
    const input = document.getElementById('chat-input');
    const messageText = input.innerHTML;
    if (messageText) {
        // 添加用户消息
        const userMessage = document.createElement('div');
        userMessage.className = 'message user-message';
        userMessage.innerHTML = `
            <div class="message-content">
                <div class="message-text">${messageText}</div>
            </div>
            <img src="images/user.png" alt="User Avatar" class="avatar">
        `;
        document.getElementById('chat-messages').appendChild(userMessage);
        // 清空输入框
        input.innerHTML = '';
        if (streamingInProgress) return;
        streamingInProgress = true;
        try {
            // 发送 POST 请求
            const response = await fetch("https://nlp-demo.szmckj.cn/api/chat/analysis", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_input: messageText,
                    chat_id: "f47e82a1-1878-453f-81e9-e9641773abd6",
                    database_id: "string",
                }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }

            // 初始化 dataContent 和 step8Content
            let dataContent = '';
            let step8Content = '';
            let isStep8Active = false;
            const step8Div = document.getElementById('step8');

            // 创建 bot 消息容器
            const botMessage = document.createElement('div');
            botMessage.className = 'message bot-message';
            const uniqueId = `audio-${Date.now()}`;
            botMessage.innerHTML = `
                <img src="images/robot.png" alt="Bot Avatar" class="avatar">
                <div class="message-content">
                    <div class="message-text">
                        <div class="loading-indicator">正在生成...</div>
                    </div>
                    <i class="fa-regular fa-circle-play" id="play_${uniqueId}" style="display:none;" onclick="bf_vedio('${uniqueId}', '${dataContent}')"></i>
                    <i class="fa-regular fa-circle-pause" style="display:none" id="pause_${uniqueId}" onclick="zt_vedio('${uniqueId}')"></i>
                    <audio id="${uniqueId}" style="display:none"></audio>
                </div>
            `;
            document.getElementById('chat-messages').appendChild(botMessage);

            // 获取消息文本容器
            const contentDiv = botMessage.querySelector('.message-text');

            // 初始化 Markdown 渲染器
            const md = window.markdownit({
                html: true,
                linkify: true,
                typographer: true,
            }).use(window.markdownitTaskLists, {
                enabled: true,
                label: true,
                labelAfter: true,
            });

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let buffer = '';
            let currentMarkdown = '';
            let lastEventType = null;

            // 修改后的内容更新函数
            function updateContent(newMarkdown, isHeader = false) {
                // 处理分隔符逻辑
                if (isHeader) {
                    if (lastEventType !== 'header') {
                        currentMarkdown += `\n\n---\n\n`;
                    }
                    currentMarkdown += `### ${newMarkdown}\n\n`;
                    lastEventType = 'header';
                } else {
                    if (currentMarkdown.includes('正在生成...')) {
                        currentMarkdown = '';
                    }
                    currentMarkdown += newMarkdown;
                    lastEventType = 'content';
                }
                contentDiv.innerHTML = md.render(currentMarkdown);
            }

            // 修改后的 processSSEChunk 函数
            function processSSEChunk(chunk) {
                const lines = chunk.split(/(?<=\n)/);
                let currentEvent = null;
                for (let line of lines) {
                    line = line.trim();
                    if (!line) continue;
                    if (line.startsWith("event:")) {
                        currentEvent = line.slice(6).trim();
                        if (currentEvent === "step8") {
                            isStep8Active = true;
                        }
                    } else if (line.startsWith("data:")) {
                        const content = line.slice(5).trim();
                        if (!content) continue;

                        // 更新 step8Div 和机器人消息内容的逻辑
                        if (isStep8Active && currentEvent === "update") {
                            step8Content += content;
                            if (step8Div) {
                                step8Div.classList.remove('has-content');
                                step8Div.innerHTML = step8Content;
                            }
                            dataContent += content;
                            updateContent(dataContent);
                            dataContent = '';
                        } else if (currentEvent?.startsWith('step')) {
                            const stepNumber = currentEvent.replace('step', '');
                            const stepTitle = `Step ${stepNumber}: ${content}`;
                            updateContent(stepTitle, true);
                        } else if (currentEvent === "update") {
                            dataContent += content;
                            if (content.endsWith('.') || content.endsWith('。') || dataContent.length > 50) {
                                updateContent(dataContent);
                                dataContent = '';
                            }
                        } else if (currentEvent === "sqldata") {
                            // 处理 sqldata 事件
                            this.echartsData = content; // 假设数据是 JSON 格式
                            console.log('echartsData:', this.echartsData);
                            // 创建 CustomEvent 对象
                            const event = new CustomEvent('sqldataReceived', {
                                detail: this.echartsData // 将数据作为 detail 传递
                            });

                            // 触发事件
                            window.dispatchEvent(event);
                            // 这里可以根据需要将 echartsData 传递给 ECharts 进行渲染
                        }
                    }
                }
                if (dataContent.length > 0) {
                    updateContent(dataContent);
                    dataContent = '';
                }
            }

            async function read() {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) {
                        streamingInProgress = false;
                        isStep8Active = false;
                        return;
                    }
                    buffer += decoder.decode(value, { stream: true });
                    let boundary;
                    while ((boundary = buffer.indexOf('\n\n')) !== -1) {
                        const chunk = buffer.slice(0, boundary);
                        buffer = buffer.slice(boundary + 2);
                        processSSEChunk(chunk);
                    }
                    const chatMessages = document.getElementById('chat-messages');
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }
            }
            await read();
        } catch (error) {
            console.error("Error during SSE POST request:", error);
            streamingInProgress = false;
            const errorDiv = document.createElement('div');
            errorDiv.className = 'message-error';
            errorDiv.textContent = '消息发送失败，请重试';
            document.getElementById('chat-messages').appendChild(errorDiv);
        }
    }
}

// AI问答
async function QAsendMessage(q_id,ifkb) {
    const input = document.getElementById('chat-input');
    const messageText = input.innerHTML;
    localStorage.setItem('hasSentMessage', 'true');
    if (messageText) {
        // 添加用户消息
        const userMessage = document.createElement('div');
        userMessage.className = 'message user-message';
        userMessage.innerHTML = `
            <div class="message-content">
                <div class="message-text" style="color:white">${messageText}</div>
            </div>
            <img src="images/user.png" alt="User Avatar" class="avatar">
        `;
        document.getElementById('chat-messages').appendChild(userMessage);
        // 清空输入框
        input.innerHTML = '';

        const is_q_id = q_id ? q_id : null;
        const is_if_kb = ifkb ? ifkb : false;
        console.log('发送成功', if_user_kb,if_kb_QA)

        // 存储RAG相关文档的数组
        let ragDocuments = [];
        try {
            // 发送POST请求
            const response = await fetch(`${BASE_URL}/api/chat/train`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_input: messageText, if_kb: is_if_kb, question_id: is_q_id, chat_id: this.chat_id, if_r1: localStorage.getItem('if_kb_QA'), if_user_kb: localStorage.getItem('if_user_kb') })
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedMessage = ''; // 用于存储累积的消息
            let ragContent = ''; // 用于存储所有RAG相关内容
            let inRagEvent = false; // 标记是否在RAG事件中
            
            // 创建唯一的消息ID
            const messageId = Date.now();
            const uniqueId = `audio-${messageId}`;
            
            // 创建机器人消息容器
            const botMessage = document.createElement('div');
            botMessage.className = 'message bot-message';
            botMessage.dataset.messageId = messageId; // 添加消息ID作为数据属性
            
            botMessage.innerHTML = `
                <img src="images/robot.png" alt="Bot Avatar" class="avatar">
                <div class="message-content">
                    <div class="message-text"></div>
                    <div class="rag-documents" style="display:none; margin-top: 10px;"></div>
                    <i class="fa-regular fa-circle-play" id="play_${uniqueId}" style="display:none;" onclick="bf_vedio('${uniqueId}', '')"></i>
                    <i class="fa-regular fa-circle-pause" style="display:none" id="pause_${uniqueId}" onclick="zt_vedio('${uniqueId}')"></i>
                    <audio id="${uniqueId}" style="display:none"></audio>
                </div>
            `;
            document.getElementById('chat-messages').appendChild(botMessage);
            // 获取消息文本容器
            const messageTextContainer = botMessage.querySelector('.message-text');
            const ragDocumentsContainer = botMessage.querySelector('.rag-documents');
            const playButton = botMessage.querySelector(`#play_${uniqueId}`);
            const pauseButton = botMessage.querySelector(`#pause_${uniqueId}`);
            
            async function read() {
                const { done, value } = await reader.read();
                if (done) {
                    // 显示播放按钮
                    playButton.style.display = 'block';
                    // 处理RAG内容并提取文档
                    if (ragContent) {
                        // 处理并解析RAG内容
                        parseRagContent(ragContent);
                        // 如果有RAG文档，显示它们
                        if (ragDocuments.length > 0) {
                            ragDocumentsContainer.style.display = 'block';
                            let ragHtml = '';
                            // 为每个文档添加可点击的标题和隐藏的内容，使用消息ID确保唯一性
                            ragDocuments.forEach((doc, index) => {
                                ragHtml += `
                                    <div class="rag-doc-item" style="margin-bottom: 10px;">
                                        <div class="rag-doc-title" data-message-id="${messageId}" data-index="${index}" style="font-weight: bold; cursor: pointer; color: #ff7272; font-size: larger;">
                                            相关文档 ${index + 1}
                                        </div>
                                        <div id="rag-doc-content-${messageId}-${index}" style="display: none; padding: 8px; border: 1px solid #eee; border-radius: 4px; margin-top: 5px;">
                                            <div><strong>法律ID:</strong> ${doc.lawId}</div>
                                            <div><strong>法律名称:</strong> ${doc.lawName}</div>
                                            <div><strong>章节:</strong> ${doc.chapter}</div>
                                            <div><strong>文章内容:</strong> ${doc.content}</div>
                                            <div><strong>相似度:</strong> ${doc.similarity}</div>
                                        </div>
                                    </div>
                                `;
                            });
                            ragDocumentsContainer.innerHTML = ragHtml;
                            
                            // 添加点击事件处理，点击标题时只展开对应的内容
                            const docTitles = ragDocumentsContainer.querySelectorAll('.rag-doc-title');
                            docTitles.forEach(title => {
                                title.addEventListener('click', () => {
                                    const msgId = title.getAttribute('data-message-id');
                                    const index = title.getAttribute('data-index');
                                    const contentElement = document.getElementById(`rag-doc-content-${msgId}-${index}`);
                                    // 切换当前点击的文档内容显示状态
                                    if (contentElement.style.display === 'none') {
                                        contentElement.style.display = 'block';
                                    } else {
                                        contentElement.style.display = 'none';
                                    }
                                });
                            });
                        }
                    }
                    // 更新语音播放的文本内容（不包含RAG文档）
                    playButton.setAttribute('onclick', `bf_vedio('${uniqueId}', '${accumulatedMessage}')`);
                    return;
                }
                const responseText = decoder.decode(value);
                // 解析SSE格式的数据
                const lines = responseText.split('\n');
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i].trim();
                    // 检测RAG事件开始
                    if (line === 'event:rag') {
                        inRagEvent = true;
                        continue;
                    }
                    // 如果在RAG事件中，收集RAG内容
                    if (inRagEvent) {
                        // 如果遇到另一个事件开始，表示RAG事件结束
                        if (line.startsWith('event:')) {
                            inRagEvent = false;
                        } else if (line) { // 只有非空行才添加
                            ragContent += line + '\n';
                        }
                    }
                    // 检测update事件
                    if (line === 'event:update') {
                        inRagEvent = false; // 确保我们不再收集RAG内容
                        const dataLine = lines[i + 1]?.trim();
                        if (dataLine && dataLine.startsWith('data:')) {
                            const data = dataLine.slice(5).trim();
                            if (data) {
                                // 累积AI消息
                                accumulatedMessage += data;
                                // 检测 </think> 标签，如果存在，在其后添加换行符
                                if (accumulatedMessage.includes('</think>')) {
                                    accumulatedMessage = accumulatedMessage.replace('</think>', '</think>\n');
                                }
                                const htmlContent = this.md.render(accumulatedMessage.replace(/</g, '&lt;').replace(/>/g, '&gt;'));
                                // 更新机器人消息内容
                                messageTextContainer.innerHTML = htmlContent;
                                // 滚动到底部
                                const chatMessages = document.getElementById('chat-messages');
                                chatMessages.scrollTop = chatMessages.scrollHeight;
                            }
                        }
                    }
                }
                await read();
            }
            
            // 解析RAG内容并提取文档
            function parseRagContent(content) {
                // 分割不同的相关文档
                const docRegex = /相关文档\s+(\d+):/g;
                let match;
                let docPositions = [];
                // 找出所有相关文档的起始位置
                while ((match = docRegex.exec(content)) !== null) {
                    docPositions.push({
                        index: match.index,
                        docNumber: match[1]
                    });
                }
                // 处理每个文档
                for (let i = 0; i < docPositions.length; i++) {
                    const startPos = docPositions[i].index;
                    const endPos = (i < docPositions.length - 1) ? docPositions[i + 1].index : content.length;
                    // 提取当前文档内容
                    const docContent = content.substring(startPos, endPos).trim();
                    // 解析文档内容
                    const lawIdMatch = docContent.match(/法律ID:\s*(.*)/);
                    const lawNameMatch = docContent.match(/法律名称:\s*(.*)/);
                    const chapterMatch = docContent.match(/章节:\s*(.*)/);
                    const contentMatch = docContent.match(/文章内容:\s*(.*(?:\n.*)*?)(?=相似度:|$)/s);
                    const similarityMatch = docContent.match(/相似度:\s*(.*)/);
                    if (lawIdMatch && lawNameMatch && chapterMatch && contentMatch && similarityMatch) {
                        ragDocuments.push({
                            lawId: lawIdMatch[1].trim(),
                            lawName: lawNameMatch[1].trim(),
                            chapter: chapterMatch[1].trim(),
                            content: contentMatch[1].trim(),
                            similarity: similarityMatch[1].trim()
                        });
                    }
                }
            }
            
            await read();
        } catch (error) {
            console.error('Fetch failed:', error);
        }
    }
}

// 自由问答
async function freesendMessage() {
    const input = document.getElementById('chat-input');
    const messageText = input.innerHTML;
    localStorage.setItem('hasSentMessage', 'true');
    if (messageText) {
        // 添加用户消息
        const userMessage = document.createElement('div');
        userMessage.className = 'message user-message';
        userMessage.innerHTML = `
            <div class="message-content">
                <div class="message-text" style="color:white">${messageText}</div>
            </div>
            <img src="images/user.png" alt="User Avatar" class="avatar">
        `;
        document.getElementById('chat-messages').appendChild(userMessage);
        // 清空输入框
        input.innerHTML = '';

        try {
            // 发送GET请求
            const response = await fetch(`${BASE_URL}/dev/chatQusetion?user_question=${encodeURIComponent(messageText)}`, {
                method: 'GET'
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            // 处理返回的JSON数据
            const data = await response.json();
            
            // 创建唯一的消息ID
            const messageId = Date.now();
            const uniqueId = `audio-${messageId}`;
            
            // 创建机器人消息容器
            const botMessage = document.createElement('div');
            botMessage.className = 'message bot-message';
            
            // 格式化显示title和content
            let title = '';
            let content = '';
            
            if (data.status === 'success' && data.data) {
                title = data.data.title || '';
                content = data.data.content || '';
            }
            
            botMessage.innerHTML = `
                <img src="images/robot.png" alt="Bot Avatar" class="avatar">
                <div class="message-content">
                    <div class="message-text">
                        ${title ? `<h3 style="margin-top: 0; margin-bottom: 10px; color: #333;">${title}</h3>` : ''}
                        <div style="line-height: 1.5;">${content}</div>
                    </div>
                </div>
            `;
            
            document.getElementById('chat-messages').appendChild(botMessage);
            
            // 滚动到底部
            const chatMessages = document.getElementById('chat-messages');
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
        } catch (error) {
            console.error('Fetch failed:', error);
            
            // 显示错误消息
            const errorMessage = document.createElement('div');
            errorMessage.className = 'message bot-message';
            errorMessage.innerHTML = `
                <img src="images/robot.png" alt="Bot Avatar" class="avatar">
                <div class="message-content">
                    <div class="message-text" style="color: red;">
                        抱歉，查询过程中出现错误，请稍后再试。
                    </div>
                </div>
            `;
            document.getElementById('chat-messages').appendChild(errorMessage);
        }
    }
}

// 播放语音
function bf_vedio(audioId, text) {
    const playButton = document.getElementById(`play_${audioId}`);
    const pauseButton = document.getElementById(`pause_${audioId}`);
    const audioElement = document.getElementById(audioId);

    // 检查是否有音频在播放，如果有则先暂停
    if (!audioElement.paused) {
        audioElement.pause();
        playButton.style.display = 'block';
        pauseButton.style.display = 'none';
        return;
    }

    // 如果音频已经加载过，且当前处于暂停状态，则从暂停位置继续播放
    if (audioElement.src && audioElement.paused) {
        playButton.style.display = 'none';
        pauseButton.style.display = 'block';
        audioElement.play();
        return;
    }

    // 如果音频未加载过，则请求新的音频数据
    playButton.style.display = 'none';
    pauseButton.style.display = 'block';

    axios.post(`${BASE_URL}/api/tts`, { tts_text: text }, { responseType: 'blob' })
        .then(function (response) {
            const blob = new Blob([response.data], { type: 'audio/mpeg' }); // 确保类型正确
            const url = URL.createObjectURL(blob);
            audioElement.src = url;

            // 监听音频播放结束事件
            audioElement.onended = function () {
                playButton.style.display = 'block';
                pauseButton.style.display = 'none';
            };

            // 播放音频
            audioElement.play();
        })
        .catch(function (err) {
            console.log(err);
        });
}

// 暂停语音
function zt_vedio(audioId) {
    const playButton = document.getElementById(`play_${audioId}`);
    const pauseButton = document.getElementById(`pause_${audioId}`);
    const audioElement = document.getElementById(audioId);

    if (audioElement && !audioElement.paused) {
        audioElement.pause();
        playButton.style.display = 'block';
        pauseButton.style.display = 'none';
    }
}

// 随机生成示例
const tech_ai_texts = [
    "人工智能的快速发展正在改变我们的生活方式。",
    "大数据与机器学习为精准医疗提供了新的可能性。",
    "自动驾驶技术正在不断提升出行的安全性和便利性。",
    "云计算让企业能够更加高效地管理和存储数据。",
    "量子计算有望解决传统计算机无法处理的复杂问题。"
]
const weather_daily_texts = [
    "今天的天气晴朗，非常适合外出运动和休闲活动。",
    "未来几天可能有小雨，请记得随身携带雨具。",
    "寒冷的冬季里，及时添加衣物以免着凉。",
    "春天的清晨常伴有微风，带来一丝凉意。",
    "夏日的午后，骄阳似火，需要做好防晒措施。"
]

function displayRandomTexts() {
    // 随机选择tech_ai_texts中的一条文本
    const randomTechText = tech_ai_texts[Math.floor(Math.random() * tech_ai_texts.length)];
    console.log(randomTechText)

    // 随机选择weather_daily_texts中的一条文本
    const randomWeatherText = weather_daily_texts[Math.floor(Math.random() * weather_daily_texts.length)];
    console.log(randomWeatherText)

    // 将随机选择的文本显示在id为AI_text和user_text的元素中
    // document.getElementById('AI_text').textContent = randomTechText;
    // document.getElementById('user_text').textContent = randomWeatherText;
}

let activeButton = null; // 用于记录当前激活的按钮

function handleButtonClick(button) {
    if (activeButton) {
        activeButton.classList.remove('active');
    }

    // 为当前点击的按钮添加激活样式
    button.classList.add('active');
    activeButton = button; // 更新当前激活的按钮

    // 根据按钮的 ID 执行不同的操作
    // if (button.id === 'show-questions') {
    //     fetchWrongQuestions();
    // } else if (button.id === 'show-text') {
    //     fetchTextContent();
    // } else if (button.id === 'show-analysis') {
    //     fetchLegalAnalysis();
    // } else 
    if (button.id === 'answer_question') {
        // 复制题目到QA问答的输入框
        document.getElementById('chat-input').innerHTML = '请帮我分析并回答这道题目。'
        const if_kb = localStorage.getItem('if_user_kb');
        // console.log('题目id', globalQuestionId);
        QAsendMessage(globalQuestionId, if_kb);
    } else if (button.id === 'Generate_questions') {
        // 生成考题
        generateQuestions();
    }
}

let historyData = [];
// 历史记录
// 当点击历史记录图标时，显示弹框
function loadHistory() {
    console.log('加载历史记录');
    
    // 显示历史记录模态框
    const historyModal = document.getElementById("historyModal");
    historyModal.classList.add("active");

    // 获取cookie中的随机ID
    const randomId = getRandomIdFromCookie();

    // 调用 API 获取历史记录
    axios.get(`${BASE_URL}/api/chat_id_title_list?user_id=${randomId}`)
        .then(function (response) {
            let historyIds = response.data.chat_id_list;
            // 过滤掉索引为 0 的元素
            historyIds = historyIds.slice(1);

            // 获取 ul 元素
            const historyList = document.getElementById("historyList");
            historyList.innerHTML = '';  // 清空现有的历史记录列表

            // 遍历数组，为每个 id 创建一个 li 元素，并添加点击事件
            historyIds.forEach(item => {
                // 只有当 item.title 存在时才创建 li 元素
                if (!item.title) return;

                const li = document.createElement("li");
                li.textContent = item.title;

                // 添加点击事件，点击时打印 chat_id，并传递 chat_id 发起请求
                li.addEventListener("click", function () {
                    // 关闭历史记录模态框
                    historyModal.classList.remove("active");

                    // 调用 API 获取指定 chat_id 的聊天记录
                    axios.get(`${BASE_URL}/api/chat_byid?chat_id=${item.chat_id}`)
                        .then(function (response) {
                            // console.log(response.data.messages.history);

                            this.chat_id = item.chat_id;
                            console.log('this.chat_id', this.chat_id);

                            // 清空全局的 historyData 数组，防止数据累加
                            historyData = [];

                            // 重新获取新的历史记录数据并存入 historyData
                            const newHistory = (response.data.messages && response.data.messages.history) || [];
                            historyData.push(...newHistory);

                            // 清空聊天记录显示区域，防止重复渲染相同的消息
                            const chatMessagesContainer = document.getElementById('chat-messages');
                            chatMessagesContainer.innerHTML = '';

                            // 渲染历史记录
                            historyData.forEach(msg => {
                                const msgContainer = document.createElement('div');
                                msgContainer.className = `message ${msg.role === 'user' ? 'user-message' : 'bot-message'}`;
                                msgContainer.innerHTML = `
                                    <img src="${msg.role === 'user' ? 'images/user.png' : 'images/robot.png'}" alt="${msg.role} Avatar" class="avatar">
                                    <div class="message-content">
                                        <div class="message-text">${msg.content}</div>
                                    </div>
                                `;
                                chatMessagesContainer.appendChild(msgContainer);
                            });

                            // 滚动到聊天记录的底部
                            chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
                        }).catch(function (err) {
                            console.log(err);
                        });
                });

                // 将 li 元素添加到历史记录列表
                historyList.appendChild(li);
            });
        }).catch(function (err) {
            console.log(err);
        });
}

// 生成一个随机的ID
function generateRandomId() {
    return 'id_' + Math.random().toString(36).substr(2, 8); // 生成一个8位的随机ID
}

// 存储随机 ID 到 Cookie 中
function setRandomIdInCookie() {
    // 判断是否存在id
    const existingId = getRandomIdFromCookie();
    if (existingId) {
        console.log(`Cookie中已存在随机ID: ${existingId}`);
        return; // 如果已经存在则不再设置
    }

    const randomId = generateRandomId();
    // 设置过期时间为 2099 年 12 月 31 日 23:59:59 GMT
    const expires = "Fri, 31 Dec 2099 23:59:59 GMT";

    // 设置 id，包含随机 ID 和过期时间
    document.cookie = `LG_sj_Id=${randomId}; expires=${expires}; path=/`;
    console.log(`Random ID stored in cookie: ${randomId}`);
}

// 获取 cookie中设置的 随机 ID
function getRandomIdFromCookie() {
    const cookieArray = document.cookie.split('; ');
    for (let i = 0; i < cookieArray.length; i++) {
        const cookie = cookieArray[i].split('=');
        if (cookie[0] === 'LG_sj_Id') {
            return cookie[1];
        }
    }
    return null; // 如果没有随机 ID，返回 null
}

// 根据关键字生成考题
async function generateQuestion() {
    const questionSearch = document.getElementById('question-search').value;
    if (!questionSearch) {
        return;
    }

    try {
        // 清空之前的内容
        const questionSection = document.getElementById('question-section-all');
        questionSection.innerHTML = '';
        
        // 创建问题容器
        const questionContainer = document.createElement('div');
        questionContainer.className = 'question-container';
        questionContainer.style.display = 'flex';
        questionContainer.style.flexDirection = 'column';
        
        // 创建内容显示区域
        const contentArea = document.createElement('div');
        contentArea.id = 'question-content';
        contentArea.className = 'markdown-content';
        contentArea.style.width = '100%';
        contentArea.style.padding = '10px';
        contentArea.style.overflow = 'auto';
        contentArea.style.height = '100%';
        contentArea.style.lineHeight = '1.6';
        contentArea.style.fontSize = '15px';
        
        // 添加加载提示
        contentArea.innerHTML = '<div style="text-align: center; padding: 20px;">正在生成考题...</div>';
        
        questionContainer.appendChild(contentArea);
        questionSection.appendChild(questionContainer);

        // 确保已初始化md对象
        if (!md && window.markdownit) {
            md = window.markdownit({
                html: true,
                linkify: true,
                typographer: true,
            }).use(window.markdownitTaskLists, {
                enabled: true,
                label: true,
                labelAfter: true,
            });
        }

        // 发送请求
        const response = await fetch(`${BASE_URL}/dev/geneQusetion?kb_content=${encodeURIComponent(questionSearch)}`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullContent = '';
        let accumulatedMarkdown = '';
        
        // 处理SSE数据流
        async function read() {
            const { done, value } = await reader.read();
            if (done) {
                // 流结束时，检查是否有最终的JSON数据
                if (fullContent) {
                    try {
                        const jsonMatch = fullContent.match(/data:({.*})/);
                        if (jsonMatch && jsonMatch[1]) {
                            const jsonData = JSON.parse(jsonMatch[1]);
                            if (jsonData.content) {
                                // 使用markdown-it渲染内容
                                accumulatedMarkdown = jsonData.content;
                                // 安全地使用md对象
                                if (md) {
                                    contentArea.innerHTML = md.render(accumulatedMarkdown);
                                } else {
                                    contentArea.innerHTML = `<pre>${accumulatedMarkdown}</pre>`;
                                }
                            }
                        }
                    } catch (e) {
                        console.error('解析最终JSON数据失败:', e);
                    }
                }
                return;
            }
            
            const chunk = decoder.decode(value);
            fullContent += chunk;
            
            // 解析数据块
            const lines = chunk.split('\n');
            let currentMarkdown = '';
            
            for (let line of lines) {
                line = line.trim();
                
                if (line.startsWith('event:update')) {
                    continue;
                }
                
                if (line.startsWith('data:')) {
                    const data = line.slice(5).trim();
                    if (data && data !== '###' && !data.startsWith('{')) {
                        currentMarkdown += data;
                    }
                }
            }
            
            // 更新Markdown内容
            if (currentMarkdown) {
                accumulatedMarkdown += currentMarkdown;
                // 安全地使用md对象
                if (md) {
                    contentArea.innerHTML = md.render(accumulatedMarkdown);
                } else {
                    contentArea.innerHTML = `<pre>${accumulatedMarkdown}</pre>`;
                }
                // 滚动到底部
                contentArea.scrollTop = contentArea.scrollHeight;
            }
            
            await read();
        }
        
        await read();
    } catch (error) {
        console.error('生成考题失败:', error);
        const questionSection = document.getElementById('question-section');
        if (questionSection) {
            questionSection.innerHTML = `<div style="color: red; padding: 20px;">生成考题失败: ${error.message}</div>`;
        }
    }
}

// 根据关键字生成考题
async function generateQuestion1() {
    console.log('ces')
    const chatInput = document.getElementById('chat-input');
    const questionSearch = chatInput.innerHTML;
    if (!questionSearch) {
        return;
    }

    // 清空输入框
    chatInput.innerHTML = '';

    try {
        // 清空之前的内容
        const questionSection = document.getElementById('question-section-lt');
        questionSection.innerHTML = '';
        
        // 创建问题容器
        const questionContainer = document.createElement('div');
        questionContainer.className = 'question-container';
        questionContainer.style.display = 'flex';
        questionContainer.style.flexDirection = 'column';
        
        // 创建内容显示区域
        const contentArea = document.createElement('div');
        contentArea.id = 'question-content';
        contentArea.className = 'markdown-content';
        contentArea.style.width = '100%';
        contentArea.style.padding = '10px';
        contentArea.style.overflow = 'auto';
        contentArea.style.height = '100%';
        contentArea.style.lineHeight = '1.6';
        contentArea.style.fontSize = '15px';
        
        // 添加加载提示
        contentArea.innerHTML = '<div style="text-align: center; padding: 20px;">正在生成考题...</div>';
        
        questionContainer.appendChild(contentArea);
        questionSection.appendChild(questionContainer);

        // 确保已初始化md对象
        if (!md && window.markdownit) {
            md = window.markdownit({
                html: true,
                linkify: true,
                typographer: true,
            }).use(window.markdownitTaskLists, {
                enabled: true,
                label: true,
                labelAfter: true,
            });
        }

        // 发送请求
        const response = await fetch(`${BASE_URL}/dev/geneQusetion?kb_content=${encodeURIComponent(questionSearch)}`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullContent = '';
        let accumulatedMarkdown = '';
        
        // 处理SSE数据流
        async function read() {
            const { done, value } = await reader.read();
            if (done) {
                // 流结束时，检查是否有最终的JSON数据
                if (fullContent) {
                    try {
                        const jsonMatch = fullContent.match(/data:({.*})/);
                        if (jsonMatch && jsonMatch[1]) {
                            const jsonData = JSON.parse(jsonMatch[1]);
                            if (jsonData.content) {
                                // 使用markdown-it渲染内容
                                accumulatedMarkdown = jsonData.content;
                                // 安全地使用md对象
                                if (md) {
                                    contentArea.innerHTML = md.render(accumulatedMarkdown);
                                } else {
                                    contentArea.innerHTML = `<pre>${accumulatedMarkdown}</pre>`;
                                }
                            }
                        }
                    } catch (e) {
                        console.error('解析最终JSON数据失败:', e);
                    }
                }
                return;
            }
            
            const chunk = decoder.decode(value);
            fullContent += chunk;
            
            // 解析数据块
            const lines = chunk.split('\n');
            let currentMarkdown = '';
            
            for (let line of lines) {
                line = line.trim();
                
                if (line.startsWith('event:update')) {
                    continue;
                }
                
                if (line.startsWith('data:')) {
                    const data = line.slice(5).trim();
                    if (data && data !== '###' && !data.startsWith('{')) {
                        currentMarkdown += data;
                    }
                }
            }
            
            // 更新Markdown内容
            if (currentMarkdown) {
                accumulatedMarkdown += currentMarkdown;
                // 安全地使用md对象
                if (md) {
                    contentArea.innerHTML = md.render(accumulatedMarkdown);
                } else {
                    contentArea.innerHTML = `<pre>${accumulatedMarkdown}</pre>`;
                }
                // 滚动到底部
                contentArea.scrollTop = contentArea.scrollHeight;
            }
            
            await read();
        }
        
        await read();
    } catch (error) {
        console.error('生成考题失败:', error);
        const questionSection = document.getElementById('question-section');
        if (questionSection) {
            questionSection.innerHTML = `<div style="color: red; padding: 20px;">生成考题失败: ${error.message}</div>`;
        }
    }
}

let selectedId = null;
//获取选中的姓名
function selectName(element) {
    // 获取选中的姓名和对应的ID
    this.selectedId = element.getAttribute('data-id');
    // 移除所有已选中的样式
    const selectedElements = document.querySelectorAll('.name-tag.selected');
    selectedElements.forEach(selectedElement => {
        selectedElement.classList.remove('selected');
    });

    // 添加选中样式到当前点击的元素
    element.classList.add('selected');
    getOrderTag();
}

// 控制工单标签的滑动
function scrollTabs(direction) {
    const tabContainer = document.getElementById('order-selector');
    if (tabContainer) {
        const scrollAmount = 100; // 可根据实际情况调整滑动的距离
        if (direction === 'left') {
            tabContainer.scrollLeft -= scrollAmount;
        } else if (direction === 'right') {
            tabContainer.scrollLeft += scrollAmount;
        }
    }
}

// 获取工单标签
function getOrderTag() {
    // 使用axios调用接口获取工单标签
    axios.post(`${BASE_URL_TS}/api/getcomplaintid?cate=${this.selectedId}`, {}, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': Authorization
        }
    })
        .then(function (response) {
            // console.log('response', response.data.complaintid_info)
            const orderSelector = document.getElementById('order-selector');
            orderSelector.innerHTML = ''; // 清空之前的选项
            
            // 检查返回数据格式
            if (response.data.complaintid_info && response.data.complaintid_info.length > 0) {
                // 获取json_agg数组
                const jsonAggArray = response.data.complaintid_info[0].json_agg;
                
                // 检查json_agg是否为数组
                if (Array.isArray(jsonAggArray)) {
                    // 遍历数组中的每个ID值
                    jsonAggArray.forEach(id => {
                        const option = document.createElement('div');
                        option.className = 'tab-button';
                        option.textContent = id;  // 设置显示的文本内容
                        option.value = id;  // 添加value属性
                        option.setAttribute('data-id', id);  // 添加data-id属性，方便通过dataset访问
                        option.addEventListener('click', function() {
                            // 先移除所有按钮的激活状态
                            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active-tab'));
                            // 为当前按钮添加激活状态
                            this.classList.add('active-tab');
                            // 获取按钮的值
                            const selectedValue = this.value || this.getAttribute('data-id');
                            console.log('选中的值:', selectedValue);
                            // 更新全局变量
                            window.selectedOrderTitle = selectedValue;
                            getComplaintContent()
                        });
                        orderSelector.appendChild(option);
                    });
                } else {
                    // 如果json_agg不是数组，按原来的方式处理
                    const order_caseid = response.data.complaintid_info;
                    order_caseid.forEach(cid => {
                        const option = document.createElement('div');
                        option.className = 'tab-button';
                        option.textContent = cid.json_agg;  // 设置显示的文本内容
                        option.value = cid.json_agg;  // 添加value属性
                        option.setAttribute('data-id', cid.json_agg);  // 添加data-id属性，方便通过dataset访问
                        option.addEventListener('click', function() {
                            // 先移除所有按钮的激活状态
                            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active-tab'));
                            // 为当前按钮添加激活状态
                            this.classList.add('active-tab');
                            // 获取按钮的值
                            const selectedValue = this.value || this.getAttribute('data-id');
                            console.log('选中的值:', selectedValue);
                            // 更新全局变量
                            window.selectedOrderTitle = selectedValue;
                            getComplaintContent()
                        });
                        orderSelector.appendChild(option);
                    });
                }
            } else {
                console.error('获取工单标签失败: 返回数据格式不正确');
            }
        })
        .catch(function (error) {
            console.error('获取工单标签失败:', error);
        });
}

// 获取投诉内容
// 获取随机题目，法理分析，法理推荐，法条分析
function getComplaintContent() {
    const currentId = selectedOrderTitle;
    return new Promise((resolve, reject) => {
        axios.post(`${BASE_URL_TS}/api/getcomplaintbyid?lc_id=${currentId}`, {}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': Authorization
            }
        })
            .then((response) => {
                console.log('response', response.data);

                // 检查返回数据格式
                if (response.data.complaint_info && response.data.complaint_info.length > 0) {
                    const complaintData = response.data.complaint_info[0];
                    
                    // 获取投诉内容和处理状态
                    const complaintContent = complaintData.complaint_content || '无投诉内容';
                    const handlingStatus = complaintData.handling_status || '无处理方案';
                    
                    // 将投诉内容显示在id为question的元素中
                    const questionElement = document.getElementById('question');
                    if (questionElement) {
                        questionElement.innerText = complaintContent;
                    } else {
                        console.error('未找到id为question的元素');
                    }
                    
                    // 将处理状态显示在id为question_solution的元素中
                    const solutionElement = document.getElementById('question_solution');
                    if (solutionElement) {
                        solutionElement.innerText = handlingStatus;
                    } else {
                        console.error('未找到id为question_solution的元素');
                    }
                } else {
                    console.error('获取投诉内容失败: 返回数据格式不正确');
                }
                
                resolve();
            })
            .catch((err) => {
                console.log(err);
                reject(err);
            });
    });
}

// 需要初始化的api
window.onload = function () {
    this.md = window
        .markdownit({
            html: true,
            linkify: true,
            typographer: true,
        })
        .use(window.markdownitTaskLists, {
            enabled: true,
            label: true,
            labelAfter: true,
        });
    setRandomIdInCookie();
    getChatId();
    
    // 强制重置并添加Q按钮事件监听
    const qaButton = document.getElementById("qa-button");
    const qaMessages = document.getElementById("qa_messages");
    if (qaButton && qaMessages) {
        // 首先移除所有已有的点击事件监听器
        qaButton.replaceWith(qaButton.cloneNode(true));
        // 重新获取克隆后的按钮
        const newQaButton = document.getElementById("qa-button");
        
        console.log('重新注册Q按钮事件 - window.onload');
        newQaButton.addEventListener("click", function(event) {
            console.log('点击Q按钮 - window.onload');
            event.stopPropagation();
            if (!qaMessages.classList.contains("show")) {
                qaMessages.classList.add("show");
            } else {
                qaMessages.classList.remove("show");
            }
        });
        
        // 阻止点击qa_messages内部时关闭弹框
        qaMessages.addEventListener("click", function(event) {
            event.stopPropagation();
        });
    }
    
    // 点击页面其他区域时关闭弹框
    document.addEventListener("click", function(event) {
        // 关闭历史记录弹框
        const historyModal = document.getElementById("historyModal");
        if (historyModal.classList.contains("active") && event.target !== document.getElementById("history")) {
            historyModal.classList.remove("active");
        }
        
        // 关闭QA问答弹框
        const qaMessages = document.getElementById("qa_messages");
        const newQaButton = document.getElementById("qa-button");
        if (qaMessages && qaMessages.classList.contains("show") && event.target !== newQaButton && !qaMessages.contains(event.target)) {
            qaMessages.classList.remove("show");
        }
    });

    localStorage.setItem('hasSentMessage', 'false')
    displayRandomTexts();
}