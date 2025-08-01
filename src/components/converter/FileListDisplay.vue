<template>
  <div class="file-list-display" v-if="files.length > 0">
    <div class="file-list-header">
      <h3 class="file-list-title">File list</h3>
      <div class="file-list-actions">
        <ElButton
          type="danger"
          text
          @click="handleDeleteSelectedFiles"
          :disabled="isUploading"
          class="pink-delete-button"
        >
          {{ $t('converter.delete') }}
        </ElButton>
      </div>
    </div>

    <div class="file-table">
      <div class="table-header">
        <div class="table-header__checkbox">
          <ElCheckbox
            v-model="selectAll"
            :indeterminate="isIndeterminate"
            @change="val => handleSelectAll(!!val)"
          />
        </div>
        <div class="table-header__file">File</div>
        <div class="table-header__status">Status</div>
        <div class="table-header__action">Action</div>
      </div>

      <div class="table-body">
        <div v-for="(file, index) in files" :key="index" class="table-row">
          <div class="table-cell table-cell__checkbox">
            <ElCheckbox
              :model-value="selectedFiles.includes(index)"
              @change="val => handleFileSelect(index, !!val)"
            />
          </div>
          <div class="table-cell table-cell__file">
            <span class="file-name">{{ file.name }}</span>
          </div>
          <div class="table-cell table-cell__status">
            <span class="status-text" :class="getStatusClass(file)">
              {{ getStatusText(file) }}
            </span>
          </div>
          <div class="table-cell table-cell__action">
            <ElPopover
              placement="top"
              :width="280"
              trigger="click"
              :visible="deletePopoverVisible[index]"
              @update:visible="val => handlePopoverVisibleChange(index, val)"
            >
              <template #reference>
                <ElButton
                  type="danger"
                  text
                  size="small"
                  :disabled="file.status === FileStatus.CONVERTING"
                  class="delete-button"
                >
                  {{ $t('converter.delete') }}
                </ElButton>
              </template>
              <div class="delete-confirm-dialog">
                <div class="confirm-header">
                  <ElIcon size="20" color="#f89f43">
                    <InfoFilled />
                  </ElIcon>
                  <span class="confirm-text">Are you sure to delete this?</span>
                </div>
                <div class="confirm-actions">
                  <ElButton size="small" @click="handleCancelDelete(index)" class="cancel-button">
                    No, thanks
                  </ElButton>
                  <ElButton
                    type="primary"
                    size="small"
                    @click="handleConfirmDelete(index)"
                    class="confirm-button"
                  >
                    OK
                  </ElButton>
                </div>
              </div>
            </ElPopover>
          </div>
        </div>
      </div>
    </div>

    <!-- 批量删除确认对话框 -->
    <ElDialog
      v-model="showBatchDeleteDialog"
      title="Title"
      
      :show-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="batch-delete-dialog"
    >
      <div class="dialog-content">
        <div class="warning-message">
          <div class="warning-icon">!</div>
          <span>This will delete all selected files. Continue?</span>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <ElButton @click="handleCancelBatchDelete" class="cancel-btn">Cancel</ElButton>
          <ElButton type="primary" @click="handleConfirmBatchDelete" class="ok-btn">OK</ElButton>
        </div>
      </template>
    </ElDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, type PropType } from 'vue'
import { ElButton, ElCheckbox, ElMessage, ElPopover, ElDialog } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { FileItem, FileStatus, OperationType } from '@/utils/converterUtils'

const emit = defineEmits<{
  'selected-multiple': [indices: number[], files: FileItem[], operation: OperationType]
  'selected-single': [index: number, file: FileItem, operation: OperationType]
}>()

const props = defineProps({
  files: {
    type: Array as PropType<FileItem[]>,
    required: true
  }
})

const { t } = useI18n()

// 响应式数据
const isUploading = ref(false)
const selectedFiles = ref<number[]>([])
const deletePopoverVisible = ref<Record<number, boolean>>({})
const showBatchDeleteDialog = ref(false)

// 计算属性
const selectAll = computed({
  get: () => selectedFiles.value.length === props.files.length && props.files.length > 0,
  set: (value: boolean) => {
    if (value) {
      selectedFiles.value = props.files.map((_, index) => index)
    } else {
      selectedFiles.value = []
    }
  }
})

