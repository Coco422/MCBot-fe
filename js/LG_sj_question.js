const chartContainer = document.getElementById('chart-container');
const myChart = echarts.init(chartContainer);

const barchartData = {
    grid: {
        top: '10%',    // 上边距
        bottom: '10%', // 下边距
        left: '10%',   // 左边距
        right: '10%'   // 右边距
    },
    tooltip: {
        trigger: 'axis', // 按坐标轴触发
        formatter: function (params) {
            // 自定义提示框内容
            let result = `名称：${params[0].name}<br>`; // 显示 x 轴名称
            params.forEach(param => {
                result += `值：${param.value}<br>`; // 显示系列名称和数据值
            });
            return result;
        }
    },
    xAxis: {
        type: 'category',
        data: [],
        axisLabel: {
            formatter: function (value) {
                if (value.length > 6) {
                    return value.substring(0, 6) + '...'; // 超过 3 个字符，显示省略号
                }
                return value;
            }
        }
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            data: [],
            type: 'bar'
        }
    ]
};

const piechartData = {
    grid: {
        top: '10%',    // 上边距
        bottom: '10%', // 下边距
        left: '10%',   // 左边距
        right: '10%'   // 右边距
    },
    // tooltip: {
    //     trigger: 'item', // 按数据项触发
    //     formatter: function (params) {
    //         return `${params.name}: ${params.value} (${(params.percent).toFixed(2)}%)`;
    //     }
    // },
    tooltip: {
        trigger: 'item'
    },
    series: [
        {
            type: 'pie',
            radius: '50%',
            data: [
            ]
        }
    ]
};

const linechartData = {
    grid: {
        top: '10%',    // 上边距
        bottom: '10%', // 下边距
        left: '10%',   // 左边距
        right: '10%'   // 右边距
    },
    tooltip: {
        trigger: 'axis', // 按坐标轴触发
        formatter: function (params) {
            // 自定义提示框内容
            let result = `名称：${params[0].name}<br>`; // 显示 x 轴名称
            params.forEach(param => {
                result += `值：${param.value}<br>`; // 显示系列名称和数据值
            });
            return result;
        }
    },
    xAxis: {
        type: 'category',
        data: [],
        axisLabel: {
            formatter: function (value) {
                if (value.length > 6) {
                    return value.substring(0, 6) + '...'; // 超过 3 个字符，显示省略号
                }
                return value;
            }
        }
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            data: [],
            type: 'line'
        }
    ]
};

// 动态转换数据
function transformData(jsonData, type) {
    if (type === 'bar') {
        return {
            grid: {
                top: '10%',    // 上边距
                bottom: '10%', // 下边距
                left: '10%',   // 左边距
                right: '10%'   // 右边距
            },
            tooltip: {
                trigger: 'axis', // 按坐标轴触发
                formatter: function (params) {
                    // 自定义提示框内容
                    let result = `名称：${params[0].name}<br>`; // 显示 x 轴名称
                    params.forEach(param => {
                        result += `值：${param.value}<br>`; // 显示系列名称和数据值
                    });
                    return result;
                }
            },
            xAxis: {
                type: 'category',
                data: jsonData.categories,
                axisLabel: {
                    formatter: function (value) {
                        if (value.length > 6) {
                            return value.substring(0, 6) + '...'; // 超过 3 个字符，显示省略号
                        }
                        return value;
                    }
                }
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    data: jsonData.values,
                    type: 'bar'
                }
            ]
        };
    } else if (type === 'pie') {
        return {
            grid: {
                top: '10%',    // 上边距
                bottom: '10%', // 下边距
                left: '10%',   // 左边距
                right: '10%'   // 右边距
            },
            tooltip: {
                trigger: 'item'
            },
            series: [
                {
                    // name: '访问来源',
                    type: 'pie',
                    radius: '50%',
                    data: jsonData.pieData
                }
            ]
        };
    } else if (type === 'line') {
        return {
            grid: {
                top: '10%',    // 上边距
                bottom: '10%', // 下边距
                left: '10%',   // 左边距
                right: '10%'   // 右边距
            },
            tooltip: {
                trigger: 'axis', // 按坐标轴触发
                formatter: function (params) {
                    // 自定义提示框内容
                    let result = `名称：${params[0].name}<br>`; // 显示 x 轴名称
                    params.forEach(param => {
                        result += `值：${param.value}<br>`; // 显示系列名称和数据值
                    });
                    return result;
                }
            },
            xAxis: {
                type: 'category',
                data: jsonData.categories,
                axisLabel: {
                    formatter: function (value) {
                        if (value.length > 6) {
                            return value.substring(0, 6) + '...'; // 超过 3 个字符，显示省略号
                        }
                        return value;
                    }
                }
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    data: jsonData.values,
                    type: 'line'
                }
            ]
        };
    }
    return null;
}

