// Reports 页面逻辑 - 基于真实 Figma 设计
import { ref, computed } from 'vue'

// 响应式数据
const selectedYear = ref<number>(2025) // 默认选择 2025

// 月份标签
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// 天数标签 (1-31)
const days = Array.from({ length: 31 }, (_, i) => i + 1)

// 数据网格 - 模拟 Figma 中的数据框
const generateDataGrid = (_year: number) => {
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

// 为不同年份生成固定的数据集
const data2024 = generateDataGrid(2024) // 2024年的固定数据
const data2025 = generateDataGrid(2025) // 2025年的固定数据

// 根据选中年份返回对应数据
const dataGrid = computed(() => {
  return selectedYear.value === 2024 ? data2024 : data2025
})

// 导出逻辑钩子
export function useReportsLogic() {
  return {
    selectedYear,
    months,
    days,
    dataGrid,
    bottomStats,
    getColorClass
  }
}
