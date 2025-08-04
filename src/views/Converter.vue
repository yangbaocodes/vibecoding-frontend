<template>
  <div class="converter-page">
    <div class="page-header">
      <div>
        <p class="page-header__description">Upload your resume, and we will convert it to match the Cognizant resume template.</p>
      </div>
    </div>

    <div class="converter-content">
      <!-- 文件上传区域 -->
      <ConverterUploadZone
        @files-selected="handleFilesSelected"
        :accepted-types="acceptedTypes"
        :max-size="maxFileSize"
        :disabled="false"
      />

      <!-- 文件列表展示区域 -->
      <FileListDisplay
        :files="uploadedFiles"
        :selected-files="selectedFiles"
        @update:selected-files="selectedFiles = $event"
        @selected-multiple="handleSelectedMultiple"
        @selected-single="handleSelectedSingle"
      />

      <!-- 转换按钮区域 -->
      <div class="convert-section" v-if="uploadedFiles.length > 0">
        <ElButton
          type="primary"
          size="large"
          :disabled="!isConvertButtonEnabled"
          @click="handleConvertFiles"
          class="convert-button"
        >
          Convert
        </ElButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage, ElButton } from 'element-plus'
// import { useI18n } from 'vue-i18n'
import ConverterUploadZone from '@/components/converter/ConverterUploadZone.vue'
import FileListDisplay from '@/components/converter/FileListDisplay.vue'
import type { FileItem } from '@/utils/converterUtils'
import { FileStatus, OperationType } from '@/utils/converterUtils'
import { fileApi } from '@/api'

// const { t } = useI18n()

// 响应式数据
const uploadedFiles = ref<FileItem[]>([])
const selectedFiles = ref<number[]>([])
const acceptedTypes = ref(['.docx', '.pdf'])
const maxFileSize = ref(5 * 1024 * 1024) // 5MB

// 计算转换按钮是否启用
const isConvertButtonEnabled = computed(() => {
  // 如果没有选择任何文件，禁用按钮
  if (selectedFiles.value.length === 0) {
    return false
  }

  // 检查选中的文件中是否有可以转换的文件（非Converting和Converted状态）
  const selectedFileItems = selectedFiles.value.map(index => uploadedFiles.value[index])
  const hasConvertibleFiles = selectedFileItems.some(
    file =>
      file &&
      file.status !== FileStatus.CONVERTING &&
      file.status !== FileStatus.CONVERTED &&
      file.status !== FileStatus.SIZE_LIMIT_EXCEEDED
  )

  return hasConvertibleFiles
})

// 转换文件处理方法
const handleConvertFiles = () => {
  ElMessage.info('Starting file conversion. Please allow approximately 1 minute for completion.')
  const selectedFileItems = selectedFiles.value.map(index => uploadedFiles.value[index])
  handleSelectedMultiple(selectedFiles.value, selectedFileItems, OperationType.CONVERT)
}

// 处理新添加的文件
const handleFilesSelected = (files: File[]) => {
  const newFiles: FileItem[] = files.map(
    (file): FileItem => ({
      name: file.name,
      size: file.size,
      file: file,
      status: FileStatus.PENDING
    })
  )

  newFiles.forEach(file => {
    if (file.size >= maxFileSize.value) {
      file.status = FileStatus.SIZE_LIMIT_EXCEEDED
    }
  })

  // 检查重复文件
  const existingFileNames = uploadedFiles.value.map(f => f.name)
  const uniqueFiles = newFiles.filter(file => !existingFileNames.includes(file.name))

  if (uniqueFiles.length !== newFiles.length) {
    ElMessage.warning('Duplicate files detected. Auto remove duplicate files.')
  }

  // 检查文件总数限制（最多10个文件）
  const currentFileCount = uploadedFiles.value.length
  const totalFilesAfterAdd = currentFileCount + uniqueFiles.length

  if (totalFilesAfterAdd > 10) {
    const maxNewFiles = 10 - currentFileCount
    if (maxNewFiles <= 0) {
      ElMessage.warning('Upload limit exceeded. Maximum 10 files allowed.')
      return
    }

    // 截取允许添加的文件数量
    const filesToAdd = uniqueFiles.slice(0, maxNewFiles)
    uploadedFiles.value.push(...filesToAdd)

    ElMessage.warning('Upload limit exceeded. Maximum 10 files allowed.')
  } else {
    uploadedFiles.value.push(...uniqueFiles)
  }

  // 记录文件路径（TODO部分）
  const addedFiles =
    totalFilesAfterAdd > 10 ? uniqueFiles.slice(0, 10 - currentFileCount) : uniqueFiles
  addedFiles.forEach(file => {
    console.log('File selected for future upload:', {
      name: file.name,
      size: file.size,
      type: getFileTypeDisplay(file.name),
      path: file.file.webkitRelativePath || `pending_upload/${file.name}`
    })
  })
}

