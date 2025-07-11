import React from 'react';

interface ErrorContentProps {
  errorMessage: string;
  errorCode?: string;
  buttonText?: string;
  onButtonClick: () => void;
  showUserQuestion?: boolean;
  userQuestion?: string;
}

/**
 * 標準化錯誤內容組件
 * 僅包含錯誤消息部分，不包含頂部header和底部輸入框
 * 用於顯示各種錯誤狀態，如前端加載失敗、閒置超時等
 */
const ErrorContent: React.FC<ErrorContentProps> = ({
  errorMessage,
  errorCode,
  buttonText = '重新整理',
  onButtonClick,
  showUserQuestion = false,
  userQuestion
}) => {
  return (
    <div className="u-fixed u-top-0 u-left-0 u-right-0 u-bottom-0 u-flex u-flex-col u-h-[100vh]">
      {/* 顯示用戶問題 */}
      {showUserQuestion && userQuestion && (
        <div className="u-flex u-justify-end u-mb-5 u-mt-3">
          <div className="u-bg-white u-rounded-lg u-px-3 u-py-2 u-max-w-[90%] u-shadow-sm">
            {userQuestion}
          </div>
        </div>
      )}

      <div className="u-flex u-flex-col u-items-center u-justify-center u-flex-1">
        <p className="u-text-center u-text-gray-600">
          {errorMessage}
        </p>
        {errorCode && (
          <p className="u-text-center u-text-gray-600 u-mb-5">
            {errorCode}
          </p>
        )}
        {buttonText !== "" && (
          <button
            className="u-px-3 u-py-2 u-bg-blue-1000 u-text-white u-font-bold u-rounded-md"
            onClick={onButtonClick}
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorContent; 