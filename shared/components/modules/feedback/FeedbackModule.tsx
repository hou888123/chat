import React, { useState, useRef, ReactNode, useEffect, useCallback, memo, useMemo } from "react";
import { motion, Variants } from "framer-motion";
import { FeedbackModuleProps } from "../../../types";
import DefaultLikeIcon from "../../../assets/like.svg";
import DefaultLikeFillIcon from "../../../assets/like_fill.svg";
import DefaultDislikeIcon from "../../../assets/dislike.svg";
import DefaultDislikeFillIcon from "../../../assets/dislike_fill.svg";
import DefaultCloseIcon from "../../../assets/close.svg";
import DefaultArrowDownIcon from "../../../assets/arrow_down.svg";
import DefaultArrowUpIcon from "../../../assets/arrow_up.svg";
import Arrow from "../../../assets/arrow.svg";

const DEFAULT_FEEDBACK_OPTIONS = ["回應速度太慢", "對話流程複雜", "問題理解有誤", "導引路徑有誤"];

interface ContainerProps {
  children: ReactNode;
}

const StaticQuestionList = memo<{
  expandedOptions: string[];
  isVisible: boolean;
  onQuestionClick: (option: string) => void;
}>(({ expandedOptions, isVisible, onQuestionClick }) => {
  const clickHandlerRef = useRef(onQuestionClick);
  clickHandlerRef.current = onQuestionClick;

  const handleClick = useCallback((option: string) => {
    clickHandlerRef.current(option);
  }, []);

  if (expandedOptions.length === 0) return null;

  return (
    <div 
      className="u-w-full u-mt-3 u-transition-all u-duration-300 u-ease-out"
      style={{
        visibility: isVisible ? "visible" : "hidden",
        transform: isVisible ? "translateY(0)" : "translateY(-10px)",
        opacity: isVisible ? 1 : 0,
        maxHeight: isVisible ? "500px" : "0px",
        overflow: "hidden"
      }}
    >
      <div className="u-flex u-flex-col u-w-full">
        {expandedOptions.map((option, index) => (
          <button
            key={`static-${option}-${index}`}
            className={`${index > 0 ? "u-border-t u-border-opacity-10 u-border-black" : ""} u-py-3 u-pr-3 u-flex u-justify-between u-items-center u-cursor-pointer hover:u-bg-gray-100 hover:u-bg-opacity-20 u-transition-colors u-duration-200 u-text-left u-w-full`}
            onClick={() => handleClick(option)}
          >
            <span className="u-text-base u-text-gray-900"><span dangerouslySetInnerHTML={{ __html: option }} /></span>
            <img src={Arrow} className="u-w-5 u-h-5 u-ml-2" />
          </button>
        ))}
      </div>
    </div>
  );
});

StaticQuestionList.displayName = "StaticQuestionList";

