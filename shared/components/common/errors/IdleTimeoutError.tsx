import React from 'react';
import ErrorContent from '../../layout/ErrorContent';
import { ERROR_MESSAGES } from '../../../constants/errorMessages';

interface IdleTimeoutErrorProps {
  errorMessage?: string;
  onRetry: () => void;
  title?: string;
}

/**
 * 閒置超時錯誤組件
 * 統一在兩個專案中使用
 */
const IdleTimeoutError: React.FC<IdleTimeoutErrorProps> = ({
  errorMessage,
  onRetry,
  title
}) => {
  return (
    <ErrorContent
      errorMessage={errorMessage || ERROR_MESSAGES.IDLE_TIMEOUT_ERROR.MESSAGE}
      onButtonClick={onRetry}
      buttonText=""
      showUserQuestion={false}
    />
  );
};

export default IdleTimeoutError; 