// Reports 页面逻辑 - 基于真实 Figma 设计
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { userApi } from '@/api'
import type { YearlyReportData } from '@/types'

// 响应式数据
const selectedYear = ref<number>(2025) // 默认选择 2025
const loading = ref(false)
const apiData = ref<YearlyReportData | null>(null)

// 月份标签
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// 天数标签 (1-31)
const days = Array.from({ length: 31 }, (_, i) => i + 1)

// 从API获取报表数据
const fetchReportsData = async (year: number) => {
  try {
    loading.value = true
    const response = await userApi.getYearlyDailyCalls(year)

    if (response.data) {
      apiData.value = response.data
      return response.data
    }
  } catch (error) {
    console.error('获取报表数据失败:', error)
    ElMessage.error('获取报表数据失败，请稍后重试')
    return null
  } finally {
    loading.value = false
  }
}

// 将API数据转换为表格数据格式
const convertApiDataToGrid = (data: YearlyReportData): any[] => {
  if (!data || !data.dailyCallCount || !Array.isArray(data.dailyCallCount)) {
    console.warn('API数据格式不正确，使用模拟数据')
    return generateMockDataGrid()
  }

  const grid = []
  const dailyCallCount = data.dailyCallCount

  // 创建日期到数据的映射
  const dataMap = new Map()
  dailyCallCount.forEach((item: any) => {
    if (item.callDate) {
      dataMap.set(item.callDate, item)
    }
  })

  // 生成12个月 x 31天的网格
  for (let month = 0; month < 12; month++) {
    const rowData = []
    for (let day = 1; day <= 31; day++) {
      // 构造日期字符串 (格式: YYYY-MM-DD)
      const dateStr = `${selectedYear.value}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const dayData = dataMap.get(dateStr)

      if (dayData) {
        const successCalls = dayData.successCount || 0
        rowData.push({
          hasData: successCalls > 0,
          value: successCalls,
          date: dateStr,
          failCount: dayData.failCount || 0,
          successCount: dayData.successCount || 0,
          totalCallCount: dayData.totalCallCount || 0,
          avgResponseTime: dayData.avgResponseTime || 0
        })
      } else {
        // 检查这个日期是否是有效日期
        const testDate = new Date(selectedYear.value, month, day)
        const isValidDate = testDate.getMonth() === month && testDate.getDate() === day

        rowData.push({
          hasData: false,
          value: 0,
          date: isValidDate ? dateStr : '',
          failCount: 0,
          successCount: 0,
          avgResponseTime: 0
        })
      }
    }
    grid.push(rowData)
  }

  return grid
}

// 数据网格 - 统一的数据获取函数
const generateDataGrid = async (year: number): Promise<any[]> => {
  // 先尝试获取API数据
  const apiResponse = await fetchReportsData(year)

  if (apiResponse) {
    // 如果API数据获取成功，转换为网格格式
    return convertApiDataToGrid(apiResponse)
  } else {
    // API失败时使用模拟数据
    return generateMockDataGrid()
  }
}

// 生成模拟数据 - 备用函数
const generateMockDataGrid = (): any[] => {
  const grid = []
  const cols = 31 // 31天
  const rows = 12 // 12个月

  for (let row = 0; row < rows; row++) {
    const rowData = []
    for (let col = 0; col < cols; col++) {
      const hasData = Math.random() > 0.95 // 5% 概率有数据，约20个单元格
      const value = hasData ? Math.floor(Math.random() * 100) + 1 : 0 // 1-100的随机数
      rowData.push({
        hasData,
        value: hasData ? value : 0,
        icon: '' // 不再使用图标
      })
    }
    grid.push(rowData)
  }
  return grid
}

// 根据数值返回颜色类名
const getColorClass = (value: number) => {
  if (value === 0) return 'color-empty'
  if (value >= 1 && value <= 10) return 'color-level-1'
  if (value >= 11 && value <= 30) return 'color-level-2'
  if (value >= 31 && value <= 50) return 'color-level-3'
  if (value > 50) return 'color-level-4'
  return 'color-empty'
}

// 底部统计数据 - 颜色图例 (基于Figma设计)
const bottomStats = [
  { color: 'rgba(1, 51, 160, 0.05)', text: '0', range: '0' },
  { color: 'rgba(1, 51, 160, 0.25)', text: '1-10', range: '1-10' },
  { color: 'rgba(1, 51, 160, 0.50)', text: '10-30', range: '10-30' },
  { color: 'rgba(1, 51, 160, 0.75)', text: '30-50', range: '30-50' },
  { color: 'rgba(1, 51, 160, 1.0)', text: '>50', range: '>50' }
]

// 为不同年份生成固定的数据集 - 初始化时使用空数组，组件加载时异步获取
const dataGrid = ref<any[]>([])

// 初始化数据
const initData = async () => {
  try {
    const gridData = await generateDataGrid(selectedYear.value)
    dataGrid.value = gridData
  } catch (error) {
    console.error('初始化数据失败:', error)
    // 失败时使用模拟数据
    dataGrid.value = generateMockDataGrid()
  }
}

// 导出逻辑钩子
export function useReportsLogic() {
  return {
    selectedYear,
    months,
    days,
    dataGrid,
    bottomStats,
    getColorClass,
    loading,
    initData
  }
}