const handleSelectedMultiple = (indices: number[], files: FileItem[], operation: OperationType) => {
  console.log('mmmmmmmmmmm:Selected multiple files:', operation, files)
  if (operation === OperationType.DELETE) {
    handleDeleteSelectedFiles(indices, files)
  } else if (operation === OperationType.DOWNLOAD) {
    handleBatchDownloadFiles(indices, files)
  } else if (operation === OperationType.CONVERT) {
    handleConvertSelectedFiles(indices, files)
  }
}

const handleSelectedSingle = (index: number, file: FileItem, operation: OperationType) => {
  console.log('mmmmmmmmmmm:Selected single file:', operation, file)
  if (operation === OperationType.DELETE) {
    handleDeleteSelectedFiles([index], [file])
  } else if (operation === OperationType.DOWNLOAD) {
    handleBatchDownloadFiles([index], [file])
  }
}

const handleConvertSelectedFiles = (_indices: number[], files: FileItem[]) => {
  console.log('mmmmmmmmmmm:Convert selected files:', files[0].file)
  // 调用api
  files.forEach(file => {
    if (
      file.status === FileStatus.CONVERTING ||
      file.status === FileStatus.CONVERTED ||
      file.status === FileStatus.SIZE_LIMIT_EXCEEDED
    ) {
      return
    }

    file.status = FileStatus.CONVERTING
    fileApi
      .upload(file.file)
      .then(res => {
        console.log('mmmmmmmmm:Upload file:', res)
        if (res.code === 200) {
          file.httpId = res.data[0].filename
          file.fileUrl = res.data[0].fileUrl

          fileApi
            .converter(res.data[0].fileUrl)
            .then(res => {
              console.log('mmmmmmmmm:Converter file:', res)
              if (res.code === 200) {
                file.converterUrl = res.data
                file.status = FileStatus.CONVERTED

                console.log('mmmmmmmmm:Converter file:', file)
              } else {
                file.status = FileStatus.FAILED
              }
            })
            .catch(err => {
              console.log(err)
              file.status = FileStatus.FAILED
            })
        } else {
          file.status = FileStatus.FAILED
        }
      })
      .catch(err => {
        console.log(err)
        file.status = FileStatus.FAILED
      })
  })
}

const handleBatchDownloadFiles = (_indices: number[], files: FileItem[]) => {
  console.log('Batch download files:', files)
  // 为了避免浏览器阻止同时下载多个文件，添加延迟
  files.forEach((file, index) => {
    setTimeout(() => {
      downloadFile(file)
    }, index * 3000) // 每个文件之间延迟3000ms
  })
}

// 下载文件的工具函数
const downloadFile = (file: FileItem) => {
  // 检查文件是否有转换后的URL
  if (!file.converterUrl) {
    ElMessage.warning(`文件 ${file.name} 没有可下载的转换结果`)
    return
  }

  try {
    // 创建隐藏的下载链接
    const link = document.createElement('a')
    link.href = file.converterUrl
    link.download = getDownloadFileName(file)
    link.style.display = 'none'

    // 添加到DOM，触发下载，然后移除
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    console.log('开始下载文件:', file.name)
  } catch (error) {
    console.error('下载文件失败:', error)
    ElMessage.error(`下载文件 ${file.name} 失败`)
  }
}

const getDownloadFileName = (file: FileItem): string => {
  const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.'))
  return `${nameWithoutExt}.docx`
}

const handleDeleteSelectedFiles = (indices: number[], _files: FileItem[]) => {
  uploadedFiles.value = uploadedFiles.value.filter((_, index) => !indices.includes(index))
  // 删除文件后清空选择状态，因为索引会发生变化
  selectedFiles.value = []
}

const getFileTypeDisplay = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase()
  switch (extension) {
    case 'pdf':
      return 'PDF'
    case 'docx':
      return 'DOCX'
    case 'doc':
      return 'DOC'
    default:
      return extension?.toUpperCase() || 'FILE'
  }
}
</script>

<style lang="scss" scoped>
.converter-page {
  padding: 1.5rem;
  margin: 0 auto;
}

.page-header {
  &__description {
    margin-top: 4rem;
    font-size: 1rem;
    color: #303133;
    font-weight: 500;
  }
}

.converter-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.convert-section {
  display: flex;
  justify-content: start;
  padding: 0.5rem 2rem;

  .convert-button {
    width: 116px;
    height: 40px;
    font-size: 1rem;
    font-weight: 500;
    border-radius: 6px;
    background-color: #0133a0;
    border: 1px solid #0133a0;
    color: #fff;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background-color: #cecece;
      border: 1px solid #cecece;
      color: #fff;
    }
  }
}

.converter-info {
  margin-top: 1rem;
}

.info-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;

  &__title {
    margin: 0 0 1rem 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
  }

  &__list {
    margin: 0;
    padding-left: 1.25rem;
    color: #6b7280;

    li {
      margin-bottom: 0.5rem;
      font-size: 0.875rem;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

// 响应式调整
@media (max-width: 768px) {
  .converter-page {
    padding: 1rem;
  }

  .info-card {
    padding: 1rem;

    &__title {
      font-size: 1rem;
    }
  }
}
</style>
