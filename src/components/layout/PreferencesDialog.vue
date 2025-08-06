<template>
  <ElDialog
    v-model="visible"
    :title="t('user.preferences')"
    width="800px"
    :show-close="true"
    @update:model-value="handleVisibleChange"
  >
    <div class="preferences-content">
      <!-- Convert to 语言选择 -->
      <div class="preference-section">
        <div class="section-row">
          <span class="section-title">{{ t('user.convertTo') }}:</span>
          <ElRadioGroup v-model="convertLanguage" class="language-options">
            <ElRadio :value="LanguagePreference.ENGLISH">{{ t('user.english') }}</ElRadio>
            <ElRadio :value="LanguagePreference.CHINESE">{{ t('user.chinese') }}</ElRadio>
          </ElRadioGroup>
        </div>
      </div>

      <!-- Template 模板选择 -->
      <div class="preference-section">
        <div class="section-row">
          <span class="section-title">{{ t('user.template') }}:</span>
          <div class="template-options">
            <div class="template-option" @click="templateType = TemplatePreference.WORD">
              <div
                class="template-image"
                :class="{ active: templateType === TemplatePreference.WORD }"
              >
                <img src="/Word.png" alt="Word Template" />
              </div>
              <div class="template-info">
                <ElRadio v-model="templateType" :value="TemplatePreference.WORD">Word</ElRadio>
              </div>
            </div>

            <div class="template-option" @click="templateType = TemplatePreference.PPT">
              <div
                class="template-image"
                :class="{ active: templateType === TemplatePreference.PPT }"
              >
                <img src="/PPT.png" alt="PPT Template" />
              </div>
              <div class="template-info">
                <ElRadio v-model="templateType" :value="TemplatePreference.PPT">PPT</ElRadio>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ElDialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { ElDialog, ElRadio, ElRadioGroup, ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/store/modules/user'
import { LanguagePreference, TemplatePreference } from '@/constants/preferences'

// Props
interface Props {
  modelValue: boolean
}

// Emits
interface Emits {
  (e: 'update:modelValue', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { t } = useI18n()
const userStore = useUserStore()

// 内部状态
const convertLanguage = ref<LanguagePreference>(LanguagePreference.ENGLISH)
const templateType = ref<TemplatePreference>(TemplatePreference.WORD)

// 双向绑定
const visible = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
})

// 处理对话框显示状态变化
const handleVisibleChange = (value: boolean) => {
  if (value) {
    // 打开对话框时加载当前设置
    loadCurrentPreferences()
  }
}

// 加载当前偏好设置
const loadCurrentPreferences = () => {
  convertLanguage.value = userStore.getLanguagePreference()
  templateType.value = userStore.getTemplatePreference()
}

// 监听语言偏好变化，自动保存
watch(convertLanguage, newValue => {
  userStore.setLanguagePreference(newValue)
  ElMessage({
    message: t('user.languagePreferenceSaved'),
    type: 'success',
    duration: 2000
  })
})

// 监听模板偏好变化，自动保存
watch(templateType, newValue => {
  userStore.setTemplatePreference(newValue)
  ElMessage({
    message: t('user.templatePreferenceSaved'),
    type: 'success',
    duration: 2000
  })
})
</script>

<style lang="scss" scoped>
// 偏好设置对话框样式
.preferences-content {
  padding: $spacing-lg 0;

  .preference-section {
    margin-bottom: $spacing-xl;

    &:last-child {
      margin-bottom: 0;
    }

    .section-row {
      @include flex(row, flex-start, flex-start);
      gap: $spacing-lg;

      .section-title {
        font-size: 14px;
        color: #999;
        min-width: 80px;
        flex-shrink: 0;
        padding-top: 2px; // 微调对齐
      }

      .language-options {
        @include flex(row, flex-start, center);

        .el-radio {
          margin-right: $spacing-lg;

          &:last-child {
            margin-right: 0;
          }

          :deep(.el-radio__label) {
            font-size: 14px;
            color: #999;
          }
        }
      }

      .template-options {
        @include flex(row, flex-start, center);
        gap: $spacing-lg;

        .template-option {
          @include flex(column, center, center);
          gap: $spacing-sm;
          cursor: pointer;

          .template-image {
            width: 180px;
            height: 250px;
            @include flex(row, center, center);
            border: 2px solid transparent;
            border-radius: $border-radius-md;
            padding: $spacing-sm;
            @include transition(all);

            &.active {
              border-color: #67c23a;
            }

            img {
              width: 100%;
              height: 100%;
              object-fit: contain;
            }
          }

          .template-info {
            .el-radio {
              pointer-events: none;
              @include flex(row, center, center);

              :deep(.el-radio__input) {
                display: block !important;
                margin-right: 8px;
              }

              :deep(.el-radio__inner) {
                background-color: transparent;
                border-color: #dcdfe6;
                position: relative;

                &::after {
                  display: none;
                }
              }

              :deep(.el-radio__input.is-checked .el-radio__inner) {
                background-color: #67c23a;
                border-color: #67c23a;

                &::after {
                  content: '✓';
                  display: block;
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  color: white;
                  font-size: 10px;
                  font-weight: bold;
                  background: none;
                  width: auto;
                  height: auto;
                  border-radius: 0;
                }
              }

              :deep(.el-radio__label) {
                font-size: 14px;
                color: #999;
                line-height: 1;
                margin: 0;
                padding: 0;
              }
            }
          }
        }
      }
    }
  }
}
</style>