const FeedbackModule: React.FC<FeedbackModuleProps> = memo(({
  type = "reask",
  showActionButton = true,
  onActionClick,
  actionButtonText,
  onLike,
  onDislikeOptionSelect,
  feedbackOptions = DEFAULT_FEEDBACK_OPTIONS,
  actionButtonClassName = "",
  feedbackOptionsClassName = "",
  iconSources = null,
  containerComponent: Container = ({ children }: ContainerProps) => <div className="u-w-full">{children}</div>,
  expandedOptionsTitle = "重新提問",
  expandedOptions = [],
  onOptionClick
}) => {
  const [isOptionsExpanded, setIsOptionsExpanded] = useState(false);
  const [showFeedbackOptions, setShowFeedbackOptions] = useState(false);
  const [likeStatus, setLikeStatus] = useState<"none" | "like" | "dislike">("none");
  const [isMenuUp, setIsMenuUp] = useState(false);
  
  const dislikeButtonRef = useRef<HTMLButtonElement>(null);
  const feedbackOptionsRef = useRef<HTMLDivElement>(null);

  const icons = {
    likeIcon: iconSources?.likeIcon || DefaultLikeIcon,
    likeFillIcon: iconSources?.likeFillIcon || DefaultLikeFillIcon,
    dislikeIcon: iconSources?.dislikeIcon || DefaultDislikeIcon,
    dislikeFillIcon: iconSources?.dislikeFillIcon || DefaultDislikeFillIcon,
    closeIcon: iconSources?.closeIcon || DefaultCloseIcon,
    arrowDownIcon: iconSources?.arrowDownIcon || DefaultArrowDownIcon,
    arrowUpIcon: iconSources?.arrowUpIcon || DefaultArrowUpIcon
  };

  // 根據不同類型提供相應的按鈕文字
  const getDefaultButtonText = () => {
    switch (type) {
      case 'goto':
        return '立即前往';
      case 'reask':
        return '重新提問';
      default:
        return '';
    }
  };

  const buttonText = actionButtonText || getDefaultButtonText();

  const optionClickRef = useRef(onOptionClick);
  optionClickRef.current = onOptionClick;

  const handleActionClick = useCallback(() => {
    onActionClick?.();
  }, [onActionClick]);

  const handleToggleOptions = useCallback(() => {
    setIsOptionsExpanded(prev => !prev);
    if (isOptionsExpanded) {
      setShowFeedbackOptions(false);
    }
  }, [isOptionsExpanded]);

  const handleLike = useCallback(() => {
    setLikeStatus("like");
    setShowFeedbackOptions(false);
    onLike?.();
  }, [onLike]);

  const handleDislike = useCallback(() => {
    if (likeStatus !== "dislike") {
      setLikeStatus("dislike");
      setShowFeedbackOptions(true);
      setIsOptionsExpanded(false);
    } else {
      setShowFeedbackOptions(false);
    }
  }, [likeStatus]);

  const handleFeedbackOptionClick = useCallback((option: string) => {
    setShowFeedbackOptions(false);
    setLikeStatus("dislike");
    onDislikeOptionSelect?.(option);
    
  }, [onDislikeOptionSelect]);

  const handleQuestionClick = useCallback((option: string) => {
    optionClickRef.current?.(option);
  }, []);

  const handleClickOutside = useCallback((event: Event) => {
    if (
      showFeedbackOptions && 
      feedbackOptionsRef.current && 
      !feedbackOptionsRef.current.contains(event.target as Node) &&
      dislikeButtonRef.current && 
      !dislikeButtonRef.current.contains(event.target as Node)
    ) {
      setShowFeedbackOptions(false);
      onDislikeOptionSelect?.("close");
    }
  }, [showFeedbackOptions]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [handleClickOutside]);

  useEffect(() => {
    if (showFeedbackOptions && dislikeButtonRef.current) {
      const checkBottomDistance = () => {
        const buttonRect = dislikeButtonRef.current?.getBoundingClientRect();
        if (buttonRect) {
          const windowHeight = window.innerHeight;
          const distanceToBottom = windowHeight - buttonRect.bottom;
          setIsMenuUp(distanceToBottom < 261);
        }
      };
      
      checkBottomDistance();
      window.addEventListener("resize", checkBottomDistance);
      return () => window.removeEventListener("resize", checkBottomDistance);
    }
  }, [showFeedbackOptions]);
  const feedbackOptionsVariants: Variants = {
    hidden: { opacity: 0, y: isMenuUp ? 15 : -15, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { 
        duration: 0.3, 
        ease: "easeOut" as const 
      } 
    },
    exit: { 
      opacity: 0, 
      y: isMenuUp ? -10 : 10, 
      scale: 0.95, 
      transition: { 
        duration: 0.2, 
        ease: "easeIn" as const 
      } 
    }
  };
  return (
    <Container>
      <div className="u-flex u-justify-between u-items-center u-relative u-w-full">
        <div className="u-flex u-items-center">
          {expandedOptions.length > 0 && (
            <button 
              onClick={handleToggleOptions}
              className="u-flex u-items-center u-py-2 u-text-center u-mr-4"
            >
              <span className="u-text-sm u-text-gray-600">{expandedOptionsTitle}</span>
              <span className="u-ml-1">
                {isOptionsExpanded ? (
                  <img src={icons.arrowUpIcon} alt="展開" className="u-w-4 u-h-4" />
                ) : (
                  <img src={icons.arrowDownIcon} alt="收起" className="u-w-4 u-h-4" />
                )}
              </span>
            </button>
          )}
          
          {showActionButton && (
            <button
              type="button"
              className={`u-bg-blue-1000 u-text-white u-px-3 u-py-2 u-rounded-md u-font-medium u-flex u-items-center u-inline-flex u-visible u-opacity-100 ${actionButtonClassName}`}
              onClick={handleActionClick}
            >
              {buttonText}
            </button>
          )}
        </div>
        
        <div className="u-flex u-items-center">
          <button 
            onClick={handleLike}
            className={`u-rounded-md u-transition-all u-duration-300 u-ease-out ${
              likeStatus === "like" 
                ? " u-cursor-default" 
                : likeStatus === "dislike" 
                  ? "u-opacity-0 u-pointer-events-none u-w-0 u-overflow-hidden u-mr-0" 
                  : "u-opacity-100"
            }`}
            style={{
              visibility: likeStatus === "dislike" ? "hidden" : "visible"
            }}
          >
            <img 
              src={likeStatus === "like" ? icons.likeFillIcon : icons.likeIcon} 
              alt="讚" 
              className="u-w-10 u-h-9" 
            />
          </button>
          
          <button 
            ref={dislikeButtonRef}
            onClick={handleDislike}
            className={`u-rounded-md u-transition-all u-duration-300 u-ease-out ${
              likeStatus === "dislike" 
                ? "u-cursor-default" 
                : likeStatus === "like" 
                  ? "u-opacity-0 u-pointer-events-none u-w-0 u-overflow-hidden" 
                  : "u-opacity-100"
            }`}
            style={{
              visibility: likeStatus === "like" ? "hidden" : "visible"
            }}
          >
            <img 
              src={likeStatus === "dislike" ? icons.dislikeFillIcon : icons.dislikeIcon} 
              alt="倒讚" 
              className="u-w-10 u-h-9" 
            />
          </button>
        </div>
        
        {showFeedbackOptions && <motion.div 
          ref={feedbackOptionsRef}
          className={`u-absolute ${isMenuUp ? "u-bottom-[calc(100%+5px)]" : "u-top-[calc(100%+5px)]"} u-right-0 u-w-[252px] u-z-[1050] u-shadow-lg u-rounded-md u-bg-white u-p-3 ${feedbackOptionsClassName}`}
          variants={feedbackOptionsVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="u-flex u-justify-between u-items-center u-mb-3">
            <span className="u-text-sm u-font-medium u-text-gray-700">請選擇您遇到的問題</span>
            <button 
              onClick={() => handleFeedbackOptionClick("close")}
              className="u-w-4 u-h-4"
              aria-label="關閉"
            >
              <img src={icons.closeIcon} alt="關閉" className="u-w-4 u-h-4" />
            </button>
          </div>
          
          <div className="u-grid u-grid-cols-2 u-gap-2 u-w-full">
            {feedbackOptions.map((option, index) => (
              <button
                key={`feedback-${index}`}
                onClick={() => handleFeedbackOptionClick(option)}
                className="u-border u-border-solid u-border-gray-200 u-rounded-full u-px-3 u-py-1.5 u-text-sm u-text-gray-700 u-text-center u-transition-all u-duration-200"
              >
                {option}
              </button>
            ))}
          </div>
        </motion.div>}
      </div>
      
      <StaticQuestionList
        expandedOptions={expandedOptions}
        isVisible={isOptionsExpanded}
        onQuestionClick={handleQuestionClick}
      />
    </Container>
  );
});

FeedbackModule.displayName = "FeedbackModule";

export default FeedbackModule;
