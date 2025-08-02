<template>
  <div class="file-list-display" v-if="files.length > 0">
    <div class="file-list-header">
      <h3 class="file-list-title">File list</h3>
      <div class="file-list-actions">
        <ElButton
          size="small"
          @click="handleBatchDownloadFiles"
          :disabled="isUploading || isBatchDownloadDisabled"
          class="batch-download-button"
        >
          Download
        </ElButton>
        <ElButton
          type="danger"
          text
          @click="handleDeleteSelectedFiles"
          :disabled="isUploading || isDeleteButtonDisabled"
          class="pink-delete-button"
        >
          Delete
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
              :model-value="props.selectedFiles.includes(index)"
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
            <div class="action-buttons">
              <!-- Download按钮 -->
              <ElButton
                v-if="file.status !== FileStatus.PENDING"
                link
                size="small"
                :disabled="file.status !== FileStatus.CONVERTED"
                :class="getDownloadButtonClass(file)"
                @click="handleDownloadFile(index)"
              >
                Download
              </ElButton>

              <!-- Delete按钮 -->
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
                    Delete
                  </ElButton>
                </template>
                <div class="delete-confirm-dialog">
                  <div class="confirm-header">
                    <div class="warning-icon">!</div>
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
import { ref, computed, watchEffect, type PropType } from 'vue'
import { ElButton, ElCheckbox, ElMessage, ElPopover, ElDialog } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { FileItem, FileStatus, OperationType } from '@/utils/converterUtils'

const emit = defineEmits<{
  'selected-multiple': [indices: number[], files: FileItem[], operation: OperationType]
  'selected-single': [index: number, file: FileItem, operation: OperationType]
  'update:selectedFiles': [indices: number[]]
}>()

const props = defineProps({
  files: {
    type: Array as PropType<FileItem[]>,
    required: true
  },
  selectedFiles: {
    type: Array as PropType<number[]>,
    default: () => []
  }
})

const { t } = useI18n()

// 响应式数据
const isUploading = ref(false)
const deletePopoverVisible = ref<Record<number, boolean>>({})
const showBatchDeleteDialog = ref(false)
const isDeleteButtonDisabled = ref(true)
const isBatchDownloadDisabled = ref(true)

// 计算属性
const selectAll = computed({
  get: () => props.selectedFiles.length === props.files.length && props.files.length > 0,
  set: (value: boolean) => {
    const newSelectedFiles = value ? props.files.map((_, index) => index) : []
    emit('update:selectedFiles', newSelectedFiles)
  }
})