const isIndeterminate = computed(() => {
  return selectedFiles.value.length > 0 && selectedFiles.value.length < props.files.length
})

// 弹框显示状态管理
const handlePopoverVisibleChange = (index: number, visible: boolean) => {
  deletePopoverVisible.value[index] = visible
}

// 取消删除
const handleCancelDelete = (index: number) => {
  deletePopoverVisible.value[index] = false
}

// 确认删除
const handleConfirmDelete = (index: number) => {
  deletePopoverVisible.value[index] = false
  emit('selected-single', index, props.files[index], OperationType.DELETE)
  ElMessage.success(t('converter.fileRemoved', { name: props.files[index].name }))
}

const handleDeleteSelectedFiles = () => {
  showBatchDeleteDialog.value = true
}

const handleConfirmBatchDelete = () => {
  const selectedFileItems = props.files.filter((_, index) => selectedFiles.value.includes(index))
  emit('selected-multiple', selectedFiles.value, selectedFileItems, OperationType.DELETE)
  showBatchDeleteDialog.value = false
  selectedFiles.value = []
}

const handleCancelBatchDelete = () => {
  showBatchDeleteDialog.value = false
}

const handleFileSelect = (index: number, checked: boolean) => {
  if (checked) {
    if (!selectedFiles.value.includes(index)) {
      selectedFiles.value.push(index)
    }
  } else {
    const fileIndex = selectedFiles.value.indexOf(index)
    if (fileIndex > -1) {
      selectedFiles.value.splice(fileIndex, 1)
    }
  }
  const selectedFileItems = props.files.filter((_, index) => selectedFiles.value.includes(index))
  emit('selected-multiple', selectedFiles.value, selectedFileItems, OperationType.NONE)
}

const handleSelectAll = (checked: boolean) => {
  if (checked) {
    selectedFiles.value = props.files.map((_, index) => index)
  } else {
    selectedFiles.value = []
  }
  const selectedFileItems = props.files.filter((_, index) => selectedFiles.value.includes(index))
  emit('selected-multiple', selectedFiles.value, selectedFileItems, OperationType.NONE)
}

const getStatusText = (file: FileItem): string => {
  switch (file.status) {
    case FileStatus.PENDING:
      return 'Pending'
    case FileStatus.CONVERTING:
      return 'Converting...'
    case FileStatus.CONVERTED:
      return 'Converted'
    case FileStatus.FAILED:
      return 'Failed'
    case FileStatus.SIZE_LIMIT_EXCEEDED:
      return 'Size limit exceeded'
    default:
      return 'Unknown'
  }
}

const getStatusClass = (file: FileItem): string => {
  switch (file.status) {
    case FileStatus.PENDING:
      return 'status--pending'
    case FileStatus.CONVERTING:
      return 'status--converting'
    case FileStatus.CONVERTED:
      return 'status--completed'
    case FileStatus.FAILED:
      return 'status--failed'
    case FileStatus.SIZE_LIMIT_EXCEEDED:
      return 'status--size-limit-exceeded'
    default:
      return 'status--unknown'
  }
}
</script>

<style lang="scss" scoped>
.file-list-display {
  margin-top: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
}

.file-list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.file-list-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
}

.file-table {
  width: 100%;
}

.table-header {
  display: grid;
  grid-template-columns: 40px 1fr 120px 100px;
  padding: 0.75rem 1.5rem;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;

  &__checkbox,
  &__file,
  &__status,
  &__action {
    display: flex;
    align-items: center;
  }

  &__checkbox {
    justify-content: center;
  }

  &__status {
    justify-content: center;
  }

  &__action {
    justify-content: center;
  }
}

.table-body {
  .table-row {
    display: grid;
    grid-template-columns: 40px 1fr 120px 100px;
    padding: 0.75rem 1.5rem;
    border-bottom: 1px solid #f3f4f6;
    transition: background-color 0.15s ease;

    &:hover {
      background: #f9fafb;
    }

    &:last-child {
      border-bottom: none;
    }
  }

  .table-cell {
    display: flex;
    align-items: center;
    font-size: 0.875rem;

    &__checkbox {
      justify-content: center;
    }

    &__file {
      .file-name {
        color: #111827;
        font-weight: 500;
        word-break: break-all;
      }
    }

    &__status {
      justify-content: center;

      .status-text {
        font-size: 0.8rem;
        font-weight: 500;

        &.status--pending {
          color: #606266;
        }

        &.status--converting {
          color: #a8abb2;
        }

        &.status--completed {
          color: #67c23a;
        }

        &.status--failed {
          color: #56c6c6;
        }

        &.status--size-limit-exceeded {
          color: #f56c6c;
        }

        &.status--unknown {
          color: #606266;
        }
      }
    }

    &__action {
      justify-content: center;

      .delete-button {
        font-size: 0.8rem;
        color: #ef4444;
        padding: 0.25rem 0.5rem;

        &:hover {
          color: #dc2626;
          background: transparent;
        }
      }
    }
  }
}

