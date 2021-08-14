import Chart from '../index';

const myChart = document.createElement('div');

myChart.className = 'chart';

document.body.appendChild(myChart);


// Pie
let pieOption = {

    type: 'pie',   // 'line', 'bar', 'radar', 'gauge'

    //样式
    style: {
        //颜色
        colors: ['#f2711c', '#2185d0', '#21ba45', '#b5cc18', '#00b5ad', '#fbbd08', '#6435c9', '#a333c8', '#e03997', '#a5673f'],

        //字体
        font: '12px sans-serif',

        /* 名称: 三种方案
         * 1 - 'none' , 表示不显示名称
         * 2 - '{a}:{b}({c}%)'
         *   a: 名称
         *   b: 值
         *   c: 百分比
         * 3 - (a, b, c) = { return a + ':' + b +'(' + c + '%)' }
        */
        // nameStyle: (a, b, c) => {
        //     return a + '(' + b + ')'
        // },

        //值, 配置方法同上
        valueStyle: '{c}%',

        //名称, 配置方法同上
        nameStyle: '{a} {c}%',

        //图例,
        legend: {
          orient: 'horizontal', // horizontal or vertical
          position: ['center', 'bottom']
        }
    },

    //半径
    radius : '60%', // 60% , 150

    //圆心位置
    center: ['50%', '50%'],  // ['50%', '50%'], [200, 200]

    //图例
    legend: ['台式电脑', '笔记本', '平板电脑', '手机', '交换机', '路由器', '服务器'],

    //图例对应的数据集
    data: [334, 211, 186, 412, 218, 162, 128]
}

const chart = new Chart(myChart);

chart.setOption(pieOption);

chart.addEventListener('click', (e: any) => {
    console.log('click e: ', e.target.name, e.target.value)
})
