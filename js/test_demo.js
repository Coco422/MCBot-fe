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
            let result = `${params[0].categories}<br>`; // 显示 x 轴名称
            params.forEach(param => {
                result += `${param.categories}: ${param.values}<br>`; // 显示系列名称和数据值
            });
            return result;
        }
    },
    xAxis: {
        type: 'category',
        data: [],
        axisLabel: {
            formatter: function(value) {
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
            name: '访问来源',
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
            let result = `${params[0].categories}<br>`; // 显示 x 轴名称
            params.forEach(param => {
                result += `${param.categories}: ${param.values}<br>`; // 显示系列名称和数据值
            });
            return result;
        }
    },
    xAxis: {
        type: 'category',
        data: [],
        axisLabel: {
            formatter: function(value) {
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
                    let result = `${params[0].categories}<br>`; // 显示 x 轴名称
                    params.forEach(param => {
                        result += `${param.categories}: ${param.values}<br>`; // 显示系列名称和数据值
                    });
                    return result;
                }
            },
            xAxis: {
                type: 'category',
                data: jsonData.categories,
                axisLabel: {
                    formatter: function(value) {
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
                    name: '访问来源',
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
                    let result = `${params[0].categories}<br>`; // 显示 x 轴名称
                    params.forEach(param => {
                        result += `${param.categories}: ${param.values}<br>`; // 显示系列名称和数据值
                    });
                    return result;
                }
            },
            xAxis: {
                type: 'category',
                data: jsonData.categories,
                axisLabel: {
                    formatter: function(value) {
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

    // 根据点击的面板类型添加 active 类
    if (panelType === 'qa') {
        qaPanel.classList.add('active');
        if (showAlert) {
            document.getElementById('send-button_QA').style.display = 'block';
            document.getElementById('send-button').style.display = 'none';
            document.getElementById('qa_messages').style.display = 'block';
            document.getElementById('data_messages').style.display = 'none';
            showMessage('已切换到 QA问答 模式');
        }
        // 这里可以添加 QA 问答相关的逻辑
    } else if (panelType === 'data') {
        dataPanel.classList.add('active');
        if (showAlert) {
            document.getElementById('send-button_QA').style.display = 'none';
            document.getElementById('send-button').style.display = 'block';
            document.getElementById('qa_messages').style.display = 'none';
            document.getElementById('data_messages').style.display = 'block';
            showMessage('已切换到 数据看板 模式');
        }
        // 这里可以添加数据看板相关的逻辑
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