// 响应式调整
@media (max-width: 768px) {
  .file-list-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .table-header,
  .table-row {
    grid-template-columns: 30px 1fr 80px 80px;
    padding: 0.5rem 1rem;
  }

  .table-header {
    font-size: 0.8rem;
  }

  .table-cell {
    font-size: 0.8rem;
  }

  .table-cell__status .status-text {
    font-size: 0.75rem;
  }

  .delete-button {
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .table-header,
  .table-row {
    grid-template-columns: 30px 1fr 60px 60px;
  }

  .table-header__status,
  .table-header__action {
    font-size: 0.75rem;
  }

  .delete-button {
    padding: 0.125rem 0.25rem;
  }
}

// 粉红色删除按钮样式
.pink-delete-button {
  background: #fce4ec !important;
  border: 1px solid #ef4444 !important;
  border-radius: 8px !important;
  color: #ef4444 !important;
  font-size: 12px !important;
  font-weight: 500 !important;
  padding: 4px 12px !important;
  height: auto !important;
  min-height: 28px !important;

  &:hover:not(:disabled) {
    background: #f8bbd9 !important;
    border-color: #ef4444 !important;
    color: #ef4444 !important;
  }

  &:active:not(:disabled) {
    background: #f48fb1 !important;
    border-color: #ef4444 !important;
  }

  &:disabled {
    background: #f5f5f5 !important;
    border-color: #e0e0e0 !important;
    color: #bdbdbd !important;
    cursor: not-allowed !important;
  }
}

// 批量删除对话框样式
:deep(.batch-delete-dialog) {
  .el-dialog {
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.55);
  }
}

.dialog-content {
  .warning-message {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #606266;
    font-size: 14px;

    .warning-icon {
      flex-shrink: 0;
      width: 20px;
      height: 20px;
      background: #f89f43;
      border-radius: 50%;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: bold;
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;

  .cancel-btn {
    background: transparent;
    border-color: #dcdfe6;
    color: #606266;

    &:hover {
      background: transparent;
      border-color: #dcdfe6;
      color: #1f4788;
    }
  }

  .ok-btn {
    background: #1f4788;
    border-color: #1f4788;

    &:hover {
      background: #1a3d73;
      border-color: #1a3d73;
    }
  }
}

// ElCheckbox 自定义样式
:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #0133a0;
  border-color: #0133a0;
}

:deep(.el-checkbox__input.is-indeterminate .el-checkbox__inner) {
  background-color: #0133a0;
  border-color: #0133a0;
}

:deep(.el-checkbox__input.is-checked:hover .el-checkbox__inner) {
  background-color: #0133a0;
  border-color: #0133a0;
}

:deep(.el-checkbox__input.is-indeterminate:hover .el-checkbox__inner) {
  background-color: #0133a0;
  border-color: #0133a0;
}

// 删除确认弹框样式
.delete-confirm-dialog {
  padding: 12px 0;

  .confirm-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;

    .warning-icon {
      flex-shrink: 0;
      width: 20px;
      height: 20px;
      background: #f89f43;
      border-radius: 50%;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .confirm-text {
      font-size: 14px;
      color: #303133;
      font-weight: 400;
    }
  }

  .confirm-actions {
    display: flex;
    justify-content: flex-end;
    gap: 4px;

    .cancel-button {
      background: transparent;
      border-color: transparent;
      color: #606266;

      &:hover {
        background: transparent;
        border-color: transparent;
        color: #409eff;
      }
    }

    .confirm-button {
      background: #0133a0;
      border-color: #0133a0;

      &:hover {
        background: #0133a0;
        border-color: #0133a0;
      }
    }
  }
}
</style>
