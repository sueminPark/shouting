'use client';

import React, { useRef, useEffect, useState } from 'react';

// 게임 전역 설정값 (기본으로 세팅한 값)
const LANE_COUNT = 4;
const LANE_WIDTH = 100; // 100px * 4 = 400px (캔버스 너비)
const JUDGE_LINE_Y = 500; // 판정선 높이
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 600;

// 정확도 판정값 (오차범위 너그러움 정도로 판정할거임)
const JUDGE_RANGE = {
    PERFECT: 30,
    GREAT: 60,
    GOOD:90,
    MISS: 120 
}



export default function GameContainer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 판정 텍스트 상태 
  const [lastJudgement, setLastJudgement] = useState("");

  // 현재 어떤 키가 눌려있는지 상태
  const pressedKeys = useRef<{ [key: string]: boolean}>({
    D: false, F: false, J:false, K: false
  });

  // 4. 테스트용 노트 데이터 
  // (실제 게임에선 상단에서 계속 생성되도록 로직 추가 필요)
  const notesRef = useRef([
    { id: 1, lane: 0, y: 0 },
    { id: 2, lane: 1, y: -150 },
    { id: 3, lane: 2, y: -300 },
    { id: 4, lane: 3, y: -450 },
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 키보드 이벤트 핸들러
    const handleKeyDown = (e: KeyboardEvent) => {
        const key = e.key.toUpperCase();
        if (pressedKeys.current.hasOwnProperty(key)) {
            // 키 처음 눌렀을 때만 판정하도록 (연타 방지용)
            if (!pressedKeys.current[key]) {
    
                pressedKeys.current[key] = true;
                checkJudgement(key);
            }
        }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
        const key = e.key.toUpperCase();
        if (pressedKeys.current.hasOwnProperty(key)) {
            pressedKeys.current[key] = false;
        }
    };

    // 판정 로직짜기
    const checkJudgement = (key: string) => {
        const laneIndex = ['D', 'F', 'J', 'K'].indexOf(key);
        // 해당 레인에서 판정선이랑 제일 가까운 노트 찾기
        const targetNote = notesRef.current.find(
            n => n.lane === laneIndex && n.y > 0 && n.y < CANVAS_HEIGHT
        );
        

        if (targetNote) {
            const distance = Math.abs(targetNote.y - JUDGE_LINE_Y);
            let result = "";

            if (distance < JUDGE_RANGE.PERFECT) result = "PERFECT";
            else if (distance < JUDGE_RANGE.GREAT) result = "GREAT";
            else if (distance < JUDGE_RANGE.GOOD) result = "GOOD";
            else result = "MISS"; 

            if (result) {
                setLastJudgement(result);
                // 맞춘 노트는 화면 밖으로 제거시키기
                targetNote.y = -999;
                // 0.5초 후에 문구 사라지게하기
                setTimeout(() => setLastJudgement(""), 500);

            }
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    // -------------- 여기서부터 메인 렌더 루프 ---------------------------
    let animationFrameId: number;
    
    const render = () => {
      // 0. 캔버스 초기화
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // 1. 레인 배경 & 누름 효과 그리기
      const keys = ['D', 'F', 'J', 'K'];
      keys.forEach((key, i) => {
        // 레인 구분선
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1;
        ctx.strokeRect(i * LANE_WIDTH, 0, LANE_WIDTH, CANVAS_HEIGHT);

        // 키 눌려잇을 때 반짝거리는 효과
        if (pressedKeys.current[key]) {
            const gradient = ctx.createLinearGradient(0, JUDGE_LINE_Y - 150, 0, JUDGE_LINE_Y);
            gradient.addColorStop(0, 'transparent');
            // 초록색 불!!
            gradient.addColorStop(1, 'rgba(74, 222, 128, 0.4');
            ctx.fillStyle = gradient;
            ctx.fillRect(i * LANE_WIDTH, JUDGE_LINE_Y - 150, LANE_WIDTH, 150);
        }
    });
      

      // 2. 판정선 그리기
      ctx.strokeStyle = '#4ade80'; // 초록색
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, JUDGE_LINE_Y);
      ctx.lineTo(CANVAS_WIDTH, JUDGE_LINE_Y);
      ctx.stroke();
    
      // 3. 노트 업데이트하고 그리기
      ctx.fillStyle = '#fde047'; // 별 색상
      notesRef.current.forEach(note => {
        // 화면 범위 내의 노트만 처리
        if (note.y > -500) {
            note.y += 4; // 낙하속도

            // 별대신 일단 막대로 표현하기
            ctx.fillRect(note.lane * LANE_WIDTH + 10, note.y, LANE_WIDTH - 20, 20);

            // 놓친 노트도 처리해주기 MISS
            if (note.y > JUDGE_LINE_Y + 50 && note.y < JUDGE_LINE_Y + 55) {
                setLastJudgement("MISS");
                setTimeout(() => setLastJudgement(""), 500);
            }
            
            //테스트용
            if (note.y > CANVAS_HEIGHT) {
                note.y = -100;
            }
        }
      });

      // 4. 판정 텍스트 그리기
      if (lastJudgement) {
        ctx.font = "bold 32px sans-serif";
        ctx.textAlign = "center";
        ctx.fillStyle = lastJudgement === "PERFECT" ? "#4ade80":
                        lastJudgement === "MISS" ? "#ef4444" : "#fde047";
        ctx.fillText(lastJudgement, CANVAS_WIDTH / 2, 250);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        cancelAnimationFrame(animationFrameId);
    };
  }, [lastJudgement]);

  return (
    <canvas 
      ref={canvasRef} 
      width={CANVAS_WIDTH} 
      height={CANVAS_HEIGHT}
      className="block"
    />
  );
}