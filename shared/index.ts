// UI Components
export { default as Button } from './components/ui/Button';
export { default as GoToButton } from './components/ui/GoToButton';
export { default as ChatInput } from './components/ui/ChatInput';
export { default as LoadingCircles } from './components/ui/LoadingCircles';
export { default as PrivacyNotice } from './components/ui/PrivacyNotice';
export { default as ScrollToBottomButton } from './components/ui/ScrollToBottomButton';
export { default as TypingText } from './components/ui/TypingText';

// Layout Components
// export { default as ErrorLayout } from './components/layout/ErrorLayout';
export { default as ErrorContent } from './components/layout/ErrorContent';
export { default as DialogLayout } from './components/layout/DialogLayout';
export type { DialogLayoutProps } from './components/layout/DialogLayout';

// Templates
// 注意：已有相似類型，請直接在項目中使用模板中的類型

// Hooks
export { useErrorHandling } from './components/hooks/useErrorHandling';
export { useDialogScroll } from './components/hooks/useDialogScroll';
export { useSmartScroll } from './components/hooks/useSmartScroll';

// Chat Components
export { default as ChatBubble } from './components/chat/ChatBubble';
export { default as SystemResponseMessage } from './components/chat/SystemResponseMessage';
export { default as ChatContent } from './components/chat/ChatContent';

// Common Components
export { default as ToastMessage } from './components/common/notifications/ToastMessage';
export * from './components/common/notifications/ToastMessage';
export { default as CustomChatInput } from './components/common/inputs/CustomChatInput';

// Button Components
export { default as ErrorButtonsList } from './components/common/buttons/ErrorButtonsList';
export { default as ConsumptionButtonsList } from './components/common/buttons/ConsumptionButtonsList';

// Feedback Components
export { default as FeedbackModule } from './components/modules/feedback/FeedbackModule';

// Error Components
export * from './components/common/errors';

// Constants
export { ERROR_MESSAGES } from './constants/errorMessages';

// Types
export * from './types';



// 其他导出...
export * from './components/layout/ErrorContent';

export { default as TermsModal } from './components/modals/TermsModal';
export { default as ReminderModal } from './components/modals/ReminderModal';

// 直接從types文件導出類型定義，不要從元件文件導出
export type { TermsModalProps, ReminderModalProps } from './types'; 