<template>
  <div class="reports-page">
    <!-- 年份选择器 -->
    <div class="year-selector">
      <div
        class="year-button"
        :class="{ active: selectedYear === 2024 }"
        @click="selectedYear = 2024"
      >
        2024
      </div>
      <div
        class="year-button"
        :class="{ active: selectedYear === 2025 }"
        @click="selectedYear = 2025"
      >
        2025
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 左上角空白区域 -->
      <div class="top-left-spacer"></div>

      <!-- 31天头部 -->
      <div class="days-header">
        <div v-for="day in days" :key="day" class="day-header">
          {{ day }}
        </div>
      </div>

      <!-- 月份标签列 -->
      <div class="months-column">
        <div v-for="month in months" :key="month" class="month-row">
          <div class="month-card">
            <div class="month-text">{{ month }}</div>
          </div>
        </div>
      </div>

      <!-- 数据网格 -->
      <div class="data-grid">
        <div v-for="(row, rowIndex) in dataGrid" :key="`row-${rowIndex}`" class="data-row">
          <div
            v-for="(cell, colIndex) in row"
            :key="`cell-${rowIndex}-${colIndex}`"
            class="data-cell"
            :class="getColorClass(cell.value)"
          >
            <div v-if="cell.hasData" class="cell-content">
              <div class="cell-value">{{ cell.value }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部统计框 -->
    <div class="bottom-stats">
      <div v-for="(stat, index) in bottomStats" :key="index" class="stat-box">
        <div class="stat-color" :style="{ backgroundColor: stat.color }"></div>
        <div class="stat-text">{{ stat.text }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useReportsLogic } from './index'

// 使用逻辑组合函数
const { selectedYear, months, days, dataGrid, bottomStats, getColorClass } = useReportsLogic()
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