myChart.setOption(barchartData, { notMerge: true });

// 假设从后端返回的 JSON 数据
const jsonData = {
    categories: [],
    values: [],
    pieData: [
    ]
};
// 监听自定义事件
window.addEventListener('sqldataReceived', (event) => {
    console.log('sqldataReceived', event);
    const test = event.detail.replace(/'/g, '"');
    console.log('test', test);
    const test2 = JSON.parse(test)
    jsonData.categories = test2.categories; // 更新 categories
    jsonData.values = test2.values; // 更新 values
    // 将 categories 和 values 组合成 pieData
    const newPieData = jsonData.categories.map((category, index) => ({
        name: category,
        value: jsonData.values[index]
    }));

    // 更新 jsonData 的 pieData
    jsonData.pieData = newPieData;
    // 假设当前图表类型是 'bar'，你可以根据实际情况调整
    const chartData = transformData(jsonData, 'bar');

    if (chartData) {
        myChart.setOption(chartData, { notMerge: true });
    }
});


function switchChart(type) {
    const chartData = transformData(jsonData, type);
    if (chartData) {
        myChart.setOption(chartData, { notMerge: true });
        document.querySelectorAll('.chart-button').forEach(button => {
            button.classList.remove('active');
        });
        document.getElementById(`${type}-chart-btn`).classList.add('active');
    }
    // 监听窗口大小变化，调整图表大小
    window.addEventListener('resize', () => {
        myChart.resize();
    });
}

// 切换面板的函数
function switchPanel(panelType, showAlert = true) {
    // 获取两个面板
    const qaPanel = document.getElementById('qa-panel');
    const dataPanel = document.getElementById('data-panel');

    // 移除所有面板的 active 类
    qaPanel.classList.remove('active');
    dataPanel.classList.remove('active');
    qaPanel.classList.remove('active_data');
    dataPanel.classList.remove('active_data');

    // 根据点击的面板类型添加 active 类
    if (panelType === 'qa') {
        qaPanel.classList.add('active');
        // const chatMessages = document.getElementById('chat-messages');
        // if (chatMessages) {
        //     chatMessages.innerHTML = ''; // 清空聊天记录
        // }
        if (showAlert) {
            document.getElementById('send-button_QA').style.display = 'block';
            document.getElementById('send-button').style.display = 'none';
            document.getElementById('qa_messages').style.display = 'block';
            document.getElementById('data_messages').style.display = 'none';
            document.getElementById('qa-button').style.display = 'block';
            document.getElementById('data-button').style.display = 'none';
            const recordButton = document.getElementById('record_button');
            recordButton.style.backgroundColor = '#1FDE82';
              // 只有当 #chat-messages 元素存在时才清空内容

            showMessage('已切换到 QA问答 模式');
        }
        // 这里可以添加 QA 问答相关的逻辑
    } else if (panelType === 'data') {
        dataPanel.classList.add('active_data');
        // const chatMessages = document.getElementById('chat-messages');
        // if (chatMessages) {
        //     chatMessages.innerHTML = ''; // 清空聊天记录
        // }
        if (showAlert) {
            document.getElementById('send-button_QA').style.display = 'none';
            document.getElementById('send-button').style.display = 'block';
            document.getElementById('qa_messages').style.display = 'none';
            document.getElementById('data_messages').style.display = 'block';
            document.getElementById('qa-button').style.display = 'none';
            document.getElementById('data-button').style.display = 'block';
            const recordButton = document.getElementById('record_button');
            recordButton.style.backgroundColor = '';
            showMessage('已切换到 数据看板 模式');
        }
    }
}

// 显示消息弹框的函数
function showMessage(message) {
    // 创建一个弹框元素
    const alertBox = document.createElement('div');
    alertBox.style.position = 'fixed';
    alertBox.style.top = '20px';
    alertBox.style.left = '50%';
    alertBox.style.transform = 'translateX(-50%)';
    alertBox.style.backgroundColor = 'rgba(76, 175, 80, 0.9)'; // 半透明的绿色背景
    alertBox.style.color = 'white';
    alertBox.style.padding = '12px 24px';
    alertBox.style.borderRadius = '8px';
    alertBox.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    alertBox.style.zIndex = '1000';
    alertBox.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    alertBox.style.fontSize = '14px';
    alertBox.style.fontFamily = 'Arial, sans-serif';
    alertBox.style.textAlign = 'center';
    alertBox.style.cursor = 'pointer'; // 点击关闭
    alertBox.textContent = message;

    // 将弹框添加到页面中
    document.body.appendChild(alertBox);

    // 点击弹框关闭
    alertBox.addEventListener('click', () => {
        alertBox.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(alertBox);
        }, 500); // 等待淡出动画完成
    });

    // 3 秒后淡出并移除弹框
    setTimeout(() => {
        alertBox.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(alertBox);
        }, 500); // 等待淡出动画完成
    }, 800); // 3 秒后消失
}

