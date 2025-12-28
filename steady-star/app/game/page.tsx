'use client';

import React, { useEffect, useState } from 'react';
import GameContainer from '@/components/game/GameContainer';
import { 
  GamePageWrapper, 
  SectionHeader, 
  GameTitle, 
  GameBoardWrapper, 
  BoardGlow, 
  CanvasContainer, 
  KeyGuideWrapper, 
  KeyCap 
} from './styles/pageStyled';

export default function GamePage() {
    
    // 현재 press한 키 저장하는 상태
    const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key.toUpperCase();
            if (['D', 'F', 'J', 'K'].includes(key)) {
                setPressedKeys(prev => new Set(prev).add(key));
            }
        };
        
        const handleKeyUp = (e: KeyboardEvent) => {
            const key = e.key.toUpperCase();
            if (['D', 'F', 'J', 'K'].includes(key)) {
                setPressedKeys(prev => {
                    const next = new Set(prev);
                    next.delete(key);
                    return next;
                });
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };

    }, []);


  return (
    <GamePageWrapper>
      
      {/* 상단 헤더 섹션 */}
      <SectionHeader>
        <GameTitle>STEADY STAR</GameTitle>
        <p className="text-slate-500 mt-2 text-sm uppercase tracking-widest font-semibold">
          Wish Delivery Service
        </p>
      </SectionHeader>
      
      {/* 중앙 게임 보드 섹션 */}
      <GameBoardWrapper>
        <BoardGlow />
        <CanvasContainer>
          <GameContainer />
        </CanvasContainer>
      </GameBoardWrapper>

      {/* 하단 키 가이드 섹션 */}
      <KeyGuideWrapper>
        {['D', 'F', 'J', 'K'].map((key) => (
          <KeyCap key={key}>{key}</KeyCap>
        ))}
      </KeyGuideWrapper>
      
      <p className="mt-8 text-slate-500 text-xs animate-pulse">
        노트에 맞춰 키를 누르세요!
      </p>

    </GamePageWrapper>
  );
}