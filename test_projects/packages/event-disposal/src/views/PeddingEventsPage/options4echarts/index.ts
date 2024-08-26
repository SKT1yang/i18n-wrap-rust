const option = (data) => ({
  tooltip: {
    trigger: 'item'
  },
  legend: {
    top: '5%',
    left: 'center',
    textStyle: {
      color: '#fff'
    }
  },
  series: [
    {
      type: 'pie',
      radius: ['40%', '70%'],
      color: '#fff',
      label: {
        show: false
      },
      itemStyle: {
        borderRadius: 10,
        color: function (params) {
          let color = ''
          switch (params.data.name) {
            case '高风险':
              color = '#ff3e32'
              break
            case '中风险':
              color = '#ff9432'
              break
            case '低风险':
              color = '#ffcd32'
              break
            case '信息':
              color = '#1890ff'
              break
            default:
              color = '#32ff90'
          }
          return color
        }
      },
      labelLine: {
        show: false
      },
      data: data
    }
  ]
})

const option2 = (data) => ({
  tooltip: {
    trigger: 'item'
  },
  grid: {
    left: '25%',
    right: '10%',
    bottom: '10%',
    top: '5%'
  },
  dataZoom: [
    {
      type: 'slider',
      show: data.count.length > 10,
      yAxisIndex: 0,
      zoomLock: true,
      width: 5,
      right: 10,
      top: 15,
      bottom: 30,
      startValue: data.count.length,
      endValue: data.count.length - 8,
      handleSize: 0,
      showDetail: false,
      showDataShadow: false
    },
    {
      type: 'inside',
      id: 'insideY',
      yAxisIndex: 0,
      start: 0,
      end: 100,
      zoomOnMouseWheel: false,
      moveOnMouseMove: true,
      moveOnMouseWheel: true
    }
  ],
  xAxis: {
    type: 'value',
    minInterval: 1,
    axisLabel: {
      color: '#fff',
      fontSize: 11,
      interval: 0
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: '#fff'
      }
    },
    splitLine: {
      show: false
    }
  },
  yAxis: {
    type: 'category',
    axisLabel: {
      color: '#fff',
      fontSize: 11,
      formatter: (value: string) => {
        if (value.length > 8) {
          return value.substring(0, 8) + '...'
        } else {
          return value
        }
      }
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: '#fff'
      }
    },
    splitLine: {
      show: false
    },
    data: data.eventName
  },
  series: [
    {
      name: '数量',
      type: 'bar',
      barWidth: 10,
      emphasis: {
        disabled: true
      },
      itemStyle: {
        borderRadius: 5,
        color: {
          type: 'linear',
          colorStops: [
            {
              offset: 0,
              color: '#1e292f'
            },
            {
              offset: 1,
              color: '#61c5fe'
            }
          ]
        }
      },
      label: {
        show: true,
        color: '#fff',
        position: 'right'
      },
      data: data.count
    }
  ]
})
const option3 = (data) => ({
  tooltip: {
    trigger: 'item'
  },
  grid: {
    left: '25%',
    right: '10%',
    bottom: '10%',
    top: '5%'
  },
  dataZoom: [
    {
      type: 'slider',
      show: data.count.length > 10,
      yAxisIndex: 0,
      zoomLock: true,
      width: 5,
      right: 10,
      top: 15,
      bottom: 30,
      startValue: data.count.length,
      endValue: data.count.length - 8,
      handleSize: 0,
      showDetail: false,
      showDataShadow: false
    },
    {
      type: 'inside',
      id: 'insideY',
      yAxisIndex: 0,
      zoomOnMouseWheel: false,
      moveOnMouseMove: true,
      moveOnMouseWheel: true
    }
  ],
  xAxis: {
    type: 'value',
    minInterval: 1,
    axisLabel: {
      color: '#fff',
      fontSize: 11,
      interval: 0
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: '#fff'
      }
    },
    splitLine: {
      show: false
    }
  },
  yAxis: {
    type: 'category',
    axisLabel: {
      color: '#fff',
      fontSize: 11
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: '#fff'
      }
    },
    splitLine: {
      show: false
    },
    data: data.eventName
  },
  series: [
    {
      name: '数量',
      type: 'bar',
      barWidth: 10,
      emphasis: {
        disabled: true
      },
      itemStyle: {
        borderRadius: 5,
        color: {
          type: 'linear',
          colorStops: [
            {
              offset: 0,
              color: '#1e292f'
            },
            {
              offset: 1,
              color: '#61c5fe'
            }
          ]
        }
      },
      label: {
        show: true,
        color: '#fff',
        position: 'right'
      },
      data: data.count
    }
  ]
})
export { option, option2, option3 }
