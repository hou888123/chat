import React, { useEffect, useRef, useState } from 'react';

interface TypingTextProps {
  text: string;
  typingSpeed?: number;
  className?: string;
  onTypingComplete?: () => void;
}

interface Character {
  char: string;
  tags: TagInfo[];
  isBr?: boolean;
}

interface TagInfo {
  tagName: string;
  attributes: { [key: string]: string };
}

/**
 * 打字效果文本組件
 * 支援HTML標籤和字元逐一淡入動畫
 */
const TypingText: React.FC<TypingTextProps> = ({
  text,
  typingSpeed = 25,
  className = '',
  onTypingComplete
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [key, setKey] = useState(0);
  const timerRef = useRef<number | null>(null);

  // 解析 HTML 並提取字元和標籤信息
  const parseHTML = (htmlString: string): Character[] => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<div>${htmlString}</div>`, 'text/html');
    const rootElement = doc.body.firstChild as Element;
    
    const characters: Character[] = [];
    
    const walkNodes = (node: Node, currentTags: TagInfo[] = []) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent || '';
        for (let i = 0; i < text.length; i++) {
          characters.push({
            char: text[i],
            tags: [...currentTags]
          });
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        
        // 特殊處理 <br> 標籤
        if (element.tagName.toLowerCase() === 'br') {
          characters.push({
            char: '\n',
            tags: [...currentTags],
            isBr: true
          });
          return;
        }
        
        const tagInfo: TagInfo = {
          tagName: element.tagName.toLowerCase(),
          attributes: {}
        };
        
        // 複製所有屬性
        for (let i = 0; i < element.attributes.length; i++) {
          const attr = element.attributes[i];
          tagInfo.attributes[attr.name] = attr.value;
        }
        
        const newTags = [...currentTags, tagInfo];
        
        for (let child of Array.from(element.childNodes)) {
          walkNodes(child, newTags);
        }
      }
    };
    
    walkNodes(rootElement);
    return characters;
  };

  // 創建帶有標籤的字元 HTML
  const createWrappedChar = (char: string, tags: TagInfo[]): string => {
    let wrappedChar = char;
    for (let i = tags.length - 1; i >= 0; i--) {
      const tag = tags[i];
      let attrString = '';
      for (let [key, value] of Object.entries(tag.attributes)) {
        attrString += ` ${key}="${value}"`;
      }
      wrappedChar = `<${tag.tagName}${attrString}>${wrappedChar}</${tag.tagName}>`;
    }
    return wrappedChar;
  };

  // 開始打字機效果
  const startTypewriter = () => {
    if (!containerRef.current) return;
    
    // 清除之前的 timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    const container = containerRef.current;
    container.innerHTML = '';
    setIsComplete(false);
    
    // 檢查是否包含 HTML 標籤
    const hasHTMLTags = /<[^>]*>/.test(text);
    
    let characters: Character[] = [];
    
    if (hasHTMLTags) {
      // 如果包含 HTML 標籤，使用 parseHTML 解析
      characters = parseHTML(text);
    } else {
      // 如果是純文本，直接處理每個字符
      for (let i = 0; i < text.length; i++) {
        if (text[i] === '\n') {
          characters.push({
            char: '\n',
            tags: [],
            isBr: true
          });
        } else {
          characters.push({
            char: text[i],
            tags: []
          });
        }
      }
    }
    
    let index = 0;
    
    timerRef.current = setInterval(() => {
      if (index >= characters.length) {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setIsComplete(true);
        if (onTypingComplete) {
          onTypingComplete();
        }
        return;
      }
      
      const { char, tags, isBr } = characters[index];
      
      // 創建 span 包裝字元
      const span = document.createElement('span');
      span.className = 'char-span';
      
      if (isBr) {
        // 處理換行 - 使用特殊的 class
        span.className = 'char-span br-span';
        span.innerHTML = '<br>';
      } else {
        if (tags.length > 0) {
          span.innerHTML = createWrappedChar(char, tags);
        } else {
          span.textContent = char; // 純文本直接設置 textContent
        }
      }
      
      container.appendChild(span);
      
      // 淡入動畫
      setTimeout(() => {
        span.style.animation = 'fadeIn 0.3s ease-out forwards';
      }, 10);
      
      index++;
    }, typingSpeed);
  };

  // 當 text 或 typingSpeed 改變時重新開始
  useEffect(() => {
    // 檢查文本是否包含 HTML 標籤
    const hasHTML = /<[^>]+>/i.test(text);
    
    // 如果文本包含 HTML 標籤，確保它們被正確處理
    if (hasHTML) {
      startTypewriter();
    } else {
      startTypewriter();
    }
    
    // 清理函數
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [text, typingSpeed, key]);

  return (
    <>
      <style>
        {`
          @keyframes blink {
            0%, 50% { border-color: #333; }
            51%, 100% { border-color: transparent; }
          }

          .char-span {
            opacity: 0;
            display: inline-block;
            white-space: pre;
          }
          
          .char-span.br-span {
            display: inline;
          }

          @keyframes fadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
        `}
      </style>
      
      <div className="typewriter-container">
        <div 
          ref={containerRef}
          className={`typewriter-text ${isComplete ? 'complete' : ''} ${className}`}
        />
      </div>
    </>
  );
};

export default TypingText; 