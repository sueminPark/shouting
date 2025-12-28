import tw from 'tailwind-styled-components';


export const GamePageWrapper = tw.main`
  flex min-h-screen flex-col 
  items-center justify-center 
  p-6
`;

export const SectionHeader = tw.header`
  text-center 
  mb-10
`;

export const GameTitle = tw.h1`
  text-4xl font-black tracking-tighter text-green-400 
  drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]
`;

export const GameBoardWrapper = tw.section`
  relative group
`;

export const BoardGlow = tw.div`
  absolute -inset-1 bg-gradient-to-b from-green-500 to-blue-600 
  rounded-[20px] blur opacity-20 group-hover:opacity-40 
  transition duration-1000
`;

export const CanvasContainer = tw.div`
  relative bg-slate-900 rounded-[18px] border 
  border-slate-800 shadow-2xl overflow-hidden
`;

export const KeyGuideWrapper = tw.div`
  mt-10 flex gap-3
`;

export const KeyCap = tw.kbd`
  px-4 py-2 bg-slate-800 border-b-4 border-slate-950 
  rounded-lg text-lg font-bold text-slate-300
`;