const isIndeterminate = computed(() => {
  return props.selectedFiles.length > 0 && props.selectedFiles.length < props.files.length
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

const handleBatchDownloadFiles = () => {
  const selectedFileItems = props.files.filter((_, index) => props.selectedFiles.includes(index))
  const convertedFiles = selectedFileItems.filter(file => file.status === FileStatus.CONVERTED)
  emit('selected-multiple', props.selectedFiles, convertedFiles, OperationType.DOWNLOAD)
}

const handleConfirmBatchDelete = () => {
  const selectedFileItems = props.files.filter((_, index) => props.selectedFiles.includes(index))
  emit('selected-multiple', props.selectedFiles, selectedFileItems, OperationType.DELETE)
  showBatchDeleteDialog.value = false
  emit('update:selectedFiles', [])
}

const handleCancelBatchDelete = () => {
  showBatchDeleteDialog.value = false
}

const handleFileSelect = (index: number, checked: boolean) => {
  const newSelectedFiles = [...props.selectedFiles]

  if (checked) {
    if (!newSelectedFiles.includes(index)) {
      newSelectedFiles.push(index)
    }
  } else {
    const fileIndex = newSelectedFiles.indexOf(index)
    if (fileIndex > -1) {
      newSelectedFiles.splice(fileIndex, 1)
    }
  }

  emit('update:selectedFiles', newSelectedFiles)
  const selectedFileItems = props.files.filter((_, index) => newSelectedFiles.includes(index))
  emit('selected-multiple', newSelectedFiles, selectedFileItems, OperationType.NONE)
}

const handleSelectAll = (checked: boolean) => {
  const newSelectedFiles = checked ? props.files.map((_, index) => index) : []
  emit('update:selectedFiles', newSelectedFiles)
  const selectedFileItems = props.files.filter((_, index) => newSelectedFiles.includes(index))
  emit('selected-multiple', newSelectedFiles, selectedFileItems, OperationType.NONE)
}

const updateStatus = () => {
  // 检查是否有选中的文件
  isDeleteButtonDisabled.value = props.selectedFiles.length === 0

  // 检查选中的文件中是否有已转换完成的文件
  const hasConvertedFiles = props.selectedFiles.some(
    index => props.files[index] && props.files[index].status === FileStatus.CONVERTED
  )
  isBatchDownloadDisabled.value = props.selectedFiles.length === 0 || !hasConvertedFiles
}

// 监听selectedFiles变化，更新按钮状态
watchEffect(() => {
  updateStatus()
})

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

// 下载按钮样式
const getDownloadButtonClass = (file: FileItem): string => {
  if (file.status === FileStatus.CONVERTED) {
    return 'download-button download-button--success'
  }
  return 'download-button download-button--disabled'
}

// 下载文件
const handleDownloadFile = (index: number) => {
  emit('selected-single', index, props.files[index], OperationType.DOWNLOAD)
}
</script>

<style lang="scss" scoped>
.file-list-display {
  margin-top: 1rem;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  background: #fff;
  overflow: hidden;
}

.file-list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 1.5rem;
}

.file-list-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
}

.file-list-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.file-table {
  width: 100%;
}

.table-header {
  display: grid;
  grid-template-columns: 40px 1fr 160px 140px;
  padding: 0.4rem 1.5rem;
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
    grid-template-columns: 40px 1fr 160px 140px;
    padding: 0.1rem 1.5rem;
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
          color: #f56c6c;
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

      .action-buttons {
        display: flex;
        gap: 6px;
        align-items: center;
      }

      .download-button {
        font-size: 0.8rem;
        padding: 0.25rem 0.5rem;
        font-weight: 500;
        text-decoration: none;
        border: none;
        background: none;
        cursor: pointer;
        transition: all 0.2s ease;

        &.download-button--success {
          color: #67c23a;

          &:hover:not(:disabled) {
            color: #5caa2d;
          }
        }

        &.download-button--disabled {
          color: #c0c4cc;
          cursor: not-allowed;

          &:hover {
            color: #c0c4cc;
          }
        }
      }

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
    grid-template-columns: 30px 1fr 100px 120px;
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

  .action-buttons {
    gap: 4px;
  }

  .download-button,
  .delete-button {
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .table-header,
  .table-row {
    grid-template-columns: 30px 1fr 80px 100px;
  }

  .table-header__status,
  .table-header__action {
    font-size: 0.75rem;
  }

  .action-buttons {
    flex-direction: column;
    gap: 2px;
  }

  .download-button,
  .delete-button {
    padding: 0.125rem 0.25rem;
    font-size: 0.7rem;
  }
}

// 蓝色批量下载按钮样式
.batch-download-button {
  background: rgba(64, 158, 255, 0.25) !important;
  border: 1px solid #409eff !important;
  border-radius: 8px !important;
  color: #409eff !important;
  font-size: 12px !important;
  font-weight: 500 !important;
  padding: 4px 12px !important;
  height: auto !important;
  min-height: 28px !important;

  &:hover:not(:disabled) {
    background: rgba(64, 158, 255, 0.35) !important;
    border-color: #409eff !important;
    color: #409eff !important;
  }

  &:active:not(:disabled) {
    background: rgba(64, 158, 255, 0.45) !important;
    border-color: #409eff !important;
  }

  &:disabled {
    background: #f5f5f5 !important;
    border-color: #e0e0e0 !important;
    color: #bdbdbd !important;
    cursor: not-allowed !important;
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