// 默认选中 QA 问答区域，但不显示消息提示
switchPanel('qa', false); // 第二个参数为 false，表示不显示消息提示

// 获取 QA问答 Q 按钮和 qa_messages 元素
const qaButton = document.getElementById("qa-button");
const qaMessages = document.getElementById("qa_messages");

// 点击 Q 按钮时，显示/隐藏 qa_messages
qaButton.addEventListener("click", function(event) {
  // 阻止点击事件冒泡，避免触发 document 上的点击事件
  event.stopPropagation();
  qaMessages.classList.toggle("show");
});

// 阻止点击 qa_messages 内部内容时，事件冒泡到 document（避免误关闭弹框）
qaMessages.addEventListener("click", function(event) {
  event.stopPropagation();
});

// 点击页面其他区域时，隐藏 qa_messages
document.addEventListener("click", function(event) {
  // 如果点击的目标既不在 qa_messages 内，也不是 Q 按钮，则关闭 qa_messages
  if (!qaMessages.contains(event.target) && event.target !== qaButton) {
    qaMessages.classList.remove("show");
  }
});

// 获取 数据看板 Q 按钮和 data_messages 元素
const dataButton = document.getElementById("data-button");
const dataMessages = document.getElementById("data_messages");

// 点击 Q 按钮时，显示/隐藏 data_messages
dataButton.addEventListener("click", function(event) {
  // 阻止点击事件冒泡，避免触发 document 上的点击事件
  event.stopPropagation();
  dataMessages.classList.toggle("show");
});

// 阻止点击 data_messages 内部内容时，事件冒泡到 document（避免误关闭弹框）
dataMessages.addEventListener("click", function(event) {
  event.stopPropagation();
});

// 点击页面其他区域时，隐藏 data_messages
document.addEventListener("click", function(event) {
  // 如果点击的目标既不在 data_messages 内，也不是 Q 按钮，则关闭 data_messages
  if (!dataMessages.contains(event.target) && event.target !== qaButton) {
    dataMessages.classList.remove("show");
  }
});

// 当点击关闭按钮时，隐藏弹框
document.getElementById("closeModal").addEventListener("click", function (event) {
    // 阻止点击事件传播到 document 上
    event.stopPropagation();
    document.getElementById("historyModal").classList.remove("active");
});

// 当点击页面的其他区域时，关闭弹框
document.addEventListener("click", function (event) {
    const modal = document.getElementById("historyModal");
    const historyButton = document.getElementById("history");

    // 如果点击的区域不是弹框本身或历史记录按钮，则关闭弹框
    if (!modal.contains(event.target) && event.target !== historyButton) {
        modal.classList.remove("active");
    }
});