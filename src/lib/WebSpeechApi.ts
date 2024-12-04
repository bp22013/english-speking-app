/* WebSpeechApiのライブラリ */

import toast from "react-hot-toast";

export const speak = (text: string, speed: number) => {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US'; // 英語（アメリカ）
        
        // speed 引数で音声速度を調整
        // rate の値は 0.1 から 10.0 までが有効範囲
        utterance.rate = Math.max(0.1, Math.min(speed, 10));

        speechSynthesis.speak(utterance);
    } else {
        toast.error('このブラウザでは合成音声は使用できません');
    }
};
