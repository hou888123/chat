import React from 'react';
import ErrorContent from '../../layout/ErrorContent';
import { ERROR_MESSAGES } from '../../../constants/errorMessages';

interface FrontendLoadingErrorProps {
  onRetry: () => void;
  title?: string;
}

/**
 * 前端加載失敗錯誤組件
 * 統一在兩個專案中使用
 */
const FrontendLoadingError: React.FC<FrontendLoadingErrorProps> = ({
  onRetry,
  title
}) => {
  return (
    <ErrorContent
      errorMessage={ERROR_MESSAGES.FRONTEND_LOADING_ERROR.MESSAGE}
      errorCode={ERROR_MESSAGES.FRONTEND_LOADING_ERROR.CODE}
      onButtonClick={onRetry}
      showUserQuestion={false}
    />
  );
};

export default FrontendLoadingError; 