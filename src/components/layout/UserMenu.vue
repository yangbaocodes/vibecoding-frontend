<template>
  <ElDropdown trigger="click" @command="handleCommand">
    <div class="user-menu">
      <ElAvatar
        :size="32"
        :src="currentUser?.avatar"
        class="user-avatar"
      >
        <ElIcon><User /></ElIcon>
      </ElAvatar>
      <span v-if="!isMobile" class="username">{{ currentUser?.username || 'User' }}</span>
      <ElIcon class="dropdown-icon"><ArrowDown /></ElIcon>
    </div>
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem command="profile">
          <ElIcon><User /></ElIcon>
          <span>{{ $t('user.profile') }}</span>
        </ElDropdownItem>
        <ElDropdownItem command="settings">
          <ElIcon><Setting /></ElIcon>
          <span>{{ $t('user.settings') }}</span>
        </ElDropdownItem>
        <ElDropdownItem divided command="logout">
          <ElIcon><SwitchButton /></ElIcon>
          <span>{{ $t('auth.logout') }}</span>
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>

<script setup lang="ts">
import { ElMessageBox, ElMessage } from 'element-plus'
import { User, Setting, SwitchButton, ArrowDown } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/store/modules/user'
import { useAppStore } from '@/store/modules/app'
import { ROUTE_NAMES } from '@/constants'

const router = useRouter()
const { t } = useI18n()
const userStore = useUserStore()
const appStore = useAppStore()

const { currentUser, logout } = userStore
const { isMobile } = appStore

// 处理下拉菜单命令
const handleCommand = async (command: string) => {
  switch (command) {
    case 'profile':
      // 跳转到个人资料页面
      // router.push('/profile')
      ElMessage.info('Profile page is coming soon!')
      break
    
    case 'settings':
      // 跳转到设置页面
      // router.push('/settings')
      ElMessage.info('Settings page is coming soon!')
      break
    
    case 'logout':
      await handleLogout()
      break
    
    default:
      console.warn('Unknown command:', command)
  }
}

// 处理用户登出
const handleLogout = async () => {
  try {
    await ElMessageBox.confirm(
      t('Are you sure you want to logout?'),
      t('Confirm Logout'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      }
    )

    await logout()
    ElMessage.success(t('auth.logoutSuccess'))
    
    // 跳转到登录页
    router.push({ name: ROUTE_NAMES.LOGIN })
  } catch (error) {
    // 用户取消登出或登出失败
    if (error !== 'cancel') {
      console.error('Logout failed:', error)
      ElMessage.error('Logout failed')
    }
  }
}
</script>

<style lang="scss" scoped>
.user-menu {
  @include flex(row, center, center);
  gap: $spacing-sm;
  padding: $spacing-xs $spacing-sm;
  border-radius: $border-radius-md;
  cursor: pointer;
  @include transition(background-color);

  &:hover {
    background-color: rgba($primary-color, 0.06);
  }
}

.user-avatar {
  flex-shrink: 0;
}

.username {
  font-size: $font-size-small;
  color: var(--text-color-regular);
  max-width: 100px;
  @include ellipsis(1);
}

.dropdown-icon {
  font-size: 12px;
  color: var(--text-color-secondary);
  @include transition(transform);
  
  .user-menu:hover & {
    transform: rotate(180deg);
  }
}

:deep(.el-dropdown-menu__item) {
  @include flex(row, flex-start, center);
  gap: $spacing-sm;
  padding: $spacing-sm $spacing-md;

  &:hover {
    background-color: rgba($primary-color, 0.06);
  }

  .el-icon {
    font-size: 16px;
    color: var(--text-color-secondary);
  }

  span {
    font-size: $font-size-small;
  }

  // 登出项的特殊样式
  &:last-child {
    color: $danger-color;

    .el-icon {
      color: $danger-color;
    }

    &:hover {
      background-color: rgba($danger-color, 0.06);
    }
  }
}
</style>