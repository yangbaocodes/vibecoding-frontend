<template>
  <div class="dashboard">
    <div class="page-header">
      <div>
        <h1 class="page-header__title">{{ $t('dashboard.title') }}</h1>
        <p class="page-header__description">{{ $t('dashboard.welcome') }}</p>
      </div>
      <div class="page-header__actions">
        <ElButton type="primary" :icon="Refresh" @click="handleRefresh">
          {{ $t('common.refresh') }}
        </ElButton>
      </div>
    </div>

    <div class="dashboard-content">
      <!-- 统计卡片 -->
      <div class="stats-grid">
        <StatsCard
          v-for="stat in stats"
          :key="stat.title"
          :title="stat.title"
          :value="stat.value"
          :icon="stat.icon"
          :color="stat.color"
          :trend="stat.trend"
        />
      </div>

      <!-- 图表和其他内容 -->
      <div class="dashboard-grid">
        <div class="dashboard-card">
          <div class="card">
            <div class="card__header">
              <h3 class="card__header-title">{{ $t('dashboard.recentActivity') }}</h3>
            </div>
            <div class="card__body">
              <ActivityList :activities="recentActivities" />
            </div>
          </div>
        </div>

        <div class="dashboard-card">
          <div class="card">
            <div class="card__header">
              <h3 class="card__header-title">{{ $t('dashboard.quickActions') }}</h3>
            </div>
            <div class="card__body">
              <QuickActions :actions="quickActions" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Refresh } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import StatsCard from '@/components/dashboard/StatsCard.vue'
import ActivityList from '@/components/dashboard/ActivityList.vue'
import QuickActions from '@/components/dashboard/QuickActions.vue'

const { t } = useI18n()

// 统计数据
const stats = ref([
  {
    title: 'Total Users',
    value: '1,234',
    icon: 'User',
    color: '#409eff',
    trend: { value: 12, isUp: true }
  },
  {
    title: 'Revenue',
    value: '$12,345',
    icon: 'Money',
    color: '#67c23a',
    trend: { value: 8, isUp: true }
  },
  {
    title: 'Orders',
    value: '456',
    icon: 'ShoppingCart',
    color: '#e6a23c',
    trend: { value: 3, isUp: false }
  },
  {
    title: 'Active Sessions',
    value: '89',
    icon: 'Connection',
    color: '#f56c6c',
    trend: { value: 15, isUp: true }
  }
])

// 最近活动
const recentActivities = ref<
  Array<{
    id: string
    title: string
    description: string
    time: string
    type: 'user' | 'order' | 'system' | 'default'
  }>
>([
  {
    id: '1',
    title: 'New user registered',
    description: 'john.doe@example.com',
    time: '2 minutes ago',
    type: 'user'
  },
  {
    id: '2',
    title: 'Order completed',
    description: 'Order #12345',
    time: '5 minutes ago',
    type: 'order'
  },
  {
    id: '3',
    title: 'System backup completed',
    description: 'Database backup successful',
    time: '1 hour ago',
    type: 'system'
  }
])

// 快捷操作
const quickActions = ref([
  {
    id: '1',
    title: 'Add User',
    description: 'Create a new user account',
    icon: 'UserFilled',
    color: '#409eff',
    action: () => handleQuickAction('add-user')
  },
  {
    id: '2',
    title: 'View Reports',
    description: 'Check system reports',
    icon: 'Document',
    color: '#67c23a',
    action: () => handleQuickAction('view-reports')
  },
  {
    id: '3',
    title: 'Settings',
    description: 'Manage system settings',
    icon: 'Setting',
    color: '#e6a23c',
    action: () => handleQuickAction('settings')
  }
])

// 处理刷新
const handleRefresh = () => {
  ElMessage.success(t('Data refreshed successfully'))
  // 这里可以添加实际的数据刷新逻辑
}

// 处理快捷操作
const handleQuickAction = (action: string) => {
  ElMessage.info(`Quick action: ${action}`)
  // 这里可以添加实际的快捷操作逻辑
}

// 加载数据
const loadData = async () => {
  // 这里可以添加实际的数据加载逻辑
  console.log('Loading dashboard data...')
}

onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.dashboard {
  min-height: 100%;
}

.dashboard-content {
  margin-top: $spacing-lg;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: $spacing-lg;
  margin-bottom: $spacing-xl;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $spacing-lg;

  @include respond-to(md) {
    grid-template-columns: 1fr;
  }
}

.dashboard-card {
  min-height: 400px;
}

// 响应式调整
@include respond-to(xs) {
  .stats-grid {
    grid-template-columns: 1fr;
    gap: $spacing-md;
  }

  .dashboard-grid {
    gap: $spacing-md;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: $spacing-md;

    &__actions {
      width: 100%;
    }
  }
}
</style